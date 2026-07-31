export type NoiseLevel = "quiet" | "normal" | "noisy" | "loud";
export type OccupancyLevel = "empty" | "sparse" | "moderate" | "full";

// カフェの利用シーン・滞在スタイルによる分類(店名から推定、編集部調べ)。
// チェーン=気軽に入れる・短時間利用、コワーキング=フルタイム作業向け、
// 個人経営/おしゃれ=気分転換・ゆったり作業、深夜=夜間・早朝のノマド利用
export type CafeUsageStyle = "chain" | "coworking" | "independent" | "night";

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
  outlet_seat_count: number | null;
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
export type LandmarkCategory =
  | "station_exit"
  | "building"
  | "school"
  | "bank"
  | "conveni_seven"
  | "conveni_lawson"
  | "conveni_familymart"
  | "traffic_signal"
  | "restaurant"
  | "drugstore"
  | "other";

export type Landmark = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: LandmarkCategory;
};
