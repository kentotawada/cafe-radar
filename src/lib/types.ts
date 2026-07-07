export type NoiseLevel = "quiet" | "normal" | "loud";

export type Report = {
  id: string;
  cafe_id: string;
  outlet_available: boolean;
  noise_level: NoiseLevel;
  created_at: string;
};

export type CafeStatus = {
  outlet_available: boolean;
  noise_level: NoiseLevel;
  created_at: string;
  isStale: boolean;
};
