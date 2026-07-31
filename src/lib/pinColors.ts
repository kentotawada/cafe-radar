import type { NoiseLevel } from "@/lib/types";

// unknown(まだ誰も報告していない状態)は、暗い色だと「閉店している」
// ように見えてしまうため、コーヒーのミルクを思わせる明るく温かみのある
// 色にし、他の混雑度の色(緑〜赤)とははっきり区別できるようにする
export const PIN_COLORS: Record<NoiseLevel | "full" | "unknown", string> = {
  unknown: "#e8c39e",
  quiet: "#16a34a",
  normal: "#2563eb",
  noisy: "#ca8a04",
  loud: "#d97706",
  full: "#dc2626",
};

export const PIN_LEGEND: { key: keyof typeof PIN_COLORS; label: string }[] = [
  { key: "quiet", label: "空きあり・静か" },
  { key: "normal", label: "空きあり・普通" },
  { key: "noisy", label: "空きあり・ややうるさい" },
  { key: "loud", label: "空きあり・うるさい" },
  { key: "full", label: "満席" },
  { key: "unknown", label: "レポート待ち" },
];
