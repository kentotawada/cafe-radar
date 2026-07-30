export type NoiseLevel = "quiet" | "normal" | "noisy" | "loud";
export type OccupancyLevel = "empty" | "sparse" | "moderate" | "full";

export type Report = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  outlet_occupancy: OccupancyLevel;
  seating_occupancy: OccupancyLevel;
  noise_level: NoiseLevel;
  created_at: string;
};

// 「電源席の場所」「だいたいの座席数」など、その場の混雑度と違って
// 時間が経っても変わらない情報。30分で消える reports とは別に、ずっと残す。
export type CafeFact = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  note: string | null;
  seat_count: number | null;
  created_at: string;
};

// ユーザーが追加した店舗に対する「存在しない・間違っている」という報告
export type CafeFlag = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  created_at: string;
};

export type CafeStats = {
  totalReporters: number;
  outletOccupancyCounts: Record<OccupancyLevel, number>;
  seatingOccupancyCounts: Record<OccupancyLevel, number>;
  noiseCounts: Record<NoiseLevel, number>;
  latestAt: string;
};

// Googleマップと見比べて調べた主要な目印(駅出口・有名な建物・学校など)。
// カフェのピンとは別の控えめな見た目で地図に重ね、周辺の位置関係が
// つかみやすいようにする(編集部調べ、クラウドソースの報告対象ではない)
export type LandmarkCategory = "station_exit" | "building" | "school" | "other";

export type Landmark = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: LandmarkCategory;
};
