import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年8月時点、各公式サイト・食べログ等）。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認】以下は閉店・実在不明の兆候が見つかったため、掲載を見送った:
// - スターバックス コーヒー TSUTAYA大崎駅前店: 2023年12月10日閉店(品川区民ニュース等で確認)
// - サンマルクカフェ 大崎ニューシティ店: 施設側お知らせで閉店告知あり(2020年3月31日閉店)
// - マクドナルド 大崎ニューシティ店: 一部グルメサイトに掲載が残るが、マクドナルド公式店舗検索で
//   周辺検索しても現在ヒットせず、営業継続を確認できなかったため見送った
// - リトルフードコート Cafe KITECHO(大崎ウィズタワー): 食べログで【閉店】表示
// なお、エクセルシオール カフェ 大崎シンクパーク店・デニーズ ThinkPark店・モスバーガー 大崎店は
// 既にcafes-gotanda.tsに収録済みのため、本ファイルでは重複掲載していない。
export const cafes: Cafe[] = [
  { id: "osaki-01", name: "スターバックス コーヒー ゲートシティ大崎店", address: "東京都品川区大崎1-11-1 ゲートシティ大崎 大崎ゲートシティプラザ1F", lat: 35.6193, lng: 139.7297, smokingInfo: "禁煙(全店舗禁煙方針、喫煙室なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "平日7:00〜22:00、土日祝7:30〜21:30" },
  { id: "osaki-02", name: "スターバックス コーヒー 大崎ブライトタワー店", address: "東京都品川区北品川5-6-1 大崎ブライトタワー", lat: 35.6165, lng: 139.7355, smokingInfo: "禁煙(全店舗禁煙方針、喫煙室なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "平日7:00〜22:00、土日祝7:30〜21:00" },
  { id: "osaki-03", name: "ドトールコーヒーショップ ゲートシティ大崎店", address: "東京都品川区大崎1-11-1 ゲートシティ大崎ウエストタワー3F", lat: 35.6193, lng: 139.7297, smokingInfo: "分煙(喫煙ブースあり、店内91席は全席禁煙)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "91席(全席禁煙、別に喫煙ブースあり)", hoursInfo: "平日7:00〜20:00、土日祝8:00〜19:00" },
  { id: "osaki-04", name: "ドトールコーヒーショップ アートヴィレッジ大崎セントラルタワー店", address: "東京都品川区大崎1-2-2", lat: 35.6225, lng: 139.7268, smokingInfo: "分煙(全39席中、禁煙25席・喫煙14席)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "39席(禁煙25・喫煙14)", hoursInfo: "平日7:00〜18:00" },
  { id: "osaki-05", name: "エクセルシオール カフェ 大崎ニューシティ店", address: "東京都品川区大崎1-6-5 ニューシティ2F", lat: 35.6215, lng: 139.7278, outletInfo: "コンセントあり(喫煙ブースと完全分煙)", smokingInfo: "分煙(喫煙ブースあり、店内81席は全席禁煙)", seatCountInfo: "81席(全席禁煙、別に喫煙ブースあり)", hoursInfo: "平日7:00〜21:00、土日祝8:00〜20:00" },
  { id: "osaki-06", name: "タリーズコーヒー 大崎センタービル店", address: "東京都品川区大崎1-5-1 大崎センタービル", lat: 35.621, lng: 139.729, outletInfo: "ChargeSpot充電サービスあり", smokingInfo: "禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:30〜19:00", closedDaysInfo: "土日定休" },
  { id: "osaki-07", name: "タリーズコーヒー 大崎ガーデンタワー店", address: "東京都品川区西品川1-1-1 住友不動産大崎ガーデンタワー1F", lat: 35.6175, lng: 139.7245, outletInfo: "ChargeSpot充電サービスあり", smokingInfo: "禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:00〜20:00、土9:00〜17:00", closedDaysInfo: "日曜定休" },
  { id: "osaki-08", name: "タリーズコーヒー 大崎オーバルコート店", address: "東京都品川区東五反田2-17-1 オーバルコート大崎 マークウエスト1F", lat: 35.6245, lng: 139.726, outletInfo: "ChargeSpot充電サービスあり", smokingInfo: "加熱式たばこ専用室あり(室内飲食可)", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:00〜18:00", closedDaysInfo: "土日定休" },
  { id: "osaki-09", name: "マクドナルド 大崎ゲートシティ店", address: "東京都品川区大崎1-11-1 ゲートシティプラザ", lat: 35.6193, lng: 139.7297, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "100席以上(公式サイトより)", hoursInfo: "7:00〜22:30(朝マックは7:00〜10:30)" },
  { id: "osaki-10", name: "BECK'S COFFEE SHOP 大崎店", address: "東京都品川区大崎1-21-4 JR大崎駅南口改札内 Dila大崎", lat: 35.6197, lng: 139.7286, outletInfo: "電源コンセントあり(大型アダプターは挿しにくいとの口コミも)", smokingInfo: "加熱式たばこ専用スペースあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "75席", hoursInfo: "平日6:15〜21:00、土日祝7:00〜19:00" },
  { id: "osaki-11", name: "MAHIRO COFFEE ROASTERY", address: "東京都品川区大崎1-20-8 INOビル", lat: 35.6205, lng: 139.73, seatCountInfo: "6席程度", hoursInfo: "8:00〜19:00", closedDaysInfo: "不定休(Instagram等で告知)" },
  { id: "osaki-12", name: "大崎ブックカフェ", address: "東京都品川区大崎2-7-11 小澤ビル1F", lat: 35.6175, lng: 139.726, hoursInfo: "平日10:00〜20:00(読書・自習・テレワーク利用)", closedDaysInfo: "土日祝は通常営業なし(貸し切りレンタルスペース利用のみ)" },
  { id: "osaki-13", name: "Tarny Bakery Cafe", address: "東京都品川区大崎1-2-2 アートヴィレッジ大崎セントラル2F", lat: 35.6225, lng: 139.7268, hoursInfo: "10:00〜18:00", closedDaysInfo: "土日祝定休" },
  { id: "osaki-14", name: "Aloha Table 大崎", address: "東京都品川区北品川5-5-15 大崎ブライトコア1F", lat: 35.6155, lng: 139.7345, hoursInfo: "平日11:30〜15:00・17:00〜22:00、土日祝11:00〜22:00", closedDaysInfo: "無休" },
  { id: "osaki-15", name: "SNOW BEANS COFFEE", address: "東京都品川区北品川5-3-1 パークシティ大崎 ザ タワー103", lat: 35.6145, lng: 139.7335, hoursInfo: "7:30〜19:00" },
  { id: "osaki-16", name: "CAFE&HALL ours", address: "東京都品川区北品川5-7-2 北品川地域交流施設", lat: 35.617, lng: 139.7365, outletInfo: "電源利用可(公式サイトに記載)", wifiInfo: "Wi-Fi利用可(公式サイトに記載)", seatCountInfo: "50席", hoursInfo: "カフェ10:00〜18:00(ランチは平日11:30〜14:30、土日祝12:00〜17:00)", closedDaysInfo: "火曜定休" },
];
