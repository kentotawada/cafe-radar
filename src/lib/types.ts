export type NoiseLevel = "quiet" | "normal" | "loud";
export type OccupancyLevel = "empty" | "moderate" | "full";

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

export type CafeStats = {
  totalReporters: number;
  outletOccupancyCounts: Record<OccupancyLevel, number>;
  seatingOccupancyCounts: Record<OccupancyLevel, number>;
  noiseCounts: Record<NoiseLevel, number>;
  latestAt: string;
};
