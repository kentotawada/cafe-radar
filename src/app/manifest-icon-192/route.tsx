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
        <svg width="130" height="130" viewBox="0 0 32 32">
          <rect x="2" y="14" width="19" height="14" rx="3" fill="#ffffff" />
          <rect x="2" y="14" width="19" height="4" rx="2" fill="#dbeafe" />
          <path
            d="M21 17h3a3 3 0 0 1 0 6h-3v-3h3a0.5 0.5 0 0 0 0-1h-3z"
            fill="#ffffff"
          />
          <polygon
            points="27,1 20,10 24,10 22,16 30,7 25,7"
            fill="#FFC93C"
            stroke="#ffffff"
            strokeWidth="1"
          />
        </svg>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
