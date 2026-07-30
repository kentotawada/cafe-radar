"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { cafes as shinjukuCafes, type Cafe } from "@/data/cafes";
import { cafes as shibuyaCafes } from "@/data/cafes-shibuya";
import { cafes as ikebukuroCafes } from "@/data/cafes-ikebukuro";
import { cafes as tokyoCafes } from "@/data/cafes-tokyo";
import { cafes as uenoCafes } from "@/data/cafes-ueno";
import { cafes as shinagawaCafes } from "@/data/cafes-shinagawa";
import { cafes as shimbashiCafes } from "@/data/cafes-shimbashi";
import { cafes as akihabaraCafes } from "@/data/cafes-akihabara";
import { cafes as yurakuchoCafes } from "@/data/cafes-yurakucho";
import { cafes as kandaCafes } from "@/data/cafes-kanda";
import { cafes as takadanobabaCafes } from "@/data/cafes-takadanobaba";
import { cafes as kichijojiCafes } from "@/data/cafes-kichijoji";
import { cafes as ebisuCafes } from "@/data/cafes-ebisu";
import { cafes as roppongiCafes } from "@/data/cafes-roppongi";
import { cafes as akasakaCafes } from "@/data/cafes-akasaka";
import { cafes as gotandaCafes } from "@/data/cafes-gotanda";
import { cafes as iidabashiCafes } from "@/data/cafes-iidabashi";
import { cafes as nakanoCafes } from "@/data/cafes-nakano";
import { cafes as tachikawaCafes } from "@/data/cafes-tachikawa";
import { cafes as ochanomizuCafes } from "@/data/cafes-ochanomizu";
import { areas } from "@/data/areas";

const seedCafes: Cafe[] = [
  ...shinjukuCafes,
  ...shibuyaCafes,
  ...ikebukuroCafes,
  ...tokyoCafes,
  ...uenoCafes,
  ...shinagawaCafes,
  ...shimbashiCafes,
  ...akihabaraCafes,
  ...yurakuchoCafes,
  ...kandaCafes,
  ...takadanobabaCafes,
  ...kichijojiCafes,
  ...ebisuCafes,
  ...roppongiCafes,
  ...akasakaCafes,
  ...gotandaCafes,
  ...iidabashiCafes,
  ...nakanoCafes,
  ...tachikawaCafes,
  ...ochanomizuCafes,
];
import { supabase } from "@/lib/supabaseClient";
import { PIN_COLORS } from "@/lib/pinColors";
import { getReporterId } from "@/lib/reporterId";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { getMapProvider, setMapProvider, type MapProvider } from "@/lib/mapProvider";
import type {
  CafeFact,
  CafeFlag,
  CafeStats,
  NoiseLevel,
  OccupancyLevel,
  Report,
} from "@/lib/types";

const FLAG_HIDE_THRESHOLD = 3;

// MapTilerタイルへの切り替えを試したところ、本番環境でページが
// クラッシュする不具合が発生したため、原因調査が終わるまでCARTO
// Voyagerに固定する(MAPTILER_KEYの設定有無に関わらずCARTOを使う)
const MAPTILER_KEY: string | undefined = undefined;
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

const SHINJUKU_CENTER: [number, number] = [35.6905, 139.7005];
const STALE_MINUTES = 30;

type NoiseFilter = "any" | "quietOnly" | "excludeLoud";
type AvailabilityFilter = "any" | "available";

// 円だけだと地図タイルの色(緑の公園、青の水面など)と紛れて見えにくいため、
// ピン(涙型)＋白フチ＋影で背景色に関係なく視認できる形にする
function createPinIcon(color: string) {
  // 白フチだと地図の白っぽい道路・建物と紛れるため、濃い色のフチ＋影で
  // どんな背景色の上でもピンだと判別できるようにする
  const html = `<svg width="30" height="40" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1px 4px rgba(0,0,0,0.8));">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10 14 22 14 22s14-12 14-22C28 6.3 21.7 0 14 0z" fill="${color}" stroke="#1f2937" stroke-width="2"/>
    <circle cx="14" cy="14" r="5.5" fill="white" stroke="#1f2937" stroke-width="1"/>
  </svg>`;
  return L.divIcon({
    className: "",
    html,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36],
  });
}

const ICONS = {
  unknown: createPinIcon(PIN_COLORS.unknown),
  quiet: createPinIcon(PIN_COLORS.quiet),
  normal: createPinIcon(PIN_COLORS.normal),
  noisy: createPinIcon(PIN_COLORS.noisy),
  loud: createPinIcon(PIN_COLORS.loud),
  full: createPinIcon(PIN_COLORS.full),
};

const USER_LOCATION_ICON = L.divIcon({
  className: "",
  html: `<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px rgba(59,130,246,0.4), 0 1px 4px rgba(0,0,0,0.5)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const NOISE_LABEL: Record<NoiseLevel, string> = {
  quiet: "静か",
  normal: "普通",
  noisy: "ややうるさい",
  loud: "うるさい",
};

const OCCUPANCY_LABEL: Record<OccupancyLevel, string> = {
  empty: "空いている",
  sparse: "やや空いている",
  moderate: "やや混雑",
  full: "満席",
};

const OCCUPANCY_SCORE: Record<OccupancyLevel, number> = {
  empty: 0,
  sparse: 33,
  moderate: 66,
  full: 100,
};

const NOISE_SCORE: Record<NoiseLevel, number> = {
  quiet: 0,
  normal: 33,
  noisy: 66,
  loud: 100,
};

function weightedPercent<T extends string>(
  counts: Record<T, number>,
  scores: Record<T, number>,
  total: number
): number {
  let sum = 0;
  for (const key in counts) {
    sum += counts[key] * scores[key];
  }
  return Math.round(sum / total);
}

function formatRelativeTime(iso: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "たった今";
  return `${minutes}分前`;
}

// 同じ人が何度も投稿しても、集計にはその人の最新の1件だけを使う
function dedupeByReporter<T extends { reporter_id: string | null; id: string }>(
  items: T[]
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = item.reporter_id ?? item.id;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

function pickMajority<T extends string>(counts: Record<T, number>): T {
  return (Object.keys(counts) as T[]).reduce((a, b) =>
    counts[b] > counts[a] ? b : a
  );
}

type QuickBadge = { key: string; emoji: string; label: string; className: string };

// ポップアップを開いてすぐ、電源・喫煙・騒がしさ・混雑度がひと目でわかるように
// バッジを横一列で表示する。編集部調べのテキストからは正規表現で簡易判定し、
// 騒がしさ・混雑度はユーザー報告の集計(stats)から判定する
function getQuickBadges(cafe: Cafe, stats: CafeStats | null): QuickBadge[] {
  const badges: QuickBadge[] = [];

  if (cafe.outletInfo) {
    const noOutlet = /電源.*(なし|不可)|コンセント.*(なし|不可)/.test(cafe.outletInfo);
    if (!noOutlet) {
      badges.push({
        key: "outlet",
        emoji: "🔌",
        label: "電源あり",
        className: "bg-blue-100 text-blue-800",
      });
    }
  }

  if (cafe.smokingInfo) {
    const nonSmoking =
      /全席禁煙|全店舗?禁煙|敷地内.*禁煙|喫煙(所|ブース)なし/.test(cafe.smokingInfo);
    const smokingOk =
      /喫煙(ブース|室|目的室|席)|喫煙可|分煙/.test(cafe.smokingInfo);
    if (nonSmoking) {
      badges.push({
        key: "nonsmoking",
        emoji: "🚭",
        label: "禁煙",
        className: "bg-green-100 text-green-800",
      });
    }
    if (smokingOk) {
      badges.push({
        key: "smoking",
        emoji: "🚬",
        label: "喫煙可",
        className: "bg-gray-200 text-gray-700",
      });
    }
  }

  if (stats) {
    if (pickMajority(stats.noiseCounts) === "loud") {
      badges.push({
        key: "noisy",
        emoji: "🔊",
        label: "うるさめ",
        className: "bg-purple-100 text-purple-800",
      });
    }
    const outletFull = pickMajority(stats.outletOccupancyCounts) === "full";
    const seatingFull = pickMajority(stats.seatingOccupancyCounts) === "full";
    if (outletFull || seatingFull) {
      badges.push({
        key: "crowded",
        emoji: "🈵",
        label: "混雑気味",
        className: "bg-red-100 text-red-800",
      });
    }
  }

  return badges;
}

function computeStats(reports: Report[]): CafeStats | null {
  const deduped = dedupeByReporter(reports);
  if (deduped.length === 0) return null;

  const noiseCounts: Record<NoiseLevel, number> = {
    quiet: 0,
    normal: 0,
    noisy: 0,
    loud: 0,
  };
  const outletOccupancyCounts: Record<OccupancyLevel, number> = {
    empty: 0,
    sparse: 0,
    moderate: 0,
    full: 0,
  };
  const seatingOccupancyCounts: Record<OccupancyLevel, number> = {
    empty: 0,
    sparse: 0,
    moderate: 0,
    full: 0,
  };

  for (const report of deduped) {
    noiseCounts[report.noise_level] += 1;
    outletOccupancyCounts[report.outlet_occupancy] += 1;
    seatingOccupancyCounts[report.seating_occupancy] += 1;
  }

  return {
    totalReporters: deduped.length,
    outletOccupancyCounts,
    seatingOccupancyCounts,
    noiseCounts,
    latestAt: deduped[0].created_at,
  };
}

type NoteGroup = {
  text: string;
  count: number;
  latestAt: string;
};

// 同じ場所を指すメモは1つにまとめ、「何人が確認したか」がわかるようにする
// 同じ人が同じメモを何度も送っても「1人が確認」の1件として数える
function groupNotes(facts: CafeFact[]): NoteGroup[] {
  const notesOnly = dedupeByReporter(facts.filter((f) => f.note));
  const groups = new Map<string, NoteGroup>();
  for (const fact of notesOnly) {
    const key = fact.note!.trim();
    if (!key) continue;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      if (fact.created_at > existing.latestAt) existing.latestAt = fact.created_at;
    } else {
      groups.set(key, { text: key, count: 1, latestAt: fact.created_at });
    }
  }
  return [...groups.values()].sort((a, b) => (a.latestAt < b.latestAt ? 1 : -1));
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function iconForStats(stats: CafeStats | null) {
  if (!stats) return ICONS.unknown;
  if (pickMajority(stats.outletOccupancyCounts) === "full") return ICONS.full;
  return ICONS[pickMajority(stats.noiseCounts)];
}

function directionsUrl(cafe: Cafe, provider: MapProvider) {
  const query = cafe.address ? `${cafe.name} ${cafe.address}` : `${cafe.lat},${cafe.lng}`;
  if (provider === "apple") {
    return `https://maps.apple.com/?daddr=${encodeURIComponent(query)}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
}

function searchUrl(cafe: Cafe) {
  const query = cafe.address ? `${cafe.name} ${cafe.address}` : cafe.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// マップアプリの選択肢はdocument.bodyへのポータルで表示する。
// Leafletのポップアップの中に置くと、モバイルでポップアップ自体が
// 閉じてしまった際に選択肢も道連れで消えてしまうため、ポップアップの
// DOMツリーから独立させ、閉じるまで確実に表示され続けるようにする
function MapProviderModal({
  cafe,
  onChoose,
  onClose,
}: {
  cafe: Cafe;
  onChoose: (provider: MapProvider) => void;
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xs flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-semibold text-gray-900">マップアプリを選択</div>
        <a
          href={directionsUrl(cafe, "google")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onChoose("google")}
          className="block text-center px-4 py-2 rounded bg-blue-600 text-white cursor-pointer"
        >
          Googleマップ
        </a>
        <a
          href={directionsUrl(cafe, "apple")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onChoose("apple")}
          className="block text-center px-4 py-2 rounded bg-gray-900 text-white cursor-pointer"
        >
          Apple Maps
        </a>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 cursor-pointer"
        >
          キャンセル
        </button>
      </div>
    </div>,
    document.body
  );
}

// ポップアップごとに独立したstateとして持たせることで、経路案内の
// 選択操作が他の全ての店舗ピンの再描画を引き起こさないようにする
// (1000件以上のピンがあるため、親コンポーネントのstateにすると
// タップのたびに全ピンが再描画されモバイルで反応が悪くなる)
function CafeDirectionsLink({ cafe }: { cafe: Cafe }) {
  const [showPicker, setShowPicker] = useState(false);
  const [savedProvider, setSavedProvider] = useState<MapProvider | null>(
    () => getMapProvider()
  );

  const choose = (provider: MapProvider) => {
    setMapProvider(provider);
    setSavedProvider(provider);
    setShowPicker(false);
  };

  return (
    <>
      {savedProvider ? (
        <>
          <a
            href={directionsUrl(cafe, savedProvider)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline cursor-pointer"
          >
            経路を見る
          </a>
          <button
            onClick={() => setShowPicker(true)}
            className="text-gray-400 underline cursor-pointer"
          >
            別のマップアプリを使う
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="text-blue-600 underline cursor-pointer"
        >
          経路を見る
        </button>
      )}
      {showPicker && (
        <MapProviderModal
          cafe={cafe}
          onChoose={choose}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

function AttributionInfoButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="このサイトについて"
        title="このサイトについて"
        className="bg-white/90 rounded-full shadow border border-gray-300 w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-600 cursor-pointer"
      >
        i
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 bg-gray-100 font-semibold text-gray-900">
                このサイトについて
              </div>
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 border-b border-gray-200 text-blue-600 cursor-pointer"
              >
                ©OpenStreetMap contributors
              </a>
              {MAPTILER_KEY ? (
                <a
                  href="https://www.maptiler.com/copyright/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 border-b border-gray-200 text-blue-600 cursor-pointer"
                >
                  ©MapTiler
                </a>
              ) : (
                <a
                  href="https://carto.com/attributions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 border-b border-gray-200 text-blue-600 cursor-pointer"
                >
                  ©CARTO
                </a>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-full px-4 py-3 font-semibold text-gray-700 cursor-pointer"
              >
                × 閉じる
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

function RecenterOnLocate({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);
  return null;
}

function AddCafeClickHandler({
  active,
  onPick,
}: {
  active: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// 1000件超のピンを常にすべてDOMに描画すると、パン・ズーム操作のたびに
// 全ピンのtransformを再計算することになり動作がカクつく原因になる。
// そのため、現在表示中の範囲(+余白)にあるピンだけをDOMに描画するように絞り込む
function MapBoundsTracker({
  onChange,
}: {
  onChange: (bounds: L.LatLngBounds) => void;
}) {
  const map = useMap();
  // map.getBounds()は呼ぶたびに新しいオブジェクトを返すため、そのまま
  // onChangeに渡すと座標が変わっていなくてもstate更新→再描画が起き続け、
  // 再描画のタイミング次第でLeaflet側のイベントが再度発火し無限ループに
  // つながることがあった。実際に座標が変わった時だけ更新するようにする
  const prevBoundsRef = useRef<L.LatLngBounds | null>(null);
  useEffect(() => {
    const handleChange = () => {
      const newBounds = map.getBounds();
      if (prevBoundsRef.current?.equals(newBounds)) return;
      prevBoundsRef.current = newBounds;
      onChange(newBounds);
    };
    map.on("moveend", handleChange);
    map.on("zoomend", handleChange);
    handleChange();
    return () => {
      map.off("moveend", handleChange);
      map.off("zoomend", handleChange);
    };
  }, [map, onChange]);
  return null;
}

export default function CafeMap() {
  const [reportsByCafe, setReportsByCafe] = useState<Record<string, Report[]>>({});
  const [factsByCafe, setFactsByCafe] = useState<Record<string, CafeFact[]>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorByCafe, setErrorByCafe] = useState<Record<string, string>>({});
  const [noteByCafe, setNoteByCafe] = useState<Record<string, string>>({});
  const [seatCountByCafe, setSeatCountByCafe] = useState<Record<string, string>>({});
  const [dynamicCafes, setDynamicCafes] = useState<Cafe[]>([]);
  const [isAddingCafe, setIsAddingCafe] = useState(false);
  const [pendingCafeLocation, setPendingCafeLocation] = useState<
    { lat: number; lng: number } | null
  >(null);
  const [newCafeName, setNewCafeName] = useState("");
  const [newCafeAddress, setNewCafeAddress] = useState("");
  const [addCafeError, setAddCafeError] = useState<string | null>(null);
  const [isSubmittingCafe, setIsSubmittingCafe] = useState(false);
  const [flagsByCafe, setFlagsByCafe] = useState<Record<string, CafeFlag[]>>({});
  const [flaggedByMe, setFlaggedByMe] = useState<Set<string>>(new Set());
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [reporterId] = useState<string>(() => getReporterId());
  const [favorites, setFavorites] = useState<Set<string>>(() => getFavorites());
  const [outletFilter, setOutletFilter] = useState<AvailabilityFilter>("any");
  const [seatingFilter, setSeatingFilter] = useState<AvailabilityFilter>("any");
  const [noiseFilter, setNoiseFilter] = useState<NoiseFilter>("any");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [mapFocus, setMapFocus] = useState<[number, number] | null>(null);
  const [areaQuery, setAreaQuery] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 640
  );
  const [locateError, setLocateError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);

  // エリア検索など、ユーザーが自分で地図の表示先を選んだ後に、
  // 遅れて返ってきた位置情報がそれを上書きしてしまわないようにする
  const hasManualFocusRef = useRef(false);

  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      setLocateError("この端末・ブラウザでは現在地を取得できません");
      return;
    }
    setLocateError(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserPosition(position);
        setMapFocus(position);
        hasManualFocusRef.current = true;
        setIsLocating(false);
      },
      (err) => {
        setLocateError(
          err.code === err.PERMISSION_DENIED
            ? "位置情報がブロックされています。アドレスバー左側のアイコン(鍵マークなど)をタップ→「位置情報」を「許可」に変更→もう一度このボタンを押してください"
            : err.code === err.TIMEOUT
              ? "現在地の取得に時間がかかっています。電波の良い場所でもう一度お試しください"
              : "現在地を取得できませんでした"
        );
        setIsLocating(false);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (hasManualFocusRef.current) return;
        const position: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserPosition(position);
        setMapFocus(position);
      },
      () => {
        // 取得できなくても地図はデフォルト位置のまま表示する
      }
    );
  }, []);

  const handleAreaSearch = (query: string) => {
    setAreaQuery(query);
    const match = areas.find((area) => area.name === query);
    if (match) {
      setMapFocus([match.lat, match.lng]);
      hasManualFocusRef.current = true;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const client = supabase;

    function groupByCafe(reports: Report[]) {
      const grouped: Record<string, Report[]> = {};
      for (const report of reports) {
        (grouped[report.cafe_id] ??= []).push(report);
      }
      return grouped;
    }

    async function loadReports() {
      if (!client) return;
      const since = new Date(Date.now() - STALE_MINUTES * 60000).toISOString();
      const { data, error } = await client
        .from("reports")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) setReportsByCafe(groupByCafe((data as Report[]) ?? []));
    }

    loadReports();

    if (!client) {
      return () => {
        isMounted = false;
      };
    }

    const channel = client
      .channel("reports-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          const report = payload.new as Report;
          setReportsByCafe((prev) => ({
            ...prev,
            [report.cafe_id]: [report, ...(prev[report.cafe_id] ?? [])],
          }));
        }
      )
      .subscribe();

    // リアルタイム通知を取りこぼしても自己修復できるよう、定期的に取り直す
    const refetchInterval = setInterval(loadReports, 2 * 60000);

    // ページを開きっぱなしでも、30分を過ぎた古い報告を集計から除外して
    // 最終更新表示なども含めて画面を新鮮に保つ
    const pruneInterval = setInterval(() => {
      const cutoff = Date.now() - STALE_MINUTES * 60000;
      setReportsByCafe((prev) => {
        const next: Record<string, Report[]> = {};
        for (const [cafeId, reports] of Object.entries(prev)) {
          next[cafeId] = reports.filter(
            (r) => new Date(r.created_at).getTime() >= cutoff
          );
        }
        return next;
      });
    }, 60000);

    return () => {
      isMounted = false;
      client.removeChannel(channel);
      clearInterval(refetchInterval);
      clearInterval(pruneInterval);
    };
  }, []);

  // 電源席の場所やだいたいの座席数は、混雑度と違って時間が経っても
  // 変わらない情報なので、時間の窓を設けずにずっと保持する
  useEffect(() => {
    let isMounted = true;
    const client = supabase;
    if (!client) return;

    function groupByCafe(facts: CafeFact[]) {
      const grouped: Record<string, CafeFact[]> = {};
      for (const fact of facts) {
        (grouped[fact.cafe_id] ??= []).push(fact);
      }
      return grouped;
    }

    async function loadFacts() {
      if (!client) return;
      const { data, error } = await client
        .from("cafe_facts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) setFactsByCafe(groupByCafe((data as CafeFact[]) ?? []));
    }

    loadFacts();

    const channel = client
      .channel("cafe-facts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cafe_facts" },
        (payload) => {
          const fact = payload.new as CafeFact;
          setFactsByCafe((prev) => ({
            ...prev,
            [fact.cafe_id]: [fact, ...(prev[fact.cafe_id] ?? [])],
          }));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  // ユーザーが「お店を追加」で登録した店舗。最初からある15店舗とは別に、
  // ずっと保持して地図に重ねて表示する
  useEffect(() => {
    let isMounted = true;
    const client = supabase;
    if (!client) return;

    async function loadCafes() {
      if (!client) return;
      const { data, error } = await client
        .from("cafes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) setDynamicCafes((data as Cafe[]) ?? []);
    }

    loadCafes();

    const channel = client
      .channel("cafes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cafes" },
        (payload) => {
          const cafe = payload.new as Cafe;
          setDynamicCafes((prev) => [cafe, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "cafes" },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setDynamicCafes((prev) => prev.filter((c) => c.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  // ユーザー追加店舗への「存在しない／間違っている」報告。ずっと保持する
  useEffect(() => {
    let isMounted = true;
    const client = supabase;
    if (!client) return;

    function groupByCafe(flags: CafeFlag[]) {
      const grouped: Record<string, CafeFlag[]> = {};
      for (const flag of flags) {
        (grouped[flag.cafe_id] ??= []).push(flag);
      }
      return grouped;
    }

    async function loadFlags() {
      if (!client) return;
      const { data, error } = await client.from("cafe_flags").select("*");

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) setFlagsByCafe(groupByCafe((data as CafeFlag[]) ?? []));
    }

    loadFlags();

    const channel = client
      .channel("cafe-flags-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cafe_flags" },
        (payload) => {
          const flag = payload.new as CafeFlag;
          setFlagsByCafe((prev) => ({
            ...prev,
            [flag.cafe_id]: [flag, ...(prev[flag.cafe_id] ?? [])],
          }));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  const submitReport = async (
    cafeId: string,
    outletOccupancy: OccupancyLevel,
    seatingOccupancy: OccupancyLevel,
    noiseLevel: NoiseLevel
  ) => {
    if (!supabase) {
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "Supabase未設定のため保存できません",
      }));
      return;
    }
    setSubmitting(cafeId);
    setErrorByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    const { error } = await supabase.from("reports").insert({
      cafe_id: cafeId,
      reporter_id: reporterId,
      outlet_occupancy: outletOccupancy,
      seating_occupancy: seatingOccupancy,
      noise_level: noiseLevel,
    });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "報告の送信に失敗しました",
      }));
    }
  };

  const submitNote = async (cafeId: string) => {
    const note = noteByCafe[cafeId]?.trim();
    if (!note) return;
    if (!supabase) {
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "Supabase未設定のため保存できません",
      }));
      return;
    }
    setSubmitting(cafeId);
    setErrorByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    const { error } = await supabase
      .from("cafe_facts")
      .insert({ cafe_id: cafeId, reporter_id: reporterId, note });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "共有に失敗しました",
      }));
    } else {
      setNoteByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    }
  };

  const submitSeatCount = async (cafeId: string) => {
    const raw = seatCountByCafe[cafeId]?.trim();
    const seatCount = raw ? Number(raw) : NaN;
    if (!raw || !Number.isInteger(seatCount) || seatCount <= 0) return;
    if (!supabase) {
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "Supabase未設定のため保存できません",
      }));
      return;
    }
    setSubmitting(cafeId);
    setErrorByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    const { error } = await supabase
      .from("cafe_facts")
      .insert({ cafe_id: cafeId, reporter_id: reporterId, seat_count: seatCount });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "共有に失敗しました",
      }));
    } else {
      setSeatCountByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    }
  };

  const handleToggleFavorite = (cafeId: string) => {
    setFavorites(toggleFavorite(cafeId));
  };

  const startAddingCafe = () => {
    setIsAddingCafe(true);
    setPendingCafeLocation(null);
    setAddCafeError(null);
  };

  const cancelAddingCafe = () => {
    setIsAddingCafe(false);
    setPendingCafeLocation(null);
    setNewCafeName("");
    setNewCafeAddress("");
    setAddCafeError(null);
  };

  const submitNewCafe = async () => {
    if (!pendingCafeLocation) return;
    const name = newCafeName.trim();
    if (!name) {
      setAddCafeError("店名を入力してください");
      return;
    }
    if (!supabase) {
      setAddCafeError("Supabase未設定のため保存できません");
      return;
    }
    setIsSubmittingCafe(true);
    setAddCafeError(null);
    const { error } = await supabase.from("cafes").insert({
      name,
      address: newCafeAddress.trim() || null,
      lat: pendingCafeLocation.lat,
      lng: pendingCafeLocation.lng,
      reporter_id: reporterId,
    });
    setIsSubmittingCafe(false);
    if (error) {
      console.error(error);
      setAddCafeError("追加に失敗しました");
      return;
    }
    cancelAddingCafe();
  };

  const flagCafe = async (cafeId: string) => {
    if (!supabase || flaggedByMe.has(cafeId)) return;
    setFlaggedByMe((prev) => new Set(prev).add(cafeId));
    const { error } = await supabase
      .from("cafe_flags")
      .insert({ cafe_id: cafeId, reporter_id: reporterId });
    if (error) console.error(error);
  };

  const dynamicCafeIds = new Set(dynamicCafes.map((c) => c.id));

  function distinctFlagCount(cafeId: string): number {
    const flags = flagsByCafe[cafeId] ?? [];
    return new Set(flags.map((f) => f.reporter_id ?? f.id)).size;
  }

  function hasIndependentActivity(cafe: Cafe): boolean {
    const addedBy = cafe.reporter_id;
    const reports = reportsByCafe[cafe.id] ?? [];
    const facts = factsByCafe[cafe.id] ?? [];
    return (
      reports.some((r) => r.reporter_id !== addedBy) ||
      facts.some((f) => f.reporter_id !== addedBy)
    );
  }

  const allCafes = [...seedCafes, ...dynamicCafes].filter(
    (cafe) => !dynamicCafeIds.has(cafe.id) || distinctFlagCount(cafe.id) < FLAG_HIDE_THRESHOLD
  );

  const statsByCafe: Record<string, CafeStats | null> = {};
  const myReportByCafe: Record<string, Report | undefined> = {};
  for (const cafe of allCafes) {
    const raw = reportsByCafe[cafe.id] ?? [];
    statsByCafe[cafe.id] = computeStats(raw);
    myReportByCafe[cafe.id] = raw.find((r) => r.reporter_id === reporterId);
  }

  const isFiltering =
    outletFilter !== "any" ||
    seatingFilter !== "any" ||
    noiseFilter !== "any" ||
    favoritesOnly;

  const visibleCafes = allCafes.filter((cafe) => {
    if (favoritesOnly && !favorites.has(cafe.id)) return false;
    if (mapBounds && !mapBounds.pad(0.5).contains([cafe.lat, cafe.lng])) {
      return false;
    }
    const stats = statsByCafe[cafe.id];
    if (!isFiltering) return true;
    if (
      (outletFilter !== "any" || seatingFilter !== "any" || noiseFilter !== "any") &&
      !stats
    ) {
      return false;
    }
    if (
      outletFilter === "available" &&
      stats &&
      pickMajority(stats.outletOccupancyCounts) === "full"
    ) {
      return false;
    }
    if (
      seatingFilter === "available" &&
      stats &&
      pickMajority(stats.seatingOccupancyCounts) === "full"
    ) {
      return false;
    }
    if (noiseFilter !== "any" && stats) {
      const majority = pickMajority(stats.noiseCounts);
      if (noiseFilter === "quietOnly" && majority !== "quiet") return false;
      if (noiseFilter === "excludeLoud" && majority === "loud") return false;
    }
    return true;
  });

  return (
    <MapContainer
      center={mapFocus ?? SHINJUKU_CENTER}
      zoom={16}
      style={{ position: "absolute", inset: 0 }}
      attributionControl={false}
    >
      <RecenterOnLocate position={mapFocus} />
      <MapBoundsTracker onChange={setMapBounds} />
      <AddCafeClickHandler
        active={isAddingCafe}
        onPick={(lat, lng) => setPendingCafeLocation({ lat, lng })}
      />
      <TileLayer
        url={TILE_URL}
        subdomains={MAPTILER_KEY ? undefined : "abcd"}
        maxZoom={20}
      />

      <div className="leaflet-top leaflet-right" style={{ zIndex: 1000 }}>
        <div className="leaflet-control bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300 m-2 text-xs sm:text-sm w-36 sm:w-60">
          <button
            onClick={() => setIsFilterPanelOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 font-semibold"
          >
            <span>絞り込み</span>
            <span>{isFilterPanelOpen ? "▲" : "▼"}</span>
          </button>
          {isFilterPanelOpen && (
            <div className="flex flex-col gap-1 sm:gap-2 px-2 sm:px-3 pb-2 sm:pb-3">
              <label className="flex flex-col gap-1">
                <span>エリア検索</span>
                <select
                  value={areaQuery}
                  onChange={(e) => handleAreaSearch(e.target.value)}
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-base text-gray-900 bg-white w-full"
                >
                  <option value="">選択してください</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span>電源席</span>
                <select
                  value={outletFilter}
                  onChange={(e) =>
                    setOutletFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-base text-gray-900 bg-white w-full"
                >
                  <option value="any">すべて</option>
                  <option value="available">空きありのみ</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span>一般席</span>
                <select
                  value={seatingFilter}
                  onChange={(e) =>
                    setSeatingFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-base text-gray-900 bg-white w-full"
                >
                  <option value="any">すべて</option>
                  <option value="available">空きありのみ</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span>静かさ</span>
                <select
                  value={noiseFilter}
                  onChange={(e) => setNoiseFilter(e.target.value as NoiseFilter)}
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-base text-gray-900 bg-white w-full"
                >
                  <option value="any">こだわらない</option>
                  <option value="quietOnly">静かな店のみ</option>
                  <option value="excludeLoud">うるさい店を除く</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>お気に入りのお店のみ</span>
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="leaflet-bottom leaflet-right" style={{ zIndex: 1000 }}>
        <div className="leaflet-control m-2 flex flex-col items-end gap-1">
          {locateError && (
            <div className="bg-white text-xs text-red-600 rounded shadow-lg border border-gray-300 px-2 py-1.5 max-w-[260px] leading-relaxed">
              {locateError}
            </div>
          )}
          <button
            onClick={locateMe}
            disabled={isLocating}
            aria-label="現在地に戻る"
            title="現在地に戻る"
            className="bg-white rounded-full shadow-lg border border-gray-300 w-10 h-10 flex items-center justify-center disabled:opacity-50"
          >
            {isLocating ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="3"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" fill="#3b82f6" />
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <line x1="12" y1="1" x2="12" y2="4" stroke="#3b82f6" strokeWidth="2" />
                <line x1="12" y1="20" x2="12" y2="23" stroke="#3b82f6" strokeWidth="2" />
                <line x1="1" y1="12" x2="4" y2="12" stroke="#3b82f6" strokeWidth="2" />
                <line x1="20" y1="12" x2="23" y2="12" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="leaflet-bottom leaflet-left" style={{ zIndex: 1000 }}>
        <div className="leaflet-control m-2">
          {isAddingCafe ? (
            <div className="bg-white text-xs rounded shadow-lg border border-gray-300 px-3 py-2 max-w-[220px] flex flex-col gap-1">
              <div className="text-gray-800">
                地図をタップしてお店の場所を選んでください
              </div>
              <button
                onClick={cancelAddingCafe}
                className="self-start px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button
              onClick={startAddingCafe}
              className="bg-white rounded-full shadow-lg border border-gray-300 px-3 h-10 flex items-center gap-1 text-sm font-semibold text-gray-900"
            >
              ＋ お店を追加
            </button>
          )}
        </div>
        <div className="leaflet-control m-2">
          <AttributionInfoButton />
        </div>
      </div>

      {pendingCafeLocation && (
        <Marker
          position={[pendingCafeLocation.lat, pendingCafeLocation.lng]}
          icon={ICONS.unknown}
        >
          <Popup minWidth={220} autoClose={false} closeOnClick={false}>
            <div className="flex flex-col gap-2 text-gray-900">
              <div className="font-bold text-base">この場所にお店を追加</div>
              <div>
                <div className="text-xs text-gray-500 mb-1">店名（必須）</div>
                <input
                  type="text"
                  maxLength={60}
                  value={newCafeName}
                  onChange={(e) => setNewCafeName(e.target.value)}
                  placeholder="例: ○○珈琲店 △△店"
                  className="w-full text-base border rounded px-2 py-1"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">住所（任意）</div>
                <input
                  type="text"
                  maxLength={100}
                  value={newCafeAddress}
                  onChange={(e) => setNewCafeAddress(e.target.value)}
                  placeholder="わかれば入力（経路案内の精度が上がります）"
                  className="w-full text-base border rounded px-2 py-1"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  newCafeName.trim() ||
                    `${pendingCafeLocation.lat},${pendingCafeLocation.lng}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 underline"
              >
                登録前にGoogleマップで実在確認する
              </a>
              <div className="flex gap-2">
                <button
                  disabled={isSubmittingCafe || !newCafeName.trim()}
                  onClick={submitNewCafe}
                  className="px-2 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                >
                  この場所に登録する
                </button>
                <button
                  onClick={cancelAddingCafe}
                  className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                >
                  キャンセル
                </button>
              </div>
              {addCafeError && (
                <div className="text-xs text-red-500">{addCafeError}</div>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      {userPosition && (
        <Marker position={userPosition} icon={USER_LOCATION_ICON}>
          <Popup>現在地</Popup>
        </Marker>
      )}
      {visibleCafes.map((cafe) => {
        const stats = statsByCafe[cafe.id];
        const myReport = myReportByCafe[cafe.id];
        const isFavorite = favorites.has(cafe.id);
        const facts = factsByCafe[cafe.id] ?? [];
        const noteGroups = groupNotes(facts);
        const seatCounts = dedupeByReporter(
          facts.filter((f) => f.seat_count != null)
        ).map((f) => f.seat_count as number);
        const seatCountMedian = median(seatCounts);
        const isDynamicCafe = dynamicCafeIds.has(cafe.id);
        const isUnconfirmed = isDynamicCafe && !hasIndependentActivity(cafe);
        const quickBadges = getQuickBadges(cafe, stats);
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={iconForStats(stats)}
          >
            <Popup minWidth={210} maxHeight={340}>
              <div className="flex flex-col gap-1 sm:gap-2 text-gray-900">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm sm:text-lg">{cafe.name}</div>
                  <button
                    onClick={() => handleToggleFavorite(cafe.id)}
                    className="text-2xl sm:text-3xl leading-none px-1 text-yellow-500"
                    aria-label="お気に入り"
                    title="お気に入り"
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>
                </div>
                <div className="text-[11px] sm:text-sm text-gray-500">{cafe.address}</div>

                {quickBadges.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {quickBadges.map((badge) => (
                      <span
                        key={badge.key}
                        className={`text-[11px] sm:text-sm px-1.5 py-0.5 rounded-full whitespace-nowrap ${badge.className}`}
                      >
                        {badge.emoji} {badge.label}
                      </span>
                    ))}
                  </div>
                )}

                {isDynamicCafe && (
                  <div className="text-[11px] sm:text-sm bg-yellow-50 border border-yellow-200 rounded p-1.5 sm:p-2 flex flex-col gap-1">
                    {isUnconfirmed ? (
                      <div className="text-yellow-800">
                        ⚠️ ユーザーが追加した店舗です。まだ他の人による確認がありません
                      </div>
                    ) : (
                      <div className="text-yellow-800">
                        ユーザーが追加した店舗です
                      </div>
                    )}
                    <button
                      disabled={flaggedByMe.has(cafe.id)}
                      onClick={() => flagCafe(cafe.id)}
                      className="self-start px-2 py-1 rounded bg-white border border-yellow-300 hover:bg-yellow-100 disabled:opacity-50"
                    >
                      {flaggedByMe.has(cafe.id)
                        ? "報告しました"
                        : "存在しない・場所が違うと報告"}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] sm:text-sm flex-wrap">
                  <CafeDirectionsLink cafe={cafe} />
                  <a
                    href={searchUrl(cafe)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    写真・口コミ(Googleマップ)
                  </a>
                </div>

                {stats ? (
                  (() => {
                    const outletPct = weightedPercent(
                      stats.outletOccupancyCounts,
                      OCCUPANCY_SCORE,
                      stats.totalReporters
                    );
                    const seatingPct = weightedPercent(
                      stats.seatingOccupancyCounts,
                      OCCUPANCY_SCORE,
                      stats.totalReporters
                    );
                    const overallPct = Math.round((outletPct + seatingPct) / 2);
                    const noisePct = weightedPercent(
                      stats.noiseCounts,
                      NOISE_SCORE,
                      stats.totalReporters
                    );
                    return (
                      <div className="text-xs sm:text-base">
                        <div className="font-semibold text-orange-700">
                          🪑 総合混雑度: {overallPct}%
                        </div>
                        <div className="text-orange-700">
                          🔌 電源席: {outletPct}%　💺 一般席: {seatingPct}%
                        </div>
                        <div className="text-purple-700">
                          🔊 騒音度: {noisePct}%
                        </div>
                        <div className="text-[11px] sm:text-sm text-gray-500 mt-1">
                          最終更新: {formatRelativeTime(stats.latestAt)}（
                          {stats.totalReporters}人の報告）
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-xs sm:text-base text-gray-400">
                    まだ報告がありません
                  </div>
                )}

                {(noteGroups.length > 0 || seatCountMedian !== null) && (
                  <div className="text-[11px] sm:text-sm bg-gray-50 rounded p-1.5 sm:p-2 flex flex-col gap-1">
                    {seatCountMedian !== null && (
                      <div className="text-gray-700">
                        📊 座席数の目安: 約{seatCountMedian}席（
                        {seatCounts.length}人の報告）
                      </div>
                    )}
                    {noteGroups.length > 0 && (
                      <div>
                        <div className="font-semibold mb-1">
                          みんなが書いた電源席の場所
                        </div>
                        <ul className="flex flex-col gap-0.5">
                          {noteGroups.map((group) => (
                            <li key={group.text} className="text-gray-700">
                              ・{group.text}
                              <span className="text-gray-400">
                                （{group.count}人が確認・
                                {formatRelativeTime(group.latestAt)}）
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t pt-1.5 sm:pt-2">
                  <div className="text-[11px] sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    📢 今の店内の様子を教えてください（リアルタイムの報告にご協力ください）
                  </div>
                  {cafe.outletInfo && (
                    <div className="text-[11px] sm:text-sm bg-blue-50 border border-blue-200 rounded p-1.5 sm:p-2 text-blue-900 mb-1 sm:mb-2">
                      <div className="font-semibold mb-0.5">
                        🔌 電源情報（ネット調べ）
                      </div>
                      <div>{cafe.outletInfo}</div>
                      <div className="text-blue-400 mt-0.5">
                        ※最新でない場合があります
                      </div>
                    </div>
                  )}
                  <div className="text-xs sm:text-sm font-semibold mb-1">電源席の混雑度</div>
                  <select
                    value={myReport?.outlet_occupancy ?? ""}
                    disabled={submitting === cafe.id}
                    onChange={(e) => {
                      const level = e.target.value as OccupancyLevel;
                      if (!level) return;
                      submitReport(
                        cafe.id,
                        level,
                        myReport?.seating_occupancy ?? "empty",
                        myReport?.noise_level ?? "normal"
                      );
                    }}
                    className="w-full text-sm sm:text-base border rounded px-2 py-0.5 sm:py-1 bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>
                      選択してください
                    </option>
                    {(Object.keys(OCCUPANCY_LABEL) as OccupancyLevel[]).map(
                      (level) => (
                        <option key={level} value={level}>
                          {OCCUPANCY_LABEL[level]}
                        </option>
                      )
                    )}
                  </select>
                  <div className="mt-1">
                    <div className="text-[11px] sm:text-sm text-gray-500 mb-1">
                      電源席はどこですか？（任意）
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={noteByCafe[cafe.id] ?? ""}
                      onChange={(e) =>
                        setNoteByCafe((prev) => ({
                          ...prev,
                          [cafe.id]: e.target.value,
                        }))
                      }
                      placeholder="例: レジ横の窓側の席"
                      className="w-full text-sm border rounded px-2 py-0.5 sm:py-1"
                    />
                    <button
                      disabled={
                        submitting === cafe.id || !noteByCafe[cafe.id]?.trim()
                      }
                      onClick={() => submitNote(cafe.id)}
                      className="mt-1 px-2 py-1 text-xs sm:text-sm rounded bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                    >
                      この場所情報を共有
                    </button>
                  </div>
                  <div className="mt-1.5 sm:mt-2">
                    <div className="text-[11px] sm:text-sm text-gray-500 mb-1">
                      だいたいの座席数（任意）
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        value={seatCountByCafe[cafe.id] ?? ""}
                        onChange={(e) =>
                          setSeatCountByCafe((prev) => ({
                            ...prev,
                            [cafe.id]: e.target.value,
                          }))
                        }
                        placeholder="例: 20"
                        className="w-full text-sm border rounded px-2 py-0.5 sm:py-1"
                      />
                      <button
                        disabled={
                          submitting === cafe.id ||
                          !seatCountByCafe[cafe.id]?.trim()
                        }
                        onClick={() => submitSeatCount(cafe.id)}
                        className="px-2 py-1 text-xs sm:text-sm rounded bg-blue-100 hover:bg-blue-200 disabled:opacity-50 whitespace-nowrap"
                      >
                        共有
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-semibold mb-1">一般席の混雑度</div>
                  <select
                    value={myReport?.seating_occupancy ?? ""}
                    disabled={submitting === cafe.id}
                    onChange={(e) => {
                      const level = e.target.value as OccupancyLevel;
                      if (!level) return;
                      submitReport(
                        cafe.id,
                        myReport?.outlet_occupancy ?? "empty",
                        level,
                        myReport?.noise_level ?? "normal"
                      );
                    }}
                    className="w-full text-sm sm:text-base border rounded px-2 py-0.5 sm:py-1 bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>
                      選択してください
                    </option>
                    {(Object.keys(OCCUPANCY_LABEL) as OccupancyLevel[]).map(
                      (level) => (
                        <option key={level} value={level}>
                          {OCCUPANCY_LABEL[level]}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-semibold mb-1">騒がしさ</div>
                  <select
                    value={myReport?.noise_level ?? ""}
                    disabled={submitting === cafe.id}
                    onChange={(e) => {
                      const level = e.target.value as NoiseLevel;
                      if (!level) return;
                      submitReport(
                        cafe.id,
                        myReport?.outlet_occupancy ?? "empty",
                        myReport?.seating_occupancy ?? "empty",
                        level
                      );
                    }}
                    className="w-full text-sm sm:text-base border rounded px-2 py-0.5 sm:py-1 bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>
                      選択してください
                    </option>
                    {(Object.keys(NOISE_LABEL) as NoiseLevel[]).map((level) => (
                      <option key={level} value={level}>
                        {NOISE_LABEL[level]}
                      </option>
                    ))}
                  </select>
                </div>

                {myReport && (
                  <div className="text-[11px] sm:text-sm text-gray-400">
                    ✓ あなたの回答が反映されています
                  </div>
                )}

                {errorByCafe[cafe.id] && (
                  <div className="text-[11px] sm:text-sm text-red-500">
                    {errorByCafe[cafe.id]}
                  </div>
                )}

                {cafe.smokingInfo && (
                  <div className="text-[10px] sm:text-xs text-gray-400 text-right border-t pt-1">
                    🚬 {cafe.smokingInfo}（ネット調べ）
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
