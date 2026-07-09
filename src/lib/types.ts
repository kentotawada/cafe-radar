export type NoiseLevel = "quiet" | "normal" | "loud";

export type Report = {
  id: string;
  cafe_id: string;
  outlet_available: boolean;
  noise_level: NoiseLevel;
  note: string | null;
  created_at: string;
};

export type CafeStats = {
  totalReports: number;
  availableCount: number;
  noiseCounts: Record<NoiseLevel, number>;
  latestNote: string | null;
  latestAt: string;
};
