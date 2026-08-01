import type { Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import type {
  CafeStats,
  NoiseLevel,
  OccupancyLevel,
  PowerSupplyTier,
  Report,
} from "@/lib/types";

// CafeMapのバッジ表示・絞り込みフィルターと、店舗ごとの共有ページ
// (src/app/cafe/[id])の両方で同じ判定基準を使うための共通化

export function dedupeByReporter<
  T extends { reporter_id: string | null; id: string },
>(items: T[]): T[] {
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

export function pickMajority<T extends string>(counts: Record<T, number>): T {
  return (Object.keys(counts) as T[]).reduce((a, b) =>
    counts[b] > counts[a] ? b : a
  );
}

// Wi-Fi速度・WEB会議可否など、みんなの投稿を単純多数決で集計する時に使う
export function pickMajorityFromList<T extends string>(items: T[]): T | null {
  if (items.length === 0) return null;
  const counts = new Map<T, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  let best = items[0];
  let bestCount = 0;
  for (const [item, count] of counts) {
    if (count > bestCount) {
      best = item;
      bestCount = count;
    }
  }
  return best;
}

// 電源席の配置(全席/カウンターのみ/わずか/なし)を、編集部調べの
// outletInfoテキストから正規表現で推測する。実測ではなくあくまで目安
export function inferPowerSupplyTier(cafe: Cafe): PowerSupplyTier | null {
  if (!cafe.outletInfo) return null;
  if (!hasOutlet(cafe)) return "none";
  const text = cafe.outletInfo;
  if (/全席|全店舗|全テーブル|全カウンター|ほぼ全/.test(text)) return "all";
  if (
    /(カウンター|窓際)[^。、]*(のみ|だけ)|入口付近の(カウンター席|カウンター)のみ/.test(
      text
    )
  ) {
    return "counter";
  }
  if (/一部|数席|わずか|要確認|程度|2席|3席|4席|5席/.test(text)) return "few";
  return null;
}

export function computeStats(reports: Report[]): CafeStats | null {
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

// 過去の報告の中から、「今」と同じ曜日・近い時間帯(前後2時間)のものだけ
// 抜き出す。ライブの報告が無い時間帯でも、傾向から予測を出すために使う
export function filterSimilarTimeSlot(reports: Report[], now: Date): Report[] {
  const targetDay = now.getDay();
  const targetHour = now.getHours();
  return reports.filter((report) => {
    const d = new Date(report.created_at);
    if (d.getDay() !== targetDay) return false;
    const diff = Math.abs(d.getHours() - targetHour);
    return Math.min(diff, 24 - diff) <= 2;
  });
}

const NIGHT_NAME_PATTERNS = /24\s*時間|24H|深夜|オールナイト/i;

export function isNonSmoking(cafe: Cafe): boolean {
  if (!cafe.smokingInfo) return false;
  return /全席禁煙|全店舗?禁煙|敷地内.*禁煙|喫煙(所|ブース)なし/.test(cafe.smokingInfo);
}

export function isSmokingOk(cafe: Cafe): boolean {
  if (!cafe.smokingInfo) return false;
  return /喫煙(ブース|室|目的室|席)|喫煙可|分煙/.test(cafe.smokingInfo);
}

export function hasWifi(cafe: Cafe): boolean {
  if (!cafe.wifiInfo) return false;
  return !/Wi-?Fi.*(なし|不可)/i.test(cafe.wifiInfo);
}

export function isLateNight(cafe: Cafe): boolean {
  return Boolean(
    NIGHT_NAME_PATTERNS.test(cafe.name) ||
      (cafe.hoursInfo && NIGHT_NAME_PATTERNS.test(cafe.hoursInfo))
  );
}

export type QuickBadge = {
  key: string;
  emoji: string;
  label: string;
  className: string;
};

// ポップアップ・共有ページの両方で、電源・喫煙・騒がしさ・混雑度が
// ひと目でわかるように横一列のバッジを出す。編集部調べのテキストからは
// 正規表現で簡易判定し、騒がしさ・混雑度はユーザー報告の集計(stats)から判定する
export function getQuickBadges(
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

  if (inferPowerSupplyTier(cafe) === "all") {
    badges.push({
      key: "powersupply-all",
      emoji: "🔌",
      label: "全席電源(推測)",
      className: "bg-blue-50 text-blue-700",
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
