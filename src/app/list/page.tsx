import type { Metadata } from "next";
import Link from "next/link";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { supabase } from "@/lib/supabaseClient";

type PageProps = {
  searchParams: Promise<{ ids?: string | string[] }>;
};

function parseIds(idsParam: string | string[] | undefined): string[] {
  if (!idsParam) return [];
  const raw = Array.isArray(idsParam) ? idsParam[0] : idsParam;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// お気に入り共有リンクで指定されたIDのお店を、最初からある店舗データと
// ユーザーが追加した店舗(Supabase)の両方から探す。並び順はURLで
// 渡された順(=お気に入りに追加した順)をそのまま保つ
async function loadSharedCafes(ids: string[]): Promise<Cafe[]> {
  if (ids.length === 0) return [];
  const idSet = new Set(ids);
  const fromSeed = seedCafes.filter((cafe) => idSet.has(cafe.id));
  const foundIds = new Set(fromSeed.map((cafe) => cafe.id));
  const remainingIds = ids.filter((id) => !foundIds.has(id));

  let fromDynamic: Cafe[] = [];
  if (remainingIds.length > 0 && supabase) {
    const { data } = await supabase.from("cafes").select("*").in("id", remainingIds);
    fromDynamic = (data as Cafe[]) ?? [];
  }

  const byId = new Map([...fromSeed, ...fromDynamic].map((cafe) => [cafe.id, cafe]));
  return ids
    .map((id) => byId.get(id))
    .filter((cafe): cafe is Cafe => cafe !== undefined);
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { ids: idsParam } = await searchParams;
  const cafes = await loadSharedCafes(parseIds(idsParam));

  const title =
    cafes.length > 0
      ? `${cafes.length}件のお気に入りカフェ | カフェレーダー`
      : "共有されたカフェリスト | カフェレーダー";
  const description =
    cafes.length > 0
      ? cafes
          .slice(0, 5)
          .map((cafe) => cafe.name)
          .join("、") + (cafes.length > 5 ? " など" : "")
      : "カフェレーダーで共有されたお気に入りのカフェリストです。";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function SharedListPage({ searchParams }: PageProps) {
  const { ids: idsParam } = await searchParams;
  const cafes = await loadSharedCafes(parseIds(idsParam));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">
          共有されたお気に入りカフェ
        </h1>
        <p className="text-sm text-gray-500">{cafes.length}件のお店</p>
      </header>
      <main className="p-4 flex flex-col gap-3 max-w-xl mx-auto">
        {cafes.length === 0 ? (
          <p className="text-sm text-gray-500">
            表示できるお店が見つかりませんでした。リンクが正しいかご確認ください。
          </p>
        ) : (
          cafes.map((cafe) => (
            <div
              key={cafe.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1"
            >
              <div className="font-semibold text-gray-900">{cafe.name}</div>
              {cafe.address && (
                <div className="text-sm text-gray-500">{cafe.address}</div>
              )}
              {cafe.hoursInfo && (
                <div className="text-xs text-gray-600">⏰ {cafe.hoursInfo}</div>
              )}
              {cafe.outletInfo && (
                <div className="text-xs text-gray-600">🔌 {cafe.outletInfo}</div>
              )}
              {cafe.smokingInfo && (
                <div className="text-xs text-gray-600">🚬 {cafe.smokingInfo}</div>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  cafe.address ?? `${cafe.lat},${cafe.lng}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 underline mt-1"
              >
                経路案内(Googleマップ)
              </a>
            </div>
          ))
        )}
      </main>
      <div className="text-center pb-6">
        <Link href="/" className="text-sm text-blue-600 underline">
          カフェレーダーでもっと探す
        </Link>
      </div>
    </div>
  );
}
