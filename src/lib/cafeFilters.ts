import type { Cafe } from "@/lib/seedCafes";
import type { CafeStats } from "@/lib/types";
import { hasOutlet } from "@/lib/cafeAmenities";
import {
  hasWifi,
  isNonSmoking,
  isSmokingOk,
  inferPowerSupplyTier,
  pickMajority,
} from "@/lib/cafeStats";

// 絞り込みの条件と判定。CafeMap.tsx の中に書かれていたものを、
// Googleマップ版からも同じ条件で使えるように切り出した。
//
// 判定を1か所にしておかないと、2つの地図で「電源あり」の意味が
// 微妙に食い違う。今日 Leaflet 版で直した「電源席フィルタが常に0件」も
// この判定の中にあった問題だった。
export type CafeFilters = {
  /** 編集部調べで電源がある店だけ */
  outlet: boolean;
  /** 電源席に空きがある(利用者の報告が必要) */
  outletFree: boolean;
  wifi: boolean;
  nonSmoking: boolean;
  smokingOk: boolean;
  /** 静かだという報告がある店だけ */
  quiet: boolean;
  /** 全席に電源がありそうな店だけ */
  outletAllSeats: boolean;
  favoritesOnly: boolean;
};

export const EMPTY_FILTERS: CafeFilters = {
  outlet: false,
  outletFree: false,
  wifi: false,
  nonSmoking: false,
  smokingOk: false,
  quiet: false,
  outletAllSeats: false,
  favoritesOnly: false,
};

export function isFiltering(f: CafeFilters): boolean {
  return Object.values(f).some(Boolean);
}

export function countActive(f: CafeFilters): number {
  return Object.values(f).filter(Boolean).length;
}

export function passesFilters(
  cafe: Cafe,
  f: CafeFilters,
  stats: CafeStats | null,
  favorites: Set<string>,
  // 編集部調べでは未確認でも、管理者が承認した電源報告がある店
  verifiedOutletIds?: Set<string>
): boolean {
  if (f.favoritesOnly && !favorites.has(cafe.id)) return false;
  if (f.outlet && !hasOutlet(cafe, verifiedOutletIds)) return false;
  if (f.wifi && !hasWifi(cafe)) return false;
  if (f.nonSmoking && !isNonSmoking(cafe)) return false;
  if (f.smokingOk && !isSmokingOk(cafe)) return false;
  if (f.outletAllSeats && inferPowerSupplyTier(cafe) !== "all") return false;

  // ここから下は利用者の報告が要る条件。報告が無い店は「空いている」とも
  // 「静か」とも言えないので、条件を選んでいる時は落とす
  if (f.outletFree) {
    if (!stats) return false;
    if (pickMajority(stats.outletOccupancyCounts) === "full") return false;
  }
  if (f.quiet) {
    if (!stats) return false;
    if (pickMajority(stats.noiseCounts) !== "quiet") return false;
  }
  return true;
}

export type FilterLabel = { key: keyof CafeFilters; label: string; note?: string };

// 言葉は短く、その場で意味が分かるものにする。
//
// 実地で使ってもらったところ「電源席に空き」「静か」が何を指すのか
// 分からないという指摘があった。どちらも「今この店にいる人の報告が
// 無いと出てこない」条件で、そこが伝わっていなかった。
// note に「いま」と付けて、リアルタイムの話だと分かるようにする。
//
// 「全席に電源」は店名からの推測でしかなく、使わないので消した。
export const FILTER_LABELS_EN: FilterLabel[] = [
  { key: "outlet", label: "🔌 Power" },
  { key: "wifi", label: "📶 Wi-Fi" },
  { key: "nonSmoking", label: "🚭 No smoking" },
  { key: "smokingOk", label: "🚬 Smoking OK" },
  { key: "outletFree", label: "⚡ Power seat open", note: "now" },
  { key: "quiet", label: "🔇 Quiet now", note: "now" },
  { key: "favoritesOnly", label: "🔖 Saved" },
];

export const FILTER_LABELS: FilterLabel[] = [
  { key: "outlet", label: "🔌 電源" },
  { key: "wifi", label: "📶 Wi-Fi" },
  { key: "nonSmoking", label: "🚭 禁煙" },
  { key: "smokingOk", label: "🚬 喫煙可" },
  { key: "outletFree", label: "⚡ 電源席が空いてる", note: "いま" },
  { key: "quiet", label: "🔇 静か", note: "いま" },
  { key: "favoritesOnly", label: "🔖 保存した店" },
];
