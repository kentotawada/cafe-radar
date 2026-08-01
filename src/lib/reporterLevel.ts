// 報告(reports)の投稿数に応じて、称号とキャラの育成段階(stage)を決める。
// 実店舗クーポンのような運営コストのかかる報酬ではなく、匿名のまま
// コード側だけで完結するゲーミフィケーションとして採用した

export type ReporterLevel = {
  level: number;
  title: string;
  emoji: string;
  stage: number;
  minCount: number;
  nextAt: number | null;
};

const LEVELS: { minCount: number; title: string; emoji: string; stage: number }[] = [
  { minCount: 0, title: "新米レポーター", emoji: "🌱", stage: 1 },
  { minCount: 3, title: "見習いレポーター", emoji: "☕", stage: 2 },
  { minCount: 8, title: "頼れるレポーター", emoji: "🔍", stage: 3 },
  { minCount: 16, title: "ベテランレポーター", emoji: "🏅", stage: 4 },
  { minCount: 31, title: "カフェレーダーの主", emoji: "👑", stage: 5 },
];

export function levelForReportCount(count: number): ReporterLevel {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (count >= LEVELS[i].minCount) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  return {
    level: index + 1,
    title: current.title,
    emoji: current.emoji,
    stage: current.stage,
    minCount: current.minCount,
    nextAt: next ? next.minCount : null,
  };
}
