"use client";

// Googleマップ本体。ページ(page.tsx)からは next/dynamic で ssr:false 付きで
// 読み込む。
//
// 分けている理由は LCP。/ で同じことをやって 5.1s から下げた経緯がある。
// PageSpeed で測ると LCP要素がヘッダーの小さなリンクになっていた。画面の
// 大半を占める地図が何も描いていないので、その小さな文字が「一番大きく
// 描かれた要素」として選ばれてしまう。内訳もダウンロードではなく描画待ち
// だった。
//
// このファイルは gzip で 155KB ぶんの塊(Googleマップのライブラリと
// 1,989軒のデータ)を持つ。最初のHTMLに混ぜると、そのぶん描き始めが遅れる。
// Google Maps 自体のJSはさらにこの上に乗る。

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  APIProvider,
  APILoadingStatus,
  // JavaScript の Map と名前がぶつかるので別名にする
  Map as GMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
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
import {
  useLiveReports,
  statusColorForStats,
  OCCUPANCY_LABEL,
  OCCUPANCY_LABEL_EN,
  OCCUPANCY_EMOJI,
  OCCUPANCY_SHORT,
  OCCUPANCY_SHORT_EN,
  OCCUPANCY_ORDER,
} from "@/lib/useLiveReports";
import { pickMajority } from "@/lib/cafeStats";
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
import {
  useCafeFacts,
  summarise,
  WIFI_SPEED_LABEL,
  WIFI_SPEED_LABEL_EN,
  WIFI_SPEED_ORDER,
} from "@/lib/useCafeFacts";
import { isNonSmoking } from "@/lib/cafeStats";
import { useUserCafes } from "@/lib/useUserCafes";
import { useVerifiedOutlets } from "@/lib/useVerifiedOutlets";
import { useLang } from "@/lib/i18n";
import AdBanner from "@/components/AdBanner";
import { supabase } from "@/lib/supabaseClient";
import type { CafeStats } from "@/lib/types";

// Googleマップ版。現地で見比べた結果「Googleのほうが店にたどり着きやすい」
// という判断になったため、本体を移行する前段として実用レベルまで作る。
//
// このページは比較用ではなく「新しい本体」として育てている。機能を1つずつ
// 移し、揃った時点で / を差し替えて Leaflet 版を削除する。
// 二重に作らないことと、途中で止めても壊れないことを優先している。

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
// 電源プラグが付く場合はプラグの先まで伸びて33px。Leaflet では
// iconAnchor でこの点を指定していた。
//
// Google のマーカーは既定で要素の「下端中央」を座標に合わせるため、
// そのままだと先端が座標より上を指す。ズーム17で約25m、ズーム16なら約50m。
// 五反田で「道を挟んで隣のビル」に見えたのはこれ。
//
// 最初 CSS の transform でずらしたが、それでは見た目が動くだけで
// ライブラリが持っている位置は元のまま。クラスタリングやタップ判定が
// ずれた位置を使い続ける。anchorPoint で正しく指定する
function pinAnchorPoint(cafe: Cafe, verifiedOutletIds: Set<string>): [string, string] {
  const anchorY = hasOutlet(cafe, verifiedOutletIds) ? 33 : 21;
  return ["50%", `${(anchorY / PIN_SIZE) * 100}%`];
}

// ピン1個ぶん。ref に渡す関数を useCallback で固定するために、
// あえてコンポーネントを分けている。
//
// 親のJSXに ref={(m) => register(m, cafe.id)} と直接書くと、描画のたびに
// 新しい関数になる。React は ref の関数が変わると null で呼び直してから
// 付け直すので、そこで state を更新していると
// 「更新 → 再描画 → refが変わる → 付け直し → 更新」で止まらなくなる。
// スマホが落ちていた原因はこれだった
function ClusteredCafeMarker({
  cafe,
  stats,
  onSelect,
  register,
  verifiedOutletIds,
}: {
  cafe: Cafe;
  stats: CafeStats | null;
  onSelect: (cafe: Cafe) => void;
  register: (id: string, marker: Marker | null) => void;
  verifiedOutletIds: Set<string>;
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
      <div
        style={{ width: PIN_SIZE, height: PIN_SIZE }}
        dangerouslySetInnerHTML={{
          __html: pinHtml(cafe, statusColorForStats(stats), verifiedOutletIds),
        }}
      />
    </AdvancedMarker>
  );
}

// AdvancedMarker と MarkerClusterer をつなぐ。クラスタリングは
// Leaflet 版と同じ理由で要る。都心では表示範囲だけでも数百件が同時に出て、
// ピンが重なって地図が読めなくなる
function CafeMarkers({
  cafes,
  statsByCafe,
  onSelect,
  verifiedOutletIds,
}: {
  cafes: Cafe[];
  statsByCafe: Record<string, CafeStats>;
  onSelect: (cafe: Cafe) => void;
  verifiedOutletIds: Set<string>;
}) {
  const map = useMap();
  // 集めたマーカーは ref に持つ。state にすると ref が付くたびに再描画が
  // 走り、上記のループに戻る
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

  // 表示対象が変わった時だけクラスタを組み直す。ref の付け外しは
  // このeffectより前に終わっているので、markersRef は埋まっている
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
        />
      ))}
    </>
  );
}

function UserLocationMarker({ position }: { position: [number, number] | null }) {
  const { t } = useLang();
  if (!position) return null;
  // 現在地は点の中心が位置。既定の「下端中央」だと半径ぶん北にずれる
  return (
    <AdvancedMarker
      position={{ lat: position[0], lng: position[1] }}
      title={t("gmap.myLocation")}
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
      <div className="cf-user-dot">
        <span className="cf-user-pulse-ring" />
      </div>
    </AdvancedMarker>
  );
}

// 出典表示。地図そのものの出典は Google が自前で出すので、ここで出すのは
// 「うちが持ち込んだデータ」の出典だけになる。
//
// 店舗の座標の一部は国土地理院の住所検索と Yahoo! の場所情報検索で解決して
// いる。Yahoo!デベロッパーネットワークのガイドラインは、APIを使ったアプリに
// クレジット表示を義務づけている。地図をGoogleに替えてもこの義務は消えない。
// 「最も目立つ要素であってはならない」「提携をほのめかしてはならない」と
// いう条件があるので、出典として淡々と並べる
function AttributionButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t("attribution.title")}
        title={t("attribution.title")}
        className="bg-white/95 rounded-full shadow border border-gray-300 w-6 h-6 flex items-center justify-center text-[11px] font-semibold text-gray-600"
      >
        {t("attribution.button")}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-gray-100 font-semibold text-gray-900">
              {t("attribution.title")}
            </div>
            <a
              href="https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 border-b border-gray-200 text-blue-600"
            >
              {t("gmap.gsiCredit")}
            </a>
            {/* この文字列は Yahoo! 側が指定している表記。訳さない */}
            <a
              href="https://developer.yahoo.co.jp/sitemap/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 border-b border-gray-200 text-blue-600"
            >
              Web Services by Yahoo! JAPAN
            </a>
            <button
              onClick={() => setOpen(false)}
              className="w-full px-4 py-3 font-semibold text-gray-700"
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
  // 訳すのは画面の文言だけ。店名・住所・営業時間・利用者の書き込みは
  // 実データなので、そのまま出す
  const { lang, t } = useLang();
  const occLabel = lang === "en" ? OCCUPANCY_LABEL_EN : OCCUPANCY_LABEL;
  const occShort = lang === "en" ? OCCUPANCY_SHORT_EN : OCCUPANCY_SHORT;
  const wifiLabel = lang === "en" ? WIFI_SPEED_LABEL_EN : WIFI_SPEED_LABEL;
  const filterLabels = lang === "en" ? FILTER_LABELS_EN : FILTER_LABELS;
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selected, setSelected] = useState<Cafe | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [filters, setFilters] = useState<CafeFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set<string>() : getFavorites()
  );
  const [listOpen, setListOpen] = useState(false);
  // お店を追加。地図をタップして場所を決める方式にしている。住所を打つより
  // 「今いる店の場所を指す」ほうが早く、座標もずれない
  const [addingCafe, setAddingCafe] = useState(false);
  const [pendingLocation, setPendingLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  // 細かい報告の入力欄。店ごとに持つ。1組だけにすると、別の店を開いた
  // ときに書きかけの文字が残り、違う店の情報として送られてしまう。
  // 店ごとなら書きかけのまま地図を見に戻っても消えない
  const [draft, setDraft] = useState<
    Record<string, { seats?: string; outletSeats?: string; note?: string; fix?: string }>
  >({});
  const [correctionSent, setCorrectionSent] = useState<Set<string>>(new Set());
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  const setDraftField = useCallback(
    (cafeId: string, field: "seats" | "outletSeats" | "note" | "fix", value: string) =>
      setDraft((prev) => ({ ...prev, [cafeId]: { ...prev[cafeId], [field]: value } })),
    []
  );
  const watchIdRef = useRef<number | null>(null);
  // 自分で地図を動かしたか。動かした後に現在地へ勝手に飛ばされると、
  // 見ていた場所を見失う
  const hasMovedRef = useRef(false);
  // 「地図はGoogleでいいが、載っている情報はカフェレーダーのもの」。
  // 直近30分の混雑報告を取り、ピンの色と店舗情報に反映する
  const {
    statsByCafe,
    reporterId,
    submitting,
    error: reportError,
    submitOccupancy,
  } = useLiveReports();
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

  // 管理者が承認した電源報告。ピンのプラグと「電源あり」の絞り込みが
  // これを見ないと、承認しても何も変わらない
  const verifiedOutletIds = useVerifiedOutlets();

  // 編集部調べの店と、利用者が追加した店をひとつの一覧にする
  const allCafes = useMemo(() => [...seedCafes, ...userCafes], [userCafes]);

  // 指を動かしている間ずっと発火する onCameraChanged を使っていたら、
  // スマホでタブごと落ちた。1フレームごとに 1,989軒の絞り込みと
  // 数百個のピンの再描画、クラスタの全再構築が走っていたため。
  //
  // Leaflet 版が moveend / zoomend を使っていたのと同じ理由で、
  // 操作が終わって地図が落ち着いた時(idle)だけ更新する
  const handleIdle = useCallback(() => {
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    const next = MapBounds.fromGoogle(b);
    setBounds((prev) => (prev?.equals(next) ? prev : next));
  }, [map]);

  const visible = useMemo(() => {
    if (!bounds) return [];
    const padded = bounds.pad(0.15);
    const inView = allCafes.filter((c) => {
      if (!padded.contains([c.lat, c.lng])) return false;
      return passesFilters(
        c,
        filters,
        statsByCafe[c.id] ?? null,
        favorites,
        verifiedOutletIds
      );
    });
    if (inView.length <= MAX_MARKERS) return inView;
    // 引いた表示だと1,000件を超える。クラスタでまとめても、その数の
    // React要素とDOMノードを作る負荷は残るので、中心に近い順で打ち切る
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

  // 縦リスト用。地図の中心に近い順に並べる。地図とリストで順番が
  // 食い違うと、どれを見ているのか分からなくなる
  const listed = useMemo(() => {
    if (!bounds) return [];
    const [cLat, cLng] = bounds.getCenter();
    return [...visible]
      .sort(
        (a, b) =>
          (a.lat - cLat) ** 2 + (a.lng - cLng) ** 2 -
          ((b.lat - cLat) ** 2 + (b.lng - cLng) ** 2)
      )
      .slice(0, 60);
  }, [visible, bounds]);

  const focusCafe = useCallback(
    (cafe: Cafe) => {
      setSelected(cafe);
      hasMovedRef.current = true;
      map?.panTo({ lat: cafe.lat, lng: cafe.lng });
    },
    [map]
  );

  const handleToggleFavorite = useCallback((cafeId: string) => {
    setFavorites(toggleFavorite(cafeId));
  }, []);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    hasMovedRef.current = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(p);
        map?.panTo({ lat: p[0], lng: p[1] });
        map?.setZoom(17);
        // 歩いている間も追従させる。Leaflet 版と同じ理由
        if (watchIdRef.current === null) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (w) => setUserPosition([w.coords.latitude, w.coords.longitude]),
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
          );
        }
      },
      () => {},
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [map]);

  // 開いた時点で現在地へ寄せる。ただし許可のダイアログを勝手に出さない。
  //
  // ホーム画面に追加して使っている人は自分の意思で入れた人なので、
  // 起動のたびにボタンを押させるほうが煩わしい。検索やSNSから初めて
  // 来た人とは分けて扱う。それ以外は Permissions API で「許可済み」と
  // 確認できたときだけ動かす(確認できない環境ではあきらめる。呼べば
  // ダイアログが出てしまうため)。Leaflet 版と同じ判断
  useEffect(() => {
    if (!map || hasMovedRef.current) return;
    const isInstalledApp =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari は display-mode に対応せず、独自の navigator.standalone を使う
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
      .catch(() => {
        // name を解釈できないブラウザ。何もしない(ダイアログを出さない)
      });
    return () => {
      cancelled = true;
    };
  }, [map, locate]);

  // 席数は「数えられる人が数えた値」なので、整数で正のものだけ受ける
  const submitCount = useCallback(
    (cafeId: string, field: "seat_count" | "outlet_seat_count", raw: string) => {
      const n = Number(raw.trim());
      if (!raw.trim() || !Number.isInteger(n) || n <= 0) return;
      submitFact(cafeId, { [field]: n });
      setDraftField(cafeId, field === "seat_count" ? "seats" : "outletSeats", "");
    },
    [submitFact, setDraftField]
  );

  // 編集部調べの記載が実際と違うときの報告。五反田で「席すらなかった」
  // 「閉店していた」が続いたので、地図側にこの口が要る
  const submitCorrection = useCallback(
    async (cafeId: string) => {
      const message = (draft[cafeId]?.fix ?? "").trim();
      if (!message || !supabase) return;
      setCorrectionError(null);
      const { error: err } = await supabase
        .from("info_corrections")
        .insert({ cafe_id: cafeId, reporter_id: reporterId, message });
      if (err) {
        setCorrectionError(err.message);
        return;
      }
      setDraftField(cafeId, "fix", "");
      setCorrectionSent((prev) => new Set(prev).add(cafeId));
    },
    [draft, reporterId, setDraftField]
  );

  const cancelAdding = useCallback(() => {
    setAddingCafe(false);
    setPendingLocation(null);
    setNewName("");
    setNewAddress("");
  }, []);

  const submitNewCafe = useCallback(async () => {
    if (!pendingLocation) return;
    const name = newName.trim();
    if (!name) return;
    const ok = await addCafe({
      name,
      address: newAddress.trim(),
      lat: pendingLocation.lat,
      lng: pendingLocation.lng,
    });
    if (ok) cancelAdding();
  }, [pendingLocation, newName, newAddress, addCafe, cancelAdding]);

  useEffect(
    () => () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    },
    []
  );

  return (
    <div className="relative flex-1">
      <GMap
        mapId={MAP_ID}
        defaultCenter={GOTANDA}
        defaultZoom={16}
        gestureHandling="greedy"
        clickableIcons={false}
        zoomControl={true}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        onIdle={handleIdle}
        onDragstart={() => {
          hasMovedRef.current = true;
        }}
        onClick={(e) => {
          if (!addingCafe || !e.detail.latLng) return;
          setPendingLocation(e.detail.latLng);
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <CafeMarkers
          cafes={visible}
          statsByCafe={statsByCafe}
          onSelect={setSelected}
          verifiedOutletIds={verifiedOutletIds}
        />
        <UserLocationMarker position={userPosition} />
        {pendingLocation && (
          <AdvancedMarker
            position={pendingLocation}
            title={t("gmap.pendingPin")}
            anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg" />
          </AdvancedMarker>
        )}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            pixelOffset={[0, -38]}
          >
            {/* 狭い画面で読まれるので、文章は削って要点だけ並べる。
                住所や長い説明は詳細ページにある。ここで答えるのは
                「座れるか」「電源はあるか」の2つに絞る */}
            <div className="text-gray-900 w-[240px] max-h-[60vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-1">
                <div className="font-bold text-sm leading-snug">{selected.name}</div>
                <button
                  onClick={() => handleToggleFavorite(selected.id)}
                  aria-label={t("gmap.favorite")}
                  className="text-lg leading-none text-yellow-500 shrink-0"
                >
                  {favorites.has(selected.id) ? "★" : "☆"}
                </button>
              </div>

              {/* 利用者が追加した店は、編集部で裏を取っていない。
                  同じ見た目にすると、確認済みの情報と区別がつかなくなる */}
              {userCafeIds.has(selected.id) && (
                <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-1.5 py-1 mt-1">
                  {t("gmap.userAdded")}
                </div>
              )}

              {(() => {
                const stats = statsByCafe[selected.id];
                const level = stats
                  ? pickMajority(stats.seatingOccupancyCounts)
                  : null;
                return (
                  <div className="mt-1.5 text-[12px] font-semibold">
                    {level ? (
                      <>
                        {OCCUPANCY_EMOJI[level]} {occLabel[level]}
                        <span className="font-normal text-gray-500">
                          {" "}
                          {stats.totalReporters}
                          {t("gmap.people")}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 font-normal">{t("gmap.noReports")}</span>
                    )}
                  </div>
                );
              })()}

              <div className="flex gap-1 mt-1.5">
                {OCCUPANCY_ORDER.map((level) => (
                  <button
                    key={level}
                    disabled={submitting === selected.id}
                    onClick={() => submitOccupancy(selected.id, level)}
                    title={occLabel[level]}
                    className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 font-semibold text-gray-700 disabled:opacity-50"
                  >
                    {OCCUPANCY_EMOJI[level]}
                    <br />
                    {occShort[level]}
                  </button>
                ))}
              </div>
              {reportError && (
                <div className="text-[10px] text-red-600 mt-1">{t("gmap.sendFailed")}</div>
              )}

              {(() => {
                const f = summarise(factsByCafe[selected.id] ?? []);
                return (
                  <>
                    {/* 公表情報では電源ありでも、現地で塞がれていることがある。
                        ネット調べの記載より先に出す */}
                    {f.outletUnusable && (
                      <div className="text-[11px] mt-2 rounded bg-red-50 border border-red-200 px-1.5 py-1 text-red-900 font-semibold">
                        {t("gmap.outletUnusable")}
                      </div>
                    )}
                    {selected.outletInfo && (
                      <div className="text-[11px] mt-2 text-gray-700 leading-snug">
                        🔌 {selected.outletInfo}
                      </div>
                    )}
                    {/* 報告で分かったことは「報告」と分かる形で出す。
                        ネット調べと混ぜると、どこまで確かなのか分からなくなる */}
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-600 mt-1">
                      {f.outletSeatCount != null && (
                        <span>
                          🔌 {t("gmap.outletSeats")}
                          {f.outletSeatCount}
                          {t("gmap.seatsUnit")}
                        </span>
                      )}
                      {f.wifiSpeed && <span>📶 {wifiLabel[f.wifiSpeed]}</span>}
                      {f.webMeetingOk != null && (
                        <span>🎧 {f.webMeetingOk ? t("gmap.callOk") : t("gmap.callNg")}</span>
                      )}
                      {f.reporters > 0 && (
                        <span className="text-gray-400">
                          {t("gmap.reportsCount")}
                          {f.reporters}
                          {t("gmap.reportsUnit")}
                        </span>
                      )}
                    </div>
                    {f.notes.length > 0 && (
                      <div className="text-[11px] text-gray-600 mt-1 leading-snug">
                        ・{f.notes[0]}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-2 text-[11px] text-gray-500 mt-1">
                      {selected.wifiInfo && <span>📶 Wi-Fi</span>}
                      {selected.seatCountInfo && <span>🪑 {selected.seatCountInfo}</span>}
                      {selected.smokingInfo && (
                        <span>
                          {isNonSmoking(selected)
                            ? `🚭 ${t("gmap.nonSmoking")}`
                            : `🚬 ${t("gmap.smokingOk")}`}
                        </span>
                      )}
                      {selected.hoursInfo && <span>⏰ {selected.hoursInfo}</span>}
                    </div>
                    {selected.webMeetingInfo && (
                      <div className="text-[11px] text-gray-600 mt-1 leading-snug">
                        🎧 {selected.webMeetingInfo}
                      </div>
                    )}

                    {/* 細かい報告は普段は畳んでおく。開くのは、その店に
                        実際にいて答えられる人だけでいい */}
                    <details className="mt-2">
                      <summary className="text-[11px] text-blue-600 cursor-pointer">
                        {t("gmap.reportMore")}
                      </summary>
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        <div>
                          <div className="text-[10px] text-gray-500">{t("gmap.wifiSpeedLabel")}</div>
                          <div className="flex gap-1 mt-0.5">
                            {WIFI_SPEED_ORDER.map((sp) => (
                              <button
                                key={sp}
                                disabled={factSubmitting === selected.id}
                                onClick={() => submitFact(selected.id, { wifi_speed: sp })}
                                className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 disabled:opacity-50"
                              >
                                {wifiLabel[sp]}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500">{t("gmap.webMeetingLabel")}</div>
                          <div className="flex gap-1 mt-0.5">
                            <button
                              disabled={factSubmitting === selected.id}
                              onClick={() =>
                                submitFact(selected.id, { web_meeting_ok: true })
                              }
                              className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 disabled:opacity-50"
                            >
                              {t("gmap.webMeetingYes")}
                            </button>
                            <button
                              disabled={factSubmitting === selected.id}
                              onClick={() =>
                                submitFact(selected.id, { web_meeting_ok: false })
                              }
                              className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 disabled:opacity-50"
                            >
                              {t("gmap.webMeetingNo")}
                            </button>
                          </div>
                        </div>
                        {/* 席数と電源席数。数えられる人にしか答えられない
                            ぶん、答えが入れば公表情報より確かな値になる */}
                        <div className="flex gap-1">
                          <div className="flex-1">
                            <div className="text-[10px] text-gray-500">
                              {t("gmap.seatCountLabel")}
                            </div>
                            <div className="flex gap-1 mt-0.5">
                              <input
                                value={draft[selected.id]?.seats ?? ""}
                                onChange={(e) => setDraftField(selected.id, "seats", e.target.value)}
                                inputMode="numeric"
                                placeholder="例 40"
                                className="w-full border border-gray-300 rounded px-1.5 py-1 text-[11px] min-w-0"
                              />
                              <button
                                disabled={factSubmitting === selected.id}
                                onClick={() =>
                                  submitCount(selected.id, "seat_count", draft[selected.id]?.seats ?? "")
                                }
                                className="rounded border border-gray-300 bg-white px-2 text-[10px] disabled:opacity-50"
                              >
                                {t("gmap.send")}
                              </button>
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] text-gray-500">
                              {t("gmap.outletSeatCountLabel")}
                            </div>
                            <div className="flex gap-1 mt-0.5">
                              <input
                                value={draft[selected.id]?.outletSeats ?? ""}
                                onChange={(e) =>
                                  setDraftField(selected.id, "outletSeats", e.target.value)
                                }
                                inputMode="numeric"
                                placeholder="例 8"
                                className="w-full border border-gray-300 rounded px-1.5 py-1 text-[11px] min-w-0"
                              />
                              <button
                                disabled={factSubmitting === selected.id}
                                onClick={() =>
                                  submitCount(
                                    selected.id,
                                    "outlet_seat_count",
                                    draft[selected.id]?.outletSeats ?? ""
                                  )
                                }
                                className="rounded border border-gray-300 bg-white px-2 text-[10px] disabled:opacity-50"
                              >
                                {t("gmap.send")}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 電源席がどこにあるか。「窓際だけ」「2階のカウンター」
                            のような一言が、実際に行く人には一番効く */}
                        <div>
                          <div className="text-[10px] text-gray-500">
                            {t("gmap.noteLabel")}
                          </div>
                          <div className="flex gap-1 mt-0.5">
                            <input
                              value={draft[selected.id]?.note ?? ""}
                              onChange={(e) => setDraftField(selected.id, "note", e.target.value)}
                              placeholder={t("gmap.notePlaceholder")}
                              className="w-full border border-gray-300 rounded px-1.5 py-1 text-[11px] min-w-0"
                            />
                            <button
                              disabled={
                                factSubmitting === selected.id ||
                                (draft[selected.id]?.note ?? "").trim() === ""
                              }
                              onClick={() => {
                                submitFact(selected.id, {
                                  note: (draft[selected.id]?.note ?? "").trim(),
                                });
                                setDraftField(selected.id, "note", "");
                              }}
                              className="rounded border border-gray-300 bg-white px-2 text-[10px] disabled:opacity-50"
                            >
                              {t("gmap.send")}
                            </button>
                          </div>
                        </div>

                        <button
                          disabled={factSubmitting === selected.id}
                          onClick={() => submitFact(selected.id, { outlet_usable: false })}
                          className="text-[10px] rounded border border-red-300 bg-white py-1 text-red-800 disabled:opacity-50"
                        >
                          {t("gmap.outletDead")}
                        </button>
                        {factError && (
                          <div className="text-[10px] text-red-600">
                            {t("gmap.sendFailed")}({factError})
                          </div>
                        )}

                        {/* 編集部調べの記載が実際と違うときの報告。
                            五反田では「席すらなかった」「閉店していた」が
                            続いた。載っている情報が違うことは普通に起きる */}
                        <div className="border-t border-gray-200 pt-1.5">
                          <div className="text-[10px] text-gray-500">
                            {t("gmap.correctionLabel")}
                          </div>
                          {correctionSent.has(selected.id) ? (
                            <div className="text-[10px] text-gray-500 mt-0.5">
                              {t("gmap.correctionThanks")}
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-1 mt-0.5">
                                <input
                                  value={draft[selected.id]?.fix ?? ""}
                                  onChange={(e) => setDraftField(selected.id, "fix", e.target.value)}
                                  placeholder={t("gmap.correctionPlaceholder")}
                                  className="w-full border border-gray-300 rounded px-1.5 py-1 text-[11px] min-w-0"
                                />
                                <button
                                  disabled={(draft[selected.id]?.fix ?? "").trim() === ""}
                                  onClick={() => submitCorrection(selected.id)}
                                  className="rounded border border-gray-300 bg-white px-2 text-[10px] disabled:opacity-50"
                                >
                                  {t("gmap.send")}
                                </button>
                              </div>
                              {correctionError && (
                                <div className="text-[10px] text-red-600 mt-0.5">
                                  {t("gmap.sendFailed")}({correctionError})
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </details>
                  </>
                );
              })()}

              <div className="flex gap-3 mt-2 text-[11px]">
                {/* 詳細ページは編集部調べの店だけ。利用者が追加した店は
                    まだページが無いので出さない */}
                {!userCafeIds.has(selected.id) && (
                  <Link href={`/cafe/${selected.id}`} className="text-blue-600 underline">
                    {t("gmap.detail")}
                  </Link>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selected.address ? `${selected.name} ${selected.address}` : selected.name
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-blue-600 underline"
                >
                  {t("gmap.directions")}
                </a>
                {userCafeIds.has(selected.id) && (
                  <button
                    onClick={() => flagCafe(selected.id)}
                    disabled={flaggedByMe.has(selected.id)}
                    className="text-gray-500 underline disabled:no-underline disabled:text-gray-400"
                  >
                    {flaggedByMe.has(selected.id) ? t("gmap.flagged") : t("gmap.flag")}
                  </button>
                )}
              </div>

              {/* Leaflet版と同じ枠。差し替えた時点で広告がゼロにならないよう、
                  移行前に入れておく */}
              <AdBanner slot="cafe-popup" minHeight={56} className="mt-2" />
            </div>
          </InfoWindow>
        )}
      </GMap>

      {/* 絞り込み。開いていない間は1行しか占めないようにして、
          地図を隠さないようにする */}
      <div className="absolute left-2 top-2 flex flex-col gap-1 items-start max-w-[calc(100%-1rem)]">
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`rounded-full shadow px-3 py-1 text-[11px] font-semibold border ${
              countActive(filters) > 0
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {t("filter.toggle")}
            {countActive(filters) > 0 ? ` ${countActive(filters)}` : ""}{" "}
            {filterOpen ? "▲" : "▼"}
          </button>
          <div className="bg-white/95 rounded shadow px-2 py-1 text-[11px] text-gray-700 whitespace-nowrap">
            {visible.length}
            {t("gmap.countUnit")}
            {capped ? t("gmap.capped") : ""}
          </div>
          <AttributionButton />
        </div>

        {/* 駅で探す。全23エリアぶん。中身は駅の一覧なので「エリア」ではなく
            「駅」と書く(Redditで区で絞れると誤解された) */}
        <select
          value=""
          onChange={(e) => {
            const area = areas.find((a) => a.id === e.target.value);
            if (!area || !map) return;
            map.panTo({ lat: area.lat, lng: area.lng });
            map.setZoom(16);
          }}
          className="rounded-full shadow px-2 py-1 text-[11px] bg-white text-gray-700 border border-gray-300 max-w-[150px]"
        >
          <option value="">{t("filter.area")}</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name.replace("駅", "")}
            </option>
          ))}
        </select>

        {filterOpen && (
          <div className="bg-white/97 rounded-lg shadow-lg border border-gray-200 p-2 flex flex-wrap gap-1 max-w-[300px]">
            {filterLabels.map(({ key, label, note }) => (
              <button
                key={key}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={`rounded-full px-2 py-1 text-[11px] font-semibold border ${
                  filters[key]
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {label}
                {note && (
                  <span
                    className={`ml-1 text-[9px] font-normal ${
                      filters[key] ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {note}
                  </span>
                )}
              </button>
            ))}
            {countActive(filters) > 0 && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="rounded-full px-2 py-1 text-[11px] text-gray-500 underline"
              >
                {t("gmap.clearFilters")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* お店を追加。載っていない店を見つけた人がその場で足せる導線。
          押した瞬間に入力欄を出すのではなく、まず場所を指してもらう */}
      <div className="absolute right-3 top-2 flex flex-col items-end gap-1 max-w-[70%]">
        <button
          onClick={() => (addingCafe ? cancelAdding() : setAddingCafe(true))}
          className={`rounded-full shadow px-3 py-1 text-[11px] font-semibold border ${
            addingCafe
              ? "bg-gray-700 text-white border-gray-700"
              : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {addingCafe ? t("gmap.addCancel") : t("addCafe.button")}
        </button>
        {addingCafe && (
          <div className="bg-white/97 rounded-lg shadow-lg border border-gray-200 p-2 w-[220px]">
            {!pendingLocation ? (
              <p className="text-[11px] text-gray-700 leading-snug">
                {t("gmap.addTapHint")}
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t("gmap.addNamePlaceholder")}
                  className="border border-gray-300 rounded px-2 py-1 text-[12px]"
                />
                <input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder={t("gmap.addAddressPlaceholder")}
                  className="border border-gray-300 rounded px-2 py-1 text-[12px]"
                />
                <div className="text-[10px] text-gray-400">
                  {pendingLocation.lat.toFixed(5)}, {pendingLocation.lng.toFixed(5)}
                </div>
                {cafeError && (
                  <div className="text-[10px] text-red-600">
                    {t("gmap.addFailed")}({cafeError})
                  </div>
                )}
                <div className="flex gap-1">
                  <button
                    onClick={submitNewCafe}
                    disabled={cafeSubmitting || newName.trim() === ""}
                    className="flex-1 rounded bg-blue-600 text-white text-[11px] py-1 font-semibold disabled:opacity-50"
                  >
                    {t("gmap.addSubmit")}
                  </button>
                  <button
                    onClick={() => setPendingLocation(null)}
                    className="rounded border border-gray-300 text-[11px] px-2 text-gray-600"
                  >
                    {t("gmap.addRepick")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={locate}
        aria-label={t("gmap.myLocation")}
        className={`absolute right-3 ${listOpen ? "bottom-16" : "bottom-32"} bg-white rounded-full shadow-lg border border-gray-300 w-11 h-11 flex items-center justify-center text-lg`}
      >
        ◎
      </button>

      {/* 横カード列。地図を見ながら1軒ずつ流し見するための並び。
          縦リストと同時に出すと画面がほぼ埋まるので、リストを閉じている
          間だけ出す */}
      {!listOpen && listed.length > 0 && (
        <div className="absolute left-0 right-0 bottom-11 overflow-x-auto flex gap-2 px-2 pb-1 snap-x snap-mandatory [scrollbar-width:none]">
          {listed.slice(0, 20).map((cafe) => {
            const stats = statsByCafe[cafe.id] ?? null;
            const level = stats ? pickMajority(stats.seatingOccupancyCounts) : null;
            return (
              <button
                key={cafe.id}
                onClick={() => focusCafe(cafe)}
                className={`snap-center shrink-0 w-[190px] text-left rounded-lg border bg-white/97 shadow px-2 py-1.5 ${
                  selected?.id === cafe.id ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <div className="text-[12px] font-semibold text-gray-900 truncate">
                  {favorites.has(cafe.id) && "★ "}
                  {cafe.name}
                </div>
                <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-500 mt-0.5">
                  {level && (
                    <span>
                      {OCCUPANCY_EMOJI[level]} {occLabel[level]}
                    </span>
                  )}
                  {hasOutlet(cafe, verifiedOutletIds) && <span>🔌</span>}
                  {cafe.wifiInfo && <span>📶</span>}
                  <span>
                    🚶 {nearestStationWalkMinutes(cafe.lat, cafe.lng)}
                    {t("gmap.walkUnit")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 縦リスト。地図だけだと「この範囲に何軒あるか」が掴めない。
          中心に近い順に並べ、タップで地図がその店へ動く */}
      <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setListOpen((v) => !v)}
          className="w-full px-3 py-2 flex items-center justify-between text-[12px] font-semibold text-gray-800"
        >
          <span>
            {t("gmap.inThisArea")}
            {visible.length}
            {t("gmap.countUnit")}
            {countActive(filters) > 0 && (
              <span className="font-normal text-gray-500">{t("gmap.filtering")}</span>
            )}
          </span>
          <span className="text-gray-400">{listOpen ? "▼" : "▲"}</span>
        </button>
        {listOpen && (
          <ul className="max-h-[45vh] overflow-y-auto border-t border-gray-100">
            {listed.map((cafe) => {
              const stats = statsByCafe[cafe.id] ?? null;
              const level = stats
                ? pickMajority(stats.seatingOccupancyCounts)
                : null;
              return (
                <li key={cafe.id}>
                  <button
                    onClick={() => focusCafe(cafe)}
                    className={`w-full text-left px-3 py-2 border-b border-gray-100 ${
                      selected?.id === cafe.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-gray-900 truncate">
                          {favorites.has(cafe.id) && "★ "}
                          {cafe.name}
                        </div>
                        <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-500 mt-0.5">
                          {level && (
                            <span>
                              {OCCUPANCY_EMOJI[level]} {occLabel[level]}
                            </span>
                          )}
                          {hasOutlet(cafe, verifiedOutletIds) && <span>🔌</span>}
                          {cafe.wifiInfo && <span>📶 Wi-Fi</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-700 bg-blue-50 rounded-full px-1.5 py-0.5 shrink-0">
                        🚶 {nearestStationWalkMinutes(cafe.lat, cafe.lng)}
                        {t("gmap.walkUnit")}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
            {listed.length === 0 && (
              <li className="px-3 py-4 text-[12px] text-gray-500">
                {t("gmap.emptyArea")}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
// 地図の読み込みに失敗したとき、そのまま <Map> を描くとライブラリが
// 未初期化のAPIに触り続け、getRootNode のエラーが延々と出てタブごと
// 落ちる(実際に起きた)。読み込みが終わるまでは地図を組み立てない。
function MapGate() {
  const status = useApiLoadingStatus();
  const { t } = useLang();

  if (status === APILoadingStatus.FAILED) {
    // ここは利用者向けではなく、自分が原因を切り分けるための画面。
    // 訳し分けても意味が無いので日本語のままにしてある
    return (
      <div className="flex-1 p-6 text-sm text-gray-800">
        <p className="font-bold text-red-700 mb-3">{t("gmap.loadFailed")}</p>
        <dl className="text-xs bg-gray-100 rounded p-3 leading-relaxed">
          <dt className="font-semibold">使用中のキー(先頭12文字)</dt>
          <dd className="mb-2 font-mono">
            {GOOGLE_MAPS_API_KEY ? `${GOOGLE_MAPS_API_KEY.slice(0, 12)}…` : "未設定"}
          </dd>
          <dt className="font-semibold">キーの長さ</dt>
          <dd className="mb-2">{GOOGLE_MAPS_API_KEY?.length ?? 0} 文字(正しくは39)</dd>
          <dt className="font-semibold">Map ID</dt>
          <dd className="mb-2 font-mono">{MAP_ID}</dd>
          <dt className="font-semibold">このページのURL</dt>
          <dd className="font-mono break-all">
            {typeof window !== "undefined" ? window.location.origin : ""}
          </dd>
        </dl>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          {t("gmap.backToLeaflet")}
        </Link>
      </div>
    );
  }

  if (status !== APILoadingStatus.LOADED) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
        {t("gmap.loading")}
      </div>
    );
  }

  return <GoogleMapView />;
}


// ページ側は殻だけ。地図を組み立てるのはここから。
//
// 地図そのものの言語は日本語で固定する。Google Maps の JS API は一度
// 読み込むと言語を切り替えられず、切り替えようとすると「別のパラメータで
// 二重に読み込んだ」と警告が出る。東京の地図なので、看板と同じ日本語表記の
// ほうが現地で照合しやすいという理由もある
export default function GoogleMapPane() {
  // ページ側で弾いているので実際には来ないが、このファイル単体でも
  // 成り立つようにしておく
  if (!GOOGLE_MAPS_API_KEY) return null;
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="ja" region="JP">
      <MapGate />
    </APIProvider>
  );
}
