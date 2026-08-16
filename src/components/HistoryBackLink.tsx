"use client";

import { useRouter } from "next/navigation";

// 「前のページに戻る」ボタン。店舗詳細 → エリア一覧 と進んだ後、
// 元の店舗ページへ戻れる手段が無かったため追加した。
//
// 戻ってよいのは「このサイトの中から来たとき」だけ。
//
// 以前は window.history.length > 1 で判定していたが、これはタブ全体の
// 履歴の長さで、同じタブで前に開いていた別サイトも数に入る。そのため
// 検索や共有リンクからこのページに来た人が押すと、まったく別のサイトへ
// 飛んでしまっていた(実際に別アプリへ戻ってしまう報告があった)。
//
// document.referrer が同じオリジンなら、直前のページはこのサイト。
// それ以外は戻り先が無いものとして fallbackHref へ送る。
// 判定は押された瞬間に行う(effectでstateに持つとレンダー中の更新になる)。
function cameFromThisSite(): boolean {
  const ref = document.referrer;
  if (!ref) return false;
  try {
    return new URL(ref).origin === window.location.origin;
  } catch {
    return false;
  }
}

export default function HistoryBackLink({
  fallbackHref,
  className,
  children,
}: {
  fallbackHref: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (cameFromThisSite()) {
          router.back();
          return;
        }
        router.push(fallbackHref);
      }}
      className={className}
    >
      {children}
    </button>
  );
}
