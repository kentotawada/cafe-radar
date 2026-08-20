import type { Cafe } from "@/lib/seedCafes";

// 同じ場所に重なっている店のピンを、小さな円状にずらして描くための位置。
//
// 同じビルに入っている店は、どれも建物の座標を持っている。そのままだと
// ピンが真上に重なり、いちばん上の1軒しか押せない。実測すると1,985軒中
// 723軒が重なっていて、そのうち479軒はタップでは絶対に選べなかった。
// 六本木ヒルズや日比谷シャンテのように11軒が1点に載っている場所もある。
//
// ずらすのは「描く位置」だけで、店が持っている座標は変えない。距離の計算も
// 並び順も本物の座標のままで、住所もカードにそのまま出る。同じ建物の中で
// 数十メートル動くだけなので、探すときの手がかりは失われない。
//
// 円に並べるので、隣り合うピンの間隔は 2 * r * sin(π / n)。これが指で
// 押し分けられる幅になるように r を決める。ズーム18でおよそ 0.5m/px なので、
// 11m あれば約22px 離れる。

/** 隣り合うピンの間隔。指で押し分けられる最小限 */
const TARGET_GAP_M = 11;
/** どれだけ増えても、ここより外へは広げない */
const MAX_RADIUS_M = 22;
const M_PER_DEG_LAT = 111320;

/**
 * 重なっている店だけを返す。重なっていない店は入っていないので、
 * 呼ぶ側は「無ければ本物の座標」と読み替える。
 */
export function spreadPositions(cafes: Cafe[]): Map<string, [number, number]> {
  // 小数5桁(約1m)でまとめる。完全一致だけでなく、ほぼ同じ点も同じ組にする
  const groups = new Map<string, Cafe[]>();
  for (const cafe of cafes) {
    const key = `${cafe.lat.toFixed(5)},${cafe.lng.toFixed(5)}`;
    const g = groups.get(key);
    if (g) g.push(cafe);
    else groups.set(key, [cafe]);
  }

  const out = new Map<string, [number, number]>();
  for (const group of groups.values()) {
    if (group.length < 2) continue;

    // 並べる順を id で固定する。開くたびに位置が入れ替わると、
    // 「さっき見たのはどれか」が分からなくなる
    const sorted = [...group].sort((a, b) => (a.id < b.id ? -1 : 1));
    const n = sorted.length;
    const radius = Math.min(MAX_RADIUS_M, TARGET_GAP_M / (2 * Math.sin(Math.PI / n)));

    sorted.forEach((cafe, i) => {
      // 真上から時計回りに配る
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const dLat = (radius * Math.sin(angle)) / M_PER_DEG_LAT;
      const dLng =
        (radius * Math.cos(angle)) /
        (M_PER_DEG_LAT * Math.cos((cafe.lat * Math.PI) / 180));
      out.set(cafe.id, [cafe.lat + dLat, cafe.lng + dLng]);
    });
  }
  return out;
}
