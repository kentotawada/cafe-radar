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
//
// 【2026年8月追加分(tamachi-28以降)について】
// 三田・芝・芝浦・海岸(芝浦ふ頭側)まで少し範囲を広げて調査した(田町駅から徒歩
// 5〜15分圏内)。浜松町エリア(cafes-hamamatsucho.ts)と重複する店舗は除外している。
// 各項目は食べログの店舗基本情報で個別に確認し、記載のない項目は空欄にしている。
// - ガーディアン(芝5-36-7 三田ベルジュビルB1F): 食べログで「当面の間休業」表示の
//   ため未掲載。
// - アトリエデリッシュ ピーコックストア芝浦アイランド店: 食べログに登録がなく
//   住所を確認できなかったため未掲載。
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
  { id: "tamachi-28", name: "喫茶室ルノアール 田町三田口駅前店", address: "東京都港区芝5-34-7 田町センタービル1F", lat: 35.6461, lng: 139.7451, smokingInfo: "分煙(加熱式たばこ限定の喫煙席あり)", wifiInfo: "無料Wi-Fiあり(有料Wi-Fiも提供)", seatCountInfo: "83席(禁煙57席・喫煙26席)", hoursInfo: "平日7:00〜22:00、土8:00〜22:00、日祝9:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "tamachi-29", name: "TULLY'S COFFEE ミタマチテラス店", address: "東京都港区芝5-34-2", lat: 35.6461, lng: 139.7449, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜19:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "tamachi-30", name: "セガフレード・ザネッティ・エスプレッソ 田町グランパーク店", address: "東京都港区芝浦3-4-1 田町グランパーク1F", lat: 35.6428, lng: 139.7500, hoursInfo: "平日8:00〜19:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-31", name: "セガフレード・ザネッティ・エスプレッソ 芝浦埠頭ヨコソーレインボータワー店", address: "東京都港区海岸3-20-20 ヨコソーレインボータワー1F", lat: 35.6420, lng: 139.7590, smokingInfo: "全席禁煙(屋外に喫煙所あり)", seatCountInfo: "20席", hoursInfo: "平日7:30〜16:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-32", name: "COSTA COFFEE 東京ポートボウル", address: "東京都港区芝浦1-13-10 第三東運ビル", lat: 35.6452, lng: 139.7538, smokingInfo: "全席禁煙", hoursInfo: "11:30〜20:00" },
  { id: "tamachi-33", name: "パッセージ コーヒー", address: "東京都港区芝5-14-16 大正堂ビル1F", lat: 35.6444, lng: 139.7438, smokingInfo: "全席禁煙", hoursInfo: "平日7:30〜18:00、土日祝9:00〜18:00", closedDaysInfo: "不定休" },
  { id: "tamachi-34", name: "MONSTER BREW COFFEE", address: "東京都港区芝5-20-22", lat: 35.6467, lng: 139.7432, hoursInfo: "火〜金8:00〜15:00", closedDaysInfo: "月曜日、土曜日、日曜日" },
  { id: "tamachi-35", name: "バンクサンドイッチ 三田聖坂店", address: "東京都港区三田3-4-11 三田3丁目ビル1F", lat: 35.6470, lng: 139.7411, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "32席(カウンター12席・テーブル20席)", hoursInfo: "平日8:00〜20:00、土8:00〜18:00、日祝8:00〜17:00", closedDaysInfo: "ゴールデンウィーク、年末年始" },
  { id: "tamachi-36", name: "TOKYO CIRCUS CAFE", address: "東京都港区芝4-12-3 S4S BLDG", lat: 35.6493, lng: 139.7458, smokingInfo: "全席禁煙(貸切時を除く)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "29席(カウンター2席・テーブル25席・ソファ2席)", hoursInfo: "11:00〜22:00(L.O.21:30)" },
  { id: "tamachi-37", name: "カフェラウンジ コロン", address: "東京都港区芝浦2-16-8 3F", lat: 35.6424, lng: 139.7515, smokingInfo: "全席禁煙(屋外に喫煙所あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "73席", hoursInfo: "平日11:30〜22:00(フードL.O.21:00、ドリンクL.O.21:30)", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-38", name: "カフェ&バーラウンジ セレクロワ", address: "東京都港区芝3-23-1 ザ・セレスティンホテル1F", lat: 35.6528, lng: 139.7468, smokingInfo: "全席禁煙", seatCountInfo: "67席", hoursInfo: "8:00〜22:00(カフェタイム10:00〜22:00)" },
  { id: "tamachi-39", name: "社中交歡 萬來舍", address: "東京都港区三田2-15-45 慶應義塾大学南校舎3F", lat: 35.6494, lng: 139.7419, smokingInfo: "全席禁煙", seatCountInfo: "100席(ラウンジ55席・個室45席)", hoursInfo: "月〜土11:00〜21:00", closedDaysInfo: "日曜日、祝日" },
  { id: "tamachi-40", name: "SHIRUCAFE 慶應義塾大学前店", address: "東京都港区三田3-1-5 第一奈半利川ビル2F", lat: 35.6470, lng: 139.7430 },
  { id: "tamachi-41", name: "Where is my chou? 田町タワー店", address: "東京都港区芝5-33-11 田町タワーモール1F", lat: 35.6459, lng: 139.7457, smokingInfo: "全席禁煙", seatCountInfo: "17席(店内カウンター6席・テラス11席)", hoursInfo: "火〜金11:00〜19:00、土日祝11:00〜18:00", closedDaysInfo: "主に月曜日(営業する場合もあり)" },
  { id: "tamachi-42", name: "和処うつわ", address: "東京都港区芝5-33-11 田町タワーB1F", lat: 35.6459, lng: 139.7457, smokingInfo: "全席禁煙", seatCountInfo: "11席(全席カウンター)", hoursInfo: "8:00〜17:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-43", name: "マイ プレイグラウンド", address: "東京都港区芝浦3-1-1 田町ステーションタワーN 2F", lat: 35.6449, lng: 139.7508, smokingInfo: "全席禁煙" },
  { id: "tamachi-44", name: "プラットフォーム ナイン", address: "東京都港区芝浦3-1-21 プルマン東京田町9F", lat: 35.6448, lng: 139.7508, wifiInfo: "無料Wi-Fiあり", seatCountInfo: "47席(テラス24席を含む)", hoursInfo: "火〜土19:00〜23:00(フードL.O.22:00、ドリンクL.O.22:30)", closedDaysInfo: "月曜日、日曜日" },
  { id: "tamachi-45", name: "ベリーベリースープ 田町駅前店", address: "東京都港区芝浦3-1-32 なぎさテラス207", lat: 35.6446, lng: 139.7511, smokingInfo: "全席禁煙", seatCountInfo: "32席(6名席×1・4名席×2・2名席×9)", hoursInfo: "平日11:00〜21:00(L.O.20:30)、土祝11:00〜18:00(L.O.17:30)", closedDaysInfo: "日曜日" },
  { id: "tamachi-46", name: "La bonne grace", address: "東京都港区芝浦3-1-32 なぎさテラス1F", lat: 35.6446, lng: 139.7511, hoursInfo: "火〜日11:30〜19:00", closedDaysInfo: "月曜日" },
  { id: "tamachi-47", name: "stand B", address: "東京都港区芝5-36-7 三田ベルジュビル1F", lat: 35.6488, lng: 139.7451, smokingInfo: "全席禁煙", seatCountInfo: "8席(隣接する姉妹カフェスペースも利用可)", hoursInfo: "平日7:30〜17:30", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-48", name: "cafe B", address: "東京都港区芝5-36-7 三田ベルジュビル1F", lat: 35.6488, lng: 139.7451, smokingInfo: "全席禁煙", seatCountInfo: "20席", hoursInfo: "平日9:00〜17:30", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-49", name: "白十字", address: "東京都港区芝5-14-2", lat: 35.6443, lng: 139.7437, smokingInfo: "全席禁煙", seatCountInfo: "10席", hoursInfo: "平日6:30〜19:00、土6:30〜15:00", closedDaysInfo: "日曜日" },
  { id: "tamachi-50", name: "草の花", address: "東京都港区芝4-12-2", lat: 35.6493, lng: 139.7458, smokingInfo: "全席喫煙可", seatCountInfo: "17席", hoursInfo: "11:00〜" },
  { id: "tamachi-51", name: "ダフニ", address: "東京都港区芝5-10-11 1階", lat: 35.6447, lng: 139.7428, smokingInfo: "14:30までは全席禁煙、以降は全席喫煙可", seatCountInfo: "6席(2名席×3卓)", hoursInfo: "平日10:00〜18:00、土日10:00〜17:00", closedDaysInfo: "水曜日" },
  { id: "tamachi-52", name: "カフェ・ド・カフェ", address: "東京都港区芝2-31-19 バンザイビル1F", lat: 35.6510, lng: 139.7470, smokingInfo: "ランチタイムは全席禁煙、それ以外の時間は喫煙可", hoursInfo: "平日8:00〜16:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "tamachi-53", name: "ニューたんぽぽ", address: "東京都港区芝浦3-14-16 庭田ビル2F", lat: 35.6400, lng: 139.7505, smokingInfo: "全席喫煙可", seatCountInfo: "30席", hoursInfo: "月〜土18:00〜20:00", closedDaysInfo: "日曜日、祝日" },
  { id: "tamachi-54", name: "アオ(碧・Ao)", address: "東京都港区芝5-34-6 新田町ビル1F", lat: 35.6461, lng: 139.7452, smokingInfo: "全席禁煙", seatCountInfo: "21席(カウンター9席・テーブル12席)", hoursInfo: "平日11:30〜14:00、16:00〜23:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "tamachi-55", name: "ウェリナ", address: "東京都港区芝2-30-15 エムエムエスビル1F", lat: 35.6512, lng: 139.7473, smokingInfo: "全席禁煙", seatCountInfo: "26席(カウンター4席・テーブル22席)", hoursInfo: "平日11:30〜15:30、17:00〜21:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-56", name: "DELI CAFE SHiBA", address: "東京都港区芝4-1-30", lat: 35.6503, lng: 139.7472, smokingInfo: "全席禁煙", seatCountInfo: "15席", hoursInfo: "平日11:00〜17:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-57", name: "まーぶるカフェ", address: "東京都港区芝4-1-17 三田いきいきプラザ2F", lat: 35.6500, lng: 139.7470, hoursInfo: "月〜土10:00〜16:00(L.O.15:30)", closedDaysInfo: "日曜日、祝日" },
  { id: "tamachi-58", name: "カフェ フルール", address: "東京都港区芝浦1-16-1 みなとパーク芝浦1F", lat: 35.6459, lng: 139.7522, smokingInfo: "全席禁煙", hoursInfo: "平日10:45〜17:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-59", name: "KOMOREBI cafe", address: "東京都港区芝浦1-13-16", lat: 35.6453, lng: 139.7540, hoursInfo: "平日8:30〜16:30", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-60", name: "紫陽花庵", address: "東京都港区芝浦1-11-15 港区立伝統文化交流館1F", lat: 35.6450, lng: 139.7535, smokingInfo: "全席禁煙", seatCountInfo: "8席", hoursInfo: "10:00〜17:00" },
  { id: "tamachi-61", name: "リーベンハウスカフェパティオ芝", address: "東京都港区芝3-8-2 芝公園ファーストビル1F", lat: 35.6535, lng: 139.7473, smokingInfo: "全席禁煙", hoursInfo: "平日8:00〜17:30", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-62", name: "RIEVEN HOUSE 三田ガーデンタワー店", address: "東京都港区三田3-5-19 東京三田ガーデンタワー2F", lat: 35.6478, lng: 139.7407 },
  { id: "tamachi-63", name: "Timeless Bakery 三田", address: "東京都港区三田3-1-20 カリーノ三田1F", lat: 35.6467, lng: 139.7433, hoursInfo: "7:30〜18:30(テイクアウトのみ)" },
  { id: "tamachi-64", name: "DELISH KOSO", address: "東京都港区三田3-1-19 第2シグマビルディング三田1F", lat: 35.6468, lng: 139.7432, smokingInfo: "全席禁煙", seatCountInfo: "4席(カウンター4席)", hoursInfo: "月〜土8:00〜20:00", closedDaysInfo: "日曜日" },
  { id: "tamachi-65", name: "グーテ・ド・ママン", address: "東京都港区三田2-17-29 グランデ三田1F", lat: 35.6460, lng: 139.7385, smokingInfo: "全席禁煙", seatCountInfo: "10席(2卓)", hoursInfo: "火〜土・祝11:00〜19:00", closedDaysInfo: "月曜日、日曜日、お盆期間" },
  { id: "tamachi-66", name: "DENDA flowers & plants", address: "東京都港区三田2-17-16 ダイナシティ三田1F", lat: 35.6461, lng: 139.7387, smokingInfo: "全席禁煙", hoursInfo: "10:30〜19:00" },
  { id: "tamachi-67", name: "ギフト＆クラフト ミタ", address: "東京都港区三田4-1-4 城南ビルディング1F", lat: 35.6470, lng: 139.7400, smokingInfo: "全席禁煙", seatCountInfo: "2席", hoursInfo: "平日12:00〜18:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-68", name: "NEON NEON TOKYO CAFE", address: "東京都港区三田4-1-4", lat: 35.6470, lng: 139.7400, hoursInfo: "月・水〜日8:30〜17:00", closedDaysInfo: "火曜日" },
  { id: "tamachi-69", name: "マキバ スタイル", address: "東京都港区芝浦2-16-7 中野第3ビル2F", lat: 35.6424, lng: 139.7514, smokingInfo: "開店〜14:00は全席禁煙、エアカーテン付き喫煙ルームによる完全分煙", seatCountInfo: "63席(全席テーブル席、ソファ席あり)", hoursInfo: "月火木金11:30〜15:00・18:00〜22:00、水18:00〜22:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-70", name: "CHILL OUT TOKYO", address: "東京都港区芝浦2-16-10 ラナビル", lat: 35.6424, lng: 139.7516 },
  { id: "tamachi-71", name: "パンとエスプレッソと 芝浦ギャラリー", address: "東京都港区芝浦4-9-13", lat: 35.6395, lng: 139.7527, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "15席", hoursInfo: "8:00〜18:00(L.O.17:00)", closedDaysInfo: "不定休" },
  { id: "tamachi-72", name: "スワン 共働店", address: "東京都港区芝浦4-13-23 ナチュラルローソン芝浦海岸通", lat: 35.6388, lng: 139.7515, smokingInfo: "全席禁煙", hoursInfo: "24時間営業" },
  { id: "tamachi-73", name: "キャナル ゲート カフェ", address: "東京都港区芝浦4-20-3", lat: 35.6378, lng: 139.7505, smokingInfo: "全席禁煙", seatCountInfo: "30席", hoursInfo: "火〜金9:00〜23:00、土日祝9:00〜21:30", closedDaysInfo: "月曜日(祝日の場合は営業)" },
  { id: "tamachi-74", name: "Cafe Perch", address: "東京都港区芝浦4-3-4 田町きよたビル3F", lat: 35.6400, lng: 139.7480 },
  { id: "tamachi-75", name: "海岸カフェ", address: "東京都港区海岸3-9-5 東京港湾福利厚生センター1F", lat: 35.6440, lng: 139.7580, smokingInfo: "全席禁煙", hoursInfo: "平日8:00〜16:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "tamachi-76", name: "スーパーレーサー", address: "東京都港区海岸3-12-9", lat: 35.6432, lng: 139.7585, smokingInfo: "分煙", hoursInfo: "平日11:30〜17:00、土日11:30〜18:00" },
  { id: "tamachi-77", name: "spire", address: "東京都港区海岸3-20-20 ヨコソーレインボータワー1F", lat: 35.6420, lng: 139.7590, seatCountInfo: "250席", hoursInfo: "平日11:00〜14:00", closedDaysInfo: "土曜日、日曜日、祝日" },
];
