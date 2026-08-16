// 2点間の直線距離。現在地からお店までの「あとどれくらいか」を出すのに使う。
//
// 直線距離なので実際に歩く距離より短く出る。それでも、近いか遠いかの判断には
// 十分で、経路の距離を出すには別のAPI(有料)が要る。
// 「約」と付けて出し、正確な道のりは経路ボタンからGoogleマップに任せる。

const EARTH_RADIUS_M = 6371000;

export function distanceMeters(
  from: [number, number],
  to: [number, number]
): number {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a1 = (lat1 * Math.PI) / 180;
  const a2 = (lat2 * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a1) * Math.cos(a2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

// 表示用。近いときはm、離れたらkm。桁を増やしても読む側は使わない
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters / 10) * 10}m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)}km`;
}
