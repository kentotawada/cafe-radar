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
        {/* AdSenseの審査が通り、パブリッシャーIDが設定されるまではスクリプトを
            読み込まない(未審査サイトへの広告配信はポリシー違反になるため) */}
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
