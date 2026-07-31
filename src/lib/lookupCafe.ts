import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { supabase } from "@/lib/supabaseClient";
import { areas } from "@/data/areas";

// 個別ページ・OGP画像の両方から使う、ID1件分のお店データ検索。
// 最初からある店舗データにまず当たり、無ければユーザーが追加した
// 店舗(Supabase)を探す
export async function lookupCafeById(id: string): Promise<Cafe | null> {
  const fromSeed = seedCafes.find((cafe) => cafe.id === id);
  if (fromSeed) return fromSeed;

  if (!supabase) return null;
  const { data } = await supabase
    .from("cafes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Cafe | null) ?? null;
}

// カフェの近くの駅名を、店名や住所に頼らず座標だけで求める(検索結果の
// タイトルに「【渋谷】」のようなエリア名を入れて、SEO・共有時の
// 見出しをわかりやすくするため)
export function nearestAreaName(lat: number, lng: number): string {
  let bestName = areas[0]?.name ?? "";
  let bestDist = Infinity;
  for (const area of areas) {
    const dLat = area.lat - lat;
    const dLng = area.lng - lng;
    const d = dLat * dLat + dLng * dLng;
    if (d < bestDist) {
      bestDist = d;
      bestName = area.name;
    }
  }
  return bestName;
}
