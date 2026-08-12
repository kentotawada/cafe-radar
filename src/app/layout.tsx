import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import InstallPromptBanner from "@/components/InstallPromptBanner";
import PreloadResources from "@/components/PreloadResources";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "カフェレーダー",
    template: "%s | カフェレーダー",
  },
  description: "カフェの混雑度・電源・Wi-Fiをリアルタイムでチェック",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "カフェレーダー",
  },
  openGraph: {
    siteName: "カフェレーダー",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Search Consoleの所有権確認用。<meta name="google-site-verification">として
  // 出力される。確認が済んだ後も、外すと所有権が失われるため残しておくこと
  verification: {
    google: "FmYW6GIGbBfsUJ0SVa0NnQyK3wqZS1aFSvvASHZMrfY",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 地図タイル・Supabaseへの接続を先に張っておく。詳細は
            PreloadResources.tsx のコメントを参照 */}
        <PreloadResources />
        {children}
        <InstallPromptBanner />
        {/* 実ユーザーの表示速度(Web Vitals)をVercelに送る。カフェ件数を増やした
            影響がモバイルで出ていないかを実測で判断するために入れている */}
        <SpeedInsights />
        {/* どのページに人が来ているかを記録する。これが無いと
            「英語圏に寄せるか、日本語検索を待つか」を判断する材料が
            Redditのコメント数しか無くなる。Cookieを使わない方式なので
            同意バナーは不要 */}
        <Analytics />
        {/* パブリッシャーIDが未設定の間はスクリプトを読み込まない。
            審査中はコードを貼ったままにする必要がある(Googleのクローラーが
            これを使ってサイトを確認するため、外すと審査が進まない)。
            承認前は広告自体が配信されずunfilledが返るだけなので、
            置いておくこと自体は問題にならない */}
        {/* next/scriptのScriptは、afterInteractiveでもbeforeInteractiveでも
            サーバーHTMLにはpreloadリンクとNext内部のキュー(__next_s)しか
            出力せず、実体の<script>はJS実行後に挿入される。AdSenseの所有権
            確認はHTMLを取得して判定するため、それでは検出されない。
            素の<script async>として書くとReactがそのままHTMLに描画するので、
            クローラーからも見える。ここはScriptコンポーネントに戻さないこと */}
        {ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
