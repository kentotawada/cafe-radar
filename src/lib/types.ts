export type NoiseLevel = "quiet" | "normal" | "loud";

export type Report = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  outlet_available: boolean;
  seating_available: boolean;
  noise_level: NoiseLevel;
  note: string | null;
  created_at: string;
};

export type CafeStats = {
  totalReporters: number;
  availableCount: number;
  seatingAvailableCount: number;
  noiseCounts: Record<NoiseLevel, number>;
  latestNote: string | null;
  latestAt: string;
};
