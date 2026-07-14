export type NoiseLevel = "quiet" | "normal" | "loud";
export type OccupancyLevel = "empty" | "moderate" | "full";

export type Report = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  outlet_occupancy: OccupancyLevel;
  seating_occupancy: OccupancyLevel;
  noise_level: NoiseLevel;
  note: string | null;
  created_at: string;
};

export type CafeStats = {
  totalReporters: number;
  outletOccupancyCounts: Record<OccupancyLevel, number>;
  seatingOccupancyCounts: Record<OccupancyLevel, number>;
  noiseCounts: Record<NoiseLevel, number>;
  latestNote: string | null;
  latestAt: string;
};
