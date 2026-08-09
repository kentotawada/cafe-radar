import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import InstallPromptBanner from "@/components/InstallPromptBanner";

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
        {children}
        <InstallPromptBanner />
        {/* 実ユーザーの表示速度(Web Vitals)をVercelに送る。カフェ件数を増やした
            影響がモバイルで出ていないかを実測で判断するために入れている */}
        <SpeedInsights />
        {/* パブリッシャーIDが未設定の間はスクリプトを読み込まない。
            審査中はコードを貼ったままにする必要がある(Googleのクローラーが
            これを使ってサイトを確認するため、外すと審査が進まない)。
            承認前は広告自体が配信されずunfilledが返るだけなので、
            置いておくこと自体は問題にならない */}
        {ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
