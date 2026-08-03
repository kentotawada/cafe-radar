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
          <rect x="4" y="11" width="19" height="16" rx="3" fill="#ffffff" />
          <path
            d="M23 14a6 6 0 0 1 0 12"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <polygon
            points="18,8 9,19 14,19 11,29 24,16 18,16"
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
