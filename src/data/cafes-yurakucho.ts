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
  { id: "yurakucho-01", name: "マクドナルド 銀座インズ店", address: "東京都中央区銀座西1-2 銀座インズ3内", lat: 35.673634, lng: 139.770294, outletInfo: "禁煙・喫煙カウンター各所にコンセントあり", smokingInfo: "全席禁煙(マクドナルド全店舗方針)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、初回のみ会員登録)", seatCountInfo: "189席", hoursInfo: "6:30〜23:00", closedDaysInfo: "施設(銀座インズ)の休業日に準ずる(実質年中無休)" },
  { id: "yurakucho-03", name: "マクドナルド 銀座二丁目ビル店", address: "東京都中央区銀座2-9-4", lat: 35.67281, lng: 139.768509, outletInfo: "2階席にコンセントあり、長居作業も可" },
  { id: "yurakucho-04", name: "マクドナルド 東京駅一番街店", address: "東京都千代田区丸の内1-9-1 東京駅一番街", lat: 35.681252, lng: 139.767242, outletInfo: "改装でカウンター撤去、電源席は現在なし", smokingInfo: "全席禁煙(マクドナルド全店舗方針)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、初回のみ会員登録)", hoursInfo: "5:30〜24:00" },
  { id: "yurakucho-05", name: "ガスト 銀座インズ店", address: "東京都中央区銀座西3丁目1番地 銀座インズ1 2F", lat: 35.673634, lng: 139.770294, outletInfo: "電源コンセント完備、Wi-Fiも利用可", smokingInfo: "敷地内全面禁煙(すかいらーくグループ方針)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜23:00" },
  { id: "yurakucho-06", name: "サイゼリヤ 銀座インズ店", address: "東京都中央区銀座西3-1 銀座インズ2F", lat: 35.673634, lng: 139.770294, smokingInfo: "全席禁煙", hoursInfo: "10:00〜23:00" },
  { id: "yurakucho-07", name: "スターバックス コーヒー 有楽町メトロピア店", address: "東京都千代田区有楽町1-11-1 東京メトロ有楽町駅構内", lat: 35.675388, lng: 139.762878, outletInfo: "8席のみのカウンター席で電源なし", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "カウンター8席のみ", hoursInfo: "7:00〜22:00", closedDaysInfo: "不定休" },
  { id: "yurakucho-08", name: "スターバックス コーヒー JR有楽町駅京橋口店", address: "東京都千代田区有楽町2-9", lat: 35.674507, lng: 139.762558, outletInfo: "2階に電源コンセント席8席あり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "7:00〜22:00", closedDaysInfo: "不定休" },
  { id: "yurakucho-09", name: "スターバックス・コーヒー 有楽町ビル店", address: "東京都千代田区有楽町1-10-1 有楽町ビルディング地下1F", lat: 35.674938, lng: 139.761795 },
  { id: "yurakucho-10", name: "スターバックス コーヒー 有楽町ビル1階店", address: "東京都千代田区有楽町1-10-1 有楽町ビル1階", lat: 35.674938, lng: 139.761795 },
  { id: "yurakucho-11", name: "スターバックス コーヒー 丸の内新東京ビル店", address: "東京都千代田区丸の内3-3-1 新東京ビル", lat: 35.677563, lng: 139.76265, outletInfo: "電源コンセント付き席が7席あり" },
  { id: "yurakucho-12", name: "スターバックス コーヒー 丸の内ビルディング店", address: "東京都千代田区丸の内2-4-1 丸の内ビルディング", lat: 35.681046, lng: 139.763794, outletInfo: "カウンター6席で電源コンセント利用可", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "37席", hoursInfo: "6:45〜22:00", closedDaysInfo: "不定休" },
  { id: "yurakucho-13", name: "ドトールコーヒーショップ 有楽町駅前店", address: "東京都千代田区丸の内3-6-11", lat: 35.675617, lng: 139.764099, outletInfo: "電源コンセントあり、作業向きの雰囲気", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi)", hoursInfo: "平日6:45〜21:00、土日祝7:30〜21:00" },
  { id: "yurakucho-14", name: "ドトールコーヒーショップ 有楽町電気ビル店", address: "東京都千代田区有楽町1-7-1", lat: 35.674358, lng: 139.761444, outletInfo: "カウンター中心に電源あり、全46席", smokingInfo: "禁煙32・喫煙13席で分煙", wifiInfo: "無料Wi-Fiあり(DOUTOR_FREE_Wi-Fi)", seatCountInfo: "全45席(禁煙32・喫煙13)", hoursInfo: "平日7:30〜21:00、土8:00〜19:00、日10:00〜19:00" },
  { id: "yurakucho-15", name: "ドトールコーヒーショップ 有楽町日比谷口店", address: "東京都千代田区有楽町1-3-7", lat: 35.673389, lng: 139.760818, outletInfo: "全席に電源コンセント完備", smokingInfo: "完全分煙(喫煙ブースあり、紙巻・加熱式対応)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "31席(全席禁煙、別途喫煙ブース)", hoursInfo: "平日6:45〜21:00、土曜7:45〜20:00、日祝7:45〜20:00" },
  { id: "yurakucho-16", name: "タリーズコーヒー ＆TEA ルミネ有楽町店", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 8F", lat: 35.673576, lng: 139.762802, outletInfo: "島型カウンター等に電源席が豊富", smokingInfo: "禁煙", wifiInfo: "タリーズWi-Fiあり", seatCountInfo: "92席", hoursInfo: "9:00〜22:00(L.O.21:30)", closedDaysInfo: "年中無休" },
  { id: "yurakucho-17", name: "タリーズコーヒー 日比谷シャンテ店", address: "東京都千代田区有楽町1丁目2-2 日比谷シャンテ B1F", lat: 35.672913, lng: 139.759964, outletInfo: "大テーブル袖に2口+USB充電あり", smokingInfo: "禁煙", wifiInfo: "タリーズWi-Fiあり", hoursInfo: "11:00〜20:00", closedDaysInfo: "年中無休" },
  { id: "yurakucho-18", name: "タリーズコーヒー 東京商工会議所ビル店", address: "東京都千代田区丸の内3-2-2 東京商工会議所ビル1F", lat: 35.677837, lng: 139.761429, outletInfo: "カウンター・大型テーブルに電源あり", smokingInfo: "禁煙", wifiInfo: "タリーズWi-Fiあり", hoursInfo: "平日7:30〜20:00、土曜8:00〜20:00", closedDaysInfo: "日曜定休" },
  { id: "yurakucho-20", name: "カフェ・ベローチェ 銀座二丁目店", address: "東京都中央区銀座2-8-4 泰明ビル1F", lat: 35.673115, lng: 139.768341, outletInfo: "窓側カウンターに3口コンセントあり", smokingInfo: "分煙(加熱式たばこ専用喫煙室・喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜22:00、土日祝7:00〜21:00" },
  { id: "yurakucho-21", name: "カフェ・ベローチェ 銀座一丁目店", address: "東京都中央区銀座1-19-14 GINZA ONE BUILDING 1F", lat: 35.673447, lng: 139.770844, outletInfo: "客席専用コンセントあり", smokingInfo: "全席禁煙・喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜21:00、土曜7:00〜20:00、日祝8:00〜20:00" },
  { id: "yurakucho-22", name: "PRONTO 有楽町電気ビル店", address: "東京都千代田区有楽町1-7-1 有楽町電気ビル", lat: 35.674358, lng: 139.761444, outletInfo: "カウンター中心に電源コンセント完備", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "63席", hoursInfo: "月〜金7:00〜23:00、土日10:00〜22:00", closedDaysInfo: "なし" },
  { id: "yurakucho-23", name: "IL BAR 有楽町イトシア店", address: "東京都千代田区有楽町2-7-1 有楽町イトシアB1F", lat: 35.674213, lng: 139.763657, outletInfo: "コンセント・Wi-Fiあり", smokingInfo: "全席禁煙(喫煙ブースあり)", seatCountInfo: "80席", hoursInfo: "月〜日7:30〜22:30", closedDaysInfo: "なし" },
  { id: "yurakucho-24", name: "コメダ珈琲店 有楽町ビックカメラ店", address: "東京都千代田区有楽町1-11-1 読売会館ビルディングB1F", lat: 35.675388, lng: 139.762878, outletInfo: "全席にコンセント・USB充電口完備", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "110席", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "yurakucho-25", name: "喫茶室ルノアール 有楽町駅前店", address: "東京都千代田区有楽町2-8-2 ジョイパックビル2F", lat: 35.674301, lng: 139.76265, outletInfo: "電源コンセントあり、分煙で静か", smokingInfo: "分煙(禁煙40席・加熱式たばこ専用19席・紙巻き喫煙ブースあり(飲食不可))", wifiInfo: "無料Wi-Fiあり(ルノアール美和Wi-Fi、Wi2、au Wi-Fi SPOT、BBモバイルポイント)", seatCountInfo: "59席", hoursInfo: "全日7:30〜22:00" },
  { id: "yurakucho-26", name: "モスバーガー 西銀座店", address: "東京都中央区銀座四丁目1", lat: 35.673046, lng: 139.76355, smokingInfo: "全席禁煙", seatCountInfo: "54席", hoursInfo: "9:00〜21:00" },
  { id: "yurakucho-27", name: "ベックスコーヒーショップ有楽町店", address: "東京都千代田区有楽町2丁目9-1", lat: 35.67477, lng: 139.762527, outletInfo: "窓際・中央カウンターに電源完備", hoursInfo: "11:00〜21:00" },
  { id: "yurakucho-28", name: "Q CAFE by Royal Garden Cafe", address: "東京都千代田区有楽町1-1-2 東京ミッドタウン日比谷 6F", lat: 35.674088, lng: 139.759552, outletInfo: "電源・Wi-Fi完備、コピー機も利用可", smokingInfo: "全席禁煙", seatCountInfo: "144席(カフェスペース96席+ワークスペース48席)", hoursInfo: "平日ランチ10:00〜15:00/カフェ15:00〜17:00/ディナー17:00〜22:00、土日祝ランチ11:00〜15:00/カフェ15:00〜17:00/ディナー17:00〜22:00", closedDaysInfo: "なし(東京ミッドタウン日比谷に準ずる)" },
  { id: "yurakucho-29", name: "GESHARY COFFEE 日比谷店", address: "東京都千代田区有楽町1-6-3 有楽町東宝ビル", lat: 35.673973, lng: 139.760651, outletInfo: "2・3階に電源あり、4階はなし", wifiInfo: "全席Wi-Fi・電源完備", hoursInfo: "月〜木8:30〜22:00、金8:30〜22:30、土日祝10:00〜22:30", closedDaysInfo: "不定休" },
  { id: "yurakucho-30", name: "DEAN & DELUCA 東京ミッドタウン日比谷", address: "東京都千代田区有楽町1-1-4 東京ミッドタウン日比谷 1F", lat: 35.674088, lng: 139.759552, outletInfo: "窓際・西側カウンター計6席に電源", smokingInfo: "全席禁煙", seatCountInfo: "18席(カウンター+テラス6席)", hoursInfo: "8:00〜20:00(L.O.20:00)" },
  { id: "yurakucho-31", name: "カフェ レクセル 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム B1F", lat: 35.676849, lng: 139.76387, outletInfo: "カウンター計19席に電源コンセント", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "41席(全席禁煙)", hoursInfo: "平日7:30〜20:30、土日祝8:00〜20:30" },
  { id: "yurakucho-32", name: "Shake Shack 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム ホールC 1F", lat: 35.676849, lng: 139.76387, outletInfo: "柱の根元付近に電源コンセントあり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜22:00(L.O.)" },
  { id: "yurakucho-33", name: "珈琲茶館 集 有楽町アネックス店", address: "東京都千代田区有楽町1-16-6 小谷ビルB1", lat: 35.674484, lng: 139.760544, hoursInfo: "平日11:00〜23:00、土日祝10:00〜23:00" },
  { id: "yurakucho-34", name: "illy CAFFÈ 有楽町イトシア店", address: "東京都千代田区有楽町2-7-1 有楽町イトシアB1F", lat: 35.674213, lng: 139.763657, outletInfo: "コンセント・Wi-Fiあり" },
  { id: "yurakucho-35", name: "THE STAND", address: "東京都千代田区有楽町2-9-1", lat: 35.67477, lng: 139.762527, outletInfo: "電源コンセント利用可", hoursInfo: "月〜土11:00〜23:30(フードL.O.22:30、ドリンクL.O.23:00)、日祝11:00〜22:30(フードL.O.21:30、ドリンクL.O.22:00)" },
  { id: "yurakucho-36", name: "椿屋珈琲 有楽町茶寮", address: "東京都千代田区有楽町2-7-1 有楽町イトシア2F", lat: 35.674213, lng: 139.763657, outletInfo: "電源・Wi-Fi利用可、76席の広い店内", wifiInfo: "Wi-Fiあり", seatCountInfo: "72席", hoursInfo: "9:30〜23:00(L.O.22:30)" },
  { id: "yurakucho-37", name: "純喫茶ローヤル", address: "東京都千代田区有楽町2-10-1 東京交通会館B1F", lat: 35.674953, lng: 139.764359, smokingInfo: "喫煙ルームあり(分煙)", hoursInfo: "平日8:00〜19:30、土日祝11:00〜19:00", closedDaysInfo: "交通会館の休館日に準ずる" },
  { id: "yurakucho-38", name: "ジュン喫茶室", address: "東京都千代田区有楽町2-10-1 東京交通会館3F", lat: 35.674953, lng: 139.764359, hoursInfo: "11:00〜18:00", closedDaysInfo: "年末年始" },
  { id: "yurakucho-39", name: "珈琲館 紅鹿舎", address: "東京都千代田区有楽町1-6-8 松井ビル1F", lat: 35.673512, lng: 139.760941, hoursInfo: "9:30〜23:45", closedDaysInfo: "無休" },
  { id: "yurakucho-40", name: "十一房珈琲店", address: "東京都中央区銀座2-2-19", lat: 35.674938, lng: 139.765732, smokingInfo: "全席禁煙", seatCountInfo: "31席(カウンター10・テーブル21)", hoursInfo: "11:00〜21:30" },
  { id: "yurakucho-41", name: "LOWLINE 日比谷OKUROJI", address: "東京都千代田区内幸町1-7-1", lat: 35.66959, lng: 139.758957, outletInfo: "店内・テラスともに電源コンセントあり" },
  { id: "yurakucho-42", name: "星乃珈琲店 数寄屋橋店", address: "東京都中央区銀座4-2-12 銀座クリスタルビル3F", lat: 35.672459, lng: 139.763657, outletInfo: "星乃珈琲は基本的に電源・Wi-Fiなし", smokingInfo: "禁煙", wifiInfo: "Wi-Fiなし", hoursInfo: "平日11:00〜22:00(L.O.21:30)、休日10:00〜22:00(L.O.21:30)" },
  { id: "yurakucho-43", name: "SUZU CAFE 銀座", address: "東京都中央区銀座2-6-5 銀座トレシャス6F", lat: 35.673607, lng: 139.767334, outletInfo: "2階窓側カウンターの柱際に電源あり", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "80席", hoursInfo: "11:00〜23:00(フードL.O.22:00、ドリンクL.O.22:30)", closedDaysInfo: "不定休(年末年始休業あり)" },
  { id: "yurakucho-44", name: "珈琲館 銀座インズ店", address: "東京都中央区銀座2-2 銀座INZ-2 2F", lat: 35.674606, lng: 139.76561, outletInfo: "全席禁煙、Wi-Fi・コンセント利用可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "95席", hoursInfo: "9:30〜22:00(L.O.21:30)", closedDaysInfo: "なし" },
  { id: "yurakucho-45", name: "AIN SOPH. 銀座店", address: "東京都中央区銀座4-12-1", lat: 35.6702, lng: 139.768005, hoursInfo: "レストラン(2〜4F)ランチ11:30〜15:00/ディナー17:00〜20:00、パティスリー(1F)11:30〜20:30" },
  { id: "yurakucho-46", name: "パパス・カフェ 丸の内本店", address: "東京都千代田区丸の内3-3-1 新東京ビル1F", lat: 35.677563, lng: 139.76265, seatCountInfo: "56席", hoursInfo: "月〜金11:00〜20:30(L.O.20:00)、土日11:00〜19:30(L.O.19:00)" },
  { id: "yurakucho-47", name: "東京會舘 ロッシニテラス（カフェテラス）", address: "東京都千代田区丸の内3-2-1", lat: 35.677837, lng: 139.761429, smokingInfo: "禁煙(ビル内に喫煙ブースあり)", seatCountInfo: "72席(個室なし)", hoursInfo: "平日11:30〜22:00(L.O.20:00)、土日祝11:00〜22:00(L.O.20:00)" },
  { id: "yurakucho-48", name: "ザ・ペニンシュラ ブティック&カフェ 東京", address: "東京都千代田区有楽町1-8-1 ザ・ペニンシュラ東京", lat: 35.674698, lng: 139.760437 },

  // 【2026年8月追加分(yurakucho-49以降)】食べログの有楽町・日比谷エリア一覧で実在を確認し、
  // 各店の個別ページ(住所・営業時間・定休日・席数・禁煙喫煙・電源・Wi-Fi)で1件ずつ裏取りした。
  // 確認できなかった項目は空欄のまま(推測では埋めていない)。有楽町駅から徒歩10分弱を目安に、
  // 西は日比谷・内幸町(帝国ホテル・日比谷図書文化館)、北は丸の内3丁目(新東京ビル・東京国際
  // フォーラム)、東は銀座3丁目まで少し範囲を広げている。新橋側(cafes-shimbashi.ts)の
  // 銀座8丁目・汐留・日比谷OKUROJIとは重複しないように選定した。
  // 【除外した候補】
  // - ラ･メゾン･デュ･ショコラ 丸の内店: 食べログに「サロン営業休止中」と記載。イートイン
  //   営業が確認できないため追加せず。
  // - DEAN & DELUCA カフェ 東京ミッドタウン日比谷: 既存のyurakucho-30と同一住所・同一階で
  //   重複の可能性が高いため追加せず。
  // - 木下闇珈琲 / 大月珈琲店(いずれも東京国際フォーラム内): キッチンカー出店で住所・営業
  //   スケジュールが確定できないため追加せず。
  // - KOKO 丸ノ内南口店: 住所(丸の内1-10-5)から所在地を特定できず、座標推定ができないため追加せず。
  { id: "yurakucho-49", name: "京都石塀小路 豆ちゃ 有楽町", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 ルミネ1 8F", lat: 35.673576, lng: 139.762802, smokingInfo: "全席禁煙(施設内に喫煙所あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "120席", hoursInfo: "11:00〜22:00(L.O.料理21:00、ドリンク21:30)", closedDaysInfo: "ルミネ有楽町の営業に準ずる" },
  { id: "yurakucho-50", name: "プロント 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム B1F", lat: 35.676849, lng: 139.76387, outletInfo: "電源あり", smokingInfo: "全席禁煙(店内に喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "129席", hoursInfo: "平日7:00〜23:00(L.O.22:30)、土10:00〜22:00(L.O.21:30)、日祝10:00〜19:00(L.O.18:30)", closedDaysInfo: "無休" },
  { id: "yurakucho-51", name: "プロント 有楽町店", address: "東京都千代田区有楽町2-9-18", lat: 35.67487, lng: 139.763458, smokingInfo: "分煙(加熱式たばこ限定)", seatCountInfo: "76席", hoursInfo: "月〜金8:00〜22:30、土日祝10:00〜22:30", closedDaysInfo: "無休" },
  { id: "yurakucho-52", name: "24/7 cafe apartment 有楽町", address: "東京都千代田区有楽町2-7-1 有楽町マルイ 5F", lat: 35.674213, lng: 139.763657, smokingInfo: "全席禁煙", seatCountInfo: "60席(カウンター3・ソファー2・半個室1を含む)", hoursInfo: "11:00〜21:00(L.O.20:00)", closedDaysInfo: "有楽町マルイの営業に準ずる" },
  { id: "yurakucho-53", name: "カフェ＆ブックス ビブリオテーク 東京・有楽町", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 ルミネ1 3F", lat: 35.673576, lng: 139.762802, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "47席", hoursInfo: "11:00〜21:00(L.O.料理20:00、ドリンク20:30)", closedDaysInfo: "ルミネ有楽町の営業に準ずる" },
  { id: "yurakucho-54", name: "やさいの王様 日比谷シャンテ店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 本館 B2F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "46席", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "日比谷シャンテの休館日に準ずる" },
  { id: "yurakucho-55", name: "ラデュレ 日比谷店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 1F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "46席(テーブル席)", hoursInfo: "月〜木11:00〜20:00(L.O.19:00)、金土日祝11:00〜21:00(L.O.20:00)", closedDaysInfo: "日比谷シャンテの営業に準ずる" },
  { id: "yurakucho-56", name: "Q-pot CAFE. 日比谷シャンテ店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 3F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "37席(カウンター5・テーブル32)", hoursInfo: "11:00〜20:00(L.O.19:30)", closedDaysInfo: "不定休(施設に準ずる)" },
  { id: "yurakucho-57", name: "DRAWING HOUSE OF HIBIYA", address: "東京都千代田区有楽町1-1-2 東京ミッドタウン日比谷 6F", lat: 35.674088, lng: 139.759552, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "150席(カウンター8・個室4〜12・テラス32・ソファ20)", hoursInfo: "11:00〜22:00(料理L.O.21:00)", closedDaysInfo: "東京ミッドタウン日比谷に準ずる" },
  { id: "yurakucho-58", name: "REVIVE KITCHEN THREE HIBIYA", address: "東京都千代田区有楽町1-1-2 東京ミッドタウン日比谷 2F", lat: 35.674088, lng: 139.759552, outletInfo: "電源あり", smokingInfo: "全席禁煙(施設内に喫煙室あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "47席", hoursInfo: "11:00〜22:00(L.O.21:00、ランチ11:00〜14:00・ティー14:00〜17:00・ディナー17:00〜22:00)", closedDaysInfo: "不定休(施設に準ずる)" },
  { id: "yurakucho-59", name: "LEXUS MEETS...", address: "東京都千代田区有楽町1-1-2 東京ミッドタウン日比谷 1F", lat: 35.674088, lng: 139.759552, smokingInfo: "全席禁煙", seatCountInfo: "110席", hoursInfo: "11:00〜22:00(L.O.料理21:00、ドリンク21:30)" },
  { id: "yurakucho-60", name: "THE BLUE", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ別館 日比谷ゴジラスクエア", lat: 35.672913, lng: 139.759964, outletInfo: "電源あり", smokingInfo: "全席禁煙(日比谷シャンテB2に喫煙ルームあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "32席(テラス18・店内10・ソファ2・エッグチェア2)", hoursInfo: "11:00〜21:00(L.O.料理20:00、ドリンク20:30)", closedDaysInfo: "不定休" },
  { id: "yurakucho-61", name: "CAFE A LA TIENNE", address: "東京都千代田区有楽町1-1-1 日本生命日比谷ビル 1F", lat: 35.674088, lng: 139.759552, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "60席", hoursInfo: "11:00〜20:00(L.O.料理19:00、ドリンク19:30)", closedDaysInfo: "年末年始" },
  { id: "yurakucho-62", name: "SINGLE O Yurakucho", address: "東京都千代田区有楽町2-9-1 ルミネ有楽町 ルミネストリート", lat: 35.67477, lng: 139.762527, hoursInfo: "10:00〜21:00" },
  { id: "yurakucho-63", name: "甘味おかめ 有楽町店", address: "東京都千代田区有楽町2-7-1 有楽町イトシア イトシアプラザ 1F", lat: 35.674213, lng: 139.763657, smokingInfo: "全席禁煙", seatCountInfo: "26席", hoursInfo: "火〜日11:00〜20:00", closedDaysInfo: "月曜日(祝日の場合は翌火曜日)" },
  { id: "yurakucho-64", name: "アフタヌーンティー・ティールーム 有楽町ルミネ店", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 ルミネ1 B1F", lat: 35.673576, lng: 139.762802, smokingInfo: "全席禁煙", seatCountInfo: "25席", hoursInfo: "11:00〜21:00", closedDaysInfo: "不定休(ルミネ有楽町店の営業に準ずる)" },
  { id: "yurakucho-65", name: "モアナキッチンカフェ 有楽町イトシア店", address: "東京都千代田区有楽町2-7-1 有楽町イトシア B1F", lat: 35.674213, lng: 139.763657, smokingInfo: "全席禁煙", seatCountInfo: "56席", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "年中無休" },
  { id: "yurakucho-66", name: "Grove", address: "東京都中央区銀座3-4-4 大倉別館 1F", lat: 35.673077, lng: 139.766174, smokingInfo: "全席禁煙", seatCountInfo: "12席", hoursInfo: "9:00〜23:30(L.O.23:00)", closedDaysInfo: "年中無休" },
  { id: "yurakucho-67", name: "メゾンカカオ 丸の内店", address: "東京都千代田区丸の内3-3-1 新東京ビル 1F", lat: 35.677563, lng: 139.76265, smokingInfo: "全席禁煙", seatCountInfo: "25席", hoursInfo: "10:00〜19:00(L.O.17:30)" },
  { id: "yurakucho-68", name: "虎屋菓寮 帝国ホテル店", address: "東京都千代田区内幸町1-1-1 帝国ホテル東京 本館 B1F アーケード", lat: 35.671375, lng: 139.758057, smokingInfo: "全席禁煙", seatCountInfo: "34席", hoursInfo: "平日・土11:00〜18:30、日祝11:00〜17:30", closedDaysInfo: "無休" },
  { id: "yurakucho-69", name: "ディー・エル・カフェ 皇居前店", address: "東京都千代田区有楽町1-13-1", lat: 35.675838, lng: 139.760757, smokingInfo: "全席禁煙", hoursInfo: "平日8:30〜16:30", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "yurakucho-70", name: "スターバックス コーヒー 東京ミッドタウン日比谷店", address: "東京都千代田区有楽町1-1-4 東京ミッドタウン日比谷", lat: 35.674088, lng: 139.759552, smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "yurakucho-71", name: "カフェ彩", address: "東京都千代田区丸の内3-4-1 新国際ビル B1F", lat: 35.676491, lng: 139.762299, smokingInfo: "全席喫煙可" },
  { id: "yurakucho-72", name: "ツタンカーメン", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム Aブロック 1F", lat: 35.676849, lng: 139.76387, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "20席", hoursInfo: "火〜日祝11:00〜19:00(L.O.18:00)", closedDaysInfo: "月曜日" },
  { id: "yurakucho-73", name: "COFFEE GALLERY 有楽町マルイ店", address: "東京都千代田区有楽町2-7-1 有楽町マルイ 7F", lat: 35.674213, lng: 139.763657, smokingInfo: "全席禁煙", hoursInfo: "11:00〜20:00" },
  { id: "yurakucho-74", name: "麻布茶房 日比谷シャンテ店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ B2F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙(店舗近くに共用の喫煙所あり)", seatCountInfo: "36席", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "なし(日比谷シャンテの営業に準ずる)" },
  { id: "yurakucho-75", name: "甘味おかめ 交通会館店", address: "東京都千代田区有楽町2-10-1 東京交通会館 B1F", lat: 35.674953, lng: 139.764359, smokingInfo: "全席禁煙", seatCountInfo: "28席", hoursInfo: "月〜土11:00〜18:30", closedDaysInfo: "日曜日" },
  { id: "yurakucho-76", name: "cafe Planetaria TOKYO", address: "東京都千代田区有楽町2-5-1 有楽町マリオン 9F", lat: 35.673576, lng: 139.762802, smokingInfo: "全席禁煙", hoursInfo: "月〜木・土日10:30〜20:40、金10:30〜21:20", closedDaysInfo: "施設に準ずる" },
  { id: "yurakucho-77", name: "椿屋珈琲 日比谷離れ", address: "東京都千代田区有楽町1-2-5 椿屋珈琲ビル 2・3F", lat: 35.673218, lng: 139.76059, smokingInfo: "分煙(加熱式たばこ限定、紙巻きは喫煙ブース)", seatCountInfo: "92席", hoursInfo: "10:00〜23:00(L.O.22:30)" },
  { id: "yurakucho-78", name: "Giolitti Cafe 有楽町店", address: "東京都千代田区有楽町2-7-1 有楽町マルイ 3F", lat: 35.674213, lng: 139.763657, smokingInfo: "全席禁煙", seatCountInfo: "48席", hoursInfo: "月〜金・日11:00〜20:00、土・祝前日11:00〜21:00", closedDaysInfo: "有楽町マルイに準ずる" },
  { id: "yurakucho-79", name: "ゆとりの空間 日比谷店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 2F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "44席", hoursInfo: "ランチ11:00〜14:30(L.O.)、ディナー16:00〜20:00(L.O.19:30)", closedDaysInfo: "無休" },
  { id: "yurakucho-80", name: "相田みつを美術館カフェ", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム ガラス棟 B1F", lat: 35.676849, lng: 139.76387, smokingInfo: "全席禁煙", seatCountInfo: "20席ほど" },
  { id: "yurakucho-81", name: "プロント ライブラリーショップ＆カフェ日比谷", address: "東京都千代田区日比谷公園1-4 日比谷図書文化館 1F", lat: 35.672764, lng: 139.754089, smokingInfo: "全席禁煙", seatCountInfo: "150席", hoursInfo: "平日10:00〜19:00、土日祝10:00〜17:00", closedDaysInfo: "不定休(日比谷図書文化館の営業に準ずる)" },
  { id: "yurakucho-82", name: "ビチェリン 阪急メンズ東京店", address: "東京都千代田区有楽町2-5-1 阪急メンズ東京 B1F", lat: 35.673576, lng: 139.762802, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "43席", hoursInfo: "平日12:00〜20:00、土日祝11:00〜20:00(L.O.料理19:00、ドリンク19:30)", closedDaysInfo: "館に準ずる" },
  { id: "yurakucho-83", name: "ザ・パントリー 丸の内", address: "東京都千代田区丸の内3-3-1 新東京ビル 1F", lat: 35.677563, lng: 139.76265, smokingInfo: "全席禁煙", seatCountInfo: "30席", hoursInfo: "月〜金11:00〜20:00(L.O.19:30)", closedDaysInfo: "土曜日、年末年始" },
  { id: "yurakucho-84", name: "果実園リーベル 日比谷シャンテ店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 2F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "74席", hoursInfo: "11:00〜20:00", closedDaysInfo: "日比谷シャンテの休館日に準ずる" },
  { id: "yurakucho-85", name: "ディーン&デルーカ 有楽町カフェ", address: "東京都千代田区有楽町2-9-17 ルミネストリート", lat: 35.674961, lng: 139.763565, smokingInfo: "全席禁煙", seatCountInfo: "20席" },
  { id: "yurakucho-86", name: "デュオカフェ 有楽町店", address: "東京都千代田区有楽町2-8-1", lat: 35.674191, lng: 139.762497, smokingInfo: "全席喫煙可", seatCountInfo: "10席" },
  { id: "yurakucho-87", name: "ラ・プティ・メルスリー ルミネ有楽町店", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 ルミネ1 4F", lat: 35.673576, lng: 139.762802, smokingInfo: "全席禁煙", seatCountInfo: "30席", hoursInfo: "11:00〜21:00(L.O.20:30)", closedDaysInfo: "ルミネ有楽町店に準ずる" },
  { id: "yurakucho-88", name: "林屋新兵衛 日比谷店", address: "東京都千代田区有楽町1-1-2 東京ミッドタウン日比谷 日比谷三井タワー 2F", lat: 35.674088, lng: 139.759552, outletInfo: "電源あり", smokingInfo: "全席禁煙", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "不定休(東京ミッドタウン日比谷に準ずる)" },
  { id: "yurakucho-89", name: "ブルックリン ロースティング カンパニー 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム A棟 1F", lat: 35.676849, lng: 139.76387, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "50席", hoursInfo: "平日11:00〜19:00(L.O.18:30)、土日祝10:00〜19:00(L.O.18:30)", closedDaysInfo: "不定休" },
  { id: "yurakucho-90", name: "珈琲茶館 集 イトシアプラザ有楽町店", address: "東京都千代田区有楽町2-7-1 有楽町イトシア 2F", lat: 35.674213, lng: 139.763657, smokingInfo: "分煙", seatCountInfo: "100席", hoursInfo: "月〜木10:00〜22:00(L.O.料理21:00、ドリンク21:30)、金〜日10:00〜22:30(L.O.料理21:30、ドリンク22:00)" },
  { id: "yurakucho-91", name: "カフェ&ダイニング アーチ HIBIYA", address: "東京都千代田区有楽町1-2-1 東宝シアタークリエビル 2F", lat: 35.672913, lng: 139.759964, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "77席(カウンター15・テーブル62)", hoursInfo: "平日7:00〜14:30(L.O.14:00)、土日7:00〜15:30(L.O.15:00)", closedDaysInfo: "なし" },
  { id: "yurakucho-92", name: "ジャンフランソワ 東京ミッドタウン日比谷", address: "東京都千代田区有楽町1-1-3 東京ミッドタウン日比谷 B1F", lat: 35.674088, lng: 139.759552, smokingInfo: "全席禁煙", seatCountInfo: "52席", hoursInfo: "10:00〜21:00", closedDaysInfo: "なし(東京ミッドタウン日比谷に準ずる)" },
  { id: "yurakucho-93", name: "チャヤ ナチュラル&ワイルドテーブル 日比谷シャンテ店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ B2F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "48席", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "日比谷シャンテに準ずる" },
  { id: "yurakucho-94", name: "宮越屋珈琲 日比谷店", address: "東京都千代田区有楽町1-13-1 1F", lat: 35.675838, lng: 139.760757, hoursInfo: "平日8:30〜19:00、土日祝11:00〜19:00" },
  { id: "yurakucho-95", name: "キハチカフェ 日比谷シャンテ店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 1F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "40席", hoursInfo: "11:00〜20:00(L.O.19:30)", closedDaysInfo: "日比谷シャンテに準ずる" },
  { id: "yurakucho-96", name: "GODIVA cafe 日比谷店", address: "東京都千代田区有楽町1-5-2 東宝日比谷プロムナードビル 2F", lat: 35.674419, lng: 139.759888, smokingInfo: "全席禁煙", seatCountInfo: "57席", hoursInfo: "11:00〜21:00(L.O.料理20:30)" },
  { id: "yurakucho-97", name: "パティスリー&カフェ デリーモ 東京ミッドタウン日比谷店", address: "東京都千代田区有楽町1-1-3 東京ミッドタウン日比谷 B1F", lat: 35.674088, lng: 139.759552, outletInfo: "電源あり", smokingInfo: "全席禁煙", seatCountInfo: "50席", hoursInfo: "11:00〜23:00(L.O.22:00)", closedDaysInfo: "施設に準ずる" },
  { id: "yurakucho-98", name: "ビーアンドビーコーヒー 丸の内店", address: "東京都千代田区丸の内3-3-1 新東京ビル B1F", lat: 35.677563, lng: 139.76265, smokingInfo: "分煙", seatCountInfo: "20席", hoursInfo: "平日7:00〜20:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "yurakucho-99", name: "Ya Kun Kaya Toast 東京国際フォーラム店", address: "東京都千代田区丸の内3-5-1 東京国際フォーラム 1F", lat: 35.676849, lng: 139.76387, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "52席", hoursInfo: "8:00〜20:00(L.O.19:00)", closedDaysInfo: "なし" },
  { id: "yurakucho-100", name: "Cafe1968", address: "東京都千代田区丸の内3-3-1 新東京ビル 8F", lat: 35.677563, lng: 139.76265, outletInfo: "コンセントのある席が多いとの口コミあり", wifiInfo: "Wi-Fi完備との口コミあり", hoursInfo: "平日10:00〜18:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "yurakucho-101", name: "阿蘇", address: "東京都千代田区有楽町2-10-1 東京交通会館 B1F", lat: 35.674953, lng: 139.764359, smokingInfo: "全席喫煙可", seatCountInfo: "16席(カウンターのみ)", hoursInfo: "月〜土9:30〜17:30", closedDaysInfo: "日曜日" },
  { id: "yurakucho-102", name: "ル・プチメック 日比谷店", address: "東京都千代田区有楽町1-2-2 日比谷シャンテ 1F", lat: 35.672913, lng: 139.759964, smokingInfo: "全席禁煙", seatCountInfo: "42席", hoursInfo: "8:00〜20:00" },
  { id: "yurakucho-103", name: "ハーブス ルミネ有楽町店", address: "東京都千代田区有楽町2-5-1 ルミネ有楽町 ルミネ1 2F", lat: 35.673576, lng: 139.762802, smokingInfo: "全席禁煙", seatCountInfo: "89席", hoursInfo: "11:00〜21:00(料理L.O.19:00、イートインL.O.20:00)", closedDaysInfo: "無休(施設に準ずる)" },
];
