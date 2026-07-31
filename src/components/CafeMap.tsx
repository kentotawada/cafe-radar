"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import { landmarks as shinjukuLandmarks } from "@/data/landmarks-shinjuku";
import { areas } from "@/data/areas";

const allLandmarks: Landmark[] = [...shinjukuLandmarks];
import { supabase } from "@/lib/supabaseClient";
import { PIN_COLORS } from "@/lib/pinColors";
import { cupPinSvgMarkup, CUP_PIN_VIEWBOX } from "@/lib/cupPinIcon";
import { getReporterId } from "@/lib/reporterId";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { getMapProvider, setMapProvider, type MapProvider } from "@/lib/mapProvider";
import type {
  CafeFact,
  CafeFlag,
  CafeStats,
  CafeUsageStyle,
  Landmark,
  LandmarkCategory,
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
type SmokingFilter = "any" | "nonSmokingOnly" | "smokingOk";
type SortOrder = "recommended" | "distance" | "seats" | "occupancy" | "noise";

// 2点間の距離をメートル単位で計算(近い順ソート用)
function distanceMeters(
  a: [number, number],
  b: [number, number]
): number {
  const R = 6371000;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// カフェのデータには「どのエリアか」を示す項目が無いため、areas.tsの
// 各駅の座標との距離が一番近い駅をそのカフェの所属エリアとみなす。
// リストのエリア選択(絞り込み欄のエリア検索と同期)で使う
function nearestAreaName(cafe: Cafe): string {
  let bestName = areas[0]?.name ?? "";
  let bestDist = Infinity;
  for (const area of areas) {
    const d = distanceMeters([cafe.lat, cafe.lng], [area.lat, area.lng]);
    if (d < bestDist) {
      bestDist = d;
      bestName = area.name;
    }
  }
  return bestName;
}

// 「全40席(カウンター15・テーブル15・テラス10)」のような編集部調べの
// テキストから、先頭の数字を座席数の目安として取り出す(席数が多い順
// ソート用)。数字が見つからなければnull
function parseSeatCount(seatCountInfo: string | null | undefined): number | null {
  if (!seatCountInfo) return null;
  const match = seatCountInfo.match(/(\d+)\s*席/);
  return match ? Number(match[1]) : null;
}

// お店の名前から「チェーン店(気軽・短時間利用)」「深夜/24時間営業
// (夜間・早朝のノマド利用)」を推定する。それ以外は「コワーキング併設」
// らしき記載があればcoworking、なければ独立店・おしゃれ系として扱う
// (店名からの推定のため厳密ではないが、地図上でざっくり見分ける用途)
const CHAIN_NAME_PATTERNS: RegExp[] = [
  /スターバックス/,
  /ドトール/,
  /タリーズ/,
  /PRONTO|プロント/i,
  /星乃珈琲/,
  /エクセルシオール/,
  /ベローチェ/,
  /コメダ/,
  /サンマルク/,
  /マクドナルド/,
  /ガスト/,
  /ジョナサン/,
  /デニーズ/,
  /ド・クリエ/,
  /ルノアール/,
];
const NIGHT_NAME_PATTERNS = /24\s*時間|24H|深夜|オールナイト/i;
const COWORKING_NAME_PATTERNS = /コワーキング|co-?working/i;

function getCafeUsageStyle(cafe: Cafe): CafeUsageStyle {
  if (CHAIN_NAME_PATTERNS.some((pattern) => pattern.test(cafe.name))) return "chain";
  if (isLateNight(cafe)) return "night";
  if (
    COWORKING_NAME_PATTERNS.test(cafe.name) ||
    (cafe.outletInfo && COWORKING_NAME_PATTERNS.test(cafe.outletInfo))
  ) {
    return "coworking";
  }
  return "independent";
}

// 表示サイズをviewBoxより小さく/大きくすることで、線の太さの比率を
// 保ったまま全体を縮小・拡大する
const CUP_PIN_DISPLAY_SIZE = 42;
// リストで店舗をタップした時、地図上のどのピンかひと目でわかるように
// 大きく表示するためのサイズ
const CUP_PIN_HIGHLIGHT_SIZE = 66;

function createCupPinIcon(
  statusColor: string,
  usageStyle: CafeUsageStyle,
  showOutletPlug: boolean,
  displaySize: number = CUP_PIN_DISPLAY_SIZE,
  highlighted: boolean = false
) {
  const scale = displaySize / CUP_PIN_VIEWBOX;
  const svgHtml = cupPinSvgMarkup(statusColor, usageStyle, showOutletPlug, displaySize);
  // アンカー(ピンの指す先端)は、プラグがあればプラグの先端、
  // 無ければカップの底(丸い台座)にする
  const anchorY = showOutletPlug ? 33 : 21;
  const anchorPx = Math.round(anchorY * scale);
  // 選択中のピンは、先端から広がるパルスリングを足して地図上で
  // すぐ見つけられるようにする
  const html = highlighted
    ? `<div style="position:relative;width:${displaySize}px;height:${displaySize}px;">
        <div class="cf-pin-pulse-ring" style="bottom:${displaySize - anchorPx}px;"></div>
        ${svgHtml}
      </div>`
    : svgHtml;
  return L.divIcon({
    className: "",
    html,
    iconSize: [displaySize, displaySize],
    iconAnchor: [Math.round(18 * scale), anchorPx],
    popupAnchor: [0, -Math.round((anchorY - 3) * scale)],
  });
}

// (statusColor, usageStyle, showOutletPlug, highlighted)の組み合わせごとに
// アイコンを作ると大量になるため、初回生成時にキャッシュしておく
const cafePinIconCache = new Map<string, L.DivIcon>();
function getCafePinIcon(
  statusColor: string,
  usageStyle: CafeUsageStyle,
  showOutletPlug: boolean,
  highlighted: boolean = false
) {
  const key = `${statusColor}|${usageStyle}|${showOutletPlug}|${highlighted}`;
  let icon = cafePinIconCache.get(key);
  if (!icon) {
    icon = createCupPinIcon(
      statusColor,
      usageStyle,
      showOutletPlug,
      highlighted ? CUP_PIN_HIGHLIGHT_SIZE : CUP_PIN_DISPLAY_SIZE,
      highlighted
    );
    cafePinIconCache.set(key, icon);
  }
  return icon;
}

const PENDING_CAFE_ICON = createCupPinIcon(PIN_COLORS.unknown, "independent", false);

// 不動産サイトの周辺環境地図のように、色付きの丸バッジ+シンプルな
// 白1色のイラスト(アイコン)にする。絵文字は色がバラバラで背景色と
// 合わずに見づらくなるため、単色のSVGアイコンを使う
function createLandmarkIcon(color: string, innerHtml: string) {
  // 丸バッジの下に小さな三角のツノを付け、その先端が実際の座標(建物の
  // 位置)を指すようにする。バッジ本体は建物の真上に浮くように見える
  const html = `<div style="position:relative;width:24px;height:30px;">
    <div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
      ${innerHtml}
    </div>
    <div style="position:absolute;left:50%;bottom:-4px;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${color};"></div>
  </div>`;
  return L.divIcon({
    className: "",
    html,
    iconSize: [24, 30],
    iconAnchor: [12, 30],
  });
}

// 「ビックカメラ新宿東口店」のようにスペースが無い複合名は、自動判定
// (文字数で強制改行)だと途中半端な位置で切れてしまうため、意味の
// まとまり(店名/支店名、施設名/通称など)で1行目・2行目を手動で指定する。
// スペース区切りの名前(「サンドラッグ 新宿中央東口店」等)は従来通り
// スペース位置で自動的に分ける
const LANDMARK_LABEL_SPLIT_OVERRIDES: Record<string, [string, string]> = {
  "landmark-shinjuku-01": ["新宿駅", "西口"],
  "landmark-shinjuku-02": ["新宿駅", "東口"],
  "landmark-shinjuku-03": ["新宿駅", "南口"],
  "landmark-shinjuku-04": ["新宿駅", "新南口"],
  "landmark-shinjuku-05": ["東京都庁", "第一本庁舎"],
  "landmark-shinjuku-06": ["モード学園", "コクーンタワー"],
  "landmark-shinjuku-08": ["新宿三井", "ビルディング"],
  "landmark-shinjuku-10": ["新宿センター", "ビル"],
  "landmark-shinjuku-12": ["新宿マルイ", "本館"],
  "landmark-shinjuku-13": ["ルミネエスト", "新宿"],
  "landmark-shinjuku-15": ["京王百貨店", "新宿店"],
  "landmark-shinjuku-16": ["ヨドバシカメラ", "新宿西口本店"],
  "landmark-shinjuku-17": ["新宿高島屋", "タイムズスクエア"],
  "landmark-shinjuku-20": ["新宿東宝ビル", "(ゴジラヘッド)"],
  "landmark-shinjuku-21": ["京王プラザ", "ホテル"],
  "landmark-shinjuku-22": ["パークハイアット東京", "(新宿パークタワー)"],
  "landmark-shinjuku-24": ["新宿アイランド", "タワー"],
  "landmark-shinjuku-26": ["損保ジャパン本社ビル", "(SOMPO美術館)"],
  "landmark-shinjuku-28": ["十二社", "熊野神社"],
  "landmark-shinjuku-29": ["東京都庁", "第二本庁舎"],
  "landmark-shinjuku-30": ["新宿御苑", "(新宿門)"],
  "landmark-shinjuku-32": ["新宿", "サブナード"],
  "landmark-shinjuku-33": ["小田急百貨店新宿店", "(ハルク)"],
  "landmark-shinjuku-34": ["新宿マルイ", "アネックス"],
  "landmark-shinjuku-35": ["ビックカメラ", "新宿東口店"],
  "landmark-shinjuku-38": ["東急歌舞伎町", "タワー"],
  "landmark-shinjuku-39": ["紀伊國屋書店", "新宿本店"],
  "landmark-shinjuku-40": ["新宿", "ゴールデン街"],
  "landmark-shinjuku-41": ["新宿西口", "思い出横丁"],
  "landmark-shinjuku-43": ["新宿区役所", "本庁舎"],
  "landmark-shinjuku-45": ["ヨドバシカメラ", "マルチメディア新宿東口"],
  "landmark-shinjuku-46": ["工学院大学", "新宿キャンパス"],
  "landmark-shinjuku-49": ["新宿中村屋", "ビル"],
  "landmark-shinjuku-51": ["三菱UFJ銀行", "新宿支店"],
  "landmark-shinjuku-52": ["みずほ銀行", "新宿支店"],
  "landmark-shinjuku-53": ["三井住友銀行", "新宿支店"],
  "landmark-shinjuku-54": ["ドン・キホーテ", "新宿歌舞伎町店"],
  "landmark-shinjuku-55": ["新宿", "ピカデリー"],
  "landmark-shinjuku-57": ["ローソン", "新宿靖国通店"],
  "landmark-shinjuku-58": ["セブンイレブン", "新宿3丁目店"],
  "landmark-shinjuku-59": ["新宿駅東口", "交番"],
  "landmark-shinjuku-60": ["新宿駅西口", "交番"],
  "landmark-shinjuku-63": ["東京都健康プラザ", "ハイジア"],
  "landmark-shinjuku-64": ["伊勢丹", "メンズ館"],
  "landmark-shinjuku-66": ["みらいおん像", "(心の絆・ライオンひろば)"],
  "landmark-shinjuku-67": ["ファミリーマート", "西新宿地下歩道店"],
  "landmark-shinjuku-68": ["みずほ銀行", "新宿西口支店"],
  "landmark-shinjuku-69": ["ファミリーマート", "都営線新宿西口駅店"],
  "landmark-shinjuku-73": ["岐阜屋", "(新宿西口思い出横丁)"],
  "landmark-shinjuku-76": ["新宿中村屋", "(グランナ)"],
  "landmark-shinjuku-77": ["タカノフルーツパーラー", "新宿本店"],
  "landmark-shinjuku-78": ["ニューヨークグリル", "(パークハイアット東京)"],
  "landmark-shinjuku-79": ["BERG(ベルク)", "ルミネエスト新宿店"],
  "landmark-shinjuku-90": ["ウエルシア", "O-GUARD新宿店"],
};

function splitLandmarkLabel(
  id: string,
  name: string
): { primary: string; secondary: string | null } {
  const override = LANDMARK_LABEL_SPLIT_OVERRIDES[id];
  if (override) return { primary: override[0], secondary: override[1] };
  const spaceIndex = name.indexOf(" ");
  if (spaceIndex === -1) return { primary: name, secondary: null };
  return {
    primary: name.slice(0, spaceIndex),
    secondary: name.slice(spaceIndex + 1),
  };
}

function svgIcon(path: string) {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="white">${path}</svg>`;
}

function letterIcon(letter: string) {
  return `<span style="color:white;font-weight:800;font-size:12px;font-family:sans-serif;line-height:1;">${letter}</span>`;
}

// 駅=電車、建物=ビル、学校=卒業帽、銀行=¥、コンビニ=各社の頭文字、
// 信号=信号機、その他=地図ピン のアイコン(実際のロゴは商標のため使わず、
// 各社のブランドカラー+頭文字で見分けられるようにする)
const LANDMARK_CATEGORY_ICON_HTML: Record<
  Exclude<LandmarkCategory, "traffic_signal">,
  string
> = {
  station_exit: svgIcon(
    '<path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>'
  ),
  building: svgIcon(
    '<path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>'
  ),
  school: svgIcon(
    '<path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>'
  ),
  other: svgIcon(
    '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>'
  ),
  bank: letterIcon("¥"),
  conveni_seven: letterIcon("7"),
  conveni_lawson: letterIcon("L"),
  conveni_familymart: letterIcon("F"),
  restaurant: svgIcon(
    '<path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>'
  ),
  drugstore: svgIcon(
    '<path d="M19 8h-2V6c0-1.66-1.34-3-3-3H10C8.34 3 7 4.34 7 6v2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2H9V6zm6 9h-3v3h-2v-3H7v-2h3v-3h2v3h3v2z"/>'
  ),
};

const LANDMARK_CATEGORY_COLOR: Record<
  Exclude<LandmarkCategory, "traffic_signal">,
  string
> = {
  station_exit: "#2563eb",
  building: "#f97316",
  school: "#0ea5e9",
  other: "#db2777",
  bank: "#ca8a04",
  conveni_seven: "#dc2626",
  conveni_lawson: "#1e3a8a",
  conveni_familymart: "#16a34a",
  restaurant: "#e11d48",
  drugstore: "#0d9488",
};

// 信号機は横長のピル型(丸みを帯びた箱に緑・黄・オレンジの丸)にする。
// 他のカテゴリのような丸バッジ+文字アイコンの形には合わないため、
// 専用の見た目にする(下に小さなツノを付けて座標を指すのは他と共通)
// Googleマップの信号アイコンのように、ごく小さく控えめにする
// (新宿エリアの信号を全部載せるため、1つ1つは目立たせすぎない)
function createTrafficSignalIcon() {
  const html = `<div style="position:relative;width:16px;height:12px;">
    <svg width="16" height="9" viewBox="0 0 28 15" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));">
      <rect x="0.5" y="0.5" width="27" height="14" rx="7" fill="#c7cfe0" stroke="white" stroke-width="1.2"/>
      <circle cx="7" cy="7.5" r="4.6" fill="#22c55e"/>
      <circle cx="14" cy="7.5" r="4.6" fill="#eab308"/>
      <circle cx="21" cy="7.5" r="4.6" fill="#f97316"/>
    </svg>
    <div style="position:absolute;left:50%;bottom:-3px;transform:translateX(-50%);width:0;height:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:4px solid #c7cfe0;"></div>
  </div>`;
  return L.divIcon({
    className: "",
    html,
    iconSize: [16, 12],
    iconAnchor: [8, 12],
  });
}

const LANDMARK_ICONS: Record<LandmarkCategory, L.DivIcon> = {
  ...(Object.fromEntries(
    (Object.keys(LANDMARK_CATEGORY_COLOR) as Exclude<LandmarkCategory, "traffic_signal">[]).map(
      (category) => [
        category,
        createLandmarkIcon(LANDMARK_CATEGORY_COLOR[category], LANDMARK_CATEGORY_ICON_HTML[category]),
      ]
    )
  ) as Record<Exclude<LandmarkCategory, "traffic_signal">, L.DivIcon>),
  traffic_signal: createTrafficSignalIcon(),
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

// react-leafletはPopupの中身(props.children)が変わるたびにLeafletの
// popup.update()を呼ぶが、これが内部で一瞬「高さを外して再計測→
// 付け直す」処理をするため、ポップアップ内のスクロール位置(scrollTop)が
// 0に戻ってしまう。中身は入力欄の操作だけでなく、2分ごとのreports再取得や
// 1分ごとの古い報告の間引き、リアルタイム通知の受信でも変わるため、
// 「入力した時だけ直す」のでは不十分(何もしていなくても時間経過で
// 勝手にスクロールが戻る)。そこで、ポップアップが開いた時点で
// (1)ユーザーが実際にスクロールした位置を'scroll'イベントで常に記録し、
// (2)MutationObserverでLeafletのDOM書き換えを検知するたびに、
// 記録しておいた位置へ即座に(描画される前に)書き戻す。これで原因を
// 問わずスクロール位置が保たれる
const popupScrollGuardTargets = new WeakSet<HTMLElement>();
function armPopupScrollGuard(scrollEl: HTMLElement) {
  if (popupScrollGuardTargets.has(scrollEl)) return;
  popupScrollGuardTargets.add(scrollEl);
  let desired = scrollEl.scrollTop;
  scrollEl.addEventListener("scroll", () => {
    desired = scrollEl.scrollTop;
  });
  const observer = new MutationObserver(() => {
    if (scrollEl.scrollTop !== desired) {
      scrollEl.scrollTop = desired;
    }
  });
  observer.observe(scrollEl, { attributes: true, attributeFilter: ["style", "class"] });
}

// ポップアップが開くたびに、その中の.leaflet-popup-contentへ
// armPopupScrollGuardを仕込む
function PopupScrollGuard() {
  const map = useMap();
  useEffect(() => {
    function handlePopupOpen(e: L.LeafletEvent) {
      const popupEvent = e as L.PopupEvent;
      const container = popupEvent.popup.getElement();
      const scrollEl = container?.querySelector(
        ".leaflet-popup-content"
      ) as HTMLElement | null;
      if (scrollEl) armPopupScrollGuard(scrollEl);
    }
    map.on("popupopen", handlePopupOpen);
    return () => {
      map.off("popupopen", handlePopupOpen);
    };
  }, [map]);
  return null;
}

function isNonSmoking(cafe: Cafe): boolean {
  if (!cafe.smokingInfo) return false;
  return /全席禁煙|全店舗?禁煙|敷地内.*禁煙|喫煙(所|ブース)なし/.test(cafe.smokingInfo);
}

function isSmokingOk(cafe: Cafe): boolean {
  if (!cafe.smokingInfo) return false;
  return /喫煙(ブース|室|目的室|席)|喫煙可|分煙/.test(cafe.smokingInfo);
}

function hasWifi(cafe: Cafe): boolean {
  if (!cafe.wifiInfo) return false;
  return !/Wi-?Fi.*(なし|不可)/i.test(cafe.wifiInfo);
}

function isLateNight(cafe: Cafe): boolean {
  return Boolean(
    NIGHT_NAME_PATTERNS.test(cafe.name) ||
      (cafe.hoursInfo && NIGHT_NAME_PATTERNS.test(cafe.hoursInfo))
  );
}

type QuickBadge = { key: string; emoji: string; label: string; className: string };

// ポップアップを開いてすぐ、電源・喫煙・騒がしさ・混雑度がひと目でわかるように
// バッジを横一列で表示する。編集部調べのテキストからは正規表現で簡易判定し、
// 騒がしさ・混雑度はユーザー報告の集計(stats)から判定する
function getQuickBadges(
  cafe: Cafe,
  stats: CafeStats | null,
  verifiedOutletCafeIds: Set<string>
): QuickBadge[] {
  const badges: QuickBadge[] = [];

  if (hasOutlet(cafe, verifiedOutletCafeIds)) {
    badges.push({
      key: "outlet",
      emoji: "🔌",
      label: "電源あり",
      className: "bg-blue-100 text-blue-800",
    });
  }

  if (isNonSmoking(cafe)) {
    badges.push({
      key: "nonsmoking",
      emoji: "🚭",
      label: "禁煙",
      className: "bg-green-100 text-green-800",
    });
  }
  if (isSmokingOk(cafe)) {
    badges.push({
      key: "smoking",
      emoji: "🚬",
      label: "喫煙可",
      className: "bg-gray-200 text-gray-700",
    });
  }

  if (hasWifi(cafe)) {
    badges.push({
      key: "wifi",
      emoji: "📶",
      label: "Wi-Fiあり",
      className: "bg-sky-100 text-sky-800",
    });
  }

  if (cafe.seatCountInfo) {
    badges.push({
      key: "seatcount",
      emoji: "🪑",
      label: cafe.seatCountInfo,
      className: "bg-amber-100 text-amber-800",
    });
  }

  if (isLateNight(cafe)) {
    badges.push({
      key: "latenight",
      emoji: "🌙",
      label: "24時間/深夜営業",
      className: "bg-indigo-100 text-indigo-800",
    });
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

function statusColorForStats(stats: CafeStats | null) {
  if (!stats) return PIN_COLORS.unknown;
  if (pickMajority(stats.outletOccupancyCounts) === "full") return PIN_COLORS.full;
  return PIN_COLORS[pickMajority(stats.noiseCounts)];
}

function iconForCafe(
  cafe: Cafe,
  stats: CafeStats | null,
  verifiedOutletCafeIds: Set<string>,
  highlighted: boolean = false
) {
  const statusColor = statusColorForStats(stats);
  return getCafePinIcon(
    statusColor,
    getCafeUsageStyle(cafe),
    hasOutlet(cafe, verifiedOutletCafeIds),
    highlighted
  );
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
        className="bg-white/90 rounded-full shadow border border-gray-300 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-600 cursor-pointer"
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

// お店に紐づかない、アプリ全体へのお問い合わせフォーム。管理画面から
// 内容を確認できる(お問い合わせ一覧は管理者のみ閲覧可)
function InquiryButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle"
  );

  const handleClose = () => {
    setOpen(false);
    setMessage("");
    setStatus("idle");
  };

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    if (!supabase) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    const { error } = await supabase
      .from("inquiries")
      .insert({ reporter_id: getReporterId(), message: trimmed });
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    setStatus("done");
    setMessage("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="お問い合わせ"
        title="お問い合わせ"
        className="bg-white/90 rounded-full shadow border border-gray-300 h-6 px-2 sm:h-8 sm:px-3 flex items-center gap-1 text-[10px] sm:text-sm font-semibold text-gray-700 cursor-pointer"
      >
        ✉ お問い合わせ
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4"
            onClick={handleClose}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-xs overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 bg-gray-100 font-semibold text-gray-900">
                お問い合わせ
              </div>
              <div className="p-4 flex flex-col gap-2">
                {status === "done" ? (
                  <p className="text-sm text-green-700">
                    送信しました。ありがとうございます。
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-600">
                      ご意見・ご要望・不具合報告など、店舗に関係のない内容はこちらからどうぞ。
                    </p>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={1000}
                      rows={4}
                      placeholder="内容を入力してください"
                      className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white resize-none"
                    />
                    {status === "error" && (
                      <p className="text-xs text-red-600">送信に失敗しました</p>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={status === "submitting" || !message.trim()}
                      className="bg-blue-600 text-white rounded px-3 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {status === "submitting" ? "送信中…" : "送信する"}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 font-semibold text-gray-700 cursor-pointer border-t"
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

// ランドマークが多いエリアでは、引いた表示だとラベルの文字同士が重なって
// 読めなくなるため、ある程度ズームインした時だけラベルを表示する
function ZoomTracker({ onChange }: { onChange: (zoom: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleChange = () => onChange(map.getZoom());
    map.on("zoomend", handleChange);
    handleChange();
    return () => {
      map.off("zoomend", handleChange);
    };
  }, [map, onChange]);
  return null;
}

export default function CafeMap() {
  const [reportsByCafe, setReportsByCafe] = useState<Record<string, Report[]>>({});
  const [factsByCafe, setFactsByCafe] = useState<Record<string, CafeFact[]>>({});
  const [verifiedOutletCafeIds, setVerifiedOutletCafeIds] = useState<Set<string>>(
    new Set()
  );
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorByCafe, setErrorByCafe] = useState<Record<string, string>>({});
  const [noteByCafe, setNoteByCafe] = useState<Record<string, string>>({});
  const [seatCountByCafe, setSeatCountByCafe] = useState<Record<string, string>>({});
  const [outletSeatCountByCafe, setOutletSeatCountByCafe] = useState<
    Record<string, string>
  >({});
  const [infoCorrectionByCafe, setInfoCorrectionByCafe] = useState<
    Record<string, string>
  >({});
  const [infoCorrectionSentByCafe, setInfoCorrectionSentByCafe] = useState<
    Record<string, boolean>
  >({});
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
  const [smokingFilter, setSmokingFilter] = useState<SmokingFilter>("any");
  const [wifiFilter, setWifiFilter] = useState<AvailabilityFilter>("any");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [mapFocus, setMapFocus] = useState<[number, number] | null>(null);
  const [areaQuery, setAreaQuery] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 640
  );
  const [locateError, setLocateError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [mapZoom, setMapZoom] = useState(16);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);

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

  const isAnyFilterActive =
    areaQuery !== "" ||
    outletFilter !== "any" ||
    seatingFilter !== "any" ||
    noiseFilter !== "any" ||
    smokingFilter !== "any" ||
    wifiFilter !== "any" ||
    favoritesOnly;

  const resetFilters = () => {
    setAreaQuery("");
    setOutletFilter("any");
    setSeatingFilter("any");
    setNoiseFilter("any");
    setSmokingFilter("any");
    setWifiFilter("any");
    setFavoritesOnly(false);
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

  // 電源情報が未確認のお店について、ユーザーからの報告を管理者が承認した
  // 一覧。承認されたお店はピンにも電源プラグのマークが付くようになる
  useEffect(() => {
    let isMounted = true;
    const client = supabase;
    if (!client) return;

    async function loadVerifications() {
      if (!client) return;
      const { data, error } = await client.from("outlet_verifications").select("cafe_id");

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) {
        setVerifiedOutletCafeIds(
          new Set((data as { cafe_id: string }[] | null)?.map((row) => row.cafe_id) ?? [])
        );
      }
    }

    loadVerifications();

    const channel = client
      .channel("outlet-verifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "outlet_verifications" },
        (payload) => {
          const row = payload.new as { cafe_id: string };
          setVerifiedOutletCafeIds((prev) => new Set(prev).add(row.cafe_id));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "outlet_verifications" },
        (payload) => {
          const row = payload.old as { cafe_id: string };
          setVerifiedOutletCafeIds((prev) => {
            const next = new Set(prev);
            next.delete(row.cafe_id);
            return next;
          });
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

  const submitInfoCorrection = async (cafeId: string) => {
    const message = infoCorrectionByCafe[cafeId]?.trim();
    if (!message) return;
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
      .from("info_corrections")
      .insert({ cafe_id: cafeId, reporter_id: reporterId, message });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "送信に失敗しました",
      }));
    } else {
      setInfoCorrectionByCafe((prev) => ({ ...prev, [cafeId]: "" }));
      setInfoCorrectionSentByCafe((prev) => ({ ...prev, [cafeId]: true }));
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

  const submitOutletSeatCount = async (cafeId: string) => {
    const raw = outletSeatCountByCafe[cafeId]?.trim();
    const outletSeatCount = raw ? Number(raw) : NaN;
    if (!raw || !Number.isInteger(outletSeatCount) || outletSeatCount <= 0) return;
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
      .insert({ cafe_id: cafeId, reporter_id: reporterId, outlet_seat_count: outletSeatCount });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "共有に失敗しました",
      }));
    } else {
      setOutletSeatCountByCafe((prev) => ({ ...prev, [cafeId]: "" }));
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
    smokingFilter !== "any" ||
    wifiFilter !== "any" ||
    favoritesOnly;

  // 絞り込み条件の判定(地図の表示範囲チェックは別途行うため、ここには含めない)
  function passesNonBoundsFilters(cafe: Cafe): boolean {
    if (favoritesOnly && !favorites.has(cafe.id)) return false;
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
    if (smokingFilter === "nonSmokingOnly" && !isNonSmoking(cafe)) return false;
    if (smokingFilter === "smokingOk" && !isSmokingOk(cafe)) return false;
    if (wifiFilter === "available" && !hasWifi(cafe)) return false;
    return true;
  }

  const visibleCafes = allCafes.filter((cafe) => {
    if (mapBounds && !mapBounds.pad(0.5).contains([cafe.lat, cafe.lng])) {
      return false;
    }
    return passesNonBoundsFilters(cafe);
  });

  // リスト表示用: エリア検索で絞り込んでいなくても店舗が表示されるよう、
  // 地図の表示範囲(mapBounds)には連動させず、絞り込み条件を満たす
  // 全エリアの店舗を対象にする。エリア検索(絞り込み欄と同期)が選択されて
  // いる場合は、そのエリアの店舗だけに絞る
  const listCafes = allCafes
    .filter(passesNonBoundsFilters)
    .filter((cafe) => !areaQuery || nearestAreaName(cafe) === areaQuery);
  if (sortOrder === "distance" && userPosition) {
    listCafes.sort(
      (a, b) =>
        distanceMeters(userPosition, [a.lat, a.lng]) -
        distanceMeters(userPosition, [b.lat, b.lng])
    );
  } else if (sortOrder === "seats") {
    listCafes.sort((a, b) => {
      const seatsA = parseSeatCount(a.seatCountInfo) ?? -1;
      const seatsB = parseSeatCount(b.seatCountInfo) ?? -1;
      return seatsB - seatsA;
    });
  } else if (sortOrder === "occupancy") {
    // 報告が無い店舗は「空いている」と決めつけられないため、常に最後に回す
    listCafes.sort((a, b) => {
      const statsA = statsByCafe[a.id];
      const statsB = statsByCafe[b.id];
      if (!statsA && !statsB) return 0;
      if (!statsA) return 1;
      if (!statsB) return -1;
      return (
        OCCUPANCY_SCORE[pickMajority(statsA.outletOccupancyCounts)] -
        OCCUPANCY_SCORE[pickMajority(statsB.outletOccupancyCounts)]
      );
    });
  } else if (sortOrder === "noise") {
    listCafes.sort((a, b) => {
      const statsA = statsByCafe[a.id];
      const statsB = statsByCafe[b.id];
      if (!statsA && !statsB) return 0;
      if (!statsA) return 1;
      if (!statsB) return -1;
      return (
        NOISE_SCORE[pickMajority(statsA.noiseCounts)] -
        NOISE_SCORE[pickMajority(statsB.noiseCounts)]
      );
    });
  }

  return (
    <div className="cf-shell">
      {/* リストパネル。地図と常に同時に表示する。スマホでは下の固定高さの
          帯、PC/タブレットでは左のサイドバー */}
      <div className="cf-list-panel">
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-col gap-1.5 z-10">
          <span className="text-sm font-semibold text-gray-900">
            {listCafes.length}件のお店
          </span>
          <select
            value={areaQuery}
            onChange={(e) => handleAreaSearch(e.target.value)}
            className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
          >
            <option value="">エリア: すべて</option>
            {areas.map((area) => (
              <option key={area.id} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
          >
            <option value="recommended">おすすめ順</option>
            <option value="distance" disabled={!userPosition}>
              現在地から近い順{!userPosition ? "(現在地未取得)" : ""}
            </option>
            <option value="seats">席数が多い順</option>
            <option value="occupancy">空いている順</option>
            <option value="noise">静かな順</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 p-2">
          {listCafes.map((cafe) => {
            const stats = statsByCafe[cafe.id];
            const statusColor = statusColorForStats(stats);
            const badges = getQuickBadges(cafe, stats, verifiedOutletCafeIds);
            const distance = userPosition
              ? distanceMeters(userPosition, [cafe.lat, cafe.lng])
              : null;
            const isSelected = cafe.id === selectedCafeId;
            return (
              <button
                key={cafe.id}
                onClick={() => {
                  setSelectedCafeId(cafe.id);
                  setMapFocus([cafe.lat, cafe.lng]);
                  hasManualFocusRef.current = true;
                }}
                className={`text-left bg-white border rounded-lg shadow-sm p-3 flex flex-col gap-1 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-white shadow mt-1 shrink-0"
                    style={{ backgroundColor: statusColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900">
                      {cafe.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cafe.address ?? "住所未登録"}
                    </div>
                  </div>
                  {distance !== null && (
                    <div className="text-xs text-gray-500 shrink-0">
                      {distance < 1000
                        ? `${Math.round(distance)}m`
                        : `${(distance / 1000).toFixed(1)}km`}
                    </div>
                  )}
                </div>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {badges.map((badge) => (
                      <span
                        key={badge.key}
                        className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${badge.className}`}
                      >
                        {badge.emoji} {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 地図パネル。常に表示し、残りのスペースいっぱいに広がる */}
      <div className="cf-map-panel">
    <MapContainer
      center={mapFocus ?? SHINJUKU_CENTER}
      zoom={16}
      style={{ position: "absolute", inset: 0 }}
      attributionControl={false}
    >
      <RecenterOnLocate position={mapFocus} />
      <MapBoundsTracker onChange={setMapBounds} />
      <ZoomTracker onChange={setMapZoom} />
      <PopupScrollGuard />
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
        <div className="leaflet-control bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300 m-1 sm:m-2 text-[10px] sm:text-sm w-24 sm:w-60">
          <div className="w-full flex items-center justify-between px-1.5 py-0.5 sm:px-3 sm:py-2 font-semibold gap-1">
            <button
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              className="flex items-center gap-1 flex-1 min-w-0"
            >
              <span>絞り込み</span>
              <span>{isFilterPanelOpen ? "▲" : "▼"}</span>
            </button>
            {isAnyFilterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetFilters();
                }}
                className="text-blue-600 text-[9px] sm:text-xs font-semibold underline shrink-0"
              >
                解除
              </button>
            )}
          </div>
          {isFilterPanelOpen && (
            <div className="cf-filter-panel-content flex flex-col gap-0.5 sm:gap-2 px-1.5 sm:px-3 pb-1 sm:pb-3 overflow-y-auto">
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>エリア検索</span>
                <select
                  value={areaQuery}
                  onChange={(e) => handleAreaSearch(e.target.value)}
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="">選択してください</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>電源席</span>
                <select
                  value={outletFilter}
                  onChange={(e) =>
                    setOutletFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">すべて</option>
                  <option value="available">空きありのみ</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>一般席</span>
                <select
                  value={seatingFilter}
                  onChange={(e) =>
                    setSeatingFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">すべて</option>
                  <option value="available">空きありのみ</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>静かさ</span>
                <select
                  value={noiseFilter}
                  onChange={(e) => setNoiseFilter(e.target.value as NoiseFilter)}
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">こだわらない</option>
                  <option value="quietOnly">静かな店のみ</option>
                  <option value="excludeLoud">うるさい店を除く</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>喫煙</span>
                <select
                  value={smokingFilter}
                  onChange={(e) =>
                    setSmokingFilter(e.target.value as SmokingFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">こだわらない</option>
                  <option value="nonSmokingOnly">禁煙のみ</option>
                  <option value="smokingOk">喫煙可でもよい</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>Wi-Fi</span>
                <select
                  value={wifiFilter}
                  onChange={(e) =>
                    setWifiFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">すべて</option>
                  <option value="available">Wi-Fiありのみ</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 sm:gap-2">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
        <div className="leaflet-control m-1.5 sm:m-2">
          {isAddingCafe ? (
            <div className="bg-white text-[11px] sm:text-xs rounded shadow-lg border border-gray-300 px-2.5 py-1.5 sm:px-3 sm:py-2 max-w-[220px] flex flex-col gap-1">
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
              className="bg-white rounded-full shadow-lg border border-gray-300 px-2 h-7 sm:px-3 sm:h-10 flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-900"
            >
              ＋ お店を追加
            </button>
          )}
        </div>
        <div className="leaflet-control m-2 flex flex-col gap-1.5 items-end">
          <InquiryButton />
          <AttributionInfoButton />
        </div>
      </div>

      {pendingCafeLocation && (
        <Marker
          position={[pendingCafeLocation.lat, pendingCafeLocation.lng]}
          icon={PENDING_CAFE_ICON}
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
      {allLandmarks.map((landmark) => (
        <Marker
          key={landmark.id}
          position={[landmark.lat, landmark.lng]}
          icon={LANDMARK_ICONS[landmark.category]}
          interactive={false}
        >
          {mapZoom >= 17 && landmark.category !== "traffic_signal" && (
            <Tooltip permanent direction="top" offset={[0, -28]} className="landmark-tooltip">
              {(() => {
                const { primary, secondary } = splitLandmarkLabel(landmark.id, landmark.name);
                return secondary ? (
                  <>
                    {primary}
                    <br />
                    {secondary}
                  </>
                ) : (
                  primary
                );
              })()}
            </Tooltip>
          )}
        </Marker>
      ))}
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
        const outletSeatCounts = dedupeByReporter(
          facts.filter((f) => f.outlet_seat_count != null)
        ).map((f) => f.outlet_seat_count as number);
        const outletSeatCountMedian = median(outletSeatCounts);
        const isDynamicCafe = dynamicCafeIds.has(cafe.id);
        const isUnconfirmed = isDynamicCafe && !hasIndependentActivity(cafe);
        const quickBadges = getQuickBadges(cafe, stats, verifiedOutletCafeIds);
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={iconForCafe(
              cafe,
              stats,
              verifiedOutletCafeIds,
              cafe.id === selectedCafeId
            )}
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
                          🪑 混雑度: {overallPct}%
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

                {(noteGroups.length > 0 ||
                  seatCountMedian !== null ||
                  outletSeatCountMedian !== null) && (
                  <div className="text-[11px] sm:text-sm bg-gray-50 rounded p-1.5 sm:p-2 flex flex-col gap-1">
                    {seatCountMedian !== null && (
                      <div className="text-gray-700">
                        📊 お店全体の座席数の目安: 約{seatCountMedian}席（
                        {seatCounts.length}人の報告）
                      </div>
                    )}
                    {outletSeatCountMedian !== null && (
                      <div className="text-gray-700">
                        🔌 電源席数の目安: 約{outletSeatCountMedian}席（
                        {outletSeatCounts.length}人の報告）
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
                  {(cafe.hoursInfo || cafe.closedDaysInfo) && (
                    <div className="text-[11px] sm:text-sm bg-indigo-50 border border-indigo-200 rounded p-1.5 sm:p-2 text-indigo-900 mb-1 sm:mb-2">
                      {cafe.hoursInfo && (
                        <>
                          <div className="font-semibold mb-0.5">
                            ⏰ 営業時間（ネット調べ）
                          </div>
                          <div>{cafe.hoursInfo}</div>
                        </>
                      )}
                      {cafe.closedDaysInfo && (
                        <div className={cafe.hoursInfo ? "mt-1" : ""}>
                          <span className="font-semibold">🚫 定休日: </span>
                          {cafe.closedDaysInfo}
                        </div>
                      )}
                      <div className="text-indigo-400 mt-0.5">
                        ※最新でない場合があります
                      </div>
                    </div>
                  )}
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
                  {cafe.smokingInfo && (
                    <div className="text-[11px] sm:text-sm bg-amber-50 border border-amber-200 rounded p-1.5 sm:p-2 text-amber-900 mb-1 sm:mb-2">
                      <div className="font-semibold mb-0.5">
                        🚬 喫煙情報（ネット調べ）
                      </div>
                      <div>{cafe.smokingInfo}</div>
                      <div className="text-amber-400 mt-0.5">
                        ※最新でない場合があります
                      </div>
                    </div>
                  )}
                  {infoCorrectionSentByCafe[cafe.id] ? (
                    <div className="text-[11px] sm:text-sm text-green-700">
                      ✓ ご報告ありがとうございます
                    </div>
                  ) : (
                    // React stateでの開閉切り替えだと、ポップアップの中身(children)が
                    // 変わるたびにLeafletのpopup.update()が呼ばれ、その中で一瞬
                    // visibility:hiddenにされるため、ポップアップが一瞬消えて見える
                    // 問題があった。<details>のネイティブな開閉はReactの再描画を
                    // 一切発生させないため、この問題が起きない
                    <details className="flex flex-col gap-1">
                      <summary className="text-[11px] sm:text-sm text-gray-400 underline cursor-pointer">
                        😕 店舗情報が実際と違う場合はこちら
                      </summary>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="text-[11px] sm:text-sm text-gray-500">
                          店舗情報が実際と違う場合はこちらにご記入ください
                        </div>
                        <textarea
                          value={infoCorrectionByCafe[cafe.id] ?? ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInfoCorrectionByCafe((prev) => ({
                              ...prev,
                              [cafe.id]: value,
                            }));
                          }}
                          maxLength={300}
                          rows={2}
                          placeholder="例: 喫煙席と書かれているが実際は全席禁煙だった"
                          className="border border-gray-400 rounded px-2 py-1 text-sm text-gray-900 bg-white resize-none"
                        />
                        <button
                          disabled={
                            submitting === cafe.id ||
                            !infoCorrectionByCafe[cafe.id]?.trim()
                          }
                          onClick={() => submitInfoCorrection(cafe.id)}
                          className="self-start px-2 py-1 text-xs sm:text-sm rounded bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                        >
                          送信する
                        </button>
                      </div>
                    </details>
                  )}
                </div>

                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-2 sm:p-2.5">
                  <div className="text-[11px] sm:text-sm text-orange-900 font-semibold mb-1 sm:mb-2">
                    📢 今の店内の様子を教えてください（リアルタイムの報告にご協力ください）
                  </div>
                  <div className="text-xs sm:text-sm font-semibold mb-1">混雑度</div>
                  <select
                    value={myReport?.outlet_occupancy ?? ""}
                    disabled={submitting === cafe.id}
                    onChange={(e) => {
                      const level = e.target.value as OccupancyLevel;
                      if (!level) return;
                      submitReport(cafe.id, level, level, myReport?.noise_level ?? "normal");
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
                  <div className="mt-1.5 sm:mt-2">
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
                  <div className="mt-1.5 sm:mt-2">
                    <div className="text-[11px] sm:text-sm text-gray-500 mb-1">
                      電源席はどこですか？（任意）
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={noteByCafe[cafe.id] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNoteByCafe((prev) => ({
                          ...prev,
                          [cafe.id]: value,
                        }));
                      }}
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
                      電源席はだいたい何席くらい？（任意）
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        value={outletSeatCountByCafe[cafe.id] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setOutletSeatCountByCafe((prev) => ({
                            ...prev,
                            [cafe.id]: value,
                          }));
                        }}
                        placeholder="例: 4"
                        className="w-full text-sm border rounded px-2 py-0.5 sm:py-1"
                      />
                      <button
                        disabled={
                          submitting === cafe.id ||
                          !outletSeatCountByCafe[cafe.id]?.trim()
                        }
                        onClick={() => submitOutletSeatCount(cafe.id)}
                        className="px-2 py-1 text-xs sm:text-sm rounded bg-blue-100 hover:bg-blue-200 disabled:opacity-50 whitespace-nowrap"
                      >
                        共有
                      </button>
                    </div>
                  </div>
                  <div className="mt-1.5 sm:mt-2">
                    <div className="text-[11px] sm:text-sm text-gray-500 mb-1">
                      お店全体の座席数はだいたい何席くらい？（任意）
                    </div>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={1}
                        value={seatCountByCafe[cafe.id] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSeatCountByCafe((prev) => ({
                            ...prev,
                            [cafe.id]: value,
                          }));
                        }}
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

                  {myReport && (
                    <div className="text-[11px] sm:text-sm text-orange-700 mt-1.5 sm:mt-2">
                      ✓ あなたの回答が反映されています
                    </div>
                  )}

                  {errorByCafe[cafe.id] && (
                    <div className="text-[11px] sm:text-sm text-red-500 mt-1.5 sm:mt-2">
                      {errorByCafe[cafe.id]}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
      </div>
    </div>
  );
}
