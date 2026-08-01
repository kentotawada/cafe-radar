"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const DISMISSED_KEY = "cafe-radar-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// favorites.tsと同じ「サーバーは常にfalse、クライアントはtrue」パターン。
// window/localStorageに触れるのはmounted===trueの時だけにして、effect内で
// setStateする代わりにhydration後の描画で直接判定する
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

// ホーム画面追加を案内する小さなバナー。Android/Chromeはbeforeinstallprompt
// を横取りしてワンタップ導線を出し、iOS Safariはbeforeinstallprompt自体が
// 無いため「共有→ホーム画面に追加」の手順を文章で案内する
export default function InstallPromptBanner() {
  const mounted = useMounted();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedByUser, setDismissedByUser] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const dismiss = () => {
    setDismissedByUser(true);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") dismiss();
    setDeferredPrompt(null);
  };

  if (!mounted) return null;
  if (isStandalone()) return null;
  if (dismissedByUser || localStorage.getItem(DISMISSED_KEY) === "1") return null;

  const isIOS =
    /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
    !("MSStream" in window);

  // Android: beforeinstallpromptが発火するまでは案内できることが無いので出さない。
  // iOS: beforeinstallpromptが存在しないため、手順の案内だけは出す
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex items-center gap-3">
        <div className="text-2xl shrink-0" aria-hidden>
          📲
        </div>
        <div className="flex-1 min-w-0 text-sm text-gray-700">
          {isIOS ? (
            <p>
              ホーム画面に追加するとアプリのようにすぐ開けます。共有ボタン
              <span aria-hidden> ⎋ </span>
              から「ホーム画面に追加」を選んでください。
            </p>
          ) : (
            <p>カフェレーダーをホーム画面に追加して、すぐに開けるようにしますか？</p>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          {!isIOS && (
            <button
              onClick={install}
              className="text-xs font-semibold bg-blue-600 text-white rounded-full px-3 py-1.5 hover:bg-blue-700"
            >
              追加する
            </button>
          )}
          <button
            onClick={dismiss}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
