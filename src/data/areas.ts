export type Area = {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
};

// エリアが増えたら、ここに中心駅を追加していく。
// 各エリアの店舗は src/data/cafes-<id>.ts に編集部調べで事前登録してあり、
// seedCafes.ts でまとめて読み込む。ユーザーの「お店を追加」投稿分は
// Supabaseのcafesテーブル側に入り、CafeMapで両者を結合して表示する。
// nameEnは英語表示切り替え時のみ使う表示用ラベル(絞り込みの内部キーは
// 常にnameのまま。areaQueryとの比較・保存済みリンク等への影響を避けるため)
export const areas: Area[] = [
  { id: "shinjuku", name: "新宿駅", nameEn: "Shinjuku Station", lat: 35.6896, lng: 139.7006 },
  { id: "shibuya", name: "渋谷駅", nameEn: "Shibuya Station", lat: 35.658, lng: 139.7016 },
  { id: "ikebukuro", name: "池袋駅", nameEn: "Ikebukuro Station", lat: 35.7295, lng: 139.7109 },
  { id: "tokyo", name: "東京駅", nameEn: "Tokyo Station", lat: 35.6812, lng: 139.7671 },
  { id: "ueno", name: "上野駅", nameEn: "Ueno Station", lat: 35.7141, lng: 139.7774 },
  { id: "shinagawa", name: "品川駅", nameEn: "Shinagawa Station", lat: 35.6285, lng: 139.7387 },
  { id: "shimbashi", name: "新橋駅", nameEn: "Shimbashi Station", lat: 35.6665, lng: 139.758 },
  { id: "akihabara", name: "秋葉原駅", nameEn: "Akihabara Station", lat: 35.6984, lng: 139.7731 },
  { id: "yurakucho", name: "有楽町駅", nameEn: "Yurakucho Station", lat: 35.6751, lng: 139.7631 },
  { id: "kanda", name: "神田駅", nameEn: "Kanda Station", lat: 35.6919, lng: 139.7708 },
  { id: "takadanobaba", name: "高田馬場駅", nameEn: "Takadanobaba Station", lat: 35.7128, lng: 139.7038 },
  { id: "ochanomizu", name: "御茶ノ水駅", nameEn: "Ochanomizu Station", lat: 35.6995, lng: 139.7658 },
  { id: "kichijoji", name: "吉祥寺駅", nameEn: "Kichijoji Station", lat: 35.7031, lng: 139.5799 },
  { id: "ebisu", name: "恵比寿駅", nameEn: "Ebisu Station", lat: 35.6467, lng: 139.7101 },
  { id: "roppongi", name: "六本木駅", nameEn: "Roppongi Station", lat: 35.6627, lng: 139.7318 },
  { id: "akasaka", name: "赤坂駅", nameEn: "Akasaka Station", lat: 35.6733, lng: 139.7368 },
  { id: "gotanda", name: "五反田駅", nameEn: "Gotanda Station", lat: 35.6262, lng: 139.7232 },
  { id: "iidabashi", name: "飯田橋駅", nameEn: "Iidabashi Station", lat: 35.7020, lng: 139.7455 },
  { id: "nakano", name: "中野駅", nameEn: "Nakano Station", lat: 35.7057, lng: 139.6650 },
  { id: "tachikawa", name: "立川駅", nameEn: "Tachikawa Station", lat: 35.6984, lng: 139.4137 },
  { id: "osaki", name: "大崎駅", nameEn: "Osaki Station", lat: 35.6197, lng: 139.7286 },
  { id: "tamachi", name: "田町駅", nameEn: "Tamachi Station", lat: 35.6457, lng: 139.7476 },
  { id: "hamamatsucho", name: "浜松町駅", nameEn: "Hamamatsucho Station", lat: 35.6553, lng: 139.7570 },
];
