"use client";

import { useRouter } from "next/navigation";

// 「前のページに戻る」ボタン。店舗詳細 → エリア一覧 と進んだ後、
// 元の店舗ページへ戻れる手段が無かったため追加した。
//
// 検索や共有リンクでこのページを直接開いた場合は戻り先が無いので、
// その時だけ fallbackHref へ送る。判定は押された瞬間に行う
// (effectでstateに持つとレンダー中の更新になり、その時点の履歴とも
// ずれる。押した時に window.history を見るのが一番確実)。
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
        // タブを開いた直後は1。それより多ければ戻れる履歴がある
        if (window.history.length > 1) {
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
