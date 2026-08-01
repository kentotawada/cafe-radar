"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { supabase } from "@/lib/supabaseClient";
import { toggleFavorite, useFavoriteIds } from "@/lib/favorites";
import { getQuickBadges } from "@/lib/cafeStats";

export default function FavoritesPage() {
  const favoriteIds = useFavoriteIds();
  const [cafes, setCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCafes() {
      if (favoriteIds.length === 0) {
        setCafes([]);
        return;
      }
      const idSet = new Set(favoriteIds);
      const fromSeed = seedCafes.filter((cafe) => idSet.has(cafe.id));
      const foundIds = new Set(fromSeed.map((cafe) => cafe.id));
      const remainingIds = favoriteIds.filter((id) => !foundIds.has(id));

      let fromDynamic: Cafe[] = [];
      if (remainingIds.length > 0 && supabase) {
        const { data } = await supabase
          .from("cafes")
          .select("*")
          .in("id", remainingIds);
        fromDynamic = (data as Cafe[]) ?? [];
      }

      const byId = new Map(
        [...fromSeed, ...fromDynamic].map((cafe) => [cafe.id, cafe])
      );
      const ordered = favoriteIds
        .map((id) => byId.get(id))
        .filter((cafe): cafe is Cafe => cafe !== undefined);
      if (!cancelled) setCafes(ordered);
    }

    loadCafes();
    return () => {
      cancelled = true;
    };
  }, [favoriteIds]);

  function handleRemove(cafeId: string) {
    toggleFavorite(cafeId);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="text-sm text-blue-600 underline">
          ← カフェレーダーに戻る
        </Link>
      </header>
      <main className="p-4 max-w-xl mx-auto flex flex-col gap-3">
        <h1 className="text-lg font-bold text-gray-900">
          ★ お気に入り{cafes.length > 0 ? `(${cafes.length}件)` : ""}
        </h1>

        {favoriteIds.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center flex flex-col gap-2">
            <div className="text-sm text-gray-500">
              まだお気に入りのお店がありません
            </div>
            <Link
              href="/"
              className="text-sm text-blue-600 underline self-center mt-1"
            >
              地図でお店を探す
            </Link>
          </div>
        ) : (
          cafes.map((cafe) => {
            const badges = getQuickBadges(cafe, null, new Set());
            return (
              <div
                key={cafe.id}
                className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/cafe/${cafe.id}`}
                      className="font-semibold text-sm text-gray-900 hover:underline"
                    >
                      {cafe.name}
                    </Link>
                    {cafe.address && (
                      <div className="text-xs text-gray-500">
                        {cafe.address}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(cafe.id)}
                    aria-label="お気に入りから解除"
                    title="お気に入りから解除"
                    className="text-yellow-500 text-lg shrink-0"
                  >
                    ★
                  </button>
                </div>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {badges.map((badge) => (
                      <span
                        key={badge.key}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.className}`}
                      >
                        {badge.emoji} {badge.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
