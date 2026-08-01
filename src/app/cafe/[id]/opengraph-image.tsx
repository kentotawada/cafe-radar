import { ImageResponse } from "next/og";
import { lookupCafeById, nearestAreaName } from "@/lib/lookupCafe";
import { hasOutlet } from "@/lib/cafeAmenities";
import { hasWifi } from "@/lib/cafeStats";

export const alt = "カフェレーダー";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cafe = await lookupCafeById(id);
  const name = cafe?.name ?? "お店が見つかりません";
  const area = cafe ? nearestAreaName(cafe.lat, cafe.lng) : "";

  // outletInfo/wifiInfoは「電源なし」のような否定テキストも含む自由記述
  // なので、単純な真偽値判定ではなくcafeAmenities/cafeStatsの正規表現
  // 判定(バッジ表示と同じ基準)を使ってタグの正確さを揃える
  const tags = cafe
    ? [
        hasOutlet(cafe) ? { emoji: "🔌", label: "電源あり", bg: "#dbeafe", fg: "#1d4ed8" } : null,
        hasWifi(cafe) ? { emoji: "📶", label: "Wi-Fiあり", bg: "#e0f2fe", fg: "#0369a1" } : null,
      ].filter((tag): tag is { emoji: string; label: string; bg: string; fg: string } => Boolean(tag))
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="56" height="56" viewBox="0 0 32 32">
            <rect x="2" y="14" width="19" height="14" rx="3" fill="#7B4B27" />
            <rect x="2" y="14" width="19" height="4" rx="2" fill="#C88A50" />
            <path
              d="M21 17h3a3 3 0 0 1 0 6h-3v-3h3a0.5 0.5 0 0 0 0-1h-3z"
              fill="#7B4B27"
            />
            <polygon
              points="27,1 20,10 24,10 22,16 30,7 25,7"
              fill="#FFC93C"
              stroke="#7B4B27"
              strokeWidth="1"
            />
          </svg>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb" }}>
            カフェレーダー
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {area && (
            <div style={{ fontSize: 32, color: "#6b7280" }}>{`${area}周辺`}</div>
          )}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            {name}
          </div>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {tags.map((tag) => (
                <div
                  key={tag.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 28,
                    fontWeight: 700,
                    color: tag.fg,
                    background: tag.bg,
                    borderRadius: 999,
                    padding: "8px 24px",
                  }}
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
