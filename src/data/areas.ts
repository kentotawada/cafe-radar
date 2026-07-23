export type Area = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

// エリアが増えたら、ここに中心駅を追加していく。
// 新宿以外は店舗を事前登録していないため、「お店を追加」機能で
// ユーザーが自分で店舗を登録していく想定。
export const areas: Area[] = [
  { id: "shinjuku", name: "新宿駅", lat: 35.6896, lng: 139.7006 },
  { id: "shibuya", name: "渋谷駅", lat: 35.658, lng: 139.7016 },
  { id: "ikebukuro", name: "池袋駅", lat: 35.7295, lng: 139.7109 },
  { id: "tokyo", name: "東京駅", lat: 35.6812, lng: 139.7671 },
  { id: "ueno", name: "上野駅", lat: 35.7141, lng: 139.7774 },
  { id: "shinagawa", name: "品川駅", lat: 35.6285, lng: 139.7387 },
];
