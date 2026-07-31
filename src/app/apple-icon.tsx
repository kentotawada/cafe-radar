import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS Safariのホーム画面追加アイコン。favicon(icon.svg)と同じ
// カップ+電源の意匠を、余白を持たせた正方形キャンバスで再現する
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg width="130" height="130" viewBox="0 0 32 32">
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
      </div>
    ),
    { ...size }
  );
}
