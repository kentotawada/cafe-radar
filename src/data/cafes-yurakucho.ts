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
// - yurakucho-03(マクドナルド 銀座二丁目ビル店): 2025年12月28日閉店
// - yurakucho-09(スターバックス・コーヒー 有楽町ビル店 B1F): 2023年10月20日
//   閉店(有楽町ビル建て替えのため)
// - yurakucho-10(スターバックス コーヒー 有楽町ビル1階店): 同上、B1F店と
//   同時閉店
//
// 【要確認・休業中/不明】新規項目を追加せず既存情報のままにしてある:
// - yurakucho-11(スターバックス コーヒー 丸の内新東京ビル店): スターバックス
//   公式サイトで「休業中」と表示。一時休業か完全閉店か確認できず。
// - yurakucho-41(LOWLINE 日比谷OKUROJI): 食べログで「掲載保留」表示があり、
//   営業状況が確認できず。
// - yurakucho-48(ザ・ペニンシュラ ブティック&カフェ 東京): 食べログでは
//   「カフェ(イートイン)休業中」、ペニンシュラ公式テナント情報(丸の内公式)
//   では通常営業のように記載されており情報が食い違い、確定できず。
//
// 【要確認・改称/統合】yurakucho-34(illy CAFFÈ 有楽町イトシア店): 食べログに
// 「【旧店名】イリーカフェ」と明記され、同一住所(有楽町イトシアB1F)の
// yurakucho-23(IL BAR 有楽町イトシア店)に改称・転換済みと判断。新規項目は
// 追加せず既存情報のままにしてある(ユーザー判断でyurakucho-34の削除・重複
// 解消を検討ください)。
export const cafes: Cafe[] = [
  { id: "yurakucho-01", name: "マクドナルド 銀座インズ店", address: "東京都中央区銀座西1-2 銀座インズ3内", lat: 35.6712, lng: 139.7627, outletInfo: "禁煙・喫煙カウンター各所にコンセントあり", smokingInfo: "全席禁煙(マクドナルド全店舗方針)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、初回のみ会員登録)", seatCountInfo: "189席", hoursInfo: "6:30〜23:00", closedDaysInfo: "施設(銀座インズ)の休業日に準ずる(実質年中無休)" },
  { id: "yurakucho-03", name: "マクドナルド 銀座二丁目ビル店", address: "東京都中央区銀座2-9-4", lat: 35.6716, lng: 139.7684, outletInfo: "2階席にコンセントあり、長居作業も可" },
  { id: "yurakucho-04", name: "マクドナルド 東京駅一番街店", address: "東京都千代田区丸の内1-9-1 東京駅一番街", lat: 35.6812, lng: 139.7671, outletInfo: "改装でカウンター撤去、電源席は現在なし", smokingInfo: "全席禁煙(マクドナルド全店舗方針)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、初回のみ会員登録)", hoursInfo: "5:30〜24:00" },
  { id: "yurakucho-05", name: "ガスト 銀座インズ店", address: "東京都中央区銀座西3丁目1番地 銀座インズ1 2F", lat: 35.6712, lng: 139.7627, outletInfo: "電源コンセント完備、Wi-Fiも利用可", smokingInfo: "敷地内全面禁煙(すかいらーくグループ方針)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜23:00" },
  { id: "yurakucho-06", name: "サイゼリヤ 銀座インズ店", address: "東京都中央区銀座西3-1 銀座インズ2F", lat: 35.6712, lng: 139.7628, smokingInfo: "全席禁煙", hoursInfo: "10:00〜23:00" },
  { id: "yurakucho-07", name: "スターバックス コーヒー 有楽町メトロピア店", address: "東京都千代田区有楽町1-11-1 東京メトロ有楽町駅構内", lat: 35.6748, lng: 139.7629, outletInfo: "8席のみのカウンター席で電源なし", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "カウンター8席のみ", hoursInfo: "7:00〜22:00", closedDaysInfo: "不定休" },
  { id: "yurakucho-08", name: "スターバックス コーヒー JR有楽町駅京橋口店", address: "東京都千代田区有楽町2-9", lat: 35.6746, lng: 139.7636, outletInfo: "2階に電源コンセント席8席あり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "7:00〜22:00", closedDaysInfo: "不定休" },
  { id: "yurakucho-09", name: "スターバックス・コーヒー 有楽町ビル店", address: "東京都千代田区有楽町1-10-1 有楽町ビルディング地下1F", lat: 35.6748, lng: 139.7627 },
  { id: "yurakucho-10", name: "スターバックス コーヒー 有楽町ビル1階店", address: "東京都千代田区有楽町1-10-1 有楽町ビル1階", lat: 35.6748, lng: 139.7627 },
  { id: "yurakucho-11", name: "スターバックス コーヒー 丸の内新東京ビル店", address: "東京都千代田区丸の内3-3-1 新東京ビル", lat: 35.6771, lng: 139.7626, outletInfo: "電源コンセント付き席が7席あり" },
  { id: "yurakucho-12", name: "スターバックス コーヒー 丸の内ビルディング店", address: "東京都千代田区丸の内2-4-1 丸の内ビルディング", lat: 35.6813, lng: 139.7639, outletInfo: "カウンター6席で電源コンセント利用可", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "37席", hoursInfo: "6:45〜22:00", closedDaysInfo: "不定休" },
  { id: "yurakucho-13", name: "ドトールコーヒーショップ 有楽町駅前店", address: "東京都千代田区丸の内3-6-11", lat: 35.6772, lng: 139.7638, outletInfo: "電源コンセントあり、作業向きの雰囲気", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi)", hoursInfo: "平日6:45〜21:00、土日祝7:30〜21:00" },
  { id: "yurakucho-14", name: "ドトールコーヒーショップ 有楽町電気ビル店", address: "東京都千代田区有楽町1-7-1", lat: 35.6753, lng: 139.7622, outletInfo: "カウンター中心に電源あり、全46席", smokingInfo: "禁煙32・喫煙13席で分煙", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi)", seatCountInfo: "全45席(禁煙32・喫煙13)", hoursInfo: "平日7:30〜21:00、土8:00〜19:00、日10:00〜19:00" },
  { id: "yurakucho-15", name: "ドトールコーヒーショップ 有楽町日比谷口店", address: "東京都千代田区有楽町1-3-7", lat: 35.6745, lng: 139.7605, outletInfo: "全席に電源コンセント完備", smokingInfo: "完全分煙(喫煙ブースあり、紙巻・加熱式対応)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "31席(全席禁煙、別途喫煙ブース)", hoursInfo: "平日6:45〜21:00、土曜7:45〜20:00、日祝7:45〜20:00" },
  { id: "yurakucho-16", name: "タリーズコーヒー ＆TEA ルミネ有楽町店", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 8F", lat: 35.6745, lng: 139.7631, outletInfo: "島型カウンター等に電源席が豊富", smokingInfo: "禁煙", wifiInfo: "タリーズWi-Fiあり", seatCountInfo: "92席", hoursInfo: "9:00〜22:00(L.O.21:30)", closedDaysInfo: "年中無休" },
  { id: "yurakucho-17", name: "タリーズコーヒー 日比谷シャンテ店", address: "東京都千代田区有楽町1丁目2-2 日比谷シャンテ B1F", lat: 35.6738, lng: 139.7602, outletInfo: "大テーブル袖に2口+USB充電あり", smokingInfo: "禁煙", wifiInfo: "タリーズWi-Fiあり", hoursInfo: "11:00〜20:00", closedDaysInfo: "年中無休" },
  { id: "yurakucho-18", name: "タリーズコーヒー 東京商工会議所ビル店", address: "東京都千代田区丸の内3-2-2 東京商工会議所ビル1F", lat: 35.6775, lng: 139.7629, outletInfo: "カウンター・大型テーブルに電源あり", smokingInfo: "禁煙", wifiInfo: "タリーズWi-Fiあり", hoursInfo: "平日7:30〜20:00、土曜8:00〜20:00", closedDaysInfo: "日曜定休" },
  { id: "yurakucho-20", name: "カフェ・ベローチェ 銀座二丁目店", address: "東京都中央区銀座2-8-4 泰明ビル1F", lat: 35.6717, lng: 139.7669, outletInfo: "窓側カウンターに3口コンセントあり", smokingInfo: "分煙(加熱式たばこ専用喫煙室・喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜22:00、土日祝7:00〜21:00" },
  { id: "yurakucho-21", name: "カフェ・ベローチェ 銀座一丁目店", address: "東京都中央区銀座1-19-14 GINZA ONE BUILDING 1F", lat: 35.6733, lng: 139.7659, outletInfo: "客席専用コンセントあり", smokingInfo: "全席禁煙・喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜21:00、土曜7:00〜20:00、日祝8:00〜20:00" },
  { id: "yurakucho-22", name: "PRONTO 有楽町電気ビル店", address: "東京都千代田区有楽町1-7-1 有楽町電気ビル", lat: 35.6753, lng: 139.7622, outletInfo: "カウンター中心に電源コンセント完備", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "63席", hoursInfo: "月〜金7:00〜23:00、土日10:00〜22:00", closedDaysInfo: "なし" },
  { id: "yurakucho-23", name: "IL BAR 有楽町イトシア店", address: "東京都千代田区有楽町2-7-1 有楽町イトシアB1F", lat: 35.6743, lng: 139.7625, outletInfo: "コンセント・Wi-Fiあり", smokingInfo: "全席禁煙(喫煙ブースあり)", seatCountInfo: "80席", hoursInfo: "月〜日7:30〜22:30", closedDaysInfo: "なし" },
  { id: "yurakucho-24", name: "コメダ珈琲店 有楽町ビックカメラ店", address: "東京都千代田区有楽町1-11-1 読売会館ビルディングB1F", lat: 35.6748, lng: 139.7629, outletInfo: "全席にコンセント・USB充電口完備", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "110席", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "yurakucho-25", name: "喫茶室ルノアール 有楽町駅前店", address: "東京都千代田区有楽町2-8-2 ジョイパックビル2F", lat: 35.6744, lng: 139.7636, outletInfo: "電源コンセントあり、分煙で静か", smokingInfo: "分煙(禁煙40席・加熱式たばこ専用19席・紙巻き喫煙ブースあり(飲食不可))", wifiInfo: "無料Wi-Fiあり(ルノアール美和Wi-Fi、Wi2、au Wi-Fi SPOT、BBモバイルポイント)", seatCountInfo: "59席", hoursInfo: "全日7:30〜22:00" },
  { id: "yurakucho-26", name: "モスバーガー 西銀座店", address: "東京都中央区銀座四丁目1", lat: 35.671, lng: 139.7628, smokingInfo: "全席禁煙", seatCountInfo: "54席", hoursInfo: "9:00〜21:00" },
  { id: "yurakucho-27", name: "ベックスコーヒーショップ有楽町店", address: "東京都千代田区有楽町2丁目9-1", lat: 35.6746, lng: 139.7636, outletInfo: "窓際・中央カウンターに電源完備", hoursInfo: "11:00〜21:00" },
  { id: "yurakucho-28", name: "Q CAFE by Royal Garden Cafe", address: "東京都千代田区有楽町1-1-2 東京ミッドタウン日比谷 6F", lat: 35.6738, lng: 139.7597, outletInfo: "電源・Wi-Fi完備、コピー機も利用可", smokingInfo: "全席禁煙", seatCountInfo: "144席(カフェスペース96席+ワークスペース48席)", hoursInfo: "平日ランチ10:00〜15:00/カフェ15:00〜17:00/ディナー17:00〜22:00、土日祝ランチ11:00〜15:00/カフェ15:00〜17:00/ディナー17:00〜22:00", closedDaysInfo: "なし(東京ミッドタウン日比谷に準ずる)" },
  { id: "yurakucho-29", name: "GESHARY COFFEE 日比谷店", address: "東京都千代田区有楽町1-6-3 有楽町東宝ビル", lat: 35.6738, lng: 139.7614, outletInfo: "2・3階に電源あり、4階はなし", wifiInfo: "全席Wi-Fi・電源完備", hoursInfo: "月〜木8:30〜22:00、金8:30〜22:30、土日祝10:00〜22:30", closedDaysInfo: "不定休" },
  { id: "yurakucho-30", name: "DEAN & DELUCA 東京ミッドタウン日比谷", address: "東京都千代田区有楽町1-1-4 東京ミッドタウン日比谷 1F", lat: 35.6738, lng: 139.7597, outletInfo: "窓際・西側カウンター計6席に電源", smokingInfo: "全席禁煙", seatCountInfo: "18席(カウンター+テラス6席)", hoursInfo: "8:00〜20:00(L.O.20:00)" },
  { id: "yurakucho-31", name: "カフェ レクセル 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム B1F", lat: 35.6759, lng: 139.7633, outletInfo: "カウンター計19席に電源コンセント", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "41席(全席禁煙)", hoursInfo: "平日7:30〜20:30、土日祝8:00〜20:30" },
  { id: "yurakucho-32", name: "Shake Shack 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム ホールC 1F", lat: 35.6759, lng: 139.7633, outletInfo: "柱の根元付近に電源コンセントあり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜22:00(L.O.)" },
  { id: "yurakucho-33", name: "珈琲茶館 集 有楽町アネックス店", address: "東京都千代田区有楽町1-16-6 小谷ビルB1", lat: 35.673, lng: 139.762, hoursInfo: "平日11:00〜23:00、土日祝10:00〜23:00" },
  { id: "yurakucho-34", name: "illy CAFFÈ 有楽町イトシア店", address: "東京都千代田区有楽町2-7-1 有楽町イトシアB1F", lat: 35.6743, lng: 139.7625, outletInfo: "コンセント・Wi-Fiあり" },
  { id: "yurakucho-35", name: "THE STAND", address: "東京都千代田区有楽町2-9-1", lat: 35.6745, lng: 139.7636, outletInfo: "電源コンセント利用可", hoursInfo: "月〜土11:00〜23:30(フードL.O.22:30、ドリンクL.O.23:00)、日祝11:00〜22:30(フードL.O.21:30、ドリンクL.O.22:00)" },
  { id: "yurakucho-36", name: "椿屋珈琲 有楽町茶寮", address: "東京都千代田区有楽町2-7-1 有楽町イトシア2F", lat: 35.6743, lng: 139.7625, outletInfo: "電源・Wi-Fi利用可、76席の広い店内", wifiInfo: "Wi-Fiあり", seatCountInfo: "72席", hoursInfo: "9:30〜23:00(L.O.22:30)" },
  { id: "yurakucho-37", name: "純喫茶ローヤル", address: "東京都千代田区有楽町2-10-1 東京交通会館B1F", lat: 35.674, lng: 139.7638, smokingInfo: "喫煙ルームあり(分煙)", hoursInfo: "平日8:00〜19:30、土日祝11:00〜19:00", closedDaysInfo: "交通会館の休館日に準ずる" },
  { id: "yurakucho-38", name: "ジュン喫茶室", address: "東京都千代田区有楽町2-10-1 東京交通会館3F", lat: 35.674, lng: 139.7638, hoursInfo: "11:00〜18:00", closedDaysInfo: "年末年始" },
  { id: "yurakucho-39", name: "珈琲館 紅鹿舎", address: "東京都千代田区有楽町1-6-8 松井ビル1F", lat: 35.674, lng: 139.7615, hoursInfo: "9:30〜23:45", closedDaysInfo: "無休" },
  { id: "yurakucho-40", name: "十一房珈琲店", address: "東京都中央区銀座2-2-19", lat: 35.672, lng: 139.7643, smokingInfo: "全席禁煙", seatCountInfo: "31席(カウンター10・テーブル21)", hoursInfo: "11:00〜21:30" },
  { id: "yurakucho-41", name: "LOWLINE 日比谷OKUROJI", address: "東京都千代田区内幸町1-7-1", lat: 35.6715, lng: 139.759, outletInfo: "店内・テラスともに電源コンセントあり" },
  { id: "yurakucho-42", name: "星乃珈琲店 数寄屋橋店", address: "東京都中央区銀座4-2-12 銀座クリスタルビル3F", lat: 35.6712, lng: 139.7671, outletInfo: "星乃珈琲は基本的に電源・Wi-Fiなし", smokingInfo: "禁煙", wifiInfo: "Wi-Fiなし", hoursInfo: "平日11:00〜22:00(L.O.21:30)、休日10:00〜22:00(L.O.21:30)" },
  { id: "yurakucho-43", name: "SUZU CAFE 銀座", address: "東京都中央区銀座2-6-5 銀座トレシャス6F", lat: 35.6725, lng: 139.7677, outletInfo: "2階窓側カウンターの柱際に電源あり", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "80席", hoursInfo: "11:00〜23:00(フードL.O.22:00、ドリンクL.O.22:30)", closedDaysInfo: "不定休(年末年始休業あり)" },
  { id: "yurakucho-44", name: "珈琲館 銀座インズ店", address: "東京都中央区銀座2-2 銀座INZ-2 2F", lat: 35.6712, lng: 139.7629, outletInfo: "全席禁煙、Wi-Fi・コンセント利用可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "95席", hoursInfo: "9:30〜22:00(L.O.21:30)", closedDaysInfo: "なし" },
  { id: "yurakucho-45", name: "AIN SOPH. 銀座店", address: "東京都中央区銀座4-12-1", lat: 35.6707, lng: 139.7669, hoursInfo: "レストラン(2〜4F)ランチ11:30〜15:00/ディナー17:00〜20:00、パティスリー(1F)11:30〜20:30" },
  { id: "yurakucho-46", name: "パパス・カフェ 丸の内本店", address: "東京都千代田区丸の内3-3-1 新東京ビル1F", lat: 35.6771, lng: 139.7626, seatCountInfo: "56席", hoursInfo: "月〜金11:00〜20:30(L.O.20:00)、土日11:00〜19:30(L.O.19:00)" },
  { id: "yurakucho-47", name: "東京會舘 ロッシニテラス（カフェテラス）", address: "東京都千代田区丸の内3-2-1", lat: 35.6773, lng: 139.7627, smokingInfo: "禁煙(ビル内に喫煙ブースあり)", seatCountInfo: "72席(個室なし)", hoursInfo: "平日11:30〜22:00(L.O.20:00)、土日祝11:00〜22:00(L.O.20:00)" },
  { id: "yurakucho-48", name: "ザ・ペニンシュラ ブティック&カフェ 東京", address: "東京都千代田区有楽町1-8-1 ザ・ペニンシュラ東京", lat: 35.6741, lng: 139.7595 },
];
