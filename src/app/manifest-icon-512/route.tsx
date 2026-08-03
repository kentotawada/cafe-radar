import { ImageResponse } from "next/og";

// PWAのホーム画面アイコン(512x512)。maskable用途にも使えるよう、
// 意匠の周りに十分な余白を持たせている
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
        <svg width="340" height="340" viewBox="0 0 32 32">
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
    { width: 512, height: 512 }
  );
}
