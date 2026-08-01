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

// 最寄り駅(areas.ts)からの直線距離を、CafeMapのformatWalkBadgeと同じ
// 分速80mの目安で徒歩分数に換算する。OGP説明文の「徒歩○分」のように、
// ユーザーの現在地に頼らずサーバー側だけで求められる値が必要な場面で使う
export function nearestStationWalkMinutes(lat: number, lng: number): number {
  const R = 6371000;
  let bestMeters = Infinity;
  for (const area of areas) {
    const dLat = ((area.lat - lat) * Math.PI) / 180;
    const dLng = ((area.lng - lng) * Math.PI) / 180;
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (area.lat * Math.PI) / 180;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const meters = 2 * R * Math.asin(Math.sqrt(h));
    if (meters < bestMeters) bestMeters = meters;
  }
  return Math.max(1, Math.ceil(bestMeters / 80));
}
