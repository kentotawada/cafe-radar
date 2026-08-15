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
  favorites: Set<string>
): boolean {
  if (f.favoritesOnly && !favorites.has(cafe.id)) return false;
  if (f.outlet && !hasOutlet(cafe)) return false;
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

// note は「利用者の報告が要る条件」の印。0件だったときに
// 「該当が無い」のか「まだ誰も報告していない」のかを見分けられるようにする
export const FILTER_LABELS_EN: FilterLabel[] = [
  { key: "outlet", label: "🔌 Outlets" },
  { key: "outletAllSeats", label: "🔌 All seats" },
  { key: "wifi", label: "📶 Wi-Fi" },
  { key: "nonSmoking", label: "🚭 Non-smoking" },
  { key: "smokingOk", label: "🚬 Smoking OK" },
  { key: "outletFree", label: "⚡ Outlet free", note: "reported" },
  { key: "quiet", label: "🔇 Quiet", note: "reported" },
  { key: "favoritesOnly", label: "★ Favorites" },
];

export const FILTER_LABELS: FilterLabel[] = [
  { key: "outlet", label: "🔌 電源あり" },
  { key: "outletAllSeats", label: "🔌 全席に電源" },
  { key: "wifi", label: "📶 Wi-Fiあり" },
  { key: "nonSmoking", label: "🚭 禁煙" },
  { key: "smokingOk", label: "🚬 喫煙可" },
  { key: "outletFree", label: "⚡ 電源席に空き", note: "報告" },
  { key: "quiet", label: "🔇 静か", note: "報告" },
  { key: "favoritesOnly", label: "★ お気に入り" },
];
