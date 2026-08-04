import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年8月時点、各公式サイト・食べログ等）。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは各チェーンの
// 公式店舗ページ・食べログ等で個別に確認して追加した。確認できなかった項目は
// 空欄のままにしている(推測では埋めていない)。スターバックス・マクドナルド・
// ガスト系(スカイラークグループ)は全店舗禁煙が全国方針のため個別確認なしで
// smokingInfoに反映している。
//
// 【要確認・閉店のため未掲載】
// - サンマルクカフェ 田町駅前店(港区芝5-33-1 森永プラザビル別館): ビル解体のため
//   2024年3月26日閉店。
// - タリーズコーヒー 田町森永プラザビル店(同じ森永プラザビル別館2F): 同じくビル
//   解体のため閉店との情報あり。
// - サンマルクカフェ 東京慶応三田店(港区芝5-25-11): 食べログ等で閉店表示。
// - カフェ・ベローチェ 芝浦店: 食べログ等で営業状況が確認できず(掲載保留の様子)。
//   閉店の確証はないため今回は未掲載。
export const cafes: Cafe[] = [
  { id: "tamachi-01", name: "スターバックス コーヒー 田町駅 南改札内店", address: "東京都港区芝5-33-36 JR田町駅南口改札内", lat: 35.6455, lng: 139.7462, hoursInfo: "平日7:00〜21:30、土日8:00〜20:00", closedDaysInfo: "不定休", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", smokingInfo: "全店舗禁煙方針、喫煙所なし" },
  { id: "tamachi-02", name: "スターバックス コーヒー 田町タワー店", address: "東京都港区芝5-33-11 田町タワーモール1F", lat: 35.6459, lng: 139.7457, hoursInfo: "平日7:00〜22:00、土日祝8:00〜21:00", closedDaysInfo: "不定休", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", smokingInfo: "全店舗禁煙方針、喫煙所なし" },
  { id: "tamachi-03", name: "スターバックス コーヒー ムスブ田町4階店", address: "東京都港区芝浦3-1-21 msb Tamachi 田町ステーションタワーS 4階402", lat: 35.6448, lng: 139.7508, hoursInfo: "9:00〜21:00", closedDaysInfo: "不定休", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", smokingInfo: "全店舗禁煙方針、喫煙所なし" },
  { id: "tamachi-04", name: "スターバックス コーヒー ムスブ田町2階店", address: "東京都港区芝浦3-1-21 msb Tamachi 田町ステーションタワーS 2階205", lat: 35.6448, lng: 139.7508, hoursInfo: "7:00〜22:00", closedDaysInfo: "不定休", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", smokingInfo: "全店舗禁煙方針、喫煙所なし" },
  { id: "tamachi-05", name: "スターバックス コーヒー 新田町ビル店", address: "東京都港区芝5-34-6 新田町ビル", lat: 35.6461, lng: 139.7452, hoursInfo: "平日6:30〜22:00、土日祝8:00〜20:00", closedDaysInfo: "不定休", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", smokingInfo: "全店舗禁煙方針、喫煙所なし" },
  { id: "tamachi-06", name: "ドトールコーヒーショップ 田町センタービル店", address: "東京都港区芝5-34-7 田町センタービル", lat: 35.6461, lng: 139.7451, outletInfo: "63席にコンセントあり", smokingInfo: "完全分煙(全63席禁煙、喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "63席", hoursInfo: "平日7:10〜20:00、土7:30〜19:00" },
  { id: "tamachi-07", name: "ドトールコーヒーショップ 芝浦3丁目店", address: "東京都港区芝浦3-11-7 根本ビル1F", lat: 35.6408, lng: 139.7513, outletInfo: "28席にコンセントあり", smokingInfo: "完全分煙(全28席禁煙、喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "28席", hoursInfo: "平日7:00〜19:00、土日祝8:00〜18:00" },
  { id: "tamachi-08", name: "ドトールコーヒーショップ シーバンス ア・モール店", address: "東京都港区芝浦1-2-2 シーバンス ア・モール1F", lat: 35.6379, lng: 139.7548, smokingInfo: "完全分煙(全45席禁煙、喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "45席", hoursInfo: "平日7:00〜15:00", closedDaysInfo: "木曜日" },
  { id: "tamachi-09", name: "ドトールコーヒーショップ 東京都済生会中央病院店", address: "東京都港区三田1-4-17", lat: 35.6494, lng: 139.7429, outletInfo: "全席にコンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "27席", hoursInfo: "平日7:30〜18:00、土7:30〜16:00", closedDaysInfo: "第2・4土曜日" },
  { id: "tamachi-10", name: "エクセルシオール カフェ 三田店", address: "東京都港区芝5-31-5 GATO三田ビル1F", lat: 35.6463, lng: 139.7449, outletInfo: "107席にコンセントあり", smokingInfo: "完全分煙(全107席禁煙、喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "107席", hoursInfo: "平日6:45〜22:00、土日祝7:00〜21:00" },
  { id: "tamachi-11", name: "エクセルシオール カフェ 田町東口店", address: "東京都港区芝浦3-5-39 イーストウイング1F", lat: 35.6438, lng: 139.7502, outletInfo: "104席にコンセントあり", smokingInfo: "分煙(禁煙76席・喫煙28席)、喫煙ブースあり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "104席(禁煙76・喫煙28)", hoursInfo: "平日6:45〜22:00、土日祝7:00〜21:00" },
  { id: "tamachi-12", name: "タリーズコーヒー 三田国際ビル店", address: "東京都港区三田1-4-28 三田国際ビルB1F", lat: 35.6494, lng: 139.7429, smokingInfo: "禁煙", hoursInfo: "平日8:00〜19:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "tamachi-13", name: "タリーズコーヒー住友不動産東京三田ガーデンタワー店", address: "東京都港区三田3-5-19", lat: 35.6478, lng: 139.7407, smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:30〜19:30", closedDaysInfo: "土曜日、日曜日" },
  { id: "tamachi-14", name: "カフェ・ベローチェ 田町店", address: "東京都港区芝5-31-19 ラウンドクロス田町1F", lat: 35.6464, lng: 139.7447, outletInfo: "お客様専用コンセントあり", smokingInfo: "加熱式たばこ専用喫煙室・喫煙ブースあり(他は禁煙)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日6:45〜21:00、土日祝7:00〜21:00" },
  { id: "tamachi-15", name: "カフェ・ベローチェ 三田店", address: "東京都港区芝5-13-13 新サダカタビル1F", lat: 35.6440, lng: 139.7438, outletInfo: "お客様専用コンセントあり", smokingInfo: "全席禁煙、喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "7:00〜21:00" },
  { id: "tamachi-16", name: "PRONTO ムスブ田町店", address: "東京都港区芝浦3-1-1 msb田町ステーションタワーN 2F", lat: 35.6449, lng: 139.7508, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "78席", hoursInfo: "平日7:00〜17:29,17:30〜23:00、土日10:00〜17:29,17:30〜22:00" },
  { id: "tamachi-17", name: "マクドナルド 三田駅前店", address: "東京都港区芝5-31-24 勝文館1F", lat: 35.6464, lng: 139.7448, smokingInfo: "全席禁煙(全店舗禁煙方針)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "64席", hoursInfo: "6:30〜23:00", closedDaysInfo: "年中無休" },
  { id: "tamachi-18", name: "ガスト 三田慶応大学前店", address: "東京都港区芝5-14-10 プレミアステージ三田慶大前2F", lat: 35.6472, lng: 139.7440, smokingInfo: "全席禁煙(スカイラークグループは全店舗禁煙)", hoursInfo: "平日6:00〜23:00、土日祝6:30〜23:00" },
  { id: "tamachi-19", name: "むさしの森Diner ムスブ田町店", address: "東京都港区芝浦3-1-1 msb Tamachi 田町ステーションタワーN 1階N114室", lat: 35.6449, lng: 139.7508, smokingInfo: "全席禁煙(スカイラークグループは全店舗禁煙)", hoursInfo: "平日9:00〜22:00、土日祝8:00〜22:00" },
  { id: "tamachi-20", name: "&COFFEE MAISON KAYSER 田町店", address: "東京都港区芝浦3-1-21 msb Tamachi 1F", lat: 35.6448, lng: 139.7508, hoursInfo: "10:00〜21:00(L.O.20:30)" },
  { id: "tamachi-21", name: "カフェ・ド・クリエ 田町駅東口なぎさテラス店", address: "東京都港区芝浦3-1-32 なぎさテラス3F", lat: 35.6446, lng: 139.7511, outletInfo: "お客様専用コンセントあり", smokingInfo: "加熱式たばこ専用喫煙室あり(他は禁煙)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜21:00、土日祝9:00〜20:00" },
  { id: "tamachi-22", name: "JUNCTION(ホテルプルマン東京田町)", address: "東京都港区芝浦3-1-21 ホテルプルマン東京田町2F", lat: 35.6448, lng: 139.7508, smokingInfo: "全席禁煙", hoursInfo: "10:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "tamachi-23", name: "純喫茶もくもく", address: "東京都港区芝5-26-3 2F", lat: 35.6478, lng: 139.7435, outletInfo: "電源あり", smokingInfo: "全席喫煙可", wifiInfo: "Wi-Fiあり", seatCountInfo: "18席(ゲーム卓2席含む)", hoursInfo: "月〜土13:00〜18:00", closedDaysInfo: "日曜日、ほか不定休" },
  { id: "tamachi-24", name: "Jaho Coffee Roaster & Wine Bar 田町店", address: "東京都港区芝5-29-11 G-BASE田町1F", lat: 35.6470, lng: 139.7442, outletInfo: "カウンター席の一部に電源あり", hoursInfo: "平日7:30〜22:00、土日8:00〜21:00" },
  { id: "tamachi-25", name: "アクセアカフェ田町店", address: "東京都港区三田3-1-11 エック三田ビル2F", lat: 35.6517, lng: 139.7437, outletInfo: "全席電源あり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "20席(ハイバックソファ6・テーブル8・カウンター6)", hoursInfo: "24時間営業(22:00〜翌6:00は要本人確認)", closedDaysInfo: "年中無休" },
  { id: "tamachi-26", name: "みなと茶寮", address: "東京都港区芝5-36-4 札の辻スクエア4F", lat: 35.6493, lng: 139.7449, hoursInfo: "10:30〜16:00(L.O.15:30)", closedDaysInfo: "土曜日、日曜日、祝日、三田図書館休館日" },
  { id: "tamachi-27", name: "Squad Base Cafe by SIVA Inc.", address: "東京都港区芝5-26-16 Mita S-Garden 1F", lat: 35.6478, lng: 139.7435, outletInfo: "全席電源あり、27インチ4Kモニター付きデスク3台あり", smokingInfo: "全席禁煙", wifiInfo: "無料高速Wi-Fiあり", seatCountInfo: "47席", hoursInfo: "平日8:30〜19:00(フードは18:00まで)", closedDaysInfo: "土曜日、日曜日、祝日" },
];
