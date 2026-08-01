"use client";

import { useState } from "react";

type ShareButtonsProps = {
  title: string;
};

// お店の個別ページからSNSへ共有するボタン。URLは常にその場のページURL
// (window.location.href)を使うので、開発/本番どちらの環境でも正しく動く
export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const shareOnX = () => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.set("text", title);
    url.searchParams.set("url", window.location.href);
    window.open(url.toString(), "_blank", "noopener,noreferrer,width=560,height=520");
  };

  const shareOnLine = () => {
    const url = new URL("https://social-plugins.line.me/lineit/share");
    url.searchParams.set("url", window.location.href);
    window.open(url.toString(), "_blank", "noopener,noreferrer,width=560,height=520");
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    setTimeout(() => setCopyStatus("idle"), 2500);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <button
          onClick={shareOnX}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
        >
          <span aria-hidden>𝕏</span> Xでシェア
        </button>
        <button
          onClick={shareOnLine}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm border border-green-300 rounded-lg px-3 py-2 text-green-700 hover:bg-green-50"
        >
          <span aria-hidden>💬</span> LINEで送る
        </button>
        <button
          onClick={copyUrl}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
        >
          <span aria-hidden>🔗</span> URLをコピー
        </button>
      </div>
      {copyStatus === "copied" && (
        <p className="text-xs text-green-600">コピーしました</p>
      )}
      {copyStatus === "error" && (
        <p className="text-xs text-red-600">コピーに失敗しました</p>
      )}
    </div>
  );
}
