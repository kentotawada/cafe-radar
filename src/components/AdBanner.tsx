"use client";

import { useEffect, useRef, useState } from "react";

type AdBannerProps = {
  /** 管理画面や計測で枠を区別するためのラベル(表示はしない) */
  slot: string;
  className?: string;
  /** レイアウトシフト防止のため確保する高さ。地図ポップアップのような
   * 狭い場所では小さめの値を渡す(デフォルトは通常の記事下枠向け) */
  minHeight?: number;
};

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

// 審査前・開発環境・広告ブロッカー使用時は「スポンサー枠」のプレース
// ホルダーを表示し、AdSenseが実際に配信できる時だけ本物の広告に差し替える。
// どちらの状態でも同じ高さを確保するのでCLSは発生しない
export default function AdBanner({
  slot,
  className = "",
  minHeight: AD_MIN_HEIGHT = 100,
}: AdBannerProps) {
  const insRef = useRef<HTMLModElement>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const isProd = process.env.NODE_ENV === "production";
  const canServeAds = isProd && Boolean(ADSENSE_ID);

  useEffect(() => {
    if (!canServeAds) return;
    try {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // adsbygoogle.jsが未読込(広告ブロッカー等)の場合はここに来る。
      // プレースホルダー表示のままにしておく
      return;
    }

    // Googleが配信可否を決めるまで少し時間がかかるため、data-ad-status
    // (unfilled/filled)を見てから初めてプレースホルダーを消す
    const timer = setTimeout(() => {
      const status = insRef.current?.getAttribute("data-ad-status");
      if (status === "filled") setShowPlaceholder(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [canServeAds]);

  return (
    <div
      data-ad-slot-name={slot}
      className={`relative w-full overflow-hidden rounded-lg ${className}`}
      style={{ minHeight: AD_MIN_HEIGHT }}
    >
      {canServeAds && (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", minHeight: AD_MIN_HEIGHT }}
          data-ad-client={ADSENSE_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
      {showPlaceholder && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 border border-dashed border-gray-300 bg-gray-50 rounded-lg text-gray-400"
          style={{ minHeight: AD_MIN_HEIGHT }}
        >
          <span className="text-[10px] tracking-wide uppercase">Sponsored</span>
          <span className="text-xs">スポンサー枠</span>
        </div>
      )}
    </div>
  );
}
