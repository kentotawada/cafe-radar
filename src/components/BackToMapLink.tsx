"use client";

import { useRouter } from "next/navigation";
import { FROM_MAP_KEY } from "@/lib/mapNavigation";

// 詳細ページの「地図で見る」。以前は <Link href="/"> で、押すたびに新しい
// 履歴が積まれていた。地図→詳細→地図 の3件になるため、そこからブラウザの
// 戻るを押すと詳細ページに逆戻りし、2回押さないと地図から抜けられなかった。
//
// 地図から来た場合は履歴を1つ戻る。こうするとブラウザが元のページ状態を
// 復元してくれる。検索や共有リンクで直接このページを開いた場合は戻り先が
// 無いので、通常どおり地図へ遷移する。
export default function BackToMapLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    let cameFromMap = false;
    try {
      cameFromMap = window.sessionStorage.getItem(FROM_MAP_KEY) === "1";
      // 使い切りにする。次に検索などから直接この詳細ページを開いた時に、
      // 関係の無い履歴へ戻してしまわないようにするため
      window.sessionStorage.removeItem(FROM_MAP_KEY);
    } catch {
      // 読めない場合は素直に地図へ遷移する
    }
    if (cameFromMap) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
