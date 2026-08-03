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
          background: "#2563eb",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 32 32">
          <path
            d="M8 3.5c-1.3 1.5 1.3 2.3 0 3.8"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M13 2.2c-1.3 1.5 1.3 2.3 0 3.8"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M18 3.5c-1.3 1.5 1.3 2.3 0 3.8"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <rect x="4" y="13" width="19" height="14" rx="3" fill="#ffffff" />
          <path
            d="M23 16a5 5 0 0 1 0 10"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <polygon
            points="18,10 9,20 14,20 11,29 24,17 18,17"
            fill="#FFC93C"
            stroke="#1e3a8a"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
