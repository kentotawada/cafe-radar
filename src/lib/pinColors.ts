import type { NoiseLevel } from "@/lib/types";

export const PIN_COLORS: Record<NoiseLevel | "full" | "unknown", string> = {
  unknown: "#4b5563",
  quiet: "#16a34a",
  normal: "#2563eb",
  loud: "#d97706",
  full: "#dc2626",
};

export const PIN_LEGEND: { key: keyof typeof PIN_COLORS; label: string }[] = [
  { key: "quiet", label: "空きあり・静か" },
  { key: "normal", label: "空きあり・普通" },
  { key: "loud", label: "空きあり・うるさい" },
  { key: "full", label: "満席" },
  { key: "unknown", label: "情報なし" },
];
