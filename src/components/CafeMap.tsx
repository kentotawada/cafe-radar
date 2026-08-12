"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MAP_VIEW_KEY, MAP_UI_KEY, FROM_MAP_KEY } from "@/lib/mapNavigation";
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
import MarkerClusterGroup from "react-leaflet-cluster";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import AdBanner from "@/components/AdBanner";
import { emitReportSubmitted } from "@/lib/reportEvents";
import {
  dedupeByReporter,
  pickMajority,
  computeStats,
  isNonSmoking,
  isSmokingOk,
  hasWifi,
  isLateNight,
  getQuickBadges,
  filterSimilarTimeSlot,
  pickMajorityFromList,
  inferPowerSupplyTier,
} from "@/lib/cafeStats";
import { landmarks as shinjukuLandmarks } from "@/data/landmarks-shinjuku";
import { landmarks as shibuyaLandmarks } from "@/data/landmarks-shibuya";
import { landmarks as ikebukuroLandmarks } from "@/data/landmarks-ikebukuro";
import { landmarks as tokyoLandmarks } from "@/data/landmarks-tokyo";
import { landmarks as uenoLandmarks } from "@/data/landmarks-ueno";
import { landmarks as shinagawaLandmarks } from "@/data/landmarks-shinagawa";
import { landmarks as shimbashiLandmarks } from "@/data/landmarks-shimbashi";
import { landmarks as akihabaraLandmarks } from "@/data/landmarks-akihabara";
import { landmarks as yurakuchoLandmarks } from "@/data/landmarks-yurakucho";
import { landmarks as kandaLandmarks } from "@/data/landmarks-kanda";
import { landmarks as takadanobabaLandmarks } from "@/data/landmarks-takadanobaba";
import { landmarks as ochanomizuLandmarks } from "@/data/landmarks-ochanomizu";
import { landmarks as kichijojiLandmarks } from "@/data/landmarks-kichijoji";
import { landmarks as ebisuLandmarks } from "@/data/landmarks-ebisu";
import { landmarks as roppongiLandmarks } from "@/data/landmarks-roppongi";
import { landmarks as akasakaLandmarks } from "@/data/landmarks-akasaka";
import { landmarks as gotandaLandmarks } from "@/data/landmarks-gotanda";
import { landmarks as iidabashiLandmarks } from "@/data/landmarks-iidabashi";
import { landmarks as nakanoLandmarks } from "@/data/landmarks-nakano";
import { landmarks as tachikawaLandmarks } from "@/data/landmarks-tachikawa";
import { areas } from "@/data/areas";
import { supabase } from "@/lib/supabaseClient";
import { PIN_COLORS } from "@/lib/pinColors";
import { cupPinSvgMarkup, CUP_PIN_VIEWBOX } from "@/lib/cupPinIcon";
import { getReporterId } from "@/lib/reporterId";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { getMapProvider, setMapProvider, type MapProvider } from "@/lib/mapProvider";
import { useLang } from "@/lib/i18n";
import type {
  CafeFact,
  CafeFlag,
  CafeStats,
  CafeUsageStyle,
  Landmark,
  LandmarkCategory,
  NoiseLevel,
  OccupancyLevel,
  PowerSupplyTier,
  Report,
  WifiSpeed,
} from "@/lib/types";

const allLandmarks: Landmark[] = [
  ...shinjukuLandmarks,
  ...shibuyaLandmarks,
  ...ikebukuroLandmarks,
  ...tokyoLandmarks,
  ...uenoLandmarks,
  ...shinagawaLandmarks,
  ...shimbashiLandmarks,
  ...akihabaraLandmarks,
  ...yurakuchoLandmarks,
  ...kandaLandmarks,
  ...takadanobabaLandmarks,
  ...ochanomizuLandmarks,
  ...kichijojiLandmarks,
  ...ebisuLandmarks,
  ...roppongiLandmarks,
  ...akasakaLandmarks,
  ...gotandaLandmarks,
  ...iidabashiLandmarks,
  ...nakanoLandmarks,
  ...tachikawaLandmarks,
];

const FLAG_HIDE_THRESHOLD = 3;

// ズームではなく「表示中のピンの数」でクラスタリングの要否を決める。
// 区の全体が収まるくらいまで引いても、そのエリアの密度が低ければ
// 個別ピンのまま見えてほしいという要望に対応するため。表示件数がこの
// しきい値を超えた時だけクラスターにまとめる(超えなければズームに
// 関係なく常に個別ピン)
const CLUSTER_PIN_THRESHOLD = 150;

// 以前MapTilerへの切り替えを試みた際に本番環境でクラッシュが発生し、原因
// 未調査のままCARTOに戻した経緯がある。今回原因を特定できた: 下の
// <TileLayer>のsubdomainsに`MAPTILER_KEY ? undefined : "abcd"`のように
// undefinedを明示的に渡すコードがすでに存在しており、Leafletは
// options.subdomainsにundefinedを渡されると内部デフォルト('abc')を
// 上書きしてしまい、タイルURL生成時に`this.options.subdomains.length`で
// 例外を投げてクラッシュしていた(MAPTILER_KEYが未設定の間は常にfalsyだった
// ため症状が出ていなかった)。対策として、subdomainsには常に無害な
// 固定値("abcd")を渡すようにした(MapTilerのURLには{s}が含まれないため
// 値自体は使われない)。CARTOと全く同じ「URLテンプレート文字列を
// TileLayerに渡すだけ」の構成を維持しているため、SDK起因の不具合は元々ない。
// NEXT_PUBLIC_MAPTILER_KEY未設定の環境(取得し忘れ・Vercel側で未設定など)
// では自動的にCARTO Voyagerにフォールバックする。
// 国土地理院タイルへの切り替えも試したが、レティナ(高解像度)画像に
// 対応しておらずスマホでぼやけて見づらくなったため元に戻した経緯がある
const MAPTILER_KEY: string | undefined = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const TILE_URL = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/bright-v2/{z}/{x}/{y}{r}.png?key=${MAPTILER_KEY}`
  : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_MAX_ZOOM = 20;

const SHINJUKU_CENTER: [number, number] = [35.6905, 139.7005];
const STALE_MINUTES = 30;

type NoiseFilter = "any" | "quietOnly" | "excludeLoud";
type AvailabilityFilter = "any" | "available";
// hasOutlet(電源あり)は編集部調べのデータだけで判定できる。
// available(空きあり)とplentyOutlets(電源席多め)は利用者の投稿が
// 前提なので、投稿がまだ少ないうちはどのエリアでも0件になる。
// r/Tokyoで「Wi-Fiと電源で絞ると1軒も出ない」と指摘されたのがこれ。
// 「電源がある店を探したい」という一番多い意図に応える選択肢が
// 存在していなかった
type OutletFilter = "any" | "hasOutlet" | "available" | "plentyOutlets";
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

// 分速80m(一般的な徒歩速度の目安)で徒歩分数に換算する。
// 「徒歩6分(約450m)」のようなバッジ表示に使う
function formatWalkBadge(distance: number): string {
  const walkMinutes = Math.max(1, Math.ceil(distance / 80));
  const distanceLabel =
    distance < 1000
      ? `${Math.round(distance)}m`
      : `${(distance / 1000).toFixed(1)}km`;
  return `徒歩${walkMinutes}分(約${distanceLabel})`;
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
  highlighted: boolean = false,
  favorite: boolean = false
) {
  const scale = displaySize / CUP_PIN_VIEWBOX;
  const svgHtml = cupPinSvgMarkup(statusColor, usageStyle, showOutletPlug, displaySize);
  // お気に入りの店は、地図を眺めているだけで見分けられるように
  // ピンの右上に★を重ねる。白フチを付けて背景が濃い地図でも埋もれないようにする
  const favoriteHtml = favorite
    ? `<div style="position:absolute;top:-2px;right:-2px;font-size:${Math.round(
        displaySize * 0.42
      )}px;line-height:1;color:#f59e0b;text-shadow:0 0 2px #fff,0 0 2px #fff,0 0 2px #fff,0 0 2px #fff;pointer-events:none;">★</div>`
    : "";
  // アンカー(ピンの指す先端)は、プラグがあればプラグの先端、
  // 無ければカップの底(丸い台座)にする
  const anchorY = showOutletPlug ? 33 : 21;
  const anchorPx = Math.round(anchorY * scale);
  // 選択中のピンは、先端から広がるパルスリングを足して地図上で
  // すぐ見つけられるようにする
  const html =
    highlighted || favorite
      ? `<div style="position:relative;width:${displaySize}px;height:${displaySize}px;">
        ${
          highlighted
            ? `<div class="cf-pin-pulse-ring" style="bottom:${displaySize - anchorPx}px;"></div>`
            : ""
        }
        ${svgHtml}
        ${favoriteHtml}
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
  highlighted: boolean = false,
  favorite: boolean = false
) {
  const key = `${statusColor}|${usageStyle}|${showOutletPlug}|${highlighted}|${favorite}`;
  let icon = cafePinIconCache.get(key);
  if (!icon) {
    icon = createCupPinIcon(
      statusColor,
      usageStyle,
      showOutletPlug,
      highlighted ? CUP_PIN_HIGHLIGHT_SIZE : CUP_PIN_DISPLAY_SIZE,
      highlighted,
      favorite
    );
    cafePinIconCache.set(key, icon);
  }
  return icon;
}

const PENDING_CAFE_ICON = createCupPinIcon(PIN_COLORS.unknown, "independent", false);

// 都心は駅同士(≒エリア同士)の距離が近く、実データが密な今は既定ズームの
// 表示範囲だけでも数百件のピンが同時に描画されうる。近いピンを1つの
// クラスターバッジにまとめる。見た目は他のバッジ(createLandmarkIcon)と
// 揃え、ブランドカラーの丸バッジにする
function createClusterIcon(cluster: L.MarkerCluster) {
  const count = cluster.getChildCount();
  const size = count < 10 ? 34 : count < 50 ? 42 : 50;
  const fontSize = count < 100 ? 13 : 11;
  const html = `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:700;font-size:${fontSize}px;">${count}</div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: L.point(size, size),
  });
}

// 不動産サイトの周辺環境地図のように、色付きの丸バッジ+シンプルな
// 白1色のイラスト(アイコン)にする。絵文字は色がバラバラで背景色と
// 合わずに見づらくなるため、単色のSVGアイコンを使う
function createLandmarkIcon(color: string, innerHtml: string) {
  // 丸バッジの下に小さな三角のツノを付け、その先端が実際の座標(建物の
  // 位置)を指すようにする。バッジ本体は建物の真上に浮くように見える。
  // カフェのピンと重なって見づらいという声を受け、先端(実座標)を軸に
  // 全体を縮小する(transform-originを先端に合わせるので、位置はずれない)
  const html = `<div style="position:relative;width:24px;height:30px;">
    <div style="transform:scale(0.72);transform-origin:50% 100%;">
      <div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
        ${innerHtml}
      </div>
      <div style="position:absolute;left:50%;bottom:-4px;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${color};"></div>
    </div>
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
  highlighted: boolean = false,
  favorite: boolean = false
) {
  const statusColor = statusColorForStats(stats);
  return getCafePinIcon(
    statusColor,
    getCafeUsageStyle(cafe),
    hasOutlet(cafe, verifiedOutletCafeIds),
    highlighted,
    favorite
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
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t("attribution.title")}
        title={t("attribution.title")}
        className="cf-map-btn rounded-full shadow border border-gray-300 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-semibold text-gray-600 cursor-pointer"
      >
        {t("attribution.button")}
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
                {t("attribution.title")}
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
                {t("attribution.close")}
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
  const { t } = useLang();
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
        aria-label={t("inquiry.title")}
        title={t("inquiry.title")}
        className="cf-map-btn rounded-full shadow border border-gray-300 h-6 px-2 sm:h-8 sm:px-3 flex items-center gap-1 text-[10px] sm:text-sm font-semibold text-gray-700 cursor-pointer"
      >
        ✉ {t("inquiry.button")}
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
                {t("inquiry.title")}
              </div>
              <div className="p-4 flex flex-col gap-2">
                {status === "done" ? (
                  <p className="text-sm text-green-700">{t("inquiry.done")}</p>
                ) : (
                  <>
                    <p className="text-xs text-gray-600">
                      {t("inquiry.description")}
                    </p>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={1000}
                      rows={4}
                      placeholder={t("inquiry.placeholder")}
                      className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white resize-none"
                    />
                    {status === "error" && (
                      <p className="text-xs text-red-600">{t("inquiry.error")}</p>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={status === "submitting" || !message.trim()}
                      className="bg-blue-600 text-white rounded px-3 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {status === "submitting"
                        ? t("inquiry.submitting")
                        : t("inquiry.submit")}
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 font-semibold text-gray-700 cursor-pointer border-t"
              >
                {t("inquiry.close")}
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
      map.setView(position, 17);
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

// 店舗詳細ページへ移動するとCafeMapはアンマウントされ、戻ってくると
// 完全に作り直される。表示していた場所はReactのstateにしか無かったため、
// 戻ると初期位置に戻り、さらに現在地取得のuseEffectが走って現在地へ
// 飛ばされていた。表示範囲をsessionStorageに逃がして復元する
type SavedMapView = { center: [number, number]; zoom: number };

// 詳細ページへ行って戻ると CafeMap は作り直される。地図の位置だけでなく
// 絞り込み・並び順・リスト欄の高さも消えるため、あわせて保存する
type SavedMapUi = {
  areaQuery: string;
  sortOrder: SortOrder;
  listHeight: number | null;
  // 選んでいた店舗。これが無いと、詳細ページから戻った時に横スライドの
  // カードが必ず先頭に巻き戻ってしまう
  selectedCafeId: string | null;
};

function readSavedMapUi(): SavedMapUi | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MAP_UI_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedMapUi;
    if (typeof parsed.areaQuery !== "string") return null;
    return {
      areaQuery: parsed.areaQuery,
      sortOrder: parsed.sortOrder,
      listHeight:
        typeof parsed.listHeight === "number" ? parsed.listHeight : null,
      selectedCafeId:
        typeof parsed.selectedCafeId === "string" ? parsed.selectedCafeId : null,
    };
  } catch {
    return null;
  }
}

function readSavedMapView(): SavedMapView | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MAP_VIEW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedMapView;
    const [lat, lng] = parsed.center ?? [];
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    if (typeof parsed.zoom !== "number") return null;
    return { center: [lat, lng], zoom: parsed.zoom };
  } catch {
    // 壊れた値が入っていても地図が開かなくなるのは避ける
    return null;
  }
}

function MapViewPersistence() {
  const map = useMap();
  useEffect(() => {
    const save = () => {
      const c = map.getCenter();
      try {
        window.sessionStorage.setItem(
          MAP_VIEW_KEY,
          JSON.stringify({ center: [c.lat, c.lng], zoom: map.getZoom() })
        );
      } catch {
        // プライベートモード等で書けない場合は諦める(復元されないだけ)
      }
    };
    map.on("moveend", save);
    map.on("zoomend", save);
    return () => {
      map.off("moveend", save);
      map.off("zoomend", save);
    };
  }, [map]);
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

export default function CafeMap({ legendOpen = false }: { legendOpen?: boolean }) {
  const router = useRouter();
  const { t, lang } = useLang();
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
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [isReportFabOpen, setIsReportFabOpen] = useState(false);
  const [reportFabMessage, setReportFabMessage] = useState<string | null>(null);
  const [cafeShareMessage, setCafeShareMessage] = useState<string | null>(null);
  const [outletFilter, setOutletFilter] = useState<OutletFilter>("any");
  const [seatingFilter, setSeatingFilter] = useState<AvailabilityFilter>("any");
  const [noiseFilter, setNoiseFilter] = useState<NoiseFilter>("any");
  const [smokingFilter, setSmokingFilter] = useState<SmokingFilter>("any");
  const [wifiFilter, setWifiFilter] = useState<AvailabilityFilter>("any");
  const [powerSupplyFilter, setPowerSupplyFilter] = useState<
    "any" | PowerSupplyTier
  >("any");
  const [wifiSpeedFilter, setWifiSpeedFilter] = useState<"any" | WifiSpeed>(
    "any"
  );
  const [webMeetingFilter, setWebMeetingFilter] = useState<"any" | "ok" | "ng">(
    "any"
  );
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [mapFocus, setMapFocus] = useState<[number, number] | null>(null);
  // 詳細ページから戻ってきた時に前回の表示範囲を復元する。マウント時に
  // 一度だけ読めばよいのでstateの初期化関数で取得する
  const [savedMapView] = useState<SavedMapView | null>(readSavedMapView);
  // 詳細ページから戻った時に、絞り込み・並び順・リスト高さを復元する
  const [savedMapUi] = useState<SavedMapUi | null>(readSavedMapUi);
  const [areaQuery, setAreaQuery] = useState(savedMapUi?.areaQuery ?? "");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 640
  );
  // 絞り込み欄の中身がスクロールできるかどうかを、影だけでなく
  // 「▼ もっと見る」のような文字でもはっきり伝えるための状態
  const [filterHasMoreBelow, setFilterHasMoreBelow] = useState(false);
  const updateFilterScrollState = (el: HTMLDivElement) => {
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setFilterHasMoreBelow(hasOverflow && !atBottom);
  };
  const [locateError, setLocateError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [quickPickError, setQuickPickError] = useState<string | null>(null);
  // リスト内で該当のお店のカードまでスクロールするために、カードのDOM要素を
  // 覚えておく(件数が多いのでrefはstateではなくMapで管理する)
  const listItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // 地図下の横スライドカード用。carouselSyncingRefは、選択に合わせて
  // こちらからスクロールさせている間だけ立てる目印で、その間はスクロール
  // 由来の選択更新を止める(選択→スクロール→選択…と往復するのを防ぐ)
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const carouselCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const carouselSyncingRef = useRef(false);
  const carouselScrollTimerRef = useRef<number | null>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  // ピンの表示に実際に使う「検索確定済み」の範囲。食べログ等と同じく、
  // ユーザーが地図を自由にドラッグ/ズームしただけではピンを更新せず、
  // 「この範囲で再検索」ボタンを押すか、エリア選択・現在地取得など
  // 明示的な移動をした時だけ更新する
  const [searchBounds, setSearchBounds] = useState<L.LatLngBounds | null>(
    null
  );
  const [hasMapDrifted, setHasMapDrifted] = useState(false);
  // 次にmapBoundsが変化した時、それが「明示的な移動」によるものなら
  // searchBoundsも一緒に同期させる。初期表示時の最初の1回も同期させたい
  // ので初期値はtrueにしておく
  const pendingSearchSyncRef = useRef(true);
  const handleMapBoundsChange = (bounds: L.LatLngBounds) => {
    setMapBounds(bounds);
    if (pendingSearchSyncRef.current) {
      pendingSearchSyncRef.current = false;
      setSearchBounds(bounds);
      setHasMapDrifted(false);
    } else {
      setHasMapDrifted(true);
    }
  };
  const handleResearchThisArea = () => {
    if (!mapBounds) return;
    setSearchBounds(mapBounds);
    setHasMapDrifted(false);
  };
  const [mapZoom, setMapZoom] = useState(17);
  const [sortOrder, setSortOrder] = useState<SortOrder>(savedMapUi?.sortOrder ?? "recommended");
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(
    savedMapUi?.selectedCafeId ?? null
  );
  const [isListPanelOpen, setIsListPanelOpen] = useState(true);

  // スマホ(縦画面)ではリスト欄を指でドラッグして高さを調整できるように
  // する。PC/タブレット(サイドバー表示)では幅の話になるため対象外とし、
  // 従来通りisListPanelOpenによる開閉のみ。どちらのレイアウトかはCSSの
  // ブレークポイント(640px)に合わせて判定する
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktopLayout(query.matches);
    update();
    query.addEventListener("change", update);
    // matchMediaのchangeイベントに対応していない環境向けの保険として、
    // 通常のresizeイベントでも同じ判定を行う
    window.addEventListener("resize", update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // 「プルダウンだけ残してリストを隠す」時の高さ = ヘッダー(件数+エリア/
  // 並び順プルダウン)の実測高さ。文言の長さやフォントサイズが変わっても
  // 正確にプルダウンの下でリストを隠せるようにResizeObserverで測る
  const listPanelHeaderRef = useRef<HTMLDivElement | null>(null);
  const [listPeekHeight, setListPeekHeight] = useState(120);
  useEffect(() => {
    const el = listPanelHeaderRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => setListPeekHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 高さの計算に使う、リスト欄・地図欄を並べている外枠(.cf-shell)への参照
  const shellRef = useRef<HTMLDivElement | null>(null);
  // ドラッグ中/ドラッグ後の実際の高さ(px)。nullの間はCSSの既定値(38vh)を使う
  const listPanelRef = useRef<HTMLDivElement | null>(null);
  const [listPanelHeightPx, setListPanelHeightPx] = useState<number | null>(
    savedMapUi?.listHeight ?? null
  );
  const listDragStateRef = useRef<{ startY: number; startHeight: number } | null>(
    null
  );
  const isListAtPeek =
    !isDesktopLayout &&
    listPanelHeightPx !== null &&
    listPanelHeightPx <= listPeekHeight + 8;
  // 見出しの矢印(▼/▲)の向きに使う「見た目上は展開されているか」
  const showListContent = isDesktopLayout ? isListPanelOpen : !isListAtPeek;
  // リスト本文を実際にDOMへ描画するかどうか。PC/タブレットは従来通り
  // isListPanelOpenで着脱する。スマホはドラッグ中もReactを再描画せず
  // 高さだけを直接書き換えているため、ここで着脱してしまうと指を動かして
  // いる間は中身が空のまま伸びて見えてしまう。常にDOMには置いたまま、
  // ピーク時はoverflow:hiddenで隠す(下のstyleで設定)
  const shouldMountListContent = isDesktopLayout ? isListPanelOpen : true;

  // 高さの基準はwindow.innerHeightではなく、実際にリスト欄・地図欄を
  // 並べている.cf-shellの実測高さを使う。ヘッダー分の高さがある分、
  // window.innerHeightより実際は小さいため、window基準だと最大まで
  // 広げた時に地図欄が0になって消えてしまっていた
  const getShellHeight = () =>
    shellRef.current?.getBoundingClientRect().height ?? window.innerHeight;
  // 最大まで広げた状態でも地図がある程度ちゃんと見えるように、地図欄の最低高さを確保する
  const MIN_MAP_VISIBLE_PX = 220;
  const getMaxListHeight = (shellHeight: number) =>
    Math.min(shellHeight * 0.85, shellHeight - MIN_MAP_VISIBLE_PX);

  const beginListDrag = (clientY: number) => {
    const panel = listPanelRef.current;
    if (!panel || isDesktopLayout) return;
    listDragStateRef.current = {
      startY: clientY,
      startHeight: panel.getBoundingClientRect().height,
    };
  };
  const updateListDrag = (clientY: number) => {
    const state = listDragStateRef.current;
    const panel = listPanelRef.current;
    if (!state || !panel) return;
    const delta = state.startY - clientY;
    const maxHeight = getMaxListHeight(getShellHeight());
    const next = Math.min(
      maxHeight,
      Math.max(listPeekHeight, state.startHeight + delta)
    );
    // ドラッグ中はReactのstateを経由せず、DOMに直接styleを書き込む。
    // 何千件ものマーカーやリストカードを抱えるこのコンポーネント全体が
    // 指を動かすたびに再描画されるとカクつくため、指を離して確定する
    // 瞬間だけstateに反映してReactの再描画を1回に抑える
    panel.style.setProperty("--cf-list-height", `${next}px`);
  };
  const endListDrag = () => {
    const panel = listPanelRef.current;
    if (!listDragStateRef.current || !panel) return;
    listDragStateRef.current = null;
    const shellHeight = getShellHeight();
    const defaultFull = shellHeight * 0.38;
    const maxHeight = getMaxListHeight(shellHeight);
    const current = panel.getBoundingClientRect().height;
    // 3段階(ピーク/既定/最大)のうち一番近いところへスナップさせる
    const peekMid = (listPeekHeight + defaultFull) / 2;
    const maxMid = (defaultFull + maxHeight) / 2;
    const snapped =
      current <= peekMid ? listPeekHeight : current >= maxMid ? maxHeight : defaultFull;
    panel.style.setProperty("--cf-list-height", `${snapped}px`);
    setListPanelHeightPx(snapped);
  };

  // 店舗情報ポップアップの高さ上限。地図欄の実際の高さ(ヘッダーの
  // 「ピンの説明」やリスト欄の展開状態で変わる)を実測して決めるので、
  // どんな組み合わせでも下のリスト欄と重ならず、途中で切れて見えなく
  // なることもない
  // ピンやリストから店舗を選んだ時に、横スライドのカードも同じ店舗まで
  // 送る。カード送りで選んだ場合は既に中央にあるので実質何も起きない
  useEffect(() => {
    if (!isListAtPeek || !selectedCafeId) return;
    const container = carouselRef.current;
    const card = carouselCardRefs.current.get(selectedCafeId);
    if (!container || !card) return;
    carouselSyncingRef.current = true;
    // behavior:"smooth" はscroll-snap-type:mandatoryと併用すると
    // アニメーション中にスナップへ引き戻されて一切動かない。instantにする
    container.scrollTo({
      left: card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2,
      behavior: "instant",
    });
    // 上のスクロールで発生するscrollイベントを1回分だけ受け流す
    const timer = window.setTimeout(() => {
      carouselSyncingRef.current = false;
    }, 200);
    return () => window.clearTimeout(timer);
  }, [selectedCafeId, isListAtPeek]);

  // 絞り込み・並び順・リスト高さを保存する。詳細ページから戻った時に、
  // 「エリアがすべてに戻る」「畳んだリストが開いてカードが消える」のを防ぐ
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        MAP_UI_KEY,
        JSON.stringify({
          areaQuery,
          sortOrder,
          listHeight: listPanelHeightPx,
          selectedCafeId,
        })
      );
    } catch {
      // プライベートモード等で書けない場合は復元を諦める
    }
  }, [areaQuery, sortOrder, listPanelHeightPx, selectedCafeId]);

  const mapPanelRef = useRef<HTMLDivElement | null>(null);

  const [popupMaxHeight, setPopupMaxHeight] = useState(340);
  useEffect(() => {
    const el = mapPanelRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const updatePopupMaxHeight = () => {
      // リスト欄をドラッグしている間は地図欄の高さが1フレームごとに変わる。
      // ここでsetStateすると、ピン・カード一式を抱えたこのコンポーネントが
      // 毎フレーム再描画されて指の動きに付いてこない(ドラッグ処理側が
      // わざわざDOM直書きで再描画を避けている意味も無くなる)。
      // 指を離した時にサイズが確定してから改めて計算する
      if (listDragStateRef.current) return;
      const isMobile = window.innerWidth < 640;
      const chrome = isMobile ? 110 : 140; // ポップアップ自体の余白・閉じるボタン分
      const cap = isMobile ? 300 : 340;
      const next = Math.max(160, Math.min(cap, el.clientHeight - chrome));
      setPopupMaxHeight(next);
    };
    updatePopupMaxHeight();
    const observer = new ResizeObserver(updatePopupMaxHeight);
    observer.observe(el);
    return () => observer.disconnect();
    // isListPanelOpenとlegendOpen(親のヘッダーで「ピンの説明」を
    // 開閉した状態)も依存に入れる。どちらも地図欄の実際の高さを
    // 変えるが、ヘッダー側の変化はResizeObserverだけでは検知が
    // 遅れることがあるため、直接の依存にして確実に再計算する
  }, [isListPanelOpen, legendOpen]);

  // エリア検索など、ユーザーが自分で地図の表示先を選んだ後に、
  // 遅れて返ってきた位置情報がそれを上書きしてしまわないようにする
  // 復元した表示位置がある時は「ユーザーが自分で選んだ場所」と同じ扱いに
  // する。そうしないと直後に走る現在地取得が復元した位置を上書きしてしまう
  const hasManualFocusRef = useRef(savedMapView !== null);
  // 現在地が取れたら自動で「近い順」にするが、ユーザーが自分で並び順を
  // 変えた後はそれを尊重して上書きしない
  const hasManualSortRef = useRef(false);

  const locateMe = (onSuccess?: (position: [number, number]) => void) => {
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
        pendingSearchSyncRef.current = true;
        setIsLocating(false);
        if (!hasManualSortRef.current) {
          setSortOrder("distance");
        }
        onSuccess?.(position);
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

  // 以前はここで無条件に getCurrentPosition を呼んでいたため、初めて
  // 来た人が地図を開いた瞬間に位置情報の許可ダイアログが出ていた
  // (PageSpeed Insightsでも「ページ読み込み時に位置情報の許可が
  // リクエストされます」として指摘された)。何のサイトか分かる前に
  // ダイアログを出されると、拒否されるか、そのまま離脱される。
  //
  // 許可済みの人には今まで通り自動で現在地に寄せたいので、先に
  // Permissions APIで状態だけ問い合わせる。これは問い合わせるだけで
  // ダイアログを出さない。granted の時だけ取得する。
  // まだ許可していない人には出さず、右下の「現在地に戻る」ボタンを
  // 押したときに初めて許可を求める(そこは操作の意図が明確なので、
  // ダイアログが出ても唐突ではない)。
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const locateSilently = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (hasManualFocusRef.current) return;
          const position: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          setUserPosition(position);
          setMapFocus(position);
          pendingSearchSyncRef.current = true;
          if (!hasManualSortRef.current) {
            setSortOrder("distance");
          }
        },
        () => {
          // 取得できなくても地図はデフォルト位置のまま表示する
        },
        // ボタン側と同じ条件。付けないと応答が無いとき延々と待つ
        { timeout: 8000, maximumAge: 60000 }
      );
    };

    // ホーム画面に追加して使っている人は、自分の意思でインストールした
    // 人なので、起動時に現在地を聞かれても唐突ではない。むしろ毎回
    // ボタンを押させるほうが煩わしい。検索やSNSから初めて来た人とは
    // 分けて扱う(この区別が無かったため、PWA利用者にも許可を求めなく
    // なってしまっていた)
    const isInstalledApp =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safariはdisplay-modeに対応せず、独自のnavigator.standaloneを使う
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isInstalledApp) {
      locateSilently();
      return;
    }

    // Permissions APIが無い環境(古いSafari等)では、自動取得をあきらめる。
    // 許可済みかどうか確かめる術がなく、呼べばダイアログが出てしまうため
    if (!navigator.permissions?.query) return;

    let cancelled = false;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled || status.state !== "granted") return;
        locateSilently();
      })
      .catch(() => {
        // nameを解釈できないブラウザ。何もしない(ダイアログを出さない)
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAreaSearch = (query: string) => {
    setAreaQuery(query);
    const match = areas.find((area) => area.name === query);
    if (match) {
      setMapFocus([match.lat, match.lng]);
      hasManualFocusRef.current = true;
      pendingSearchSyncRef.current = true;
    }
  };

  const isAnyFilterActive =
    areaQuery !== "" ||
    outletFilter !== "any" ||
    seatingFilter !== "any" ||
    noiseFilter !== "any" ||
    smokingFilter !== "any" ||
    wifiFilter !== "any" ||
    powerSupplyFilter !== "any" ||
    wifiSpeedFilter !== "any" ||
    webMeetingFilter !== "any" ||
    favoritesOnly;

  const resetFilters = () => {
    setAreaQuery("");
    setOutletFilter("any");
    setSeatingFilter("any");
    setNoiseFilter("any");
    setSmokingFilter("any");
    setWifiFilter("any");
    setPowerSupplyFilter("any");
    setWifiSpeedFilter("any");
    setWebMeetingFilter("any");
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

  // 直近の報告が無いお店でも、過去の同じ曜日・時間帯の報告傾向から
  // 「予測」を出せるように、期間を絞らず全報告を取得しておく
  const [historicalReportsByCafe, setHistoricalReportsByCafe] = useState<
    Record<string, Report[]>
  >({});
  useEffect(() => {
    let isMounted = true;
    const client = supabase;
    if (!client) return;

    async function loadHistoricalReports() {
      if (!client) return;
      const { data, error } = await client.from("reports").select("*");
      if (error) {
        console.error(error);
        return;
      }
      const grouped: Record<string, Report[]> = {};
      for (const report of (data as Report[]) ?? []) {
        (grouped[report.cafe_id] ??= []).push(report);
      }
      if (isMounted) setHistoricalReportsByCafe(grouped);
    }

    loadHistoricalReports();
    const interval = setInterval(loadHistoricalReports, 10 * 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
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
    } else {
      emitReportSubmitted();
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

  const submitWifiSpeed = async (cafeId: string, wifiSpeed: WifiSpeed) => {
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
      .insert({ cafe_id: cafeId, reporter_id: reporterId, wifi_speed: wifiSpeed });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({ ...prev, [cafeId]: "共有に失敗しました" }));
    }
  };

  const submitWebMeetingOk = async (cafeId: string, webMeetingOk: boolean) => {
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
      .insert({
        cafe_id: cafeId,
        reporter_id: reporterId,
        web_meeting_ok: webMeetingOk,
      });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({ ...prev, [cafeId]: "共有に失敗しました" }));
    }
  };

  // 「電源が実際に使えたか」の記録。web_meeting_okと同じ形で、
  // cafe_factsに1行足す(多数決はoutletUsableMajorityで取る)
  const submitOutletUsable = async (cafeId: string, usable: boolean) => {
    if (!supabase) {
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "Supabase未設定のため保存できません",
      }));
      return;
    }
    const { error } = await supabase
      .from("cafe_facts")
      .insert({ cafe_id: cafeId, reporter_id: reporterId, outlet_usable: usable });
    if (error) {
      console.error(error);
      // スマホでは開発者ツールを開けず、「共有に失敗しました」だけでは
      // 列が無いのか権限なのか切り分けられない。原因の文言も出す
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: `共有に失敗しました(${error.message})`,
      }));
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

  // みんなが投稿した「席数」「電源席数」の目安から、電源席の割合を
  // 概算する(投稿が両方揃っていない店舗はnullを返し、絞り込み対象外にする)
  function outletSeatRatio(cafe: Cafe): number | null {
    const facts = factsByCafe[cafe.id] ?? [];
    const seatCountMedian = median(
      dedupeByReporter(facts.filter((f) => f.seat_count != null)).map(
        (f) => f.seat_count as number
      )
    );
    const outletSeatCountMedian = median(
      dedupeByReporter(facts.filter((f) => f.outlet_seat_count != null)).map(
        (f) => f.outlet_seat_count as number
      )
    );
    if (!seatCountMedian || outletSeatCountMedian === null) return null;
    return outletSeatCountMedian / seatCountMedian;
  }

  // Wi-Fiの速度・WEB会議可否は、みんなの投稿を単純多数決で集計する
  function wifiSpeedMajority(cafe: Cafe): WifiSpeed | null {
    const facts = factsByCafe[cafe.id] ?? [];
    const votes = dedupeByReporter(facts.filter((f) => f.wifi_speed != null)).map(
      (f) => f.wifi_speed as WifiSpeed
    );
    return pickMajorityFromList(votes);
  }

  // 「電源はあるはずだが使えなかった」の多数決。編集部調べのoutletInfoは
  // 各店舗の公表情報なので、塞がれている・壊れているといった現地の状態は
  // ここでしか分からない
  function outletUsableMajority(cafe: Cafe): boolean | null {
    const facts = factsByCafe[cafe.id] ?? [];
    const votes = dedupeByReporter(
      facts.filter((f) => f.outlet_usable != null)
    ).map((f) => (f.outlet_usable ? "ok" : "ng"));
    const majority = pickMajorityFromList(votes);
    return majority === null ? null : majority === "ok";
  }

  function webMeetingMajority(cafe: Cafe): boolean | null {
    const facts = factsByCafe[cafe.id] ?? [];
    const votes = dedupeByReporter(
      facts.filter((f) => f.web_meeting_ok != null)
    ).map((f) => (f.web_meeting_ok ? "ok" : "ng"));
    const majority = pickMajorityFromList(votes);
    return majority === null ? null : majority === "ok";
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

  // ライブの報告が無いお店だけ、過去の同じ曜日・時間帯の傾向から予測を出す
  const now = new Date();
  const predictedStatsByCafe: Record<string, CafeStats | null> = {};
  for (const cafe of allCafes) {
    if (statsByCafe[cafe.id]) continue;
    const historical = historicalReportsByCafe[cafe.id];
    if (!historical || historical.length === 0) continue;
    predictedStatsByCafe[cafe.id] = computeStats(
      filterSimilarTimeSlot(historical, now)
    );
  }

  const isFiltering =
    outletFilter !== "any" ||
    seatingFilter !== "any" ||
    noiseFilter !== "any" ||
    smokingFilter !== "any" ||
    wifiFilter !== "any" ||
    powerSupplyFilter !== "any" ||
    wifiSpeedFilter !== "any" ||
    webMeetingFilter !== "any" ||
    favoritesOnly;

  // 絞り込み条件の判定(地図の表示範囲チェックは別途行うため、ここには含めない)
  function passesNonBoundsFilters(cafe: Cafe): boolean {
    if (favoritesOnly && !favorites.has(cafe.id)) return false;
    const stats = statsByCafe[cafe.id];
    if (!isFiltering) return true;
    if (
      (outletFilter === "available" || seatingFilter !== "any" || noiseFilter !== "any") &&
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
    if (outletFilter === "hasOutlet" && !hasOutlet(cafe, verifiedOutletCafeIds)) {
      return false;
    }
    if (outletFilter === "plentyOutlets") {
      const ratio = outletSeatRatio(cafe);
      if (ratio === null || ratio < 0.5) return false;
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
    if (
      powerSupplyFilter !== "any" &&
      inferPowerSupplyTier(cafe) !== powerSupplyFilter
    ) {
      return false;
    }
    if (
      wifiSpeedFilter !== "any" &&
      wifiSpeedMajority(cafe) !== wifiSpeedFilter
    ) {
      return false;
    }
    if (webMeetingFilter !== "any") {
      const majority = webMeetingMajority(cafe);
      if (majority === null) return false;
      if (webMeetingFilter === "ok" && !majority) return false;
      if (webMeetingFilter === "ng" && majority) return false;
    }
    return true;
  }

  // ピンは生の地図表示範囲(mapBounds)ではなく、「再検索」が確定した
  // 範囲(searchBounds)で絞り込む。ドラッグ・ズームしただけでは更新しない。
  // 余白は最小限(15%)にとどめる。都心はエリア同士が近く、余白を広く
  // 取ると密集地で数百件のピンが一度に描画されて動作が重くなるため
  const visibleCafes = allCafes.filter((cafe) => {
    if (searchBounds && !searchBounds.pad(0.15).contains([cafe.lat, cafe.lng])) {
      return false;
    }
    return passesNonBoundsFilters(cafe);
  });
  const shouldClusterCafes = visibleCafes.length > CLUSTER_PIN_THRESHOLD;

  // 目印(駅出口・建物など)も、カフェのピンと同じ理由で表示範囲だけに絞る。
  // 全エリア分(2000件超)を常時描画すると、特にスマホで地図の動きが重くなる
  const visibleLandmarks = searchBounds
    ? allLandmarks.filter((landmark) =>
        searchBounds.pad(0.15).contains([landmark.lat, landmark.lng])
      )
    : allLandmarks;

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

  // 地図の下に重ねる横スライドのカード。リストを畳んで地図を広く見ている
  // ときに、指でカードを送りながらピンを順に確認できるようにする。
  // 対象は「いま地図に写っているピン」に絞る。全1,989件を並べても
  // 画面外の店舗まで延々と送ることになり、DOMも重くなるため
  const carouselCafes = (() => {
    if (!isListAtPeek) return [];
    const visibleIds = new Set(visibleCafes.map((cafe) => cafe.id));
    return listCafes.filter((cafe) => visibleIds.has(cafe.id)).slice(0, 30);
  })();

  // カード送りで店舗を選んだ時の処理。縦のリストと違い、ここでは
  // pendingSearchSyncRefを立てない。立てると地図が寄った直後に検索範囲が
  // 取り直され、carouselCafesが作り直されて、いま選んだカード自体が
  // 一覧から消える(実際にそうなっていた)。カードに並んでいるのは元々
  // 表示中のピンなので、ここで範囲を取り直す必要もない
  // カードを「タップ」した時だけ詳細へ送る。カードを横に送る操作でも
  // pointerup は起きるので、押した位置からほとんど動いていない時に限る
  const cardPointerRef = useRef<{ x: number; y: number } | null>(null);
  const openCafeDetail = (cafe: Cafe) => {
    try {
      window.sessionStorage.setItem(FROM_MAP_KEY, "1");
    } catch {
      // 書けなくても遷移自体は成立させる
    }
    router.push(`/cafe/${cafe.id}`);
  };

  const focusCafe = (cafe: Cafe) => {
    setSelectedCafeId(cafe.id);
    setMapFocus([cafe.lat, cafe.lng]);
    hasManualFocusRef.current = true;
  };

  // 中央に来たカードの店舗を選ぶ。scrollイベントは指を動かす間ずっと
  // 飛んでくるので、止まってから判定する
  const handleCarouselScroll = () => {
    if (carouselSyncingRef.current) return;
    if (carouselScrollTimerRef.current !== null) {
      window.clearTimeout(carouselScrollTimerRef.current);
    }
    carouselScrollTimerRef.current = window.setTimeout(() => {
      const container = carouselRef.current;
      if (!container) return;
      const center = container.scrollLeft + container.clientWidth / 2;
      let nearestId: string | null = null;
      let nearestDistance = Infinity;
      for (const [id, el] of carouselCardRefs.current) {
        const cardCenter = el.offsetLeft + el.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestId = id;
        }
      }
      if (!nearestId || nearestId === selectedCafeId) return;
      const cafe = carouselCafes.find((c) => c.id === nearestId);
      if (cafe) focusCafe(cafe);
    }, 120);
  };

  // 地図下端のコントロールをカードの高さ分だけ押し上げる。カードの高さは
  // 店名の折り返しやバッジの数で変わるため、固定値だと足りずに重なる
  // (実際、128pxの決め打ちでは142pxのカードに「お店を追加」が被っていた)。
  // 実測してCSS変数に書く。stateを使うと再描画になるのでDOMへ直接書く
  useEffect(() => {
    const panel = mapPanelRef.current;
    if (!panel) return;
    const carousel = carouselRef.current;
    if (!carousel) {
      panel.style.removeProperty("--cf-carousel-h");
      return;
    }
    const apply = () =>
      panel.style.setProperty(
        "--cf-carousel-h",
        `${Math.round(carousel.getBoundingClientRect().height)}px`
      );
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(apply);
    observer.observe(carousel);
    return () => observer.disconnect();
  }, [carouselCafes.length, selectedCafeId]);

  // 「現在地からすぐ行ける、空いてそうなお店」を1タップで探す機能。
  // 現在の絞り込み条件は尊重しつつ、徒歩圏内(1.2km以内)で「満席」と
  // 報告されている店舗は後回しにし、一番近い店舗を選ぶ
  const runQuickPick = (position: [number, number]) => {
    const candidates = allCafes
      .filter(passesNonBoundsFilters)
      .map((cafe) => ({
        cafe,
        distance: distanceMeters(position, [cafe.lat, cafe.lng]),
      }))
      .filter((entry) => entry.distance <= 1200);

    if (candidates.length === 0) {
      setQuickPickError(t("quickPick.notFound"));
      return;
    }

    candidates.sort((a, b) => {
      const statsA = statsByCafe[a.cafe.id];
      const statsB = statsByCafe[b.cafe.id];
      const aFull = !!statsA && pickMajority(statsA.outletOccupancyCounts) === "full";
      const bFull = !!statsB && pickMajority(statsB.outletOccupancyCounts) === "full";
      if (aFull !== bFull) return aFull ? 1 : -1;
      return a.distance - b.distance;
    });

    const best = candidates[0].cafe;
    setQuickPickError(null);
    setSortOrder("distance");
    setSelectedCafeId(best.id);
    setMapFocus([best.lat, best.lng]);
    hasManualFocusRef.current = true;
    pendingSearchSyncRef.current = true;
    setIsListPanelOpen(true);
    setListPanelHeightPx(getShellHeight() * 0.38);
    setTimeout(() => {
      listItemRefs.current
        .get(best.id)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);
  };

  const handleQuickPick = () => {
    if (userPosition) {
      runQuickPick(userPosition);
    } else {
      locateMe((position) => runQuickPick(position));
    }
  };

  // 「選んでいるお店」がなければ、現在地から一番近いお店を対象にする
  function resolveQuickReportTarget(): Cafe | null {
    if (selectedCafeId) {
      const selected = allCafes.find((cafe) => cafe.id === selectedCafeId);
      if (selected) return selected;
    }
    if (userPosition) {
      let nearest: Cafe | null = null;
      let nearestDist = Infinity;
      for (const cafe of allCafes) {
        const d = distanceMeters(userPosition, [cafe.lat, cafe.lng]);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = cafe;
        }
      }
      return nearest;
    }
    return null;
  }

  const quickReport = async (
    kind: "available" | "full" | "outletOk" | "outletDead"
  ) => {
    const target = resolveQuickReportTarget();
    if (!target) {
      setReportFabMessage(t("quickReport.noTarget"));
      setTimeout(() => setReportFabMessage(null), 2500);
      return;
    }
    const prior = myReportByCafe[target.id];
    if (kind === "available") {
      await submitReport(target.id, "empty", "empty", prior?.noise_level ?? "normal");
    } else if (kind === "full") {
      await submitReport(target.id, "full", "full", prior?.noise_level ?? "normal");
    } else if (kind === "outletOk") {
      // 電源席が空いていた、という混雑の報告に加えて、電源が実際に
      // 使えたことも記録する
      await submitReport(
        target.id,
        "empty",
        prior?.seating_occupancy ?? "empty",
        prior?.noise_level ?? "normal"
      );
      await submitOutletUsable(target.id, true);
    } else {
      // 「あるはずの電源が使えなかった」。混雑度とは別の話なので
      // 空き状況の報告は行わず、事実だけを記録する
      await submitOutletUsable(target.id, false);
    }
    setSelectedCafeId(target.id);
    setMapFocus([target.lat, target.lng]);
    hasManualFocusRef.current = true;
    pendingSearchSyncRef.current = true;
    setIsReportFabOpen(false);
    setReportFabMessage(t("quickReport.sent").replace("{name}", target.name));
    setTimeout(() => setReportFabMessage(null), 3000);
  };

  const handleShareFavorites = async () => {
    if (favorites.size === 0) return;
    const url = `${window.location.origin}/list?ids=${[...favorites].join(",")}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: t("favorites.shareTitle"), url });
      } catch {
        // ユーザーが共有をキャンセルした場合は何もしない
      }
      return;
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2500);
    }
  };

  return (
    <div className="cf-shell" ref={shellRef}>
      {/* リストパネル。地図と常に同時に表示する。スマホでは下の固定高さの
          帯、PC/タブレットでは左のサイドバー */}
      <div
        ref={listPanelRef}
        className={`cf-list-panel${isDesktopLayout && !isListPanelOpen ? " cf-list-panel-collapsed" : ""}`}
        style={
          {
            ...(!isDesktopLayout && listPanelHeightPx !== null
              ? { "--cf-list-height": `${listPanelHeightPx}px` }
              : {}),
            // ピーク(プルダウンのみ)状態の時は、下に隠れているカード一覧が
            // スクロールで引き出せてしまわないようにoverflowを止める
            ...(isListAtPeek ? { overflowY: "hidden" } : {}),
          } as CSSProperties
        }
      >
        <div
          ref={listPanelHeaderRef}
          className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10"
        >
          {/* ドラッグハンドル。スマホでのみ表示し、指でリスト欄の高さを
              調整できるようにする(ピーク/既定/最大の3段階にスナップ) */}
          {/* 取っ手は見た目こそ細い棒だが、指で掴む領域は広くとる。
              py-1.5(全体で約18px)では小さすぎて掴み損ねていた */}
          <div
            className="sm:hidden flex items-center justify-center py-3.5 -my-1 touch-none cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              beginListDrag(e.clientY);
            }}
            onPointerMove={(e) => {
              if (listDragStateRef.current) updateListDrag(e.clientY);
            }}
            onPointerUp={endListDrag}
            onPointerCancel={endListDrag}
          >
            <div className="h-1.5 w-10 rounded-full bg-gray-300" />
          </div>
          <button
            onClick={() => {
              if (isDesktopLayout) {
                setIsListPanelOpen((prev) => !prev);
                return;
              }
              setListPanelHeightPx((current) =>
                current !== null && current <= listPeekHeight + 8
                  ? getShellHeight() * 0.38
                  : listPeekHeight
              );
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-900"
          >
            <span>
              {listCafes.length}
              {t("list.count")}
            </span>
            <span>{showListContent ? "▼" : "▲"}</span>
          </button>
          {(isDesktopLayout ? isListPanelOpen : true) && (
            <div className="flex flex-col gap-1.5 px-3 pb-2">
              <select
                value={areaQuery}
                onChange={(e) => handleAreaSearch(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
              >
                <option value="">{t("list.areaAll")}</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {lang === "en" ? area.nameEn : area.name}
                  </option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => {
                  hasManualSortRef.current = true;
                  setSortOrder(e.target.value as SortOrder);
                }}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700"
              >
                <option value="recommended">{t("list.sortRecommended")}</option>
                <option value="distance" disabled={!userPosition}>
                  {t("list.sortDistance")}
                  {!userPosition ? t("list.sortDistanceUnavailable") : ""}
                </option>
                <option value="seats">{t("list.sortSeats")}</option>
                <option value="occupancy">{t("list.sortOccupancy")}</option>
                <option value="noise">{t("list.sortNoise")}</option>
              </select>
              {/* 元は地図の右下にあったが、地図の下端は横スライドのカードで
                  埋まったうえ、この機能は並び順の「空いている順」+「現在地から
                  近い順」と結果が重なる。重複相手の隣に置いて、地図側の
                  ボタン数を減らす */}
              <button
                onClick={handleQuickPick}
                disabled={isLocating}
                className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 disabled:opacity-50 whitespace-nowrap"
              >
                📍 {t("quickPick.button")}
              </button>
            </div>
          )}
        </div>
        {shouldMountListContent && listCafes.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <div className="text-2xl">🔍</div>
            <div className="text-sm text-gray-500">
              {t("list.empty")}
            </div>
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 underline"
              >
                {t("list.emptyResetFilters")}
              </button>
            )}
          </div>
        )}
        {shouldMountListContent && (
        <div className="flex flex-col gap-2 p-2">
          {listCafes.flatMap((cafe, index) => {
            const stats = statsByCafe[cafe.id];
            const statusColor = statusColorForStats(stats);
            const badges = getQuickBadges(cafe, stats, verifiedOutletCafeIds, lang);
            const isFavorite = favorites.has(cafe.id);
            const distance = userPosition
              ? distanceMeters(userPosition, [cafe.lat, cafe.lng])
              : null;
            const isSelected = cafe.id === selectedCafeId;
            // インフィード広告: 3番目・6番目のカードの直後に挿入する
            const showAdAfter =
              (index === 2 || index === 5) && index < listCafes.length - 1;
            const card = (
              <div
                key={cafe.id}
                ref={(el) => {
                  if (el) listItemRefs.current.set(cafe.id, el);
                  else listItemRefs.current.delete(cafe.id);
                }}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedCafeId(cafe.id);
                  setMapFocus([cafe.lat, cafe.lng]);
                  hasManualFocusRef.current = true;
                  pendingSearchSyncRef.current = true;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedCafeId(cafe.id);
                    setMapFocus([cafe.lat, cafe.lng]);
                    hasManualFocusRef.current = true;
                    pendingSearchSyncRef.current = true;
                  }
                }}
                className={`text-left bg-white border rounded-lg shadow-sm p-3 flex flex-col gap-1 cursor-pointer ${
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
                      {cafe.address ?? t("list.noAddress")}
                    </div>
                  </div>
                  {distance !== null && (
                    <div className="text-[10px] sm:text-xs font-semibold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 shrink-0">
                      🚶 {formatWalkBadge(distance)}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(cafe.id);
                    }}
                    aria-label={
                      isFavorite ? "お気に入りから解除" : "お気に入りに追加"
                    }
                    title={isFavorite ? "お気に入りから解除" : "お気に入りに追加"}
                    className={`shrink-0 text-lg leading-none ${
                      isFavorite ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
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
              </div>
            );
            return showAdAfter
              ? [
                  card,
                  <AdBanner
                    key={`ad-after-${cafe.id}`}
                    slot="cafe-list-infeed"
                  />,
                ]
              : [card];
          })}
        </div>
        )}
      </div>

      {/* 地図パネル。常に表示し、残りのスペースいっぱいに広がる */}
      <div
        className={`cf-map-panel${carouselCafes.length > 0 ? " cf-has-carousel" : ""}`}
        ref={mapPanelRef}
      >
    <MapContainer
      center={mapFocus ?? savedMapView?.center ?? SHINJUKU_CENTER}
      zoom={savedMapView?.zoom ?? 17}
      style={{ position: "absolute", inset: 0 }}
      attributionControl={false}
    >
      <RecenterOnLocate position={mapFocus} />
      <MapViewPersistence />
      <MapBoundsTracker onChange={handleMapBoundsChange} />
      <ZoomTracker onChange={setMapZoom} />
      <PopupScrollGuard />
      <AddCafeClickHandler
        active={isAddingCafe}
        onPick={(lat, lng) => setPendingCafeLocation({ lat, lng })}
      />
      <TileLayer
        url={TILE_URL}
        // subdomainsにundefinedを明示的に渡すと、Leafletが内部デフォルト
        // ('abc')を上書きしてしまい、タイルURL生成時に
        // this.options.subdomains.lengthで例外が発生してクラッシュする
        // (過去のMapTiler切り替え時の本番クラッシュの原因はこれだった
        // 可能性が高い)。MapTilerのURLには{s}が含まれないため値自体は
        // 使われないので、常に無害な値を渡しておく
        subdomains="abcd"
        maxZoom={TILE_MAX_ZOOM}
      />

      <div className="leaflet-top leaflet-right" style={{ zIndex: 1000 }}>
        <div
          ref={(el) => {
            if (el) {
              L.DomEvent.disableScrollPropagation(el);
              L.DomEvent.disableClickPropagation(el);
            }
          }}
          className="leaflet-control bg-white text-gray-900 rounded-lg shadow-lg border border-gray-300 m-1 sm:m-2 text-[10px] sm:text-sm w-24 sm:w-60"
        >
          <div className="w-full flex items-center justify-between px-1.5 py-0.5 sm:px-3 sm:py-2 font-semibold gap-1">
            <button
              onClick={() => setIsFilterPanelOpen((prev) => !prev)}
              className="flex items-center gap-1 flex-1 min-w-0"
            >
              <span>{t("filter.toggle")}</span>
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
                {t("filter.reset")}
              </button>
            )}
          </div>
          {isFilterPanelOpen && (
            <div
              ref={(el) => {
                if (el) updateFilterScrollState(el);
              }}
              onScroll={(e) => updateFilterScrollState(e.currentTarget)}
              className="cf-filter-panel-content flex flex-col gap-0.5 sm:gap-2 px-1.5 sm:px-3 pb-1 sm:pb-3 overflow-y-auto"
            >
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.area")}</span>
                <select
                  value={areaQuery}
                  onChange={(e) => handleAreaSearch(e.target.value)}
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="">{t("filter.areaPlaceholder")}</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {lang === "en" ? area.nameEn : area.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.outlet")}</span>
                <select
                  value={outletFilter}
                  onChange={(e) =>
                    setOutletFilter(e.target.value as OutletFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.any")}</option>
                  {/* 一番上に置く。編集部調べだけで判定できる唯一の選択肢で、
                      「電源のある店を探したい」という最も多い意図に対応する。
                      下の2つは投稿が集まるまで0件になるため後ろに回す */}
                  <option value="hasOutlet">{t("filter.hasOutlet")}</option>
                  <option value="available">{t("filter.availableOnly")}</option>
                  <option value="plentyOutlets">{t("filter.plentyOutlets")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.seating")}</span>
                <select
                  value={seatingFilter}
                  onChange={(e) =>
                    setSeatingFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.any")}</option>
                  <option value="available">{t("filter.availableOnly")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.noise")}</span>
                <select
                  value={noiseFilter}
                  onChange={(e) => setNoiseFilter(e.target.value as NoiseFilter)}
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.noiseAny")}</option>
                  <option value="quietOnly">{t("filter.quietOnly")}</option>
                  <option value="excludeLoud">{t("filter.excludeLoud")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.smoking")}</span>
                <select
                  value={smokingFilter}
                  onChange={(e) =>
                    setSmokingFilter(e.target.value as SmokingFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.smokingAny")}</option>
                  <option value="nonSmokingOnly">{t("filter.nonSmokingOnly")}</option>
                  <option value="smokingOk">{t("filter.smokingOk")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.wifi")}</span>
                <select
                  value={wifiFilter}
                  onChange={(e) =>
                    setWifiFilter(e.target.value as AvailabilityFilter)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.any")}</option>
                  <option value="available">{t("filter.wifiAvailableOnly")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.powerSupply")}</span>
                <select
                  value={powerSupplyFilter}
                  onChange={(e) =>
                    setPowerSupplyFilter(
                      e.target.value as "any" | PowerSupplyTier
                    )
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.any")}</option>
                  <option value="all">{t("filter.powerSupplyAll")}</option>
                  <option value="counter">{t("filter.powerSupplyCounter")}</option>
                  <option value="few">{t("filter.powerSupplyFew")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.wifiSpeed")}</span>
                <select
                  value={wifiSpeedFilter}
                  onChange={(e) =>
                    setWifiSpeedFilter(e.target.value as "any" | WifiSpeed)
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.any")}</option>
                  <option value="fast">{t("filter.wifiSpeedFast")}</option>
                  <option value="standard">{t("filter.wifiSpeedStandard")}</option>
                </select>
              </label>
              <label className="flex flex-col gap-0.5 sm:gap-1">
                <span>{t("filter.webMeeting")}</span>
                <select
                  value={webMeetingFilter}
                  onChange={(e) =>
                    setWebMeetingFilter(e.target.value as "any" | "ok" | "ng")
                  }
                  className="border border-gray-400 rounded px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm text-gray-900 bg-white w-full"
                >
                  <option value="any">{t("filter.any")}</option>
                  <option value="ok">{t("filter.webMeetingOk")}</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 sm:gap-2">
                <input
                  type="checkbox"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                />
                <span>{t("filter.favoritesOnly")}</span>
              </label>
              {favorites.size > 0 && (
                <button
                  onClick={handleShareFavorites}
                  className="self-start text-blue-600 underline"
                >
                  {shareStatus === "copied"
                    ? t("favorites.copied")
                    : t("favorites.share")}
                </button>
              )}
            </div>
          )}
          {isFilterPanelOpen && filterHasMoreBelow && (
            <div className="text-center text-[9px] sm:text-xs font-semibold text-blue-600 bg-blue-50 border-t border-blue-100 py-1">
              {t("filter.scrollHint")}
            </div>
          )}
        </div>
        {/* お問い合わせと出典表示。独立した .leaflet-top.leaflet-left を
            足すとLeaflet自身のズーム(＋−)コンテナと同じ位置に重なるため、
            既存の右上コンテナの中に入れて縦に積む */}
        <div className="leaflet-control m-1 sm:m-2 flex flex-col gap-1.5 items-end">
          <InquiryButton />
          <AttributionInfoButton />
        </div>
      </div>

      <div className="leaflet-bottom leaflet-right" style={{ zIndex: 1000 }}>
        <div className="leaflet-control m-2 flex flex-col items-end gap-1">
          {locateError && (
            <div className="bg-white text-xs text-red-600 rounded shadow-lg border border-gray-300 pl-2 pr-1 py-1.5 max-w-[260px] leading-relaxed flex items-start gap-1">
              <span className="flex-1">{locateError}</span>
              <button
                onClick={() => setLocateError(null)}
                aria-label="閉じる"
                className="text-gray-400 hover:text-gray-600 px-1 shrink-0"
              >
                ×
              </button>
            </div>
          )}
          {quickPickError && (
            <div className="bg-white text-xs text-red-600 rounded shadow-lg border border-gray-300 pl-2 pr-1 py-1.5 max-w-[260px] leading-relaxed flex items-start gap-1">
              <span className="flex-1">{quickPickError}</span>
              <button
                onClick={() => setQuickPickError(null)}
                aria-label="閉じる"
                className="text-gray-400 hover:text-gray-600 px-1 shrink-0"
              >
                ×
              </button>
            </div>
          )}
          {reportFabMessage && (
            <div className="bg-white text-xs text-blue-700 rounded shadow-lg border border-gray-300 px-2 py-1.5 max-w-[260px] leading-relaxed">
              {reportFabMessage}
            </div>
          )}
          {isReportFabOpen && (
            <div className="cf-report-ui bg-white rounded-lg shadow-lg border border-gray-300 p-2 flex flex-col gap-1 w-44">
              <div className="text-[11px] text-gray-500 px-1">
                {(() => {
                  const target = resolveQuickReportTarget();
                  return target ? target.name : t("quickReport.noTarget");
                })()}
              </div>
              <button
                onClick={() => quickReport("available")}
                className="text-left text-xs sm:text-sm rounded px-2 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 font-semibold"
              >
                😊 {t("quickReport.available")}
              </button>
              <button
                onClick={() => quickReport("full")}
                className="text-left text-xs sm:text-sm rounded px-2 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 font-semibold"
              >
                😣 {t("quickReport.full")}
              </button>
              <button
                onClick={() => quickReport("outletOk")}
                className="text-left text-xs sm:text-sm rounded px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold"
              >
                🔌 {t("quickReport.outletOk")}
              </button>
              <button
                onClick={() => quickReport("outletDead")}
                className="text-left px-2 py-1.5 rounded hover:bg-gray-100"
              >
                ⚡ {t("quickReport.outletDead")}
              </button>
              <button
                onClick={() => setIsReportFabOpen(false)}
                className="text-center text-xs text-gray-400 hover:text-gray-600 mt-0.5"
              >
                {t("quickReport.close")}
              </button>
            </div>
          )}
          <button
            onClick={() => setIsReportFabOpen((prev) => !prev)}
            className="cf-report-ui cf-map-btn rounded-full shadow-lg border border-gray-300 h-9 sm:h-10 px-3 flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-900"
            aria-label={t("quickReport.fab")}
            title={t("quickReport.fab")}
          >
            📢 {t("quickReport.fab")}
          </button>
          {/* 「近くの空席候補」はリスト側の並び順プルダウンの隣へ移した */}
          <button
            onClick={() => locateMe()}
            disabled={isLocating}
            aria-label="現在地に戻る"
            title="現在地に戻る"
            className="cf-map-btn rounded-full shadow-lg border border-gray-300 w-10 h-10 flex items-center justify-center disabled:opacity-50"
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
              <div className="text-gray-800">{t("addCafe.tapHint")}</div>
              <button
                onClick={cancelAddingCafe}
                className="self-start px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >
                {t("addCafe.cancel")}
              </button>
            </div>
          ) : (
            <button
              onClick={startAddingCafe}
              className="cf-map-btn rounded-full shadow-lg border border-gray-300 px-2 h-7 sm:px-3 sm:h-10 flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-900"
            >
              {t("addCafe.button")}
            </button>
          )}
        </div>
      </div>

      {pendingCafeLocation && (
        <Marker
          position={[pendingCafeLocation.lat, pendingCafeLocation.lng]}
          icon={PENDING_CAFE_ICON}
        >
          <Popup minWidth={220} autoClose={false} closeOnClick={false}>
            <div className="flex flex-col gap-2 text-gray-900">
              <div className="font-bold text-base">{t("addCafe.title")}</div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {t("addCafe.nameLabel")}
                </div>
                <input
                  type="text"
                  maxLength={60}
                  value={newCafeName}
                  onChange={(e) => setNewCafeName(e.target.value)}
                  placeholder={t("addCafe.namePlaceholder")}
                  className="w-full text-base border rounded px-2 py-1"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {t("addCafe.addressLabel")}
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={newCafeAddress}
                  onChange={(e) => setNewCafeAddress(e.target.value)}
                  placeholder={t("addCafe.addressPlaceholder")}
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
                {t("addCafe.verifyOnGoogleMaps")}
              </a>
              <div className="flex gap-2">
                <button
                  disabled={isSubmittingCafe || !newCafeName.trim()}
                  onClick={submitNewCafe}
                  className="px-2 py-1 text-xs rounded bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                >
                  {t("addCafe.submit")}
                </button>
                <button
                  onClick={cancelAddingCafe}
                  className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200"
                >
                  {t("addCafe.cancel")}
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
      {/* 目印は全エリアで2000件超あり、ズームアウト時にmapBoundsが広い
          範囲を含むと数百件同時に描画されて地図の動きが重くなる。街区が
          見える程度まで拡大した時だけ描画する(縮小時は不要な情報でもある) */}
      {mapZoom >= 15 && visibleLandmarks.map((landmark) => (
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
      {/* ズームではなく表示件数でクラスタリングの要否を決める(区が丸ごと
          収まるくらいまで引いても、その範囲が空いていれば個別ピンのまま
          見えるようにするため)。CLUSTER_PIN_THRESHOLDを超えた時だけ
          近いピンをクラスターバッジにまとめる */}
      {(() => {
        const PinsWrapper = shouldClusterCafes ? MarkerClusterGroup : Fragment;
        const wrapperProps = shouldClusterCafes
          ? {
              maxClusterRadius: 60,
              showCoverageOnHover: false,
              spiderfyOnMaxZoom: true,
              iconCreateFunction: createClusterIcon,
            }
          : {};
        return (
          <PinsWrapper {...wrapperProps}>
      {visibleCafes.map((cafe) => {
        const stats = statsByCafe[cafe.id];
        const predictedStats = predictedStatsByCafe[cafe.id];
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
        const wifiSpeedVotes = dedupeByReporter(
          facts.filter((f) => f.wifi_speed != null)
        );
        const wifiSpeedResult = pickMajorityFromList(
          wifiSpeedVotes.map((f) => f.wifi_speed as WifiSpeed)
        );
        const webMeetingVotes = dedupeByReporter(
          facts.filter((f) => f.web_meeting_ok != null)
        );
        const webMeetingResult =
          webMeetingVotes.length > 0
            ? pickMajorityFromList(
                webMeetingVotes.map((f) => (f.web_meeting_ok ? "ok" : "ng"))
              )
            : null;
        const isDynamicCafe = dynamicCafeIds.has(cafe.id);
        const isUnconfirmed = isDynamicCafe && !hasIndependentActivity(cafe);
        const quickBadges = getQuickBadges(cafe, stats, verifiedOutletCafeIds, lang);
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            // ピンをタップしてポップアップを開いた店舗を「選択中」にする。
            // これが無いと、resolveQuickReportTargetが「現在地から一番近い
            // 店」へフォールバックし、開いている店とは別の店に投稿されて
            // しまう(実際に起きた)。地図は動かさず選択だけ移す
            eventHandlers={{
              popupopen: () => setSelectedCafeId(cafe.id),
            }}
            icon={iconForCafe(
              cafe,
              stats,
              verifiedOutletCafeIds,
              cafe.id === selectedCafeId,
              isFavorite
            )}
          >
            <Popup
              key={Math.round(popupMaxHeight / 10)}
              minWidth={210}
              maxHeight={popupMaxHeight}
            >
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
                  {/* ポップアップからカフェ詳細ページへ行く唯一の導線。
                      これが無いと、詳細ページは共有リンクとお気に入り経由
                      でしか開けない(営業時間・定休日・代替手段の案内など、
                      ポップアップに収まらない情報が全て届かなくなる) */}
                  <Link
                    href={`/cafe/${cafe.id}`}
                    onClick={() => {
                      // 詳細ページの「地図で見る」に、新しい履歴を積まずに
                      // 戻ればよいことを伝える。積んでしまうと地図→詳細→地図
                      // となり、ブラウザの戻るを2回押さないと抜けられない
                      try {
                        window.sessionStorage.setItem(FROM_MAP_KEY, "1");
                      } catch {
                        // 書けなくても遷移自体は成立させる
                      }
                    }}
                    className="text-blue-600 underline font-semibold"
                  >
                    📄 このお店の詳細
                  </Link>
                  <CafeDirectionsLink cafe={cafe} />
                  <a
                    href={searchUrl(cafe)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    写真・口コミ(Googleマップ)
                  </a>
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/cafe/${cafe.id}`;
                      if (typeof navigator.share === "function") {
                        try {
                          await navigator.share({ title: cafe.name, url });
                        } catch {
                          // ユーザーが共有をキャンセルした場合は何もしない
                        }
                        return;
                      }
                      if (navigator.clipboard) {
                        await navigator.clipboard.writeText(url);
                        setCafeShareMessage(cafe.id);
                        setTimeout(() => setCafeShareMessage(null), 2500);
                      }
                    }}
                    className="text-blue-600 underline"
                  >
                    🔗{" "}
                    {cafeShareMessage === cafe.id
                      ? "コピーしました"
                      : "このお店を共有"}
                  </button>
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
                ) : predictedStats ? (
                  (() => {
                    const outletPct = weightedPercent(
                      predictedStats.outletOccupancyCounts,
                      OCCUPANCY_SCORE,
                      predictedStats.totalReporters
                    );
                    const seatingPct = weightedPercent(
                      predictedStats.seatingOccupancyCounts,
                      OCCUPANCY_SCORE,
                      predictedStats.totalReporters
                    );
                    const overallPct = Math.round((outletPct + seatingPct) / 2);
                    return (
                      <div className="text-xs sm:text-base border border-dashed border-gray-300 rounded p-1.5 sm:p-2">
                        <div className="font-semibold text-gray-500">
                          📊 予測混雑度: {overallPct}%
                        </div>
                        <div className="text-[11px] sm:text-sm text-gray-400 mt-1">
                          今の報告はまだありません。過去の同じ曜日・時間帯の傾向(
                          {predictedStats.totalReporters}件)からの参考値です
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
                  outletSeatCountMedian !== null ||
                  wifiSpeedResult !== null ||
                  webMeetingResult !== null) && (
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
                    {wifiSpeedResult !== null && (
                      <div className="text-gray-700">
                        📶 Wi-Fi速度の傾向:{" "}
                        {
                          {
                            fast: "速い",
                            standard: "普通",
                            restricted: "遅い/制限あり",
                            none: "Wi-Fiなし",
                          }[wifiSpeedResult]
                        }
                        （{wifiSpeedVotes.length}人の報告）
                      </div>
                    )}
                    {webMeetingResult !== null && (
                      <div className="text-gray-700">
                        💻 WEB会議・通話:{" "}
                        {webMeetingResult === "ok" ? "OKの声が多い" : "NGの声が多い"}
                        （{webMeetingVotes.length}人の報告）
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
                  {/* 公表情報では電源ありでも、現地で塞がれている・壊れて
                      いることがある。みんなの投稿でしか分からないので、
                      ネット調べの情報のすぐ下に並べて対比させる */}
                  {outletUsableMajority(cafe) === false && (
                    <div className="text-[11px] sm:text-sm bg-red-50 border border-red-200 rounded p-1.5 sm:p-2 text-red-900 mb-1 sm:mb-2">
                      <div className="font-semibold">
                        ⚡ 電源が使えなかったという報告があります
                      </div>
                      <div className="text-red-500 mt-0.5">
                        塞がれている・故障しているなどの可能性があります
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
                  <div className="mt-1.5 sm:mt-2">
                    <div className="text-[11px] sm:text-sm text-gray-500 mb-1">
                      Wi-Fiの速度は？（任意・みんなで集めています）
                    </div>
                    <select
                      value=""
                      disabled={submitting === cafe.id}
                      onChange={(e) => {
                        const value = e.target.value as WifiSpeed;
                        if (!value) return;
                        submitWifiSpeed(cafe.id, value);
                      }}
                      className="w-full text-sm border rounded px-2 py-0.5 sm:py-1 bg-white disabled:opacity-50"
                    >
                      <option value="" disabled>
                        選択してください
                      </option>
                      <option value="fast">速い(動画も快適)</option>
                      <option value="standard">普通</option>
                      <option value="restricted">遅い/時間制限あり</option>
                      <option value="none">Wi-Fiなし</option>
                    </select>
                  </div>
                  <div className="mt-1.5 sm:mt-2">
                    <div className="text-[11px] sm:text-sm text-gray-500 mb-1">
                      WEB会議・通話をしても大丈夫？（任意・みんなで集めています）
                    </div>
                    <div className="flex gap-1">
                      <button
                        disabled={submitting === cafe.id}
                        onClick={() => submitWebMeetingOk(cafe.id, true)}
                        className="flex-1 px-2 py-1 text-xs sm:text-sm rounded bg-green-100 hover:bg-green-200 disabled:opacity-50"
                      >
                        👍 大丈夫
                      </button>
                      <button
                        disabled={submitting === cafe.id}
                        onClick={() => submitWebMeetingOk(cafe.id, false)}
                        className="flex-1 px-2 py-1 text-xs sm:text-sm rounded bg-red-100 hover:bg-red-200 disabled:opacity-50"
                      >
                        🙅 NG
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

                <AdBanner slot="cafe-popup" minHeight={56} className="mt-1" />
              </div>
            </Popup>
          </Marker>
        );
      })}
          </PinsWrapper>
        );
      })()}
    </MapContainer>

      {/* 地図に重ねる横スライドのカード。リストを畳んで「エリア」「並び順」の
          プルダウンだけが見えている状態のときに出す。展開時は縦のリストが
          同じ役目を果たすので出さない。z-indexはLeafletのポップアップ層(700)
          より上に置き、カードを送っている最中もカードが隠れないようにする */}
      {carouselCafes.length > 0 && (
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="cf-map-carousel absolute bottom-3 left-0 right-0 z-[800] flex gap-3 overflow-x-auto px-[12.5vw] snap-x snap-mandatory"
        >
          {carouselCafes.map((cafe) => {
            const stats = statsByCafe[cafe.id];
            const badges = getQuickBadges(cafe, stats, verifiedOutletCafeIds, lang);
            const distance = userPosition
              ? distanceMeters(userPosition, [cafe.lat, cafe.lng])
              : null;
            const isSelected = cafe.id === selectedCafeId;
            const isFavorite = favorites.has(cafe.id);
            // みんなの投稿があるお店は、ポップアップを開かなくても
            // 混雑度がわかるようにカード上に出す。直近30分の投稿が無い
            // 場合は、同じ曜日・時間帯の過去の投稿からの予測に切り替える。
            // ライブと予測は必ず区別できるようにラベルを分ける
            const predicted = predictedStatsByCafe[cafe.id];
            const occupancySource = stats ?? predicted ?? null;
            const seatPercent = occupancySource
              ? weightedPercent(
                  occupancySource.seatingOccupancyCounts,
                  OCCUPANCY_SCORE,
                  occupancySource.totalReporters
                )
              : null;
            const noisePercent = occupancySource
              ? weightedPercent(
                  occupancySource.noiseCounts,
                  NOISE_SCORE,
                  occupancySource.totalReporters
                )
              : null;
            const isPredicted = !stats && Boolean(predicted);
            // 混雑度・騒音度は数値で別に出すので、同じ内容のバッジ
            // (混雑気味・うるさめ)はここでは省く。残るのは編集部調べの
            // 固定情報だけになるため、並ぶ順番が店舗ごとにぶれない
            const staticBadges = badges.filter(
              (badge) => badge.key !== "crowded" && badge.key !== "noisy"
            );
            return (
              <div
                key={cafe.id}
                ref={(el) => {
                  if (el) carouselCardRefs.current.set(cafe.id, el);
                  else carouselCardRefs.current.delete(cafe.id);
                }}
                role="button"
                tabIndex={0}
                onPointerDown={(e) => {
                  cardPointerRef.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerUp={(e) => {
                  const start = cardPointerRef.current;
                  cardPointerRef.current = null;
                  if (!start) return;
                  // 10pxを超えて動いていたらカード送り。詳細へは飛ばさない
                  if (
                    Math.abs(e.clientX - start.x) > 10 ||
                    Math.abs(e.clientY - start.y) > 10
                  ) {
                    return;
                  }
                  openCafeDetail(cafe);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCafeDetail(cafe);
                  }
                }}
                className={`snap-center shrink-0 w-[75vw] max-w-xs bg-white rounded-xl shadow-lg border px-2.5 py-2 flex flex-col gap-1 cursor-pointer ${
                  isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full border border-white shadow mt-1 shrink-0"
                    style={{ backgroundColor: statusColorForStats(stats) }}
                  />
                  {/* 店名は1行に収める。折り返すとカードの高さが店舗ごとに
                      変わって、横に送ったときガタつくため */}
                  <div
                    title={cafe.name}
                    className="flex-1 min-w-0 font-semibold text-sm text-gray-900 truncate"
                  >
                    {cafe.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(cafe.id);
                    }}
                    aria-label={
                      isFavorite ? "お気に入りから解除" : "お気に入りに追加"
                    }
                    title={isFavorite ? "お気に入りから解除" : "お気に入りに追加"}
                    className={`shrink-0 text-lg leading-none ${
                      isFavorite ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {distance !== null && (
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">
                      🚶 {formatWalkBadge(distance)}
                    </span>
                  )}
                  {/* 混雑度と騒音度は必ずこの順で隣に並べる。どちらも
                      みんなの投稿から出る数値で、店舗ごとに位置が動くと
                      見比べられないため、静的なバッジとは行を分けている */}
                  {seatPercent !== null && (
                    <span
                      className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                        isPredicted
                          ? "bg-gray-100 text-gray-600"
                          : seatPercent >= 80
                            ? "bg-red-100 text-red-800"
                            : seatPercent >= 50
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      🈵 混雑度 {seatPercent}%{isPredicted ? "(予測)" : ""}
                    </span>
                  )}
                  {/* 「電源はあるはずだが使えなかった」の報告。編集部調べで
                      電源ありとしていても、現地で塞がれていることがある。
                      行く前にいちばん知りたい情報なので目立たせる */}
                  {outletUsableMajority(cafe) === false && (
                    <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-red-100 text-red-800">
                      ⚡ 電源が使えない報告あり
                    </span>
                  )}
                  {noisePercent !== null && (
                    <span
                      className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
                        isPredicted
                          ? "bg-gray-100 text-gray-600"
                          : noisePercent >= 80
                            ? "bg-purple-100 text-purple-800"
                            : noisePercent >= 50
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      🔊 騒音度 {noisePercent}%{isPredicted ? "(予測)" : ""}
                    </span>
                  )}
                </div>
                {staticBadges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {staticBadges.map((badge) => (
                      <span
                        key={badge.key}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.className}`}
                      >
                        {badge.emoji} {badge.label}
                      </span>
                    ))}
                  </div>
                )}
                {/* カードのどこを押しても詳細へ飛ぶので、専用のリンクは
                    置かない。押せることが伝わるよう表示だけ残す */}
                <div className="self-start text-xs text-blue-600 font-semibold">
                  📄 タップで詳細
                </div>
              </div>
            );
          })}
        </div>
      )}
        {/* 食べログ等と同じ「この範囲で再検索」ボタン。地図をドラッグ/
            ズームしただけではピンを更新せず、これをタップした時だけ
            表示中の範囲でピンを再検索する */}
        {hasMapDrifted && (
          <button
            onClick={handleResearchThisArea}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 shadow-lg border border-blue-200 hover:bg-blue-50"
          >
            <span>↻</span>
            <span>{t("map.researchButton")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
