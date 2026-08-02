import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【未着手】ochanomizu-12〜21・33〜43は、調査中にツール利用上限に達した
// ため未調査のまま(新規項目なし)。別途リサーチを再開して追加する予定。
//
// 【要確認・休業中】ochanomizu-46(スカイラウンジ暁): 明治大学公式サイトに
// よると厨房機器更新工事のため2026年8月1日から休業中、再開は同年11月4日
// 予定(調査時点)。新規項目は追加せず既存情報のままにしてある。
export const cafes: Cafe[] = [
  { id: "ochanomizu-01", name: "マクドナルド 御茶ノ水ソラシティ店", address: "東京都千代田区神田駿河台4-6-1 御茶ノ水ソラシティ B1F", lat: 35.6984, lng: 139.7649, outletInfo: "西側窓際カウンター11席、USB充電のみ設置", smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(FREE WiFi、登録不要)", seatCountInfo: "37席", hoursInfo: "7:00〜23:00(日曜22:00〜翌7:00は御茶ノ水ソラシティ全体のメンテナンスにより休業)" },
  { id: "ochanomizu-02", name: "マクドナルド 神保町店", address: "東京都千代田区神田神保町1-2-1", lat: 35.696, lng: 139.758, outletInfo: "3階中央カウンター20席中10席に2口コンセント", smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(FREE WiFi、登録不要)", seatCountInfo: "158席", hoursInfo: "6:30〜23:00" },
  { id: "ochanomizu-03", name: "スターバックス コーヒー 御茶ノ水ソラシティ店", address: "東京都千代田区神田駿河台4-6 御茶ノ水ソラシティ", lat: 35.6984, lng: 139.765, outletInfo: "コンセント席16席あり、中央付近のテーブル席に設置", smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "月〜金7:00〜21:00、土日祝8:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-04", name: "スターバックス コーヒー お茶の水村田ビル店", address: "東京都千代田区神田駿河台2-5 村田ビルディング1F", lat: 35.6968, lng: 139.7617, outletInfo: "1階窓側と2階カウンターテーブルに電源あり", smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "月〜土7:00〜22:00、日祝8:00〜21:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-05", name: "スターバックス コーヒー お茶の水サンクレール店", address: "東京都千代田区神田駿河台4-3", lat: 35.6978, lng: 139.7642, outletInfo: "電源なし、90分目安の立ち寄り利用向け店舗", smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "月〜金7:00〜22:30、土7:00〜22:00、日祝8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-06", name: "ドトールコーヒーショップ お茶の水駿河台店", address: "東京都千代田区神田駿河台1-6", lat: 35.6975, lng: 139.763, smokingInfo: "完全分煙、加熱式・紙タバコ対応の喫煙ブースあり(客席73席はすべて禁煙席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "73席(全席禁煙、喫煙ブース別途あり)", hoursInfo: "平日6:45〜20:00、土日祝8:00〜19:00" },
  { id: "ochanomizu-07", name: "ドトールコーヒーショップ 神保町駅前店", address: "東京都千代田区神田神保町1-10-1", lat: 35.6956, lng: 139.7573, outletInfo: "1・2階の窓際カウンターに電源、計15席以上", smokingInfo: "完全分煙、喫煙席(加熱式)・喫煙ブース(紙・加熱式)あり(104席中、禁煙85席・喫煙19席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "104席(禁煙85・喫煙19)", hoursInfo: "平日6:45〜22:00、土日祝7:45〜20:00" },
  { id: "ochanomizu-08", name: "タリーズコーヒー 神保町店", address: "東京都千代田区神田神保町2-7 神保町NKビル1F", lat: 35.6963, lng: 139.7558, outletInfo: "全2フロア110席のほとんどに2口コンセント完備", smokingInfo: "喫煙専用室あり(飲食不可)", wifiInfo: "無料Wi-Fiあり(Tully's Wi-Fi、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金7:00〜20:00、土8:00〜19:00、日9:00〜19:00" },
  { id: "ochanomizu-09", name: "タリーズコーヒー 神保町三井ビルディング店", address: "東京都千代田区神田神保町1-105 神保町三井ビルディング1F", lat: 35.6958, lng: 139.7568, outletInfo: "電源席ありとの情報も、塞がれ利用不可との口コミあり", smokingInfo: "加熱式タバコ専用室あり(飲食可)", wifiInfo: "無料Wi-Fiあり(Tully's Wi-Fi、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金7:30〜20:00、土日8:00〜19:00" },
  { id: "ochanomizu-10", name: "エクセルシオール カフェ 新お茶の水店", address: "東京都千代田区神田駿河台4-3 新お茶の水ビルディング サンクレールB1F", lat: 35.6978, lng: 139.7642, outletInfo: "客席にコンセントあり（具体的な席位置は要確認）", smokingInfo: "完全分煙、加熱式・紙タバコ対応の喫煙ブースあり(客席98席はすべて禁煙席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "98席(全席禁煙、喫煙ブース別途あり)", hoursInfo: "平日・土7:00〜22:00、日祝7:00〜21:00" },
  { id: "ochanomizu-11", name: "エクセルシオール カフェ お茶の水店", address: "東京都千代田区神田駿河台2-1 ユニオンビル1F", lat: 35.697, lng: 139.762, outletInfo: "入口左手窓際カウンター7席中4席にコンセントあり", smokingInfo: "完全分煙、加熱式・紙タバコ対応の喫煙ブースあり(客席82席はすべて禁煙席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "82席(全席禁煙、喫煙ブース別途あり)", hoursInfo: "平日6:45〜22:00、土日祝7:00〜21:00" },
  { id: "ochanomizu-12", name: "カフェ・ベローチェ 新御茶ノ水店", address: "東京都千代田区神田駿河台3-4-2 日専連朝日生命ビル1F", lat: 35.6976, lng: 139.7638, outletInfo: "電源コンセント＆Wi-Fiあり、作業利用者に人気" },
  { id: "ochanomizu-13", name: "カフェ・ベローチェ 神保町店", address: "東京都千代田区神田神保町1-8 漢陽商事ビル1F", lat: 35.6958, lng: 139.7572, outletInfo: "カウンター席はほぼ全席2口コンセント完備" },
  { id: "ochanomizu-14", name: "PRONTO 御茶ノ水店", address: "東京都千代田区神田駿河台2-4-4 サンロイヤルビル1F", lat: 35.6972, lng: 139.7625 },
  { id: "ochanomizu-15", name: "NEW YORKER'S Cafe 駿河台4丁目店", address: "東京都千代田区神田駿河台4-1-1 ウエルトンビル1F", lat: 35.698, lng: 139.7635, outletInfo: "電源サービスあり（ルノアール系列店舗）" },
  { id: "ochanomizu-16", name: "喫茶室ルノアール 水道橋西口店", address: "東京都千代田区神田三崎町3-6-13 山京中央ビル1F", lat: 35.6978, lng: 139.7528, outletInfo: "電源サービスあり、携帯充電しながら寛げる" },
  { id: "ochanomizu-17", name: "サンマルクカフェ相鉄フレッサイン御茶ノ水神保町店", address: "東京都千代田区神田神保町1-19-7", lat: 35.6962, lng: 139.7568, outletInfo: "カウンター席に電源コンセントあり" },
  { id: "ochanomizu-18", name: "サンマルクカフェ 神保町すずらん通り店", address: "東京都千代田区神田神保町1-5-1", lat: 35.696, lng: 139.758, outletInfo: "壁沿いカウンター席・喫煙室丸テーブルに電源多数" },
  { id: "ochanomizu-19", name: "サンマルクカフェ 明治大学グローバルフロント店", address: "東京都千代田区神田駿河台2-1", lat: 35.697, lng: 139.7618, outletInfo: "電源・Wi-Fi利用可能な店舗として紹介あり" },
  { id: "ochanomizu-20", name: "Delifrance お茶の水カフェベーカリー店", address: "東京都千代田区神田駿河台2-1 御茶の水クリスチャンセンター1F", lat: 35.6968, lng: 139.7622, outletInfo: "客席に充電コンセントあり（一部情報でなしとの声も）" },
  { id: "ochanomizu-21", name: "モスバーガー 水道橋西通り店", address: "東京都千代田区西神田2-5-8", lat: 35.6975, lng: 139.7528, outletInfo: "カウンター席にコンセント設置、電源カフェと紹介" },
  { id: "ochanomizu-22", name: "淡路坂珈琲 お茶の水店", address: "東京都千代田区神田淡路町2-9 JR紅梅橋高架下4号", lat: 35.698, lng: 139.7685, outletInfo: "各席に電源あり、窓際席はテーブル下に設置", smokingInfo: "分煙(テラス席のみ喫煙可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "50席", hoursInfo: "7:30〜19:00", closedDaysInfo: "12/31・1/1のみ休み" },
  { id: "ochanomizu-23", name: "BOTTOS 没頭作業カフェ 御茶ノ水駅前店", address: "東京都千代田区神田駿河台2-6-10 田中ビル2-4F", lat: 35.6975, lng: 139.7625, outletInfo: "全席に電源完備（作業特化型カフェ）", wifiInfo: "無料Wi-Fiあり(高速Wi-Fi)", seatCountInfo: "60席", hoursInfo: "8:00〜22:00(将来的に24時間営業へ移行予定)", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-24", name: "MEDI CAFE", address: "東京都文京区湯島1-5-34 お茶の水医学会館1F", lat: 35.7015, lng: 139.7665, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "24席", hoursInfo: "平日9:30〜18:00", closedDaysInfo: "土日定休" },
  { id: "ochanomizu-25", name: "レストラン1899お茶の水", address: "東京都千代田区神田駿河台3-4", lat: 35.6976, lng: 139.7639, smokingInfo: "全席禁煙(テラス含む)", wifiInfo: "あり", seatCountInfo: "全76席(店内40席・テラス36席)", hoursInfo: "月〜土11:00〜22:00(料理L.O./ドリンクL.O.21:30)、日・祝11:00〜17:30", closedDaysInfo: "無休(日・祝のディナータイムのみ休業)" },
  { id: "ochanomizu-26", name: "喫茶 穂高", address: "東京都千代田区神田駿河台4-5-3 御茶ノ水穂高ビル1F", lat: 35.6988, lng: 139.765, smokingInfo: "全席禁煙(2017年8月より)", seatCountInfo: "42席(カウンター4・テーブル2、4人掛け9卓)", hoursInfo: "月〜土8:00〜19:00", closedDaysInfo: "日曜・祝日" },
  { id: "ochanomizu-27", name: "さぼうる", address: "東京都千代田区神田神保町1-11", lat: 35.6957, lng: 139.7577, smokingInfo: "全席禁煙", seatCountInfo: "70席", hoursInfo: "月〜土11:00〜19:00(料理L.O.18:00、ドリンクL.O.18:30)、祝日11:00〜18:00", closedDaysInfo: "日曜定休、不定休あり" },
  { id: "ochanomizu-28", name: "さぼうる2", address: "東京都千代田区神田神保町1-11", lat: 35.6957, lng: 139.7578, smokingInfo: "全席禁煙", seatCountInfo: "50席", hoursInfo: "月〜土11:00〜19:00(料理L.O.18:00、ドリンクL.O.18:30)", closedDaysInfo: "日曜定休、祝日は不定休" },
  { id: "ochanomizu-29", name: "ミロンガ・ヌォーバ", address: "東京都千代田区神田神保町1-3", lat: 35.696, lng: 139.7583, outletInfo: "移転後カウンター席に電源設置、USB貸出も", smokingInfo: "全席禁煙", hoursInfo: "月・火・木・金11:30〜22:30(L.O.22:00)、土日祝11:30〜19:00(L.O.18:30)", closedDaysInfo: "水曜定休" },
  { id: "ochanomizu-30", name: "ラドリオ", address: "東京都千代田区神田神保町1-3", lat: 35.696, lng: 139.7584, outletInfo: "無料Wi-Fi＆電源コンセント完備との紹介あり", smokingInfo: "全席禁煙", seatCountInfo: "49席(カウンター7・テーブル42)", hoursInfo: "月・水・木・金11:30〜22:30(L.O.22:00)、土日祝12:00〜19:00(L.O.18:30)", closedDaysInfo: "火曜定休" },
  { id: "ochanomizu-31", name: "神田伯剌西爾", address: "東京都千代田区神田神保町1-7 小宮山ビルB1", lat: 35.6959, lng: 139.758, smokingInfo: "分煙(喫煙席34・禁煙席16、未成年不可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "50席", hoursInfo: "月〜土11:00〜21:00、日・祝11:00〜19:00" },
  { id: "ochanomizu-32", name: "古瀬戸珈琲店", address: "東京都千代田区神田小川町3-10 江本ビル2F", lat: 35.6958, lng: 139.7593, smokingInfo: "全席禁煙", seatCountInfo: "34席(カウンター12・テーブル22)", hoursInfo: "月〜金12:00〜20:00、土日祝13:00〜19:00", closedDaysInfo: "不定休(休業日はInstagramで告知)" },
  { id: "ochanomizu-33", name: "カフェ・トロワバグ", address: "東京都千代田区神田神保町1-12-1 富田ビルB1", lat: 35.6956, lng: 139.7575, outletInfo: "Wi-Fi・電源コンセントあり（1976年創業）" },
  { id: "ochanomizu-34", name: "トロワバグ ヴェール", address: "東京都千代田区神田猿楽町2-7-7 倉林ビル1F B室", lat: 35.6968, lng: 139.7518 },
  { id: "ochanomizu-35", name: "文房堂ギャラリーカフェ", address: "東京都千代田区神田神保町1-21-1", lat: 35.6953, lng: 139.7568 },
  { id: "ochanomizu-36", name: "GLITCH COFFEE & ROASTERS", address: "東京都千代田区神田錦町3-16 香村ビル1F", lat: 35.6935, lng: 139.7595 },
  { id: "ochanomizu-37", name: "壹眞珈琲店 神保町店", address: "東京都千代田区神田神保町1-8 山田ビルB1", lat: 35.6959, lng: 139.7579 },
  { id: "ochanomizu-38", name: "珈琲館 専大前本店", address: "東京都千代田区神田神保町3-1 日建ビル1F", lat: 35.6963, lng: 139.7548, outletInfo: "カウンター席に電源とWi-Fi、コンセント多数" },
  { id: "ochanomizu-39", name: "青海珈琲 神保町店", address: "東京都千代田区神田神保町1-24 加藤KKビル1F", lat: 35.6954, lng: 139.757, outletInfo: "電源・Wi-Fiあり、1杯100円からのコーヒー店" },
  { id: "ochanomizu-40", name: "TeaHouse TAKANO", address: "東京都千代田区神田神保町1-3-5 寿ビルB1", lat: 35.696, lng: 139.7582, outletInfo: "情報により電源の有無が分かれる（要確認）" },
  { id: "ochanomizu-41", name: "かふぇ あたらくしあ", address: "東京都千代田区神田神保町2-12-4 エスペランサ神田神保町III B1", lat: 35.6968, lng: 139.7548 },
  { id: "ochanomizu-42", name: "atacu cafe", address: "東京都千代田区神田神保町1-26", lat: 35.6953, lng: 139.7565 },
  { id: "ochanomizu-43", name: "きっさこ", address: "東京都千代田区神田神保町2-24-3", lat: 35.697, lng: 139.754 },
  { id: "ochanomizu-44", name: "神保町ブックハウスカフェ", address: "東京都千代田区神田神保町2-5 北沢ビル1F", lat: 35.6965, lng: 139.7563, smokingInfo: "全席禁煙、喫煙所なし", wifiInfo: "Wi-Fiあり", seatCountInfo: "総席数55席", hoursInfo: "月〜金11:00〜17:30(LO17:00)、土日11:00〜18:00(LO17:30)", closedDaysInfo: "年中無休(年末年始を除く)" },
  { id: "ochanomizu-45", name: "神保町ブックセンター", address: "東京都千代田区神田神保町2-3-1 岩波書店アネックス1-3F", lat: 35.6966, lng: 139.756, outletInfo: "窓際カウンター6席、各席テーブル面に2口コンセント", hoursInfo: "平日9:00〜19:00、土日祝10:00〜19:00" },
  { id: "ochanomizu-46", name: "スカイラウンジ暁（明治大学リバティタワー）", address: "東京都千代田区神田駿河台1-1 リバティタワー17F", lat: 35.6972, lng: 139.7628 },
  { id: "ochanomizu-47", name: "Basis Point 神保町店", address: "東京都千代田区神田神保町1-4-6 クロサワビル6F", lat: 35.6958, lng: 139.7578, outletInfo: "全席に電源・Wi-Fi完備（コワーキング）", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(高速Wi-Fi完備)", hoursInfo: "平日8:00〜22:00、土日祝10:00〜22:00", closedDaysInfo: "年中無休(年末年始12/31〜1/3を除く)" },
  { id: "ochanomizu-48", name: "Work Lounge WACRÉ", address: "東京都千代田区神田三崎町3-1-1 高橋セーフビル5F", lat: 35.6978, lng: 139.7524, outletInfo: "全席Wi-Fi・電源完備、充電ケーブル貸出あり", wifiInfo: "無料Wi-Fiあり(共用)", hoursInfo: "7:00〜22:00(ドロップイン利用時間、最終入店21:00)、会員はプランにより24時間利用可", closedDaysInfo: "年中無休(原則なし、土日祝も利用可)" },
  { id: "ochanomizu-49", name: "IGNIS", address: "東京都千代田区神田猿楽町2-8-11 VORT水道橋III 7・8・9階", lat: 35.6968, lng: 139.7518, outletInfo: "電源・Wi-Fi完備のコワーキングスペース", smokingInfo: "室内完全禁煙", wifiInfo: "Wi-Fiあり(NURO回線)", seatCountInfo: "総席数約50席(個室16室、固定席4席を含む)", hoursInfo: "24時間365日利用可(会員/入館者)、受付・見学対応は平日10:00〜18:00", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-50", name: "BIZcomfort 御茶ノ水", address: "東京都文京区本郷3-4-3 ヒルズ884お茶ノ水ビル5F", lat: 35.7018, lng: 139.7628, outletInfo: "各席にコンセントあり（24時間利用可）", wifiInfo: "無料Wi-Fiあり(共用)", hoursInfo: "コワーキング利用は24時間365日可能(会員)。受付・見学対応は9:00〜18:00", closedDaysInfo: "年中無休(年末年始を除く)" },
  { id: "ochanomizu-51", name: "axle御茶ノ水", address: "東京都千代田区神田小川町3", lat: 35.6968, lng: 139.7605, outletInfo: "屋上テラスにコンセント付きカウンターあり", wifiInfo: "無線LAN(Wi-Fi)あり", hoursInfo: "9:00〜18:00(固定席は平日22:00まで利用可、個室は24時間利用可)", closedDaysInfo: "日曜・祝日定休" },
  { id: "ochanomizu-52", name: "いいオフィス御茶ノ水 by GrinSpace", address: "東京都千代田区外神田2-2-18 東信お茶の水ビル1F", lat: 35.6998, lng: 139.7675, outletInfo: "電源完備、18席以上のコワーキングスペース", wifiInfo: "高速Wi-Fiあり(下り499Mbps/上り383Mbps)", seatCountInfo: "オープン席18席+半個室ブース・グラススペースあり", hoursInfo: "10:00〜18:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-53", name: "オトナリ珈琲", address: "東京都千代田区神田神保町2-48 2F", lat: 35.6975, lng: 139.7545, smokingInfo: "全席禁煙", seatCountInfo: "13席(カウンター7席、4人掛けテーブル1卓、2人掛けテーブル1卓)", hoursInfo: "月13:00〜18:00、火〜金・日12:00〜19:00、土12:00〜20:00(日によって変動あり)", closedDaysInfo: "不定休(店頭掲示の月間スケジュール参照)" },
];
