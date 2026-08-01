import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "cafe-radar-favorites";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

export function getFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function toggleFavorite(cafeId: string): Set<string> {
  const favorites = getFavorites();
  if (favorites.has(cafeId)) {
    favorites.delete(cafeId);
  } else {
    favorites.add(cafeId);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  emitChange();
  return favorites;
}

// サーバーコンポーネントのページ(/cafe/[id]、/favorites)からお気に入りを
// 読む時、localStorageはサーバー側に存在しないため、useEffect内で
// setStateすると初回描画(サーバー)とハイドレーション後の描画がずれて
// しまう。useSyncExternalStoreを使えば、サーバー側は常に空、
// クライアント側はlocalStorageの実際の値を安全に返せる
function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

export function useFavoriteIds(): string[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // JSON.parseは呼ぶたびに新しい配列を作ってしまい、rawが同じでも
  // 参照が変わるため、これをuseEffectの依存配列に使うと無限ループに
  // つながる。rawが変わらない限り同じ配列を返すようにする
  return useMemo(() => {
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }, [raw]);
}
