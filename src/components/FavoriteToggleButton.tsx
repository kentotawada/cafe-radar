"use client";

import { toggleFavorite, useFavoriteIds } from "@/lib/favorites";

// /cafe/[id]はサーバーコンポーネントなので、localStorageを使う
// お気に入りボタンだけをクライアントアイランドとして切り出す
export default function FavoriteToggleButton({ cafeId }: { cafeId: string }) {
  const favoriteIds = useFavoriteIds();
  const isFavorite = favoriteIds.includes(cafeId);

  return (
    <button
      onClick={() => toggleFavorite(cafeId)}
      className={`flex items-center gap-1 text-sm rounded-full border px-3 py-1.5 ${
        isFavorite
          ? "border-yellow-400 bg-yellow-50 text-yellow-600"
          : "border-gray-300 text-gray-500"
      }`}
    >
      <span className="text-base leading-none">★</span>
      {isFavorite ? "お気に入り済み" : "お気に入りに追加"}
    </button>
  );
}
