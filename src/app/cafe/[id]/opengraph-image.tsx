import { ImageResponse } from "next/og";
import { lookupCafeById, nearestAreaName } from "@/lib/lookupCafe";

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

  const infoLine = cafe
    ? [
        cafe.outletInfo ? "🔌 電源あり" : null,
        cafe.wifiInfo ? "📶 Wi-Fiあり" : null,
        cafe.smokingInfo ? "🚬 喫煙情報あり" : null,
      ]
        .filter(Boolean)
        .join("　")
    : "";

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
          {infoLine && (
            <div style={{ fontSize: 32, color: "#374151", marginTop: 8 }}>
              {infoLine}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
