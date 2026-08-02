import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認・閉店】新規項目を追加せず既存情報のままにしてある:
// - takadanobaba-06(サイゼリヤ 高田馬場東早稲田通り店): 2022年1月11日閉店
// - takadanobaba-26(COTTI COFFEE 高田馬場店): 食べログ【閉店】表示
// - takadanobaba-31(BowRabit TOKYO 高田馬場本店): 食べログ【閉店】表示、
//   公式ドメインも解決不可
// - takadanobaba-33(Cafe au lait Tokyo): 高田馬場の住所から品川区五反田へ
//   移転済み(食べログが「移転前の店舗情報」と明記)
export const cafes: Cafe[] = [
  { id: "takadanobaba-01", name: "マクドナルド 高田馬場駅前店", address: "東京都新宿区高田馬場2-18-11", lat: 35.7124, lng: 139.7054, outletInfo: "窓際ハイカウンター席に電源あり、USB充電も可能", smokingInfo: "屋内禁煙(2014年8月1日より全店舗で屋内禁煙、喫煙室なし)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "86席", hoursInfo: "7:00〜22:00" },
  { id: "takadanobaba-02", name: "ガスト 高田馬場駅前店", address: "東京都新宿区高田馬場1-26-7 名店ビル2F", lat: 35.7122, lng: 139.7036, outletInfo: "自由に使えるコンセントあり、机の下にも設置", smokingInfo: "全席禁煙(敷地内禁煙、すかいらーくグループ全店方針)", wifiInfo: "無料Wi-Fiあり(すかいらーくグループ共通)", seatCountInfo: "86席", hoursInfo: "8:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-03", name: "デニーズ 高田馬場店", address: "東京都豊島区高田3-26-3", lat: 35.7155, lng: 139.7082, outletInfo: "全席に電源あり、ひとり席中心に確保", smokingInfo: "全席禁煙(2020年4月1日より全店全面禁煙化)", seatCountInfo: "130席", hoursInfo: "平日6:30〜23:00、土日6:30〜24:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-04", name: "サイゼリヤ ビッグボックス高田馬場店", address: "東京都新宿区高田馬場1-35-3 BIGBOX高田馬場9F", lat: 35.7134, lng: 139.7033, smokingInfo: "全席禁煙(2019年6月より全店全席禁煙化済み)", hoursInfo: "10:00〜翌5:00(L.O.4:30)", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-06", name: "サイゼリヤ 高田馬場東早稲田通り店", address: "東京都新宿区高田馬場2-13-2 PrimegateビルB1", lat: 35.712, lng: 139.7065 },
  { id: "takadanobaba-07", name: "スターバックス コーヒー 西武高田馬場駅店", address: "東京都新宿区高田馬場1-35-2 高田馬場西武ラチ内コンコース", lat: 35.7131, lng: 139.7032, outletInfo: "カウンター席に電源あり、使える席は4席ほど", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "6:30〜22:30", closedDaysInfo: "不定休" },
  { id: "takadanobaba-08", name: "スターバックス コーヒー 高田馬場早稲田通り店", address: "東京都新宿区高田馬場1-25-32 108ビル1F", lat: 35.7124, lng: 139.704, outletInfo: "2階中央テーブルに電源あり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "全50席(1F・地下1F・2Fの3フロアに分散)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "takadanobaba-09", name: "ドトールコーヒーショップ 高田馬場4丁目店", address: "東京都新宿区高田馬場4-8-4", lat: 35.7139, lng: 139.7031, outletInfo: "電源なし、との情報あり", smokingInfo: "分煙(喫煙席・喫煙ブースあり、完全分煙)", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "全59席(禁煙48・喫煙11)", hoursInfo: "平日6:45〜21:00、土曜7:30〜21:00、日祝7:30〜21:00" },
  { id: "takadanobaba-10", name: "ドトールコーヒーショップ 高田馬場1丁目店", address: "東京都新宿区高田馬場1-17-16 中村ビル1F", lat: 35.7108, lng: 139.7028, outletInfo: "電源・Wi-Fiあり（電源カフェ検索調べ）", smokingInfo: "分煙(店内116席は全席禁煙、別途喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "全116席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜21:00、土曜7:30〜20:00、日祝8:00〜20:00" },
  { id: "takadanobaba-11", name: "タリーズコーヒー Emio Style BIGBOX高田馬場店", address: "東京都新宿区高田馬場1-35-3 BIGBOX高田馬場2F", lat: 35.7134, lng: 139.7033, outletInfo: "窓際カウンターに電源あり、ACとUSB両対応", smokingInfo: "禁煙(店内喫煙不可)", wifiInfo: "無料Wi-Fiあり(tullys_Wi-Fi、会員登録不要・利用時間制限なし)", seatCountInfo: "全71席", hoursInfo: "8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-12", name: "エクセルシオール カフェ 高田馬場駅前店", address: "東京都新宿区高田馬場2-17-6 ゆう文ビル2F", lat: 35.7127, lng: 139.7052, outletInfo: "フリーWi-Fiと電源席あり", smokingInfo: "全65席禁煙、別途喫煙ブース(紙巻・加熱式たばこ)あり", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi/Wi2premium)", seatCountInfo: "65席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜22:00、土日祝8:00〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-13", name: "カフェ・ベローチェ 西早稲田店", address: "東京都新宿区西早稲田2-21-16 高田馬場EKKビル1F", lat: 35.7071, lng: 139.7043, outletInfo: "窓際等の座面下に2口コンセント、計4席分", smokingInfo: "全席禁煙", wifiInfo: "会員登録不要の無料Wi-Fiあり(+veloce_free_wifi)", seatCountInfo: "70席", hoursInfo: "7:00〜21:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-14", name: "PRONTO 高田馬場店", address: "東京都新宿区高田馬場1-33-13 千年ビルB1F", lat: 35.712, lng: 139.7033, outletInfo: "木製大テーブルに電源あり、約10席で利用可", smokingInfo: "分煙(禁煙席・加熱式たばこ専用席)", wifiInfo: "無料Wi-Fiあり(PRONTO_FREE_Wi-Fi)", seatCountInfo: "117席", hoursInfo: "月〜金7:00〜17:59(カフェ)/18:00〜21:30(バー)、土日7:00〜18:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-15", name: "コメダ珈琲店 高田馬場駅前店", address: "東京都新宿区高田馬場3-2-5 フレンドビル2F", lat: 35.7118, lng: 139.705, outletInfo: "コンセントなし、Wi-Fiのみ利用可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(Komeda_Wi-Fi)", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-16", name: "喫茶室ルノアール 高田馬場駅前店", address: "東京都新宿区高田馬場4-8-7 花川ビル2F", lat: 35.7135, lng: 139.7032, outletInfo: "電源サービス完備、複数Wi-Fiも利用可", smokingInfo: "禁煙55席・加熱式たばこ専用喫煙席18席、紙巻きたばこ専用喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "73席(禁煙55+加熱式喫煙18、別途喫煙ブース)", hoursInfo: "7:30〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-17", name: "喫茶室ルノアール 高田馬場1丁目店", address: "東京都新宿区高田馬場1-34-12 竹内ビル1F", lat: 35.7119, lng: 139.7028, outletInfo: "電源あり、禁煙席61席の落ち着いた店内", smokingInfo: "禁煙61席・喫煙(加熱式たばこ専用)28席", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "89席(禁煙61+加熱式喫煙28、別途喫煙ブース)", hoursInfo: "月〜土7:30〜22:00、日祝8:00〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-18", name: "喫茶室ルノアール 高田馬場2丁目店", address: "東京都新宿区高田馬場2-18-6 柳屋ビル1F", lat: 35.7126, lng: 139.7048, outletInfo: "電源あり、禁煙席58席・喫煙席20席", smokingInfo: "禁煙58席・加熱式たばこ専用喫煙席20席", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "78席(禁煙58+加熱式喫煙20)", hoursInfo: "月〜金7:30〜22:00、土日祝8:00〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-19", name: "モスバーガー 高田馬場四丁目店", address: "東京都新宿区高田馬場4-9-14", lat: 35.7145, lng: 139.7028, outletInfo: "1階優先カウンター席にコンセント2個あり", smokingInfo: "全席禁煙", seatCountInfo: "40席" },
  { id: "takadanobaba-20", name: "フレッシュネスバーガー 高田馬場店", address: "東京都新宿区高田馬場1-17-15", lat: 35.71, lng: 139.7025, outletInfo: "コンセントあり、Wi-Fiも完備", smokingInfo: "完全禁煙(喫煙専用室あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "57席", hoursInfo: "9:00〜22:00(L.O.21:40)" },
  { id: "takadanobaba-21", name: "ベックスコーヒーショップ 高田馬場店", address: "東京都新宿区高田馬場1-35-2（高田馬場駅構内）", lat: 35.713, lng: 139.7035, outletInfo: "店内奥の一人掛け椅子に電源席あり", smokingInfo: "分煙(喫煙可のエリアあり、最新情報は要確認)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "45席", hoursInfo: "平日6:30〜21:00、土日祝6:30〜20:00" },
  { id: "takadanobaba-22", name: "Delifrance BIGBOX高田馬場店", address: "東京都新宿区高田馬場1-35-3 BIGBOX高田馬場1F", lat: 35.7134, lng: 139.7033, smokingInfo: "禁煙", wifiInfo: "フリーWi-Fiあり", seatCountInfo: "31席", hoursInfo: "月〜日・祝日7:00〜22:00(ドリンクL.O.閉店30分前)" },
  { id: "takadanobaba-23", name: "カフェ・ド・クリエ 高田馬場店", address: "東京都新宿区高田馬場4-8-7 花川ビル1F", lat: 35.7135, lng: 139.7032, outletInfo: "カウンター席に電源コンセントあり", smokingInfo: "分煙(最新情報は要確認)", seatCountInfo: "90席", hoursInfo: "月火水木6:45〜21:00、金・日7:30〜21:00、土7:00〜21:00", closedDaysInfo: "なし(無休)" },
  { id: "takadanobaba-24", name: "星乃珈琲店 高田馬場店", address: "東京都新宿区高田馬場2-17-15 唐橋ビル2F", lat: 35.7124, lng: 139.7053, outletInfo: "コンセント・Wi-Fiともになし、との口コミあり", smokingInfo: "禁煙(喫煙ブースあり)", wifiInfo: "Wi-Fiなし", hoursInfo: "月火水木金日10:00〜22:00(L.O.21:15)、土10:00〜22:30(L.O.21:45)" },
  { id: "takadanobaba-25", name: "COSTA COFFEE 高田馬場店", address: "東京都新宿区高田馬場2-14-2 B1F", lat: 35.7115, lng: 139.7062, smokingInfo: "全席禁煙", seatCountInfo: "100席" },
  { id: "takadanobaba-26", name: "COTTI COFFEE 高田馬場店", address: "東京都新宿区高田馬場1-33-15 TFT高田馬場駅前ビル1F", lat: 35.7133, lng: 139.7025 },
  { id: "takadanobaba-27", name: "NEW YORKER'S Cafe 高田馬場1丁目店", address: "東京都新宿区高田馬場1-33-13 千年ビル1F", lat: 35.712, lng: 139.7033, outletInfo: "窓際カウンター席で電源使用可、6席ほど", smokingInfo: "分煙:禁煙55席、加熱式たばこ可27席、紙巻きたばこ専用喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi等)、電源あり", seatCountInfo: "82席(禁煙55席・喫煙27席)", hoursInfo: "月〜土7:00〜22:00、日・祝日7:30〜22:00", closedDaysInfo: "なし(年中無休)" },
  { id: "takadanobaba-28", name: "10°CAFE（ジュードカフェ）", address: "東京都豊島区高田3-12-8", lat: 35.7148, lng: 139.7065, outletInfo: "1階2階全席に電源完備", wifiInfo: "全席電源＆Wi-Fi完備(無料Wi-Fiあり)", hoursInfo: "平日9:00〜20:30(L.O.20:00)、休日11:00〜20:30(L.O.20:00)、夜CAFE金・土20:30〜23:30(L.O.23:00)", closedDaysInfo: "第3日曜日" },
  { id: "takadanobaba-29", name: "LUCAS FARM CAFE", address: "東京都新宿区高田馬場1-26-5 F・Iビル4F", lat: 35.7122, lng: 139.7038, outletInfo: "電源・コンセントあり、Wi-Fi完備、30席以上", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜20:00(L.O.19:30)", closedDaysInfo: "不定休" },
  { id: "takadanobaba-30", name: "cat cafe にゃんこと", address: "東京都新宿区高田馬場2-14-6 スワンビル201", lat: 35.7118, lng: 139.706, outletInfo: "電源・Wi-Fi無料、作業スペースとしても利用可", wifiInfo: "あり", closedDaysInfo: "年中無休(臨時休業・貸切営業日あり)" },
  { id: "takadanobaba-31", name: "BowRabit TOKYO 高田馬場本店", address: "東京都新宿区高田馬場4-12-7", lat: 35.7148, lng: 139.7025, outletInfo: "入って左側カウンターで電源使用可" },
  { id: "takadanobaba-33", name: "Cafe au lait Tokyo", address: "東京都新宿区高田馬場4-2-28", lat: 35.7138, lng: 139.703, outletInfo: "壁際カウンター席で電源使用可" },
  { id: "takadanobaba-35", name: "虫二（ちゅうじ）", address: "東京都新宿区高田馬場2-14-5 ROZZO1F", lat: 35.7117, lng: 139.7061, smokingInfo: "全席禁煙", seatCountInfo: "10席(手前席4名まで・奥席6名までの茶席)", hoursInfo: "11:00〜18:00(月・水・金・土・日・祝日・祝前日・祝後日営業、7〜9月は夏季限定カフェ営業あり)", closedDaysInfo: "火曜日・木曜日(不定休あり、詳細はSNSで要確認)" },
  { id: "takadanobaba-36", name: "イントロ（JazzSpot Intro）", address: "東京都新宿区高田馬場2-14-8", lat: 35.7117, lng: 139.7061, hoursInfo: "火〜金・日18:30〜24:00、土18:30〜翌4:30", closedDaysInfo: "月曜日(『イントロ安息日』)" },
  { id: "takadanobaba-37", name: "パンデュール", address: "東京都新宿区下落合1-3-19", lat: 35.7145, lng: 139.701, seatCountInfo: "26席(カウンター6席、テーブル20席)", hoursInfo: "月火水木金9:30〜21:00、土10:30〜21:00", closedDaysInfo: "日曜日・祝日・第2土曜日・第4土曜日" },
  { id: "takadanobaba-38", name: "本に没頭できるカフェ Good Rack", address: "東京都新宿区高田馬場4-2-9 コスタレイ高田馬場103", lat: 35.715, lng: 139.703, smokingInfo: "全席禁煙" },
  { id: "takadanobaba-39", name: "ラタン", address: "東京都新宿区高田馬場1-31-8 ダイカンプラザ1F", lat: 35.7118, lng: 139.703, smokingInfo: "全席喫煙可", hoursInfo: "18:00〜24:00" },
  { id: "takadanobaba-40", name: "白井珈琲店", address: "東京都新宿区高田馬場4-28-18 鈴木ビル1F", lat: 35.7165, lng: 139.7025, outletInfo: "カウンター・テーブル席にWi-Fi＆コンセントあり", wifiInfo: "無料Wi-Fiあり(電源席あり)", hoursInfo: "月〜土08:00〜18:00", closedDaysInfo: "日曜日・祝日" },
  { id: "takadanobaba-41", name: "サブスリー", address: "東京都新宿区高田馬場3-14-17", lat: 35.71, lng: 139.707, smokingInfo: "全席喫煙可(2020年施行の改正健康増進法以前の情報の可能性あり要確認)", hoursInfo: "月〜土10:00〜17:00", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-42", name: "馬場サウナ＆ワークカフェ", address: "東京都新宿区高田馬場2-1-1 センテニアルタワー2F", lat: 35.7128, lng: 139.7048, outletInfo: "ワークスペース全域で高速Wi-Fi・コンセント完備", smokingInfo: "施設内全面禁煙(入口階段含む)", wifiInfo: "高速Wi-Fi・電源完備(ワークカフェエリア)", hoursInfo: "8:00〜23:00(ワークカフェ最終受付22:00、サウナ最終入場22:00)", closedDaysInfo: "年中無休(設備工事等による臨時休業の可能性あり)" },
  { id: "takadanobaba-43", name: "地球を旅するCAFE", address: "東京都新宿区高田馬場2-12-5 プレビル1F", lat: 35.7119, lng: 139.7058, outletInfo: "電源・Wi-Fiともになし、との情報あり", smokingInfo: "全席禁煙", seatCountInfo: "17席(カウンター3席・テーブル14席)", hoursInfo: "09:00〜17:00(L.O.16:30)" },
  { id: "takadanobaba-44", name: "日本茶カフェ 茶々工房", address: "東京都新宿区西早稲田2-21-19", lat: 35.7072, lng: 139.7044, hoursInfo: "11:30〜19:00(L.O.18:30)", closedDaysInfo: "日曜・祝日" },
  { id: "takadanobaba-45", name: "LUNA CAFE ORGANIC & LAUNDRY", address: "東京都新宿区高田馬場1-24-18", lat: 35.7115, lng: 139.7038, outletInfo: "電源席あり、Wi-Fiも利用可", hoursInfo: "カフェ10:00〜18:00、コインランドリー24時間営業", closedDaysInfo: "カフェ:不定休、コインランドリー:なし" },
  { id: "takadanobaba-46", name: "珈琲専門店 預言CAFE", address: "東京都新宿区高田馬場4-2-38 宏陽ビル1F", lat: 35.7142, lng: 139.7032, smokingInfo: "全席禁煙", seatCountInfo: "11席", hoursInfo: "月火水木土祝14:00〜(受付終了18:15)、金16:00〜21:00(受付終了20:45)", closedDaysInfo: "日曜日、第2土曜日(カデンツ公演日)" },
  { id: "takadanobaba-47", name: "Caffe CIELO", address: "東京都新宿区高田馬場1-31-8", lat: 35.7119, lng: 139.7029, smokingInfo: "全席禁煙", seatCountInfo: "60席" },
  { id: "takadanobaba-48", name: "Deli flattoriano", address: "東京都新宿区高田馬場1-25-30 1F", lat: 35.7123, lng: 139.7039, smokingInfo: "全席禁煙", seatCountInfo: "28席(テーブル14卓)", hoursInfo: "月〜土11:00〜22:00(L.O.料理21:00、ドリンク21:30)、日11:00〜21:00(L.O.料理20:00、ドリンク20:30)" },
  { id: "takadanobaba-49", name: "Tasse Coffee Roastery", address: "東京都新宿区高田馬場1-6-12 1F", lat: 35.7094, lng: 139.7033, outletInfo: "コンセントは一部の席のみ利用可、との情報あり", smokingInfo: "全席禁煙", seatCountInfo: "12席(テーブル10席:2人掛け×5、ベンチ2席)", hoursInfo: "11:00〜17:30", closedDaysInfo: "火曜日" },
  { id: "takadanobaba-50", name: "サンリンシャ", address: "東京都新宿区高田馬場4-4-10 コーポラス徳光1F", lat: 35.7143, lng: 139.7027, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "8席(4人掛けテーブル×1、2人掛けテーブル×2)", hoursInfo: "月・土11:15〜17:00、火11:15〜19:00、水11:15〜15:00、木11:15〜20:00、金11:15〜21:00", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-51", name: "CoCo Bubble Tea 高田馬場店", address: "東京都新宿区高田馬場3-4-19", lat: 35.712, lng: 139.7052, smokingInfo: "全席禁煙", hoursInfo: "11:00〜22:00", closedDaysInfo: "なし" },
  { id: "takadanobaba-52", name: "バーガーキング 高田馬場店", address: "東京都新宿区高田馬場1-27-3 ニュー竹宝ビル1F", lat: 35.7112, lng: 139.703, outletInfo: "奥の壁際カウンター席に電源あり、5席ほど", smokingInfo: "分煙(禁煙69席・喫煙7席、全76席中)", seatCountInfo: "76席", hoursInfo: "月〜金07:00〜23:00、土08:00〜23:00、日・祝08:00〜22:00", closedDaysInfo: "無休(年中無休)" },
  { id: "takadanobaba-53", name: "KFC+CAFE&BAR 高田馬場店", address: "東京都新宿区高田馬場1-28-10", lat: 35.7113, lng: 139.7031, outletInfo: "木製テーブル席に電源あり、8席ほど" },
];
