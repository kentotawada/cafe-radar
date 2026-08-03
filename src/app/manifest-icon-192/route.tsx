import { ImageResponse } from "next/og";

// PWAのホーム画面アイコン(192x192)。apple-icon.tsxと同じカップ+電源の
// 意匠を、Androidのインストール可否判定で求められるPNGとして生成する
export async function GET() {
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
    { width: 192, height: 192 }
  );
}
