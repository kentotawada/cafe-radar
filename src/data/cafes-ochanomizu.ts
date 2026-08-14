import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は国土地理院の住所検索APIで解決した街区(番地)レベルの地点です
// (2026-08-14に全件更新)。建物単位ではないため、同じ番地の店は同じ点に
// なります。それ以前は住所からの大まかな推定で、実測で中央値174mずれて
// いました。経路・写真検索は店名+住所のテキストでGoogleマップに渡して
// いるため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認・閉店】ochanomizu-19(サンマルクカフェ 明治大学グローバルフロント
// 店): 食べログに「【閉店】このお店は現在閉店しております」と明記。サンマル
// クカフェ公式サイトの店舗ページも削除済み。新規項目は追加せず既存情報のまま
// にしてある。
//
// 【要確認・休業中】ochanomizu-46(スカイラウンジ暁・明治大学リバティタワー):
// 明治大学公式サイトによると厨房機器更新工事のため2026年8月1日から休業中、
// 再開は同年11月4日予定(調査時点)。新規項目は追加せず既存情報のままにして
// ある。
export const cafes: Cafe[] = [
  { id: "ochanomizu-01", name: "マクドナルド 御茶ノ水ソラシティ店", address: "東京都千代田区神田駿河台4-6-1 御茶ノ水ソラシティ B1F", lat: 35.698673, lng: 139.766403, outletInfo: "西側窓際カウンター11席、USB充電のみ設置", smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(FREE WiFi、登録不要)", seatCountInfo: "37席", hoursInfo: "7:00〜23:00(日曜22:00〜翌7:00は御茶ノ水ソラシティ全体のメンテナンスにより休業)" },
  { id: "ochanomizu-02", name: "マクドナルド 神保町店", address: "東京都千代田区神田神保町1-2-1", lat: 35.696373, lng: 139.760117, outletInfo: "3階中央カウンター20席中10席に2口コンセント", smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(FREE WiFi、登録不要)", seatCountInfo: "158席", hoursInfo: "6:30〜23:00" },
  { id: "ochanomizu-03", name: "スターバックス コーヒー 御茶ノ水ソラシティ店", address: "東京都千代田区神田駿河台4-6 御茶ノ水ソラシティ", lat: 35.698673, lng: 139.766403, outletInfo: "コンセント席16席あり、中央付近のテーブル席に設置", smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "月〜金7:00〜21:00、土日祝8:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-04", name: "スターバックス コーヒー お茶の水村田ビル店", address: "東京都千代田区神田駿河台2-5 村田ビルディング1F", lat: 35.700001, lng: 139.760956, outletInfo: "1階窓側と2階カウンターテーブルに電源あり", smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "月〜土7:00〜22:00、日祝8:00〜21:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-05", name: "スターバックス コーヒー お茶の水サンクレール店", address: "東京都千代田区神田駿河台4-3", lat: 35.698803, lng: 139.765167, outletInfo: "電源なし、90分目安の立ち寄り利用向け店舗", smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "月〜金7:00〜22:30、土7:00〜22:00、日祝8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-06", name: "ドトールコーヒーショップ お茶の水駿河台店", address: "東京都千代田区神田駿河台1-6", lat: 35.697113, lng: 139.762665, smokingInfo: "完全分煙、加熱式・紙タバコ対応の喫煙ブースあり(客席73席はすべて禁煙席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "73席(全席禁煙、喫煙ブース別途あり)", hoursInfo: "平日6:45〜20:00、土日祝8:00〜19:00" },
  { id: "ochanomizu-07", name: "ドトールコーヒーショップ 神保町駅前店", address: "東京都千代田区神田神保町1-10-1", lat: 35.696121, lng: 139.758408, outletInfo: "1・2階の窓際カウンターに電源、計15席以上", smokingInfo: "完全分煙、喫煙席(加熱式)・喫煙ブース(紙・加熱式)あり(104席中、禁煙85席・喫煙19席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "104席(禁煙85・喫煙19)", hoursInfo: "平日6:45〜22:00、土日祝7:45〜20:00" },
  { id: "ochanomizu-08", name: "タリーズコーヒー 神保町店", address: "東京都千代田区神田神保町2-7 神保町NKビル1F", lat: 35.695702, lng: 139.755798, outletInfo: "全2フロア110席のほとんどに2口コンセント完備", smokingInfo: "喫煙専用室あり(飲食不可)", wifiInfo: "無料Wi-Fiあり(Tully's Wi-Fi、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金7:00〜20:00、土8:00〜19:00、日9:00〜19:00" },
  { id: "ochanomizu-09", name: "タリーズコーヒー 神保町三井ビルディング店", address: "東京都千代田区神田神保町1-105 神保町三井ビルディング1F", lat: 35.694241, lng: 139.760376, outletInfo: "電源席ありとの情報も、塞がれ利用不可との口コミあり", smokingInfo: "加熱式タバコ専用室あり(飲食可)", wifiInfo: "無料Wi-Fiあり(Tully's Wi-Fi、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金7:30〜20:00、土日8:00〜19:00" },
  { id: "ochanomizu-10", name: "エクセルシオール カフェ 新お茶の水店", address: "東京都千代田区神田駿河台4-3 新お茶の水ビルディング サンクレールB1F", lat: 35.698803, lng: 139.765167, outletInfo: "客席にコンセントあり（具体的な席位置は要確認）", smokingInfo: "完全分煙、加熱式・紙タバコ対応の喫煙ブースあり(客席98席はすべて禁煙席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "98席(全席禁煙、喫煙ブース別途あり)", hoursInfo: "平日・土7:00〜22:00、日祝7:00〜21:00" },
  { id: "ochanomizu-11", name: "エクセルシオール カフェ お茶の水店", address: "東京都千代田区神田駿河台2-1 ユニオンビル1F", lat: 35.699497, lng: 139.762421, outletInfo: "入口左手窓際カウンター7席中4席にコンセントあり", smokingInfo: "完全分煙、加熱式・紙タバコ対応の喫煙ブースあり(客席82席はすべて禁煙席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "82席(全席禁煙、喫煙ブース別途あり)", hoursInfo: "平日6:45〜22:00、土日祝7:00〜21:00" },
  { id: "ochanomizu-12", name: "カフェ・ベローチェ 新御茶ノ水店", address: "東京都千代田区神田駿河台3-4-2 日専連朝日生命ビル1F", lat: 35.696365, lng: 139.765549, outletInfo: "電源コンセント＆Wi-Fiあり、作業利用者に人気", smokingInfo: "分煙、加熱式たばこ専用喫煙室・喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(Free-WiFi)", hoursInfo: "平日7:00〜21:00、土日祝7:00〜20:00" },
  { id: "ochanomizu-13", name: "カフェ・ベローチェ 神保町店", address: "東京都千代田区神田神保町1-8 漢陽商事ビル1F", lat: 35.696224, lng: 139.758972, outletInfo: "カウンター席はほぼ全席2口コンセント完備", smokingInfo: "全席禁煙、喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "7:00〜21:00" },
  { id: "ochanomizu-14", name: "PRONTO 御茶ノ水店", address: "東京都千代田区神田駿河台2-4-4 サンロイヤルビル1F", lat: 35.699505, lng: 139.76358, hoursInfo: "平日・祝前日6:30〜23:30(カフェタイム6:30〜17:30)、土・祝日8:00〜23:30(カフェタイム8:00〜17:30)、以降バータイム" },
  { id: "ochanomizu-15", name: "NEW YORKER'S Cafe 駿河台4丁目店", address: "東京都千代田区神田駿河台4-1-1 ウエルトンビル1F", lat: 35.698055, lng: 139.765045, outletInfo: "電源サービスあり（ルノアール系列店舗）", smokingInfo: "分煙(禁煙56席、加熱式たばこ専用席26席、紙巻きたばこ用喫煙ブースは飲食不可)", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi、Wi2、au Wi-Fi SPOT、BBモバイルポイント対応)", seatCountInfo: "82席(禁煙56・加熱式たばこ26)+紙巻きたばこ用喫煙ブース別途", hoursInfo: "月〜金7:00〜22:00、土8:00〜22:00、日祝8:00〜21:30" },
  { id: "ochanomizu-16", name: "喫茶室ルノアール 水道橋西口店", address: "東京都千代田区神田三崎町3-6-13 山京中央ビル1F", lat: 35.701458, lng: 139.751465, outletInfo: "電源サービスあり、携帯充電しながら寛げる", smokingInfo: "分煙(禁煙34席、加熱式たばこ専用席20席)", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi、Wi2、au Wi-Fi SPOT、BBモバイルポイント対応)", seatCountInfo: "54席(禁煙34・加熱式たばこ20)", hoursInfo: "月〜土7:30〜22:00、日祝8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-17", name: "サンマルクカフェ相鉄フレッサイン御茶ノ水神保町店", address: "東京都千代田区神田神保町1-19-7", lat: 35.695263, lng: 139.760468, outletInfo: "カウンター席に電源コンセントあり", smokingInfo: "全席禁煙(54席)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "54席(全席禁煙)", hoursInfo: "7:00〜22:00" },
  { id: "ochanomizu-18", name: "サンマルクカフェ 神保町すずらん通り店", address: "東京都千代田区神田神保町1-5-1", lat: 35.695469, lng: 139.759216, outletInfo: "壁沿いカウンター席・喫煙室丸テーブルに電源多数", smokingInfo: "分煙、喫煙ブースあり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "92席", hoursInfo: "7:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-19", name: "サンマルクカフェ 明治大学グローバルフロント店", address: "東京都千代田区神田駿河台2-1", lat: 35.699497, lng: 139.762421, outletInfo: "電源・Wi-Fi利用可能な店舗として紹介あり" },
  { id: "ochanomizu-20", name: "Delifrance お茶の水カフェベーカリー店", address: "東京都千代田区神田駿河台2-1 御茶の水クリスチャンセンター1F", lat: 35.699497, lng: 139.762421, outletInfo: "客席に充電コンセントあり（一部情報でなしとの声も）", smokingInfo: "禁煙(禁煙フリー)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "67席", hoursInfo: "月〜金7:00〜20:30、土7:00〜20:00、日・祝8:00〜20:00" },
  { id: "ochanomizu-21", name: "モスバーガー 水道橋西通り店", address: "東京都千代田区西神田2-5-8", lat: 35.698963, lng: 139.75383, outletInfo: "カウンター席にコンセント設置、電源カフェと紹介", smokingInfo: "全席禁煙", hoursInfo: "月〜金7:30〜20:00、土・日8:00〜18:00" },
  { id: "ochanomizu-22", name: "淡路坂珈琲 お茶の水店", address: "東京都千代田区神田淡路町2-9 JR紅梅橋高架下4号", lat: 35.698174, lng: 139.768005, outletInfo: "各席に電源あり、窓際席はテーブル下に設置", smokingInfo: "分煙(テラス席のみ喫煙可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "50席", hoursInfo: "7:30〜19:00", closedDaysInfo: "12/31・1/1のみ休み" },
  { id: "ochanomizu-23", name: "BOTTOS 没頭作業カフェ 御茶ノ水駅前店", address: "東京都千代田区神田駿河台2-6-10 田中ビル2-4F", lat: 35.699821, lng: 139.76416, outletInfo: "全席に電源完備（作業特化型カフェ）", wifiInfo: "無料Wi-Fiあり(高速Wi-Fi)", seatCountInfo: "60席", hoursInfo: "8:00〜22:00(将来的に24時間営業へ移行予定)", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-24", name: "MEDI CAFE", address: "東京都文京区湯島1-5-34 お茶の水医学会館1F", lat: 35.70274, lng: 139.76384, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "24席", hoursInfo: "平日9:30〜18:00", closedDaysInfo: "土日定休" },
  { id: "ochanomizu-25", name: "レストラン1899お茶の水", address: "東京都千代田区神田駿河台3-4", lat: 35.696365, lng: 139.765549, smokingInfo: "全席禁煙(テラス含む)", wifiInfo: "あり", seatCountInfo: "全76席(店内40席・テラス36席)", hoursInfo: "月〜土11:00〜22:00(料理L.O./ドリンクL.O.21:30)、日・祝11:00〜17:30", closedDaysInfo: "無休(日・祝のディナータイムのみ休業)" },
  { id: "ochanomizu-26", name: "喫茶 穂高", address: "東京都千代田区神田駿河台4-5-3 御茶ノ水穂高ビル1F", lat: 35.699562, lng: 139.765182, smokingInfo: "全席禁煙(2017年8月より)", seatCountInfo: "42席(カウンター4・テーブル2、4人掛け9卓)", hoursInfo: "月〜土8:00〜19:00", closedDaysInfo: "日曜・祝日" },
  { id: "ochanomizu-27", name: "さぼうる", address: "東京都千代田区神田神保町1-11", lat: 35.695465, lng: 139.758499, smokingInfo: "全席禁煙", seatCountInfo: "70席", hoursInfo: "月〜土11:00〜19:00(料理L.O.18:00、ドリンクL.O.18:30)、祝日11:00〜18:00", closedDaysInfo: "日曜定休、不定休あり" },
  { id: "ochanomizu-28", name: "さぼうる2", address: "東京都千代田区神田神保町1-11", lat: 35.695465, lng: 139.758499, smokingInfo: "全席禁煙", seatCountInfo: "50席", hoursInfo: "月〜土11:00〜19:00(料理L.O.18:00、ドリンクL.O.18:30)", closedDaysInfo: "日曜定休、祝日は不定休" },
  { id: "ochanomizu-29", name: "ミロンガ・ヌォーバ", address: "東京都千代田区神田神保町1-3", lat: 35.695683, lng: 139.759888, outletInfo: "移転後カウンター席に電源設置、USB貸出も", smokingInfo: "全席禁煙", hoursInfo: "月・火・木・金11:30〜22:30(L.O.22:00)、土日祝11:30〜19:00(L.O.18:30)", closedDaysInfo: "水曜定休" },
  { id: "ochanomizu-30", name: "ラドリオ", address: "東京都千代田区神田神保町1-3", lat: 35.695683, lng: 139.759888, outletInfo: "無料Wi-Fi＆電源コンセント完備との紹介あり", smokingInfo: "全席禁煙", seatCountInfo: "49席(カウンター7・テーブル42)", hoursInfo: "月・水・木・金11:30〜22:30(L.O.22:00)、土日祝12:00〜19:00(L.O.18:30)", closedDaysInfo: "火曜定休" },
  { id: "ochanomizu-31", name: "神田伯剌西爾", address: "東京都千代田区神田神保町1-7 小宮山ビルB1", lat: 35.695789, lng: 139.759201, smokingInfo: "分煙(喫煙席34・禁煙席16、未成年不可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "50席", hoursInfo: "月〜土11:00〜21:00、日・祝11:00〜19:00" },
  { id: "ochanomizu-32", name: "古瀬戸珈琲店", address: "東京都千代田区神田小川町3-10 江本ビル2F", lat: 35.696098, lng: 139.761169, smokingInfo: "全席禁煙", seatCountInfo: "34席(カウンター12・テーブル22)", hoursInfo: "月〜金12:00〜20:00、土日祝13:00〜19:00", closedDaysInfo: "不定休(休業日はInstagramで告知)" },
  { id: "ochanomizu-33", name: "カフェ・トロワバグ", address: "東京都千代田区神田神保町1-12-1 富田ビルB1", lat: 35.696396, lng: 139.758362, outletInfo: "Wi-Fi・電源コンセントあり（1976年創業）", smokingInfo: "全席禁煙", seatCountInfo: "34席(カウンター7席・テーブル8卓27席)", hoursInfo: "月〜金10:00〜20:00、土・祝12:00〜19:00", closedDaysInfo: "日曜定休" },
  { id: "ochanomizu-34", name: "トロワバグ ヴェール", address: "東京都千代田区神田猿楽町2-7-7 倉林ビル1F B室", lat: 35.700432, lng: 139.757385, hoursInfo: "火〜金12:00〜19:00(L.O.18:30)、土日祝12:00〜18:00(L.O.17:30)", closedDaysInfo: "月曜定休" },
  { id: "ochanomizu-35", name: "文房堂ギャラリーカフェ", address: "東京都千代田区神田神保町1-21-1", lat: 35.69529, lng: 139.761002, closedDaysInfo: "年末年始のみ休業(ほぼ年中無休)" },
  { id: "ochanomizu-36", name: "GLITCH COFFEE & ROASTERS", address: "東京都千代田区神田錦町3-16 香村ビル1F", lat: 35.693691, lng: 139.761383, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "16席(カウンター中心)", hoursInfo: "月〜金8:00〜19:00、土日祝9:00〜19:00", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-37", name: "壹眞珈琲店 神保町店", address: "東京都千代田区神田神保町1-8 山田ビルB1", lat: 35.696224, lng: 139.758972, smokingInfo: "全席喫煙可(2020年健康増進法改正の影響で現在は変更の可能性あり、要確認)", seatCountInfo: "27席(カウンター7席・4人掛けテーブル5卓)", hoursInfo: "月〜金11:30〜22:00、土12:00〜22:00、日・祝12:00〜21:00" },
  { id: "ochanomizu-38", name: "珈琲館 専大前本店", address: "東京都千代田区神田神保町3-1 日建ビル1F", lat: 35.69566, lng: 139.755081, outletInfo: "カウンター席に電源とWi-Fi、コンセント多数", smokingInfo: "全席禁煙、喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:30〜22:00、土日祝8:00〜20:00", closedDaysInfo: "無休" },
  { id: "ochanomizu-39", name: "青海珈琲 神保町店", address: "東京都千代田区神田神保町1-24 加藤KKビル1F", lat: 35.6973, lng: 139.759415, outletInfo: "電源・Wi-Fiあり、1杯100円からのコーヒー店", hoursInfo: "平日7:30〜20:00、土日祝10:00〜19:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-40", name: "TeaHouse TAKANO", address: "東京都千代田区神田神保町1-3-5 寿ビルB1", lat: 35.695683, lng: 139.759888, outletInfo: "情報により電源の有無が分かれる（要確認）", hoursInfo: "平日11:30〜19:00、土曜・祝日11:30〜18:30", closedDaysInfo: "日曜定休" },
  { id: "ochanomizu-41", name: "かふぇ あたらくしあ", address: "東京都千代田区神田神保町2-12-4 エスペランサ神田神保町III B1", lat: 35.696617, lng: 139.756882, hoursInfo: "月〜金11:00〜20:00(L.O.19:30)、土11:00〜18:00(L.O.17:30、祝日は短縮の場合あり)", closedDaysInfo: "日曜・第3月曜定休" },
  { id: "ochanomizu-42", name: "atacu cafe", address: "東京都千代田区神田神保町1-26", lat: 35.697201, lng: 139.759171, seatCountInfo: "13席", hoursInfo: "平日9:00〜19:00、日12:00〜17:00", closedDaysInfo: "土曜定休(日祝も休業となる場合あり)" },
  { id: "ochanomizu-43", name: "きっさこ", address: "東京都千代田区神田神保町2-24-3", lat: 35.697613, lng: 139.757095, smokingInfo: "全席禁煙", seatCountInfo: "18席(テーブル2席×3、4席×3)", hoursInfo: "火〜金12:00〜17:00、土日祝12:00〜18:00", closedDaysInfo: "月曜定休(不定休あり)" },
  { id: "ochanomizu-44", name: "神保町ブックハウスカフェ", address: "東京都千代田区神田神保町2-5 北沢ビル1F", lat: 35.695709, lng: 139.756622, smokingInfo: "全席禁煙、喫煙所なし", wifiInfo: "Wi-Fiあり", seatCountInfo: "総席数55席", hoursInfo: "月〜金11:00〜17:30(LO17:00)、土日11:00〜18:00(LO17:30)", closedDaysInfo: "年中無休(年末年始を除く)" },
  { id: "ochanomizu-45", name: "神保町ブックセンター", address: "東京都千代田区神田神保町2-3-1 岩波書店アネックス1-3F", lat: 35.695724, lng: 139.757355, outletInfo: "窓際カウンター6席、各席テーブル面に2口コンセント", hoursInfo: "平日9:00〜19:00、土日祝10:00〜19:00" },
  { id: "ochanomizu-46", name: "スカイラウンジ暁（明治大学リバティタワー）", address: "東京都千代田区神田駿河台1-1 リバティタワー17F", lat: 35.697712, lng: 139.761398 },
  { id: "ochanomizu-47", name: "Basis Point 神保町店", address: "東京都千代田区神田神保町1-4-6 クロサワビル6F", lat: 35.696312, lng: 139.759811, outletInfo: "全席に電源・Wi-Fi完備（コワーキング）", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(高速Wi-Fi完備)", hoursInfo: "平日8:00〜22:00、土日祝10:00〜22:00", closedDaysInfo: "年中無休(年末年始12/31〜1/3を除く)" },
  { id: "ochanomizu-48", name: "Work Lounge WACRÉ", address: "東京都千代田区神田三崎町3-1-1 高橋セーフビル5F", lat: 35.699371, lng: 139.753082, outletInfo: "全席Wi-Fi・電源完備、充電ケーブル貸出あり", wifiInfo: "無料Wi-Fiあり(共用)", hoursInfo: "7:00〜22:00(ドロップイン利用時間、最終入店21:00)、会員はプランにより24時間利用可", closedDaysInfo: "年中無休(原則なし、土日祝も利用可)" },
  { id: "ochanomizu-49", name: "IGNIS", address: "東京都千代田区神田猿楽町2-8-11 VORT水道橋III 7・8・9階", lat: 35.700775, lng: 139.757187, outletInfo: "電源・Wi-Fi完備のコワーキングスペース", smokingInfo: "室内完全禁煙", wifiInfo: "Wi-Fiあり(NURO回線)", seatCountInfo: "総席数約50席(個室16室、固定席4席を含む)", hoursInfo: "24時間365日利用可(会員/入館者)、受付・見学対応は平日10:00〜18:00", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-50", name: "BIZcomfort 御茶ノ水", address: "東京都文京区本郷3-4-3 ヒルズ884お茶ノ水ビル5F", lat: 35.703442, lng: 139.763321, outletInfo: "各席にコンセントあり（24時間利用可）", wifiInfo: "無料Wi-Fiあり(共用)", hoursInfo: "コワーキング利用は24時間365日可能(会員)。受付・見学対応は9:00〜18:00", closedDaysInfo: "年中無休(年末年始を除く)" },
  { id: "ochanomizu-51", name: "axle御茶ノ水", address: "東京都千代田区神田小川町3", lat: 35.6954, lng: 139.762405, outletInfo: "屋上テラスにコンセント付きカウンターあり", wifiInfo: "無線LAN(Wi-Fi)あり", hoursInfo: "9:00〜18:00(固定席は平日22:00まで利用可、個室は24時間利用可)", closedDaysInfo: "日曜・祝日定休" },
  { id: "ochanomizu-52", name: "いいオフィス御茶ノ水 by GrinSpace", address: "東京都千代田区外神田2-2-18 東信お茶の水ビル1F", lat: 35.699516, lng: 139.767456, outletInfo: "電源完備、18席以上のコワーキングスペース", wifiInfo: "高速Wi-Fiあり(下り499Mbps/上り383Mbps)", seatCountInfo: "オープン席18席+半個室ブース・グラススペースあり", hoursInfo: "10:00〜18:00", closedDaysInfo: "不定休" },
  { id: "ochanomizu-53", name: "オトナリ珈琲", address: "東京都千代田区神田神保町2-48 2F", lat: 35.698292, lng: 139.756714, smokingInfo: "全席禁煙", seatCountInfo: "13席(カウンター7席、4人掛けテーブル1卓、2人掛けテーブル1卓)", hoursInfo: "月13:00〜18:00、火〜金・日12:00〜19:00、土12:00〜20:00(日によって変動あり)", closedDaysInfo: "不定休(店頭掲示の月間スケジュール参照)" },
  // 以下、2026年8月に追加調査した54件目以降。店名・住所はウェブ検索で実在確認済み。
  // 座標は住所から推定した目安地点。確認できなかった項目(電源/Wi-Fi/喫煙/席数/
  // 営業時間/定休日)は空欄のまま(推測では埋めていない)。チェーン店のWi-Fi・
  // 喫煙方針など全店共通の公表情報のみ、個別未確認でも記載している。
  { id: "ochanomizu-54", name: "ドトールコーヒーショップ 御茶ノ水北店", address: "東京都千代田区外神田2-19-3 お茶の水木村ビル", lat: 35.702492, lng: 139.76651, wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)" },
  { id: "ochanomizu-55", name: "ドトールコーヒーショップ 神田小川町店", address: "東京都千代田区神田小川町2-2", lat: 35.694706, lng: 139.764847, wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)" },
  { id: "ochanomizu-56", name: "エクセルシオール カフェ お茶の水日本大学店", address: "東京都千代田区神田駿河台1-6 日本大学お茶の水校舎1F", lat: 35.697113, lng: 139.762665, outletInfo: "全席に電源あり", smokingInfo: "全席禁煙(74席)", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi、1回1時間まで繰り返し利用可)", seatCountInfo: "74席(全席禁煙)", hoursInfo: "平日7:00〜21:00、土・祝8:00〜19:00" },
  { id: "ochanomizu-57", name: "スターバックス コーヒー 都営神保町駅店", address: "東京都千代田区神田神保町2-7 都営三田線・新宿線神保町駅構内", lat: 35.695702, lng: 139.755798, smokingInfo: "全店舗禁煙方針、屋内客席は全店禁煙(喫煙所なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo Wi-Fi・SoftBank Wi-Fiスポットにも対応)", hoursInfo: "7:00〜22:30" },
  { id: "ochanomizu-58", name: "星乃珈琲店 御茶ノ水店", address: "東京都千代田区神田駿河台2-4 ウィーンビル2F", lat: 35.699505, lng: 139.76358 },
  { id: "ochanomizu-59", name: "タリーズコーヒー 三井住友海上駿河台ビル店", address: "東京都千代田区神田駿河台3-9 三井住友海上駿河台ビルB1F", lat: 35.696598, lng: 139.764236, wifiInfo: "無料Wi-Fiあり(Tully's Wi-Fi、登録不要で利用規約に同意するだけ)", hoursInfo: "平日7:30〜20:00", closedDaysInfo: "土日定休" },
  { id: "ochanomizu-60", name: "マクドナルド 水道橋外堀通り店", address: "東京都文京区後楽1-1-17 TK-EASTビル", lat: 35.702358, lng: 139.754776, smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(FREE WiFi、登録不要)", seatCountInfo: "176席", hoursInfo: "24時間営業", closedDaysInfo: "年中無休" },
  { id: "ochanomizu-61", name: "ジョナサン 水道橋店", address: "東京都文京区本郷1-22-6", lat: 35.705185, lng: 139.75499, smokingInfo: "全席禁煙(すかいらーくグループ方針)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "7:00〜翌5:00" },
  { id: "ochanomizu-62", name: "画廊喫茶ミロ", address: "東京都千代田区神田駿河台2-4-6", lat: 35.699505, lng: 139.76358, closedDaysInfo: "日曜・不定休(営業日は公式X等で告知)" },
  { id: "ochanomizu-63", name: "茶房きゃんどる", address: "東京都千代田区神田神保町1-103 東京パークタワー1F", lat: 35.694244, lng: 139.759079, hoursInfo: "10:00〜19:00", closedDaysInfo: "第1土曜・日曜・祝日定休" },
  { id: "ochanomizu-64", name: "CAFE Rijn", address: "東京都千代田区神田三崎町2-11-12 アイロン三崎町1F", lat: 35.700874, lng: 139.754227, hoursInfo: "月〜金9:00〜23:00、土10:00〜15:00", closedDaysInfo: "日曜・祝日定休" },
  { id: "ochanomizu-65", name: "イトウコーヒー店", address: "東京都千代田区神田錦町3-8 ランドステージお茶の水1F", lat: 35.693272, lng: 139.762115 },
  { id: "ochanomizu-66", name: "珈琲舎 蔵", address: "東京都千代田区神田神保町1-26 矢崎ビル2F", lat: 35.697201, lng: 139.759171 },
  { id: "ochanomizu-67", name: "ギャラリー珈琲店 古瀬戸", address: "東京都千代田区神田神保町1-7 NSEビル1F", lat: 35.695789, lng: 139.759201 },
  { id: "ochanomizu-68", name: "喫茶プペ", address: "東京都千代田区神田錦町3-13-11", lat: 35.69221436, lng: 139.76225838 },
  { id: "ochanomizu-69", name: "優美堂", address: "東京都千代田区神田小川町2-4", lat: 35.694618, lng: 139.763977, hoursInfo: "月・火・木・日・祝11:30〜18:00(L.O.17:30)、金・土11:30〜21:00(L.O.20:30)", closedDaysInfo: "水曜定休" },
  { id: "ochanomizu-70", name: "バロン", address: "東京都千代田区神田錦町2-7-1 東和ビル1F", lat: 35.691624, lng: 139.762909 },
  { id: "ochanomizu-71", name: "豆香房 神保町店", address: "東京都千代田区神田神保町1-39-9", lat: 35.694763, lng: 139.760468, hoursInfo: "平日7:30〜18:30、土9:00〜17:30、日12:00〜17:00", closedDaysInfo: "祝日定休" },
  { id: "ochanomizu-72", name: "自家焙煎珈琲みじんこ", address: "東京都文京区湯島2-9-10 湯島三組ビル1F", lat: 35.704006, lng: 139.766953 },
  { id: "ochanomizu-73", name: "ヒナタ屋", address: "東京都千代田区神田小川町3-10 振天堂ビル4F", lat: 35.696098, lng: 139.761169 },
  { id: "ochanomizu-74", name: "Muusa", address: "東京都千代田区神田猿楽町1-3-5 久野ビル1F", lat: 35.697914, lng: 139.759445, smokingInfo: "分煙(ランチタイム14:00までは禁煙)", seatCountInfo: "13席(4人掛けテーブル3卓+1人席)", hoursInfo: "月〜金12:00〜17:00", closedDaysInfo: "土日定休" },
  { id: "ochanomizu-75", name: "石窯パン焼き茶房タムタム", address: "東京都千代田区神田神保町1-9", lat: 35.695793, lng: 139.758453 },
  { id: "ochanomizu-76", name: "グッドモーニングカフェ 錦町", address: "東京都千代田区神田錦町3-20 錦町トラッドスクエア1F", lat: 35.693386, lng: 139.76088 },
  { id: "ochanomizu-77", name: "カフェ&ベーカリー MIYABI 神保町", address: "東京都千代田区西神田2-1-13", lat: 35.698727, lng: 139.7565 },
  { id: "ochanomizu-78", name: "サクラカフェ神保町", address: "東京都千代田区神田神保町2-21-4", lat: 35.695072, lng: 139.756744 },
  { id: "ochanomizu-79", name: "BURGERS CAFE GRILL FUKUYOSHI", address: "東京都千代田区神田猿楽町1-3-4 島崎ビル1F", lat: 35.697914, lng: 139.759445 },
  { id: "ochanomizu-80", name: "ONCA COFFEE 神田店", address: "東京都千代田区神田錦町3-1 安田シーケンスタワー", lat: 35.692589, lng: 139.761765 },
  { id: "ochanomizu-81", name: "Social Good Roasters", address: "東京都千代田区神田錦町1-14-13 LANDPOOL KANDA TERRACE 2F", lat: 35.693806, lng: 139.764252 },
  { id: "ochanomizu-82", name: "cafe,Dining&Bar 104.5", address: "東京都千代田区神田淡路町2-101 ワテラスタワー2F", lat: 35.697632, lng: 139.766876 },
  { id: "ochanomizu-83", name: "COTTI COFFEE 神保町店", address: "東京都千代田区神田神保町1-5-4", lat: 35.695469, lng: 139.759216 },
  { id: "ochanomizu-84", name: "カンダコーヒー", address: "東京都千代田区神田神保町2-38-10 多幸ビル1F", lat: 35.697594, lng: 139.754822 },
  { id: "ochanomizu-85", name: "アボカフェ", address: "東京都千代田区神田神保町1-2-9 ウエルスビル3F", lat: 35.696373, lng: 139.760117 },
  { id: "ochanomizu-86", name: "アディロンダックカフェ", address: "東京都千代田区神田神保町1-2-9 ウェルスビル4F", lat: 35.696373, lng: 139.760117 },
  { id: "ochanomizu-87", name: "眞踏珈琲店", address: "東京都千代田区神田小川町3-1-7", lat: 35.694458, lng: 139.762344 },
  { id: "ochanomizu-88", name: "カフェ・デ・プリマベーラ", address: "東京都千代田区神田猿楽町1-3-2 内田ビル1F", lat: 35.697914, lng: 139.759445 },
  { id: "ochanomizu-89", name: "センダイカフェ", address: "東京都千代田区神田神保町3-4-1 専修大学10号館1F", lat: 35.696228, lng: 139.753281 },
  { id: "ochanomizu-90", name: "Cafe Lish", address: "東京都千代田区一ツ橋2-3-1 小学館ビル1F", lat: 35.694153, lng: 139.758224 },
  { id: "ochanomizu-91", name: "ブックカフェ 二十世紀", address: "東京都千代田区神田神保町2-5-4 開拓社ビル2F", lat: 35.695709, lng: 139.756622 },
  { id: "ochanomizu-92", name: "クラインブルー", address: "東京都千代田区神田神保町1-7 三光堂ビル2F", lat: 35.695789, lng: 139.759201 },
  { id: "ochanomizu-93", name: "Cafe Inclusion", address: "東京都千代田区神田錦町3-7 神田旅館組合ビル1F", lat: 35.692181, lng: 139.759201 },
  { id: "ochanomizu-94", name: "THE SEVEN'S HOUSE", address: "東京都千代田区神田錦町3-28 学士会館1F", lat: 35.693356, lng: 139.758942 },
];
