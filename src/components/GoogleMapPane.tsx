"use client";

// 地図本体。ページ(page.tsx)からは next/dynamic で ssr:false 付きで読み込む。
//
// 分けている理由は LCP。/ で同じことをやって改善した経緯がある。地図が何も
// 描いていない間は、画面に残った小さな文字が「一番大きく描かれた要素」として
// 選ばれてしまう。読み込み中の表示を先に出すほうが、待つ人にも数字にもよい。
//
// このファイルは Googleマップのライブラリと1,989軒のデータを持つ。最初のHTMLに
// 混ぜると、そのぶん描き始めが遅れる。

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  APIProvider,
  APILoadingStatus,
  // JavaScript の Map と名前がぶつかるので別名にする
  Map as GMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  ControlPosition,
  useApiLoadingStatus,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import { getCafeUsageStyle } from "@/lib/cafeUsageStyle";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { MapBounds } from "@/lib/mapBounds";
import { useLiveReports, statusColorForStats, OCCUPANCY_EMOJI } from "@/lib/useLiveReports";
import { pickMajority, isNonSmoking } from "@/lib/cafeStats";
import {
  EMPTY_FILTERS,
  FILTER_LABELS,
  FILTER_LABELS_EN,
  countActive,
  passesFilters,
  type CafeFilters,
} from "@/lib/cafeFilters";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { areas } from "@/data/areas";
import { nearestStationWalkMinutes } from "@/lib/lookupCafe";
import { useCafeFacts } from "@/lib/useCafeFacts";
import { useUserCafes } from "@/lib/useUserCafes";
import { useVerifiedOutlets } from "@/lib/useVerifiedOutlets";
import { useLang, type TranslationKey } from "@/lib/i18n";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";
import { supabase } from "@/lib/supabaseClient";
import CafeCard from "@/components/CafeCard";
import AdBanner from "@/components/AdBanner";
import BookmarkIcon from "@/components/BookmarkIcon";
import StarRating from "@/components/StarRating";
import { distanceMeters, formatDistance } from "@/lib/geoDistance";
import { useReporterProgress } from "@/lib/useReporterProgress";
import { useCafeRatings } from "@/lib/useCafeRatings";
import type { CafeStats } from "@/lib/types";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

const GOTANDA: google.maps.LatLngLiteral = { lat: 35.6257, lng: 139.7233 };
// 一度に作るピンの上限。引いた表示では1,000件を超えることがあり、
// クラスタでまとめても、その数のDOMを作る負荷自体がスマホに効く
const MAX_MARKERS = 400;
const PIN_SIZE = 42;

// ピンのSVGは (利用スタイル × 電源の有無) の組み合わせでしか変わらない。
// 毎回組み立てると、パンのたびに数百回の文字列生成が走る
const pinHtmlCache = new Map<string, string>();
function pinHtml(cafe: Cafe, statusColor: string, verifiedOutletIds: Set<string>) {
  const style = getCafeUsageStyle(cafe);
  const outlet = hasOutlet(cafe, verifiedOutletIds);
  const key = `${statusColor}|${style}|${outlet}`;
  let html = pinHtmlCache.get(key);
  if (!html) {
    html = cupPinSvgMarkup(statusColor, style, outlet, PIN_SIZE);
    pinHtmlCache.set(key, html);
  }
  return html;
}

// カップの絵は42pxの箱の中で、先端(店を指す点)が上から21pxの位置にある。
// 電源プラグが付く場合はプラグの先まで伸びて33px。
//
// Google のマーカーは既定で要素の「下端中央」を座標に合わせるため、そのままだと
// 先端が座標より上を指す。ズーム17で約25m、16なら約50m。五反田で「道を挟んで
// 隣のビル」に見えたのはこれ。CSS の transform では見た目が動くだけで、
// クラスタリングやタップ判定はずれた位置を使い続ける。anchorPoint で指定する
function pinAnchorPoint(cafe: Cafe, verifiedOutletIds: Set<string>): [string, string] {
  const anchorY = hasOutlet(cafe, verifiedOutletIds) ? 33 : 21;
  return ["50%", `${(anchorY / PIN_SIZE) * 100}%`];
}

// ピンの見た目。保存した店には右上にしおりを付ける。地図を見ただけで
// 「前に保存した店だ」と分かるようにするため
function PinBody({
  cafe,
  statusColor,
  verifiedOutletIds,
  saved,
  selected,
}: {
  cafe: Cafe;
  statusColor: string;
  verifiedOutletIds: Set<string>;
  saved: boolean;
  selected: boolean;
}) {
  return (
    <div
      className="relative"
      style={{
        width: PIN_SIZE,
        height: PIN_SIZE,
        // 選んだピンは一回り大きくして白い縁を付ける。周りに埋もれると
        // どれを見ているのか分からなくなる
        transform: selected ? "scale(1.35)" : undefined,
        transformOrigin: "50% 50%",
        filter: selected ? "drop-shadow(0 0 3px #fff) drop-shadow(0 2px 4px rgba(0,0,0,.5))" : undefined,
      }}
    >
      {selected && <span className="cf-selected-pulse" />}
      <div dangerouslySetInnerHTML={{ __html: pinHtml(cafe, statusColor, verifiedOutletIds) }} />
      {saved && (
        <span className="absolute -top-1 -right-1 rounded-full bg-white p-[1px] shadow leading-none">
          <BookmarkIcon filled size={12} />
        </span>
      )}
    </div>
  );
}

// ピン1個ぶん。ref に渡す関数を useCallback で固定するために、あえて分けている。
//
// 親のJSXに ref={(m) => register(m, cafe.id)} と直接書くと描画のたびに新しい関数に
// なる。React は ref の関数が変わると null で呼び直してから付け直すので、そこで
// state を更新していると止まらなくなる。スマホが落ちていた原因はこれだった
function ClusteredCafeMarker({
  cafe,
  stats,
  onSelect,
  register,
  verifiedOutletIds,
  saved,
  hidden,
}: {
  cafe: Cafe;
  stats: CafeStats | null;
  onSelect: (cafe: Cafe) => void;
  register: (id: string, marker: Marker | null) => void;
  verifiedOutletIds: Set<string>;
  saved: boolean;
  /** 選ばれている店。目立たせたピンを別に重ねるので、こちらは透明にする */
  hidden: boolean;
}) {
  const ref = useCallback(
    (marker: Marker | null) => register(cafe.id, marker),
    [cafe.id, register]
  );
  return (
    <AdvancedMarker
      position={{ lat: cafe.lat, lng: cafe.lng }}
      ref={ref}
      onClick={() => onSelect(cafe)}
      title={cafe.name}
      anchorPoint={pinAnchorPoint(cafe, verifiedOutletIds)}
    >
      <div style={hidden ? { opacity: 0, pointerEvents: "none" } : undefined}>
        <PinBody
          cafe={cafe}
          statusColor={statusColorForStats(stats)}
          verifiedOutletIds={verifiedOutletIds}
          saved={saved}
          selected={false}
        />
      </div>
    </AdvancedMarker>
  );
}

// AdvancedMarker と MarkerClusterer をつなぐ。クラスタリングは都心で要る。
// 表示範囲だけでも数百件が同時に出て、ピンが重なって地図が読めなくなる
const CafeMarkers = memo(function CafeMarkers({
  cafes,
  statsByCafe,
  onSelect,
  verifiedOutletIds,
  favorites,
  selectedId,
}: {
  cafes: Cafe[];
  statsByCafe: Record<string, CafeStats>;
  onSelect: (cafe: Cafe) => void;
  verifiedOutletIds: Set<string>;
  favorites: Set<string>;
  selectedId: string | null;
}) {
  const map = useMap();
  // 集めたマーカーは ref に持つ。state にすると ref が付くたびに再描画が走る
  const markersRef = useRef<Record<string, Marker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  const register = useCallback((id: string, marker: Marker | null) => {
    if (marker) markersRef.current[id] = marker;
    else delete markersRef.current[id];
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) clusterer.current = new MarkerClusterer({ map });
    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  useEffect(() => {
    const c = clusterer.current;
    if (!c) return;
    c.clearMarkers(true);
    c.addMarkers(Object.values(markersRef.current));
  }, [cafes, map]);

  return (
    <>
      {cafes.map((cafe) => (
        <ClusteredCafeMarker
          key={cafe.id}
          cafe={cafe}
          stats={statsByCafe[cafe.id] ?? null}
          onSelect={onSelect}
          register={register}
          verifiedOutletIds={verifiedOutletIds}
          saved={favorites.has(cafe.id)}
          hidden={cafe.id === selectedId}
        />
      ))}
    </>
  );
});

// 現在地。向きが分かると「どっちへ歩けばいいか」がその場で決まる
function UserLocationMarker({
  position,
  heading,
}: {
  position: [number, number] | null;
  heading: number | null;
}) {
  const { t } = useLang();
  if (!position) return null;
  return (
    <AdvancedMarker
      position={{ lat: position[0], lng: position[1] }}
      title={t("gmap.myLocation")}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {heading != null && (
          // 向いている方向へ扇形を出す。三角形をCSSで作り、真上を0度として回す
          <span
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "11px solid rgba(37,99,235,.95)",
              // 点のすぐ外側に置く。離すと別のものに見える
              transform: `rotate(${heading}deg) translateY(-9px)`,
              transformOrigin: "50% 100%",
            }}
          />
        )}
        <span className="cf-user-dot">
          <span className="cf-user-pulse-ring" />
        </span>
      </div>
    </AdvancedMarker>
  );
}

// 出典表示と規約への入口。地図そのものの出典は Google が自前で出すので、
// ここで出すのは「うちが持ち込んだデータ」の出典。
//
// 座標の一部は国土地理院の住所検索と Yahoo! の場所情報検索で解決している。
// Yahoo!デベロッパーネットワークのガイドラインはクレジット表示を義務づけており、
// 地図をGoogleに替えてもこの義務は消えない。
//
// プライバシーポリシーとお問い合わせもここに入れた。ヘッダーに並べると
// 地図が狭くなるうえ、「お気に入り」と同列に見えて紛らわしいという指摘があった
// ピンの形の見本。色は「まだ報告が無い」の色に固定し、形の違いだけが目に入るようにする
const SHAPE_LEGEND = [
  { style: "chain", outlet: false, key: "gmap.shapeChain" },
  { style: "coworking", outlet: false, key: "gmap.shapeCoworking" },
  { style: "independent", outlet: false, key: "gmap.shapeIndependent" },
  { style: "night", outlet: false, key: "gmap.shapeNight" },
  { style: "chain", outlet: true, key: "gmap.shapeOutlet" },
] as const;

// ピンの説明。地図の上に見える形で置く。「i」の中に入れると、色と形の意味を
// 知りたいときに辿り着けない
function LegendButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full shadow px-2.5 py-1 text-[11px] font-semibold bg-white text-gray-800 border border-gray-300 whitespace-nowrap"
      >
        {t("legend.toggle")} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-200 p-2 space-y-1.5 pointer-events-auto">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {PIN_LEGEND.map((item) => (
              <span key={item.key} className="flex items-center gap-1 text-[11px] text-gray-800">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow"
                  style={{ backgroundColor: PIN_COLORS[item.key] }}
                />
                {t(`legend.status.${item.key}` as TranslationKey)}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-800">
            {SHAPE_LEGEND.map(({ style, outlet, key }) => (
              <span key={`${style}-${outlet}`} className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, style, outlet, 16),
                  }}
                />
                {t(key)}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// 言語切替。ここも「i」の中に隠さない
function LangButton() {
  const { lang, setLang, t } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className="rounded-full shadow px-2.5 py-1 text-[11px] font-semibold bg-white text-gray-800 border border-gray-300 whitespace-nowrap"
    >
      {t("app.langToggle")}
    </button>
  );
}

function AboutButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t("attribution.title")}
        className="bg-white/95 rounded-full shadow border border-gray-300 w-7 h-7 flex items-center justify-center text-[12px] font-bold text-gray-700"
      >
        i
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-gray-100 font-bold text-gray-900">
              {t("attribution.title")}
            </div>
            <Link href="/privacy" className="block px-4 py-3 border-b text-blue-700">
              {t("privacy.link")}
            </Link>
            <Link href="/contact" className="block px-4 py-3 border-b text-blue-700">
              {t("gmap.navContact")}
            </Link>
            <Link href="/business" className="block px-4 py-3 border-b text-blue-700">
              {t("gmap.navBusiness")}
            </Link>
            <a
              href="https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 border-b text-[12px] text-gray-600"
            >
              {t("gmap.gsiCredit")}
            </a>
            {/* この文字列は Yahoo! 側が指定している表記。訳さない */}
            <a
              href="https://developer.yahoo.co.jp/sitemap/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 border-b text-[12px] text-gray-600"
            >
              Web Services by Yahoo! JAPAN
            </a>
            <button
              onClick={() => setOpen(false)}
              className="w-full px-4 py-3 font-semibold text-gray-800"
            >
              {t("attribution.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function GoogleMapView() {
  const map = useMap();
  const { lang, t } = useLang();
  const filterLabels = lang === "en" ? FILTER_LABELS_EN : FILTER_LABELS;

  // 今選んでいる店のid。スクロール中の判定で使う。state を依存に入れると
  // 判定の関数が作り直されて、スクロールの途中で取りこぼす
  const selectedIdRef = useRef<string | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  // リストを並べる基準の点。地図の中心と別に持つ
  const [sortCenter, setSortCenter] = useState<[number, number] | null>(null);
  const [selected, setSelected] = useState<Cafe | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [filters, setFilters] = useState<CafeFilters>(EMPTY_FILTERS);
  const [favorites, setFavorites] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set<string>() : getFavorites()
  );
  // リストは畳んだ状態で始める。常に開いていると地図が狭くなり、吹き出しも
  // 窮屈になる。見出しの帯と横カード列は出したままなので、リストがあること
  // 自体は分かる(以前「気づかなかった」と言われたのはこの帯ごと画面の外に
  // 出ていたためで、高さを dvh にして解消済み)
  const [listOpen, setListOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  // 地図を動かしたか。動かした後だけ「この範囲で再検索」を出す
  const [drifted, setDrifted] = useState(false);
  // 送信の手応え。押しただけでは送れたのか分からない
  const [thanks, setThanks] = useState<string | null>(null);
  const [addingCafe, setAddingCafe] = useState(false);
  const [pendingLocation, setPendingLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [newCafe, setNewCafe] = useState({
    name: "",
    address: "",
    website: "",
    outlet: false,
    wifi: false,
    nonSmoking: false,
  });

  const watchIdRef = useRef<number | null>(null);
  // 横カード列。真ん中のカードを拾うために実体を持つ
  const stripRef = useRef<HTMLDivElement | null>(null);
  const stripTimerRef = useRef<number>(0);
  // 横スライドの操作で選んだか。そうならカードを送り直さない
  const fromStripRef = useRef(false);
  // 並び順を押したか。押した直後だけ、新しい先頭の店を開く
  const sortChangedRef = useRef(false);
  // 真ん中へ送りたい店。カードが出来た回に送る
  const pendingScrollRef = useRef<string | null>(null);
  // カードに並べる一覧。店を選んでいる間は入れ替えない。
  // 地図が動くと listed の中身が変わり、送っている途中で並びが差し替わって
  // 「選択が変わるときと変わらないときがある」状態になっていた
  const [frozenStrip, setFrozenStrip] = useState<Cafe[]>([]);
  // 何件まで並べるか。端まで送ったら8件ずつ足す。最初から全部並べると、
  // 都心では数百枚のカードを作ることになって重い。
  //
  // 20件ずつにしていたが、カードを全部「店舗情報つき」で描くように変えて
  // から、店を選び直すたびに20枚分を組み直すことになった。その間はほかの
  // 指の操作が待たされ、ピンを押しても反応しないことがあった。
  // 見えているのは常に1枚なので、少しずつ足りる
  const [stripCount, setStripCount] = useState(8);
  // 並び順。地図にピンがたくさんあるとき、どれから見ればよいか決められる
  const [sortOrder, setSortOrder] = useState<"recommended" | "nearest" | "rating">(
    "recommended"
  );
  // 下の帯(横カード列＋リスト)の実際の高さ。現在地ボタンをこの上に置く。
  // 数値を決め打ちにすると、リストを開いた時に必ず重なる
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [bottomHeight, setBottomHeight] = useState(150);
  // 自分で地図を動かしたか。動かした後に現在地へ勝手に飛ばされると見失う
  const hasMovedRef = useRef(false);
  // リストから店を選んだ直後だけ、並べ替えを止める。選ぶと地図が動き、
  // 動くと中心が変わって並び順が変わってしまい、押した店が消えて見えた
  const freezeListRef = useRef(false);

  const { statsByCafe, reporterId, submitting, error: reportError, submitOccupancy } =
    useLiveReports();
  const {
    factsByCafe,
    submitting: factSubmitting,
    error: factError,
    submitFact,
  } = useCafeFacts();
  const {
    cafes: userCafes,
    userCafeIds,
    flaggedByMe,
    submitting: cafeSubmitting,
    error: cafeError,
    addCafe,
    flagCafe,
  } = useUserCafes();
  const verifiedOutletIds = useVerifiedOutlets();
  // 送った件数と称号。報告しても本人には何も返らないので、ここで返す
  const progress = useReporterProgress();
  const { ratingFor, submitting: ratingSubmitting, rate } = useCafeRatings();

  const allCafes = useMemo(() => [...seedCafes, ...userCafes], [userCafes]);

  // 下の帯の高さを測る。開閉や件数で変わるので、変化を監視する
  useEffect(() => {
    const el = bottomRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setBottomHeight(el.offsetHeight));
    ro.observe(el);
    setBottomHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  // 指を動かしている間ずっと発火する onCameraChanged を使っていたら、スマホで
  // タブごと落ちた。操作が終わって地図が落ち着いた時(idle)だけ更新する
  const handleIdle = useCallback(() => {
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    const next = MapBounds.fromGoogle(b);
    setBounds((prev) => (prev?.equals(next) ? prev : next));
    // 並び順の基準。リストから店を選んだ直後は据え置く。選ぶと地図が動き、
    // 動くと中心が変わって並びが変わり、押した店が別の位置へ飛んで見えた
    if (!freezeListRef.current) setSortCenter(next.getCenter());
  }, [map]);

  // 開いた直後にピンが出ない件。
  //
  // 表示範囲(bounds)が決まるまでピンは1つも出さない作りにしてある。その範囲は
  // 地図が落ち着いた合図(idle)で読むが、最初の idle は React が地図の実体を
  // 受け取るより先に飛ぶことがある。その回は map がまだ null で素通りし、
  // 次の idle は指で動かすまで来ない。だから「何か触るまでピンが出ない」。
  //
  // 地図の実体を受け取った時点で自分から読みに行き、あわせて idle も直接
  // 拾っておく。二重に拾っても、同じ範囲なら setBounds は何もしない
  useEffect(() => {
    if (!map) return;
    // 地図の実体を受け取った直後はまだ範囲が定まっていないことがあるので、
    // 1度きりの遅らせた読み取りで拾う
    const timer = window.setTimeout(handleIdle, 0);
    const listener = map.addListener("idle", handleIdle);
    return () => {
      window.clearTimeout(timer);
      listener.remove();
    };
  }, [map, handleIdle]);

  const visible = useMemo(() => {
    if (!bounds) return [];
    const padded = bounds.pad(0.15);
    const inView = allCafes.filter((c) => {
      if (!padded.contains([c.lat, c.lng])) return false;
      return passesFilters(c, filters, statsByCafe[c.id] ?? null, favorites, verifiedOutletIds);
    });
    if (inView.length <= MAX_MARKERS) return inView;
    const [cLat, cLng] = bounds.getCenter();
    return [...inView]
      .sort(
        (a, b) =>
          (a.lat - cLat) ** 2 + (a.lng - cLng) ** 2 -
          ((b.lat - cLat) ** 2 + (b.lng - cLng) ** 2)
      )
      .slice(0, MAX_MARKERS);
  }, [bounds, filters, statsByCafe, favorites, allCafes, verifiedOutletIds]);
  const capped = visible.length >= MAX_MARKERS;

  // クラスタに載せるピンは、見えている店ぜんぶ。選んだ店も外さない。
  //
  // クラスタは「全部消す → 付け直す」でしか作り直せない。付け直しが済む
  // までの一瞬、ピンは地図に付いていないので、そこを押しても何も起きない。
  //
  // 以前はここで選んだ店を配列から外していた。すると店を選ぶたびに配列が
  // 別物になり、そのたびに数百個のピンを外して付け直していた。
  // 「歩いているとピンを押しても反応しないことがある」のはこれだった。
  //
  // 選んだ店のピンは、目立たせたものを別に重ねて出す。クラスタ側の同じ店は
  // 二重に見えないよう透明にする(まとまりの数は数えたままにしたいので消さない)
  const clustered = visible;

  // 選んだ並び順で店を並べる。地図の表示範囲で切るかどうかは呼ぶ側が決める
  const rank = useCallback(
    (pool: Cafe[], limit: number) => {
      if (!sortCenter) return [];
      // 基準の点。「近い順」は現在地から、それ以外は地図の中心から測る
      const [cLat, cLng] =
        sortOrder === "nearest" && userPosition ? userPosition : sortCenter;
      const near = (c: Cafe) => (c.lat - cLat) ** 2 + (c.lng - cLng) ** 2;
      const sorted = [...pool];
      if (sortOrder === "rating") {
        // 評価順。まだ誰も付けていない店は下へ。同点なら近いほうを先に
        sorted.sort((a, b) => {
          const ra = ratingFor(a.id).average ?? -1;
          const rb = ratingFor(b.id).average ?? -1;
          if (ra !== rb) return rb - ra;
          return near(a) - near(b);
        });
      } else {
        sorted.sort((a, b) => near(a) - near(b));
      }
      return sorted.slice(0, limit);
    },
    [sortCenter, sortOrder, userPosition, ratingFor]
  );

  // 縦リストは「この辺のお店」なので、地図に映っている範囲で切る
  const listed = useMemo(() => rank(visible, 200), [rank, visible]);

  // 横スライドは範囲で切らない。
  //
  // 映っている店だけにすると、端まで送ったときに足すものが無くなって
  // そこで止まる。並びは近い順なので、頭は結局いま映っている店から始まり、
  // 送るほど外側の店へ続いていく。地図のピンは今までどおり範囲内だけ
  const ranked = useMemo(
    () =>
      rank(
        allCafes.filter((c) =>
          passesFilters(c, filters, statsByCafe[c.id] ?? null, favorites, verifiedOutletIds)
        ),
        Infinity
      ),
    [rank, allCafes, filters, statsByCafe, favorites, verifiedOutletIds]
  );

  // カードに並べる一覧。店を選んでいる間は、選び始めたときの並びのまま。
  // 送っている途中で並びが差し替わると、真ん中の判定が別の店を指してしまう
  const strip = selected && frozenStrip.length > 0 ? frozenStrip : ranked;

  // 並びの中身は ref でも持っておく。
  //
  // focusCafe が ranked に依存していると、現在地が動くたびに関数が作り直され、
  // それを受け取っている地図のピンも全部作り直しになる。歩いている間ずっと
  // それが続くので、ピンを押しても反応しないことがあった。
  // 中身は ref から読み、関数自体は作り直さない
  const rankedRef = useRef<Cafe[]>([]);
  useEffect(() => {
    rankedRef.current = ranked;
  }, [ranked]);

  const focusCafe = useCallback(
    (cafe: Cafe, zoomIn = true) => {
      // 横スライドで選ばれたときは、並びをそのまま保つ。送っている途中に
      // 足元が入れ替わると、真ん中の判定が別の店を指してしまう。
      //
      // ピンをタップした / リストや検索から選んだときは、その店を先頭にして
      // 並べ直す。並びは地図の中心からの近さなので、中心が古いままだと
      // タップした店が並びのずっと後ろにいることがある。カードは先頭から
      // 20枚ずつしか描いていないので、その場合カードが1枚も無く、
      // 「ピンを押しても横リストが変わらない」ように見えていた
      if (!fromStripRef.current) {
        setFrozenStrip([cafe, ...rankedRef.current.filter((c) => c.id !== cafe.id)]);
        setStripCount(8);
      }
      selectedIdRef.current = cafe.id;
      setSelected(cafe);
      hasMovedRef.current = true;
      freezeListRef.current = true;
      if (!map) return;
      map.panTo({ lat: cafe.lat, lng: cafe.lng });
      // クラスタに埋もれたままだと、選んだ店のピンが見えない。
      // まとまりがほどける寄りまで一段寄せる
      // 横カード列を送っているときは寄せない。勝手に拡大されると、
      // それまで見ていた範囲が分からなくなる
      if (zoomIn && (map.getZoom() ?? 16) < 18) map.setZoom(18);
      // 店舗情報は画面の下に出るので、ピンが下寄りだとカードに隠れる。
      // 地図を送ってピンを画面の上のほうへ移し、下にカードのぶんの余地を作る。
      // 吹き出しが上に出ていた頃の名残で、向きが逆になっていた
      const el = map.getDiv();
      const shift = Math.round((el?.clientHeight ?? 0) * 0.22);
      if (shift > 0) window.setTimeout(() => map.panBy(0, shift), 0);
    },
    [map]
  );

  // 指が止まってから、いちばん真ん中に近いカードの店を選ぶ
  const handleStripScroll = useCallback(() => {
    // 端に近づいたら次の20件を足す。指を止めずに送り続けられるよう、
    // 最後のカードに着く前に足しておく。並びは変えないので、続きは
    // そのまま「おすすめ順/近い順/評価順」の続きになる
    const el0 = stripRef.current;
    if (el0 && el0.scrollLeft >= el0.scrollWidth - el0.clientWidth * 2) {
      setStripCount((n) => (n < strip.length ? n + 8 : n));
    }
    window.clearTimeout(stripTimerRef.current);
    stripTimerRef.current = window.setTimeout(() => {
      const el = stripRef.current;
      if (!el) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let bestId: string | null = null;
      let bestGap = Infinity;
      for (const child of Array.from(el.children)) {
        const card = child as HTMLElement;
        const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (gap < bestGap) {
          bestGap = gap;
          bestId = card.dataset.cafeId ?? null;
        }
      }
      if (!bestId) return;
      // 探すのは「今カードに並んでいる一覧」から。listed は地図が動くたびに
      // 中身が入れ替わるので、そこから探すと見つからず、選択が変わらない
      // ことがあった
      const cafe = strip.find((c) => c.id === bestId);
      if (cafe && cafe.id !== selectedIdRef.current) {
        fromStripRef.current = true;
        focusCafe(cafe, false);
      }
    }, 80);
  }, [strip, focusCafe]);

  const handleToggleFavorite = useCallback((cafeId: string) => {
    setFavorites(toggleFavorite(cafeId));
  }, []);

  // 端末の向き。iOS は本人の操作を伴う許可が要るので、現在地ボタンで求める
  const startHeading = useCallback(() => {
    type Req = { requestPermission?: () => Promise<string> };
    const DOE = window.DeviceOrientationEvent as unknown as Req | undefined;
    const attach = () => {
      window.addEventListener(
        "deviceorientation",
        (e) => {
          const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
          // iOS は webkitCompassHeading が真北基準。それ以外は alpha を反転する
          const h =
            ev.webkitCompassHeading != null
              ? ev.webkitCompassHeading
              : ev.alpha != null
                ? 360 - ev.alpha
                : null;
          if (h != null) setHeading(h);
        },
        true
      );
    };
    if (DOE?.requestPermission) {
      DOE.requestPermission()
        .then((s) => {
          if (s === "granted") attach();
        })
        .catch(() => {});
      return;
    }
    attach();
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    hasMovedRef.current = true;
    freezeListRef.current = false;
    startHeading();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(p);
        map?.panTo({ lat: p[0], lng: p[1] });
        map?.setZoom(17);
        if (watchIdRef.current === null) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (w) => {
              // 少し動いただけでは更新しない。
              //
              // 歩いていると1秒ごとに位置が届く。そのたびに並び順・カード・
              // ピンへの受け渡しが作り直され、画面全体が組み直しになる。
              // その間は指の操作が落ちるので、歩きながらピンを押しても
              // 反応しないことがあった。
              // 8m は「表示が実用上ずれない」程度の粗さ
              setUserPosition((prev) => {
                const next: [number, number] = [w.coords.latitude, w.coords.longitude];
                if (prev && distanceMeters(prev, next) < 8) return prev;
                return next;
              });
              // 歩いている間は進行方向が取れることがある。取れたら向きに使う
              if (w.coords.heading != null && !Number.isNaN(w.coords.heading)) {
                setHeading(w.coords.heading);
              }
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
          );
        }
      },
      () => {},
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [map, startHeading]);

  // 開いた時点で現在地へ寄せる。ただし許可のダイアログを勝手に出さない。
  // ホーム画面に追加して使っている人は自分の意思で入れた人なので、起動のたびに
  // ボタンを押させるほうが煩わしい。それ以外は許可済みと確認できたときだけ
  useEffect(() => {
    if (!map || hasMovedRef.current) return;
    const isInstalledApp =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isInstalledApp) {
      locate();
      return;
    }
    if (!navigator.permissions?.query) return;
    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled || status.state !== "granted" || hasMovedRef.current) return;
        locate();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [map, locate]);

  useEffect(
    () => () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    },
    []
  );

  // 選んだ店のカードを真ん中へ送る。ピンをタップしたときに、そのカードが
  // 見えていないと、どこに情報が出たのか分からない。
  // 送ったことでスクロールの判定がまた走るが、同じ店なので何も起きない
  useEffect(() => {
    if (!selected) return;
    // 横スライドの操作で選ばれた場合は、こちらから送り直さない。
    // 送り直すとまた真ん中の判定が走り、店が次々に選ばれて止まらなくなる
    if (fromStripRef.current) {
      fromStripRef.current = false;
      return;
    }
    // ここで送ろうとしても、並べ直したカードがまだ画面に出来ていないことが
    // ある。予約だけしておいて、実際に出来た回に送る
    pendingScrollRef.current = selected.id;
  }, [selected]);

  // 予約された店のカードが画面に出来ていたら、真ん中へ送る。
  // 毎回の描画のあとに見るが、予約が無ければ何もしない
  useEffect(() => {
    const id = pendingScrollRef.current;
    if (!id) return;
    const box = stripRef.current;
    const el = box?.querySelector<HTMLElement>(`[data-cafe-id="${CSS.escape(id)}"]`);
    if (!box || !el) return;
    pendingScrollRef.current = null;
    // scrollIntoView は外側の入れ物や画面そのものまで動かしてしまう。
    // 「たまに画面全体が横に流れる」のはこれが原因だった。
    // カード列の中だけを動かすよう、位置を自分で出して送る
    box.scrollTo({
      left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  });

  // 並び順を押した直後に、新しい先頭の店を開く。
  //
  // 選んでいた店は残るので、順番だけ変わるとその店は別の位置へ行き、
  // 真ん中には開いていないカードが来る。押したのに情報が消えたように
  // 見えるので、先頭へ戻して1軒目を開く
  useEffect(() => {
    if (!sortChangedRef.current) return;
    sortChangedRef.current = false;
    const first = ranked[0];
    if (!first) return;
    stripRef.current?.scrollTo({ left: 0 });
    // state の更新を effect の中で直に呼ばないよう、1拍ずらす
    const timer = window.setTimeout(() => focusCafe(first, false), 0);
    return () => window.clearTimeout(timer);
  }, [ranked, focusCafe]);

  // 検索語。空白で区切った語をすべて含むものを探す。
  // 「スターバックス 五反田」のように打つ人が多く、そのまま1語として
  // 照合すると0件になる(店名は「スターバックス コーヒー 五反田西口店」)。
  // 全角空白も区切りとして扱う
  const terms = useMemo(
    () =>
      query
        .trim()
        .toLowerCase()
        .split(/[\s　]+/)
        .filter((w) => w !== ""),
    [query]
  );

  const matches = useMemo(() => {
    if (terms.length === 0) return [];
    return allCafes.filter((c) => {
      const hay = `${c.name} ${c.address ?? ""}`.toLowerCase();
      return terms.every((w) => hay.includes(w));
    });
  }, [terms, allCafes]);

  // 候補は打つそばから出す。多すぎると読めないので頭だけ見せる
  const suggestions = useMemo(() => matches.slice(0, 8), [matches]);

  // 候補が複数あるときは、全部が入る範囲まで地図を引く
  const showAllMatches = useCallback(() => {
    if (!map || matches.length === 0) return;
    setSuggestOpen(false);
    if (matches.length === 1) {
      focusCafe(matches[0]);
      return;
    }
    const b = new google.maps.LatLngBounds();
    for (const c of matches) b.extend({ lat: c.lat, lng: c.lng });
    freezeListRef.current = false;
    hasMovedRef.current = true;
    map.fitBounds(b, 48);
  }, [matches, map, focusCafe]);

  // 送信のあとに「送れた」と出す。押しただけでは分からないという指摘への対応。
  // ついでに、あと何件で称号が上がるかも出す。報告しても本人には何も返って
  // こないので、ここで返す
  const reportedOk = useCallback(() => {
    const next =
      progress.remaining == null
        ? t("gmap.topLevel")
        : t("gmap.nextLevel").replace("{n}", String(Math.max(1, progress.remaining)));
    setThanks(`${t("gmap.thanksSent")}\n${next}`);
    window.setTimeout(() => setThanks(null), 3000);
  }, [progress.remaining, t]);

  const submitCorrection = useCallback(
    async (cafeId: string, message: string) => {
      if (!supabase) return false;
      const { error: err } = await supabase
        .from("info_corrections")
        .insert({ cafe_id: cafeId, reporter_id: reporterId, message });
      return !err;
    },
    [reporterId]
  );

  const cancelAdding = useCallback(() => {
    setAddingCafe(false);
    setPendingLocation(null);
    setNewCafe({
      name: "",
      address: "",
      website: "",
      outlet: false,
      wifi: false,
      nonSmoking: false,
    });
  }, []);

  const submitNewCafe = useCallback(async () => {
    if (!pendingLocation) return;
    const name = newCafe.name.trim();
    if (!name) return;
    const ok = await addCafe({
      name,
      address: newCafe.address.trim(),
      lat: pendingLocation.lat,
      lng: pendingLocation.lng,
      website: newCafe.website.trim(),
      // チェックした項目だけ、そのまま短い文で残す。書いた人が現地で見た事実
      outletInfo: newCafe.outlet ? "電源あり(追加した人の確認)" : "",
      wifiInfo: newCafe.wifi ? "Wi-Fiあり(追加した人の確認)" : "",
      smokingInfo: newCafe.nonSmoking ? "禁煙(追加した人の確認)" : "",
    });
    if (ok) cancelAdding();
  }, [pendingLocation, newCafe, addCafe, cancelAdding]);

  const activeCount = countActive(filters);

  return (
    <div className="relative flex-1 min-h-0">
      <GMap
        mapId={MAP_ID}
        defaultCenter={GOTANDA}
        defaultZoom={16}
        // 指がすべって縮小に化けたときに、世界地図まで引けてしまっていた。
        // 載っているのは東京だけなので、そこまで引く意味がない。
        // 11 は関東がひととおり収まるあたり
        minZoom={11}
        gestureHandling="greedy"
        clickableIcons={false}
        zoomControl={false}
        // 拡大縮小は右の中ほどへ。既定の右下だと横カード列と重なる。
        // 数値を直に書いていたら 7(=RIGHT_TOP)で、右上の「お店を追加」の
        // 裏に隠れて見つからなくなっていた
        zoomControlOptions={{ position: ControlPosition.RIGHT_CENTER }}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        onIdle={handleIdle}
        onDragstart={() => {
          hasMovedRef.current = true;
          setSuggestOpen(false);
          setDrifted(true);
        }}
        onClick={(e) => {
          if (addingCafe && e.detail.latLng) {
            setPendingLocation(e.detail.latLng);
            return;
          }
          setSuggestOpen(false);
          // カードのバツ印を消したので、地図の何もない所を押すのが閉じ方
          selectedIdRef.current = null;
          setSelected(null);
          setFrozenStrip([]);
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <CafeMarkers
          cafes={clustered}
          selectedId={selected?.id ?? null}
          statsByCafe={statsByCafe}
          onSelect={focusCafe}
          verifiedOutletIds={verifiedOutletIds}
          favorites={favorites}
        />
        {/* 選んだ店はクラスタに入れず単独で出し、そのピンに吹き出しを付ける。
            まとめられていると、リストから選んだのにピンが見えなかった */}
        {selected && (
          <>
            <AdvancedMarker
              position={{ lat: selected.lat, lng: selected.lng }}
              title={selected.name}
              zIndex={999}
              anchorPoint={pinAnchorPoint(selected, verifiedOutletIds)}
            >
              <PinBody
                cafe={selected}
                statusColor={statusColorForStats(statsByCafe[selected.id] ?? null)}
                verifiedOutletIds={verifiedOutletIds}
                saved={favorites.has(selected.id)}
                selected
              />
            </AdvancedMarker>
          </>
        )}
        <UserLocationMarker position={userPosition} heading={heading} />
        {pendingLocation && (
          <AdvancedMarker
            position={pendingLocation}
            title={t("gmap.pendingPin")}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
          </AdvancedMarker>
        )}
      </GMap>

      {/* 上の操作。上から順に「探す → エリア → 絞り込み」。
          実地で「上から順に操作するから、エリアが絞り込みの下にあると迷う」
          という指摘があったので、この並びにしている */}
      <div className="absolute left-2 right-2 top-2 z-20 flex flex-col gap-1.5 items-start pointer-events-none">
        <div className="w-full flex items-center gap-1.5 pointer-events-auto">
          <div className="flex-1 relative">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") showAllMatches();
            }}
            placeholder={t("gmap.searchPlaceholder")}
            className="w-full rounded-full shadow-lg border border-gray-300 bg-white px-3.5 py-1.5 text-[13px] text-gray-900 placeholder:text-gray-500"
          />
          {query !== "" && (
            <button
              onClick={() => {
                setQuery("");
                setSuggestOpen(false);
              }}
              aria-label={t("gmap.close")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[15px]"
            >
              ✕
            </button>
          )}
          {suggestOpen && query.trim() !== "" && (
            <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[46vh] overflow-y-auto">
              {suggestions.length === 0 ? (
                <p className="px-4 py-3 text-[13px] text-gray-600">
                  {t("gmap.searchNoHit")}
                </p>
              ) : (
                <>
                  {suggestions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSuggestOpen(false);
                        focusCafe(c);
                      }}
                      className="w-full text-left px-4 py-2.5 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="block text-[13px] font-semibold text-gray-900 truncate">
                        {favorites.has(c.id) && "🔖 "}
                        {c.name}
                      </span>
                      <span className="block text-[11px] text-gray-600 truncate">
                        {c.address ?? ""}
                      </span>
                    </button>
                  ))}
                  {suggestions.length > 1 && (
                    <button
                      onClick={showAllMatches}
                      className="w-full px-4 py-2.5 text-[13px] font-semibold text-blue-700 bg-gray-50"
                    >
                      {matches.length}
                      {t("gmap.searchShowAll")}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          </div>
          {/* 言語・ピンの説明・「i」は検索欄と同じ行の右に並べる。
              「i」の中に入れると辿り着けないので、どれも外に出しておく */}
          <LegendButton />
          <LangButton />
          <AboutButton />
        </div>

        {/* この範囲で再検索。地図を動かした後だけ出す。行ごと中央に置いて、
            地図の左右どちらにも寄らないようにする */}
        {drifted && (
          <div className="w-full flex justify-center pointer-events-auto">
            <button
              onClick={() => {
                freezeListRef.current = false;
                // 探し直したら、カードも先頭の20件からやり直す
                setFrozenStrip([]);
                setStripCount(8);
                setDrifted(false);
                handleIdle();
              }}
              className="rounded-full bg-white text-gray-900 border border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.2)] px-4 py-1.5 text-[12px] font-bold whitespace-nowrap flex items-center gap-1"
            >
              <span className="text-blue-700">↻</span>
              {t("gmap.researchHere")}
            </button>
          </div>
        )}


          {/* 送信の手応え。押した場所の近くではなく画面の中ほどに出す。
            吹き出しの中に出すと、開いている報告欄に埋もれて気づかれない */}
      {thanks && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 flex justify-center pointer-events-none px-6">
          <p className="bg-gray-900/92 text-white rounded-xl px-4 py-3 text-[13px] font-bold text-center whitespace-pre-line shadow-xl">
            {thanks}
          </p>
        </div>
      )}

      </div>

      {/* お店を追加。横スライドの左上に置く。地図の上には検索と
          言語・ピンの説明・iだけを残して、地図を広く見せる */}
      <div
        style={{ bottom: bottomHeight + 8 }}
        className="absolute left-2 z-20 flex flex-col items-start gap-1 max-w-[74%]"
      >
        <button
          onClick={() => (addingCafe ? cancelAdding() : setAddingCafe(true))}
          className={`rounded-full shadow px-2.5 py-1 text-[11px] font-semibold border ${
            addingCafe
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-800 border-gray-300"
          }`}
        >
          {addingCafe ? t("gmap.close") : `＋ ${t("gmap.addTitle")}`}
        </button>
        {addingCafe && (
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-2.5 w-[248px]">
            {!pendingLocation ? (
              <p className="text-[12px] text-gray-800">{t("gmap.addTapHint")}</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {/* 座標の数字は出さない。読めても意味が無く、不安にさせるだけ */}
                <p className="text-[11px] text-gray-600">{t("gmap.addPlaced")}</p>
                <input
                  value={newCafe.name}
                  onChange={(e) => setNewCafe((s) => ({ ...s, name: e.target.value }))}
                  placeholder={t("gmap.nameRequired")}
                  className="border border-gray-300 rounded px-2 py-1.5 text-[13px] text-gray-900"
                />
                <input
                  value={newCafe.address}
                  onChange={(e) => setNewCafe((s) => ({ ...s, address: e.target.value }))}
                  placeholder={t("gmap.addressOptional")}
                  className="border border-gray-300 rounded px-2 py-1.5 text-[13px] text-gray-900"
                />
                <input
                  value={newCafe.website}
                  onChange={(e) => setNewCafe((s) => ({ ...s, website: e.target.value }))}
                  placeholder={t("gmap.websiteOptional")}
                  inputMode="url"
                  className="border border-gray-300 rounded px-2 py-1.5 text-[13px] text-gray-900"
                />
                {/* 現地で見れば分かることは、打たせずに押させる */}
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ["outlet", `🔌 ${t("gmap.hasOutlet")}`],
                      ["wifi", `📶 ${t("gmap.hasWifi")}`],
                      ["nonSmoking", `🚭 ${t("gmap.isNonSmoking")}`],
                    ] as const
                  ).map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setNewCafe((s) => ({ ...s, [k]: !s[k] }))}
                      className={`rounded-full px-2.5 py-1 text-[12px] border ${
                        newCafe[k]
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {cafeError && (
                  <p className="text-[11px] text-red-700">{t("gmap.addFailed")}</p>
                )}
                <div className="flex gap-1.5">
                  <button
                    onClick={submitNewCafe}
                    disabled={cafeSubmitting || newCafe.name.trim() === ""}
                    className="flex-1 rounded-lg bg-blue-600 text-white text-[13px] py-1.5 font-semibold disabled:opacity-50"
                  >
                    {t("gmap.addSubmit")}
                  </button>
                  <button
                    onClick={() => setPendingLocation(null)}
                    className="rounded-lg border border-gray-300 text-[12px] px-2.5 text-gray-800"
                  >
                    {t("gmap.addRepick")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 現在地。下の帯の高さに追従させているので、カードが広がっても重ならない */}
      {(
        <button
          onClick={locate}
          aria-label={t("gmap.myLocation")}
          style={{ bottom: bottomHeight + 12 }}
          className="absolute right-3 z-20 bg-white rounded-full shadow-lg border border-gray-300 w-8 h-8 flex items-center justify-center text-[14px]"
        >
          ◎
        </button>
      )}

      {/* 横カード列と縦リスト。店を選ぶと、その店のカードが広がって
          店舗情報を出す。吹き出しはやめた(地図の上に重なるので幅も高さも
          取れず、店名が切れる・欄がはみ出す問題が最後まで残った)。
          縦リストの中身は、カードが広がっている間は畳んでおく */}
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 z-10">
          {/* 横スライドは1本だけ。カードの幅は全部そろえ、選んだカードだけが
              下へ伸びて店舗情報を出す。
              幅を変えると、真ん中に来るカードが変わる → その店が選ばれる →
              また幅が変わる、で選択が止まらなくなる。高さが変わるぶんには
              真ん中の判定は動かない */}
          {strip.length > 0 && (
            <div
              ref={stripRef}
              onScroll={handleStripScroll}
              // overscroll-x-contain: 端まで送りきった勢いを画面へ渡さない。
              // これが無いと、行き止まりで指を動かしたぶんが画面ごとの
              // 横移動(iOSでは「前の画面へ戻る」)に化けることがある
              className="overflow-x-auto overscroll-x-contain flex gap-2 px-[calc(50%-43vw)] pb-2 snap-x snap-mandatory [scrollbar-width:none]"
            >
              {strip.slice(0, stripCount).map((cafe) => {
                const stats = statsByCafe[cafe.id] ?? null;
                  const isOpen = selected?.id === cafe.id;
                  return (
                    <div
                      key={cafe.id}
                      data-cafe-id={cafe.id}
                      // 送っている途中のカードを押したら、その店を選ぶ。
                      // 中のボタンを押した場合もここまで上がってくるが、
                      // 同じ店を選び直すだけなので害はない
                      onClick={() => {
                        if (!isOpen) focusCafe(cafe, false);
                      }}
                      className={`snap-center shrink-0 w-[86vw] rounded-xl border bg-white px-3 py-2 ${
                        isOpen
                          ? "border-2 border-blue-600 shadow-xl"
                          : "border-gray-200 shadow"
                      }`}
                    >
                      <CafeCard
                          cafe={cafe}
                          stats={stats}
                          facts={factsByCafe[cafe.id] ?? []}
                          isUserAdded={userCafeIds.has(cafe.id)}
                          active={isOpen}
                          userPosition={userPosition}
                          isFavorite={favorites.has(cafe.id)}
                          isFlagged={flaggedByMe.has(cafe.id)}
                          reportSubmitting={submitting === cafe.id}
                          factSubmitting={factSubmitting === cafe.id}
                          reportError={reportError}
                          factError={factError}
                          onClose={() => {
                            selectedIdRef.current = null;
                            setSelected(null);
                            setFrozenStrip([]);
                          }}
                          onToggleFavorite={() => handleToggleFavorite(cafe.id)}
                          onReportOccupancy={async (lv2) => {
                            await submitOccupancy(cafe.id, lv2);
                            reportedOk();
                          }}
                          onSubmitFact={async (patch) => {
                            await submitFact(cafe.id, patch);
                            reportedOk();
                          }}
                          rating={ratingFor(cafe.id)}
                          ratingSubmitting={ratingSubmitting === cafe.id}
                          onRate={(score) => rate(cafe.id, score)}
                          onFlag={() => flagCafe(cafe.id)}
                          onSubmitCorrection={(m) => submitCorrection(cafe.id, m)}
                        />
                    </div>
                  );
              })}
            </div>
          )}

          <div className="relative bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.10)]">
            {/* エリアと絞り込みはリスト側に持たせる。探す条件を決める道具は、
                探した結果(リスト)と同じ場所にあるほうが行き来しなくて済む */}
            <div className="flex items-center gap-1.5 px-2 pt-1.5 overflow-x-auto [scrollbar-width:none]">
            <select
              value=""
              onChange={(e) => {
                const area = areas.find((a) => a.id === e.target.value);
                if (!area || !map) return;
                hasMovedRef.current = true;
                freezeListRef.current = false;
                map.panTo({ lat: area.lat, lng: area.lng });
                map.setZoom(16);
              }}
              className="rounded-full px-2.5 py-1 text-[11px] bg-white text-gray-800 border border-gray-300 max-w-[112px]"
            >
              <option value="">{t("gmap.area")}</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name.replace("駅", "")}
                </option>
              ))}
            </select>
            {/* 並び順。地図にピンがたくさんあるとき、どれから見ればよいか
                決められるようにする */}
            {(
              [
                ["recommended", t("gmap.sortRecommended")],
                ["nearest", t("gmap.sortNearest")],
                ["rating", t("gmap.sortRating")],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  freezeListRef.current = false;
                  setFrozenStrip([]);
                  setStripCount(8);
                  // 並べ替えた直後に、新しい先頭の店を開く。
                  //
                  // 選んでいた店はそのまま残るので、順番だけ変わると
                  // その店は別の位置へ行き、真ん中には開いていないカードが
                  // 来る。押した直後に情報が消えたように見えていた
                  sortChangedRef.current = true;
                  setSortOrder(key);
                }}
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold border whitespace-nowrap ${
                  sortOrder === key
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {label}
              </button>
            ))}

            {/* 絞り込みは畳まずに出しっぱなしにする。開いてからでないと
                何で絞れるのか分からない状態だと、そもそも押されない。
                横に溢れるぶんは横スクロールで見せる */}
            {filterLabels.map(({ key, label, note }) => (
              <button
                key={key}
                onClick={() => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold border whitespace-nowrap ${
                  filters[key]
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {label}
                {note && (
                  <span
                    className={`ml-1 text-[10px] font-normal ${
                      filters[key] ? "text-blue-100" : "text-gray-600"
                    }`}
                  >
                    {note}
                  </span>
                )}
              </button>
            ))}
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="shrink-0 rounded-full px-2 py-0.5 text-[11px] text-gray-700 underline whitespace-nowrap"
              >
                {t("gmap.clearFilters")}
              </button>
            )}
            </div>

            <button
              onClick={() => setListOpen((v) => !v)}
              className="w-full px-3 py-1.5 flex items-center justify-between text-[12px] font-bold text-gray-900"
            >
              <span>
                {t("gmap.listInView")} {visible.length}
                {t("gmap.count")}
                {capped && (
                  <span className="ml-1 font-normal text-[11px] text-gray-600">
                    {t("gmap.capped")}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-2">
                {/* 送った件数と称号。報告する気になる材料として常に見せる */}
                {progress.level && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 rounded-full px-2 py-0.5">
                    {progress.level.emoji} Lv.{progress.level.level}
                  </span>
                )}
                <span className="text-gray-500">{listOpen ? "▼" : "▲"}</span>
              </span>
            </button>
            {listOpen && !selected && (
              <ul className="max-h-[22vh] overflow-y-auto border-t border-gray-100">
                {listed.map((cafe) => {
                  const stats = statsByCafe[cafe.id] ?? null;
                  const lv = stats ? pickMajority(stats.seatingOccupancyCounts) : null;
                  return (
                    // このリストは店を選んでいない間しか出ないので、
                    // 選択中の行を塗り分ける必要はない
                    <li key={cafe.id} className="flex items-center border-b border-gray-100">
                      <button
                        onClick={() => focusCafe(cafe)}
                        className="flex-1 min-w-0 text-left pl-3 py-1.5 flex items-center justify-between gap-2"
                      >
                        {/* 横スライドのカードと同じ中身にする。片方だけ情報が
                            薄いと、見る場所によって分かることが変わってしまう */}
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-bold text-gray-900 truncate">
                            {cafe.name}
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] mt-0.5 whitespace-nowrap">
                            {userPosition ? (
                              <span className="text-blue-800 font-bold">
                                📍{" "}
                                {formatDistance(
                                  distanceMeters(userPosition, [cafe.lat, cafe.lng])
                                )}
                                <span className="font-normal text-gray-700">
                                  （{t("gmap.walkMin")}
                                  {Math.max(
                                    1,
                                    Math.ceil(
                                      distanceMeters(userPosition, [cafe.lat, cafe.lng]) / 80
                                    )
                                  )}
                                  分）
                                </span>
                              </span>
                            ) : (
                              <span className="text-gray-600">
                                🚶 {nearestStationWalkMinutes(cafe.lat, cafe.lng)}
                                {lang === "en" ? "m" : "分"}
                              </span>
                            )}
                            <StarRating value={ratingFor(cafe.id).average} size={10} />
                            <span className="text-gray-600">
                              {ratingFor(cafe.id).count > 0
                                ? ratingFor(cafe.id).average!.toFixed(1)
                                : "–"}
                            </span>
                          </span>
                          <span className="flex gap-x-1 text-[10px] mt-0.5">
                            {lv && <span>{OCCUPANCY_EMOJI[lv]}</span>}
                            {hasOutlet(cafe, verifiedOutletIds) && (
                              <span className="bg-amber-100 text-amber-900 rounded px-1">🔌</span>
                            )}
                            {cafe.wifiInfo && (
                              <span className="bg-sky-100 text-sky-900 rounded px-1">📶</span>
                            )}
                            {isNonSmoking(cafe) && (
                              <span className="bg-emerald-100 text-emerald-900 rounded px-1">
                                🚭
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                      {/* 一覧から直接しおりを付けられるようにする。行を押すと
                          店が選ばれてしまうので、ボタンは分けておく */}
                      <button
                        onClick={() => handleToggleFavorite(cafe.id)}
                        aria-label={favorites.has(cafe.id) ? t("gmap.saved") : t("gmap.save")}
                        aria-pressed={favorites.has(cafe.id)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center"
                      >
                        <BookmarkIcon filled={favorites.has(cafe.id)} size={16} />
                      </button>
                    </li>
                  );
                })}
                {/* カードから外した広告枠。スクロールする場所なので、
                    地図やカードと場所を取り合わない */}
                {listed.length > 3 && (
                  <li className="px-3 py-2 border-b border-gray-100">
                    <AdBanner slot="cafe-list-infeed" minHeight={56} />
                  </li>
                )}
                {listed.length === 0 && (
                  <li className="px-3 py-4 text-[12px] text-gray-600">
                    {t("gmap.listEmpty")}
                  </li>
                )}
              </ul>
            )}
          </div>
      </div>
    </div>
  );
}

// 地図の読み込みに失敗したとき、そのまま描くとライブラリが未初期化のAPIに
// 触り続け、getRootNode のエラーが延々と出てタブごと落ちる(実際に起きた)。
// 読み込みが終わるまでは地図を組み立てない
function MapGate() {
  const { t } = useLang();
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED) {
    return (
      <div className="flex-1 p-6 text-sm text-gray-800">
        <p className="font-bold text-red-700 mb-3">{t("gmap.loadFailed")}</p>
        {/* ここは原因を切り分けるための表示。訳し分けても意味が無い */}
        <dl className="text-xs bg-gray-100 rounded p-3 leading-relaxed">
          <dt className="font-semibold">キーの長さ</dt>
          <dd className="mb-2">{GOOGLE_MAPS_API_KEY?.length ?? 0} 文字(正しくは39)</dd>
          <dt className="font-semibold">Map ID</dt>
          <dd className="mb-2 font-mono">{MAP_ID}</dd>
          <dt className="font-semibold">このページのURL</dt>
          <dd className="font-mono break-all">
            {typeof window !== "undefined" ? window.location.origin : ""}
          </dd>
        </dl>
      </div>
    );
  }

  if (status !== APILoadingStatus.LOADED) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-600">
        {t("gmap.loading")}
      </div>
    );
  }

  return <GoogleMapView />;
}

// 地図そのものの言語は日本語で固定する。Google Maps の JS API は一度読み込むと
// 言語を切り替えられず、切り替えようとすると二重読み込みの警告が出る。東京の
// 地図なので、看板と同じ日本語表記のほうが現地で照合しやすいという理由もある
export default function GoogleMapPane() {
  if (!GOOGLE_MAPS_API_KEY) return null;
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="ja" region="JP">
      <MapGate />
    </APIProvider>
  );
}
