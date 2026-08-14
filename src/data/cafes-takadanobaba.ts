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
// - takadanobaba-06(サイゼリヤ 高田馬場東早稲田通り店): 2022年1月11日閉店
// - takadanobaba-26(COTTI COFFEE 高田馬場店): 食べログ【閉店】表示
// - takadanobaba-31(BowRabit TOKYO 高田馬場本店): 食べログ【閉店】表示、
//   公式ドメインも解決不可
// - takadanobaba-33(Cafe au lait Tokyo): 高田馬場の住所から品川区五反田へ
//   移転済み(食べログが「移転前の店舗情報」と明記)
export const cafes: Cafe[] = [
  { id: "takadanobaba-01", name: "マクドナルド 高田馬場駅前店", address: "東京都新宿区高田馬場2-18-11", lat: 35.713612, lng: 139.704819, outletInfo: "窓際ハイカウンター席に電源あり、USB充電も可能", smokingInfo: "屋内禁煙(2014年8月1日より全店舗で屋内禁煙、喫煙室なし)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "86席", hoursInfo: "7:00〜22:00" },
  { id: "takadanobaba-02", name: "ガスト 高田馬場駅前店", address: "東京都新宿区高田馬場1-26-7 名店ビル2F", lat: 35.713116, lng: 139.705017, outletInfo: "自由に使えるコンセントあり、机の下にも設置", smokingInfo: "全席禁煙(敷地内禁煙、すかいらーくグループ全店方針)", wifiInfo: "無料Wi-Fiあり(すかいらーくグループ共通)", seatCountInfo: "86席", hoursInfo: "8:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-03", name: "デニーズ 高田馬場店", address: "東京都豊島区高田3-26-3", lat: 35.715374, lng: 139.70813, outletInfo: "全席に電源あり、ひとり席中心に確保", smokingInfo: "全席禁煙(2020年4月1日より全店全面禁煙化)", seatCountInfo: "130席", hoursInfo: "平日6:30〜23:00、土日6:30〜24:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-04", name: "サイゼリヤ ビッグボックス高田馬場店", address: "東京都新宿区高田馬場1-35-3 BIGBOX高田馬場9F", lat: 35.712494, lng: 139.703873, smokingInfo: "全席禁煙(2019年6月より全店全席禁煙化済み)", hoursInfo: "10:00〜翌5:00(L.O.4:30)", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-06", name: "サイゼリヤ 高田馬場東早稲田通り店", address: "東京都新宿区高田馬場2-13-2 PrimegateビルB1", lat: 35.712143, lng: 139.707474 },
  { id: "takadanobaba-07", name: "スターバックス コーヒー 西武高田馬場駅店", address: "東京都新宿区高田馬場1-35-2 高田馬場西武ラチ内コンコース", lat: 35.7131017, lng: 139.7041121, outletInfo: "カウンター席に電源あり、使える席は4席ほど", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "6:30〜22:30", closedDaysInfo: "不定休" },
  { id: "takadanobaba-08", name: "スターバックス コーヒー 高田馬場早稲田通り店", address: "東京都新宿区高田馬場1-25-32 108ビル1F", lat: 35.712204, lng: 139.706787, outletInfo: "2階中央テーブルに電源あり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "全50席(1F・地下1F・2Fの3フロアに分散)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "takadanobaba-09", name: "ドトールコーヒーショップ 高田馬場4丁目店", address: "東京都新宿区高田馬場4-8-4", lat: 35.713566, lng: 139.703232, outletInfo: "電源なし、との情報あり", smokingInfo: "分煙(喫煙席・喫煙ブースあり、完全分煙)", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "全59席(禁煙48・喫煙11)", hoursInfo: "平日6:45〜21:00、土曜7:30〜21:00、日祝7:30〜21:00" },
  { id: "takadanobaba-10", name: "ドトールコーヒーショップ 高田馬場1丁目店", address: "東京都新宿区高田馬場1-17-16 中村ビル1F", lat: 35.712051, lng: 139.707199, outletInfo: "電源・Wi-Fiあり（電源カフェ検索調べ）", smokingInfo: "分煙(店内116席は全席禁煙、別途喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "全116席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜21:00、土曜7:30〜20:00、日祝8:00〜20:00" },
  { id: "takadanobaba-11", name: "タリーズコーヒー Emio Style BIGBOX高田馬場店", address: "東京都新宿区高田馬場1-35-3 BIGBOX高田馬場2F", lat: 35.712494, lng: 139.703873, outletInfo: "窓際カウンターに電源あり、ACとUSB両対応", smokingInfo: "禁煙(店内喫煙不可)", wifiInfo: "無料Wi-Fiあり(tullys_Wi-Fi、会員登録不要・利用時間制限なし)", seatCountInfo: "全71席", hoursInfo: "8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-12", name: "エクセルシオール カフェ 高田馬場駅前店", address: "東京都新宿区高田馬場2-17-6 ゆう文ビル2F", lat: 35.713486, lng: 139.70517, outletInfo: "フリーWi-Fiと電源席あり", smokingInfo: "全65席禁煙、別途喫煙ブース(紙巻・加熱式たばこ)あり", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi/Wi2premium)", seatCountInfo: "65席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜22:00、土日祝8:00〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-13", name: "カフェ・ベローチェ 西早稲田店", address: "東京都新宿区西早稲田2-21-16 高田馬場EKKビル1F", lat: 35.711262, lng: 139.710648, outletInfo: "窓際等の座面下に2口コンセント、計4席分", smokingInfo: "全席禁煙", wifiInfo: "会員登録不要の無料Wi-Fiあり(+veloce_free_wifi)", seatCountInfo: "70席", hoursInfo: "7:00〜21:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-14", name: "PRONTO 高田馬場店", address: "東京都新宿区高田馬場1-33-13 千年ビルB1F", lat: 35.711369, lng: 139.704056, outletInfo: "木製大テーブルに電源あり、約10席で利用可", smokingInfo: "分煙(禁煙席・加熱式たばこ専用席)", wifiInfo: "無料Wi-Fiあり(PRONTO_FREE_Wi-Fi)", seatCountInfo: "117席", hoursInfo: "月〜金7:00〜17:59(カフェ)/18:00〜21:30(バー)、土日7:00〜18:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-15", name: "コメダ珈琲店 高田馬場駅前店", address: "東京都新宿区高田馬場3-2-5 フレンドビル2F", lat: 35.713825, lng: 139.703125, outletInfo: "コンセントなし、Wi-Fiのみ利用可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(Komeda_Wi-Fi)", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "takadanobaba-16", name: "喫茶室ルノアール 高田馬場駅前店", address: "東京都新宿区高田馬場4-8-7 花川ビル2F", lat: 35.713715, lng: 139.703506, outletInfo: "電源サービス完備、複数Wi-Fiも利用可", smokingInfo: "禁煙55席・加熱式たばこ専用喫煙席18席、紙巻きたばこ専用喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "73席(禁煙55+加熱式喫煙18、別途喫煙ブース)", hoursInfo: "7:30〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-17", name: "喫茶室ルノアール 高田馬場1丁目店", address: "東京都新宿区高田馬場1-34-12 竹内ビル1F", lat: 35.712017, lng: 139.7043, outletInfo: "電源あり、禁煙席61席の落ち着いた店内", smokingInfo: "禁煙61席・喫煙(加熱式たばこ専用)28席", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "89席(禁煙61+加熱式喫煙28、別途喫煙ブース)", hoursInfo: "月〜土7:30〜22:00、日祝8:00〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-18", name: "喫茶室ルノアール 高田馬場2丁目店", address: "東京都新宿区高田馬場2-18-6 柳屋ビル1F", lat: 35.713936, lng: 139.705093, outletInfo: "電源あり、禁煙席58席・喫煙席20席", smokingInfo: "禁煙58席・加熱式たばこ専用喫煙席20席", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "78席(禁煙58+加熱式喫煙20)", hoursInfo: "月〜金7:30〜22:00、土日祝8:00〜22:00", closedDaysInfo: "無休" },
  { id: "takadanobaba-19", name: "モスバーガー 高田馬場四丁目店", address: "東京都新宿区高田馬場4-9-14", lat: 35.713676, lng: 139.703125, outletInfo: "1階優先カウンター席にコンセント2個あり", smokingInfo: "全席禁煙", seatCountInfo: "40席" },
  { id: "takadanobaba-20", name: "フレッシュネスバーガー 高田馬場店", address: "東京都新宿区高田馬場1-17-15", lat: 35.712128, lng: 139.707062, outletInfo: "コンセントあり、Wi-Fiも完備", smokingInfo: "完全禁煙(喫煙専用室あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "57席", hoursInfo: "9:00〜22:00(L.O.21:40)" },
  { id: "takadanobaba-21", name: "ベックスコーヒーショップ 高田馬場店", address: "東京都新宿区高田馬場1-35-2（高田馬場駅構内）", lat: 35.712494, lng: 139.703873, outletInfo: "店内奥の一人掛け椅子に電源席あり", smokingInfo: "分煙(喫煙可のエリアあり、最新情報は要確認)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "45席", hoursInfo: "平日6:30〜21:00、土日祝6:30〜20:00" },
  { id: "takadanobaba-22", name: "Delifrance BIGBOX高田馬場店", address: "東京都新宿区高田馬場1-35-3 BIGBOX高田馬場1F", lat: 35.712494, lng: 139.703873, smokingInfo: "禁煙", wifiInfo: "フリーWi-Fiあり", seatCountInfo: "31席", hoursInfo: "月〜日・祝日7:00〜22:00(ドリンクL.O.閉店30分前)" },
  { id: "takadanobaba-23", name: "カフェ・ド・クリエ 高田馬場店", address: "東京都新宿区高田馬場4-8-7 花川ビル1F", lat: 35.713715, lng: 139.703506, outletInfo: "カウンター席に電源コンセントあり", smokingInfo: "分煙(最新情報は要確認)", seatCountInfo: "90席", hoursInfo: "月火水木6:45〜21:00、金・日7:30〜21:00、土7:00〜21:00", closedDaysInfo: "なし(無休)" },
  { id: "takadanobaba-24", name: "星乃珈琲店 高田馬場店", address: "東京都新宿区高田馬場2-17-15 唐橋ビル2F", lat: 35.713127, lng: 139.705811, outletInfo: "コンセント・Wi-Fiともになし、との口コミあり", smokingInfo: "禁煙(喫煙ブースあり)", wifiInfo: "Wi-Fiなし", hoursInfo: "月火水木金日10:00〜22:00(L.O.21:15)、土10:00〜22:30(L.O.21:45)" },
  { id: "takadanobaba-25", name: "COSTA COFFEE 高田馬場店", address: "東京都新宿区高田馬場2-14-2 B1F", lat: 35.712372, lng: 139.707047, smokingInfo: "全席禁煙", seatCountInfo: "100席" },
  { id: "takadanobaba-26", name: "COTTI COFFEE 高田馬場店", address: "東京都新宿区高田馬場1-33-15 TFT高田馬場駅前ビル1F", lat: 35.711117, lng: 139.703964 },
  { id: "takadanobaba-27", name: "NEW YORKER'S Cafe 高田馬場1丁目店", address: "東京都新宿区高田馬場1-33-13 千年ビル1F", lat: 35.711369, lng: 139.704056, outletInfo: "窓際カウンター席で電源使用可、6席ほど", smokingInfo: "分煙:禁煙55席、加熱式たばこ可27席、紙巻きたばこ専用喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi等)、電源あり", seatCountInfo: "82席(禁煙55席・喫煙27席)", hoursInfo: "月〜土7:00〜22:00、日・祝日7:30〜22:00", closedDaysInfo: "なし(年中無休)" },
  { id: "takadanobaba-28", name: "10°CAFE（ジュードカフェ）", address: "東京都豊島区高田3-12-8", lat: 35.714859, lng: 139.705551, outletInfo: "1階2階全席に電源完備", wifiInfo: "全席電源＆Wi-Fi完備(無料Wi-Fiあり)", hoursInfo: "平日9:00〜20:30(L.O.20:00)、休日11:00〜20:30(L.O.20:00)、夜CAFE金・土20:30〜23:30(L.O.23:00)", closedDaysInfo: "第3日曜日" },
  { id: "takadanobaba-29", name: "LUCAS FARM CAFE", address: "東京都新宿区高田馬場1-26-5 F・Iビル4F", lat: 35.712883, lng: 139.704865, outletInfo: "電源・コンセントあり、Wi-Fi完備、30席以上", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜20:00(L.O.19:30)", closedDaysInfo: "不定休" },
  { id: "takadanobaba-30", name: "cat cafe にゃんこと", address: "東京都新宿区高田馬場2-14-6 スワンビル201", lat: 35.712677, lng: 139.706512, outletInfo: "電源・Wi-Fi無料、作業スペースとしても利用可", wifiInfo: "あり", closedDaysInfo: "年中無休(臨時休業・貸切営業日あり)" },
  { id: "takadanobaba-31", name: "BowRabit TOKYO 高田馬場本店", address: "東京都新宿区高田馬場4-12-7", lat: 35.713184, lng: 139.701462, outletInfo: "入って左側カウンターで電源使用可" },
  { id: "takadanobaba-33", name: "Cafe au lait Tokyo", address: "東京都新宿区高田馬場4-2-28", lat: 35.711555, lng: 139.70282, outletInfo: "壁際カウンター席で電源使用可" },
  { id: "takadanobaba-35", name: "虫二（ちゅうじ）", address: "東京都新宿区高田馬場2-14-5 ROZZO1F", lat: 35.712601, lng: 139.70665, smokingInfo: "全席禁煙", seatCountInfo: "10席(手前席4名まで・奥席6名までの茶席)", hoursInfo: "11:00〜18:00(月・水・金・土・日・祝日・祝前日・祝後日営業、7〜9月は夏季限定カフェ営業あり)", closedDaysInfo: "火曜日・木曜日(不定休あり、詳細はSNSで要確認)" },
  { id: "takadanobaba-36", name: "イントロ（JazzSpot Intro）", address: "東京都新宿区高田馬場2-14-8", lat: 35.71283, lng: 139.706238, hoursInfo: "火〜金・日18:30〜24:00、土18:30〜翌4:30", closedDaysInfo: "月曜日(『イントロ安息日』)" },
  { id: "takadanobaba-37", name: "パンデュール", address: "東京都新宿区下落合1-3-19", lat: 35.715565, lng: 139.703262, seatCountInfo: "26席(カウンター6席、テーブル20席)", hoursInfo: "月火水木金9:30〜21:00、土10:30〜21:00", closedDaysInfo: "日曜日・祝日・第2土曜日・第4土曜日" },
  { id: "takadanobaba-38", name: "本に没頭できるカフェ Good Rack", address: "東京都新宿区高田馬場4-2-9 コスタレイ高田馬場103", lat: 35.710835, lng: 139.701416, smokingInfo: "全席禁煙" },
  { id: "takadanobaba-39", name: "ラタン", address: "東京都新宿区高田馬場1-31-8 ダイカンプラザ1F", lat: 35.710106, lng: 139.703125, smokingInfo: "全席喫煙可", hoursInfo: "18:00〜24:00" },
  { id: "takadanobaba-40", name: "白井珈琲店", address: "東京都新宿区高田馬場4-28-18 鈴木ビル1F", lat: 35.712059, lng: 139.69902, outletInfo: "カウンター・テーブル席にWi-Fi＆コンセントあり", wifiInfo: "無料Wi-Fiあり(電源席あり)", hoursInfo: "月〜土08:00〜18:00", closedDaysInfo: "日曜日・祝日" },
  { id: "takadanobaba-41", name: "サブスリー", address: "東京都新宿区高田馬場3-14-17", lat: 35.713554, lng: 139.699768, smokingInfo: "全席喫煙可(2020年施行の改正健康増進法以前の情報の可能性あり要確認)", hoursInfo: "月〜土10:00〜17:00", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-42", name: "馬場サウナ＆ワークカフェ", address: "東京都新宿区高田馬場2-1-1 センテニアルタワー2F", lat: 35.711655, lng: 139.709869, outletInfo: "ワークスペース全域で高速Wi-Fi・コンセント完備", smokingInfo: "施設内全面禁煙(入口階段含む)", wifiInfo: "高速Wi-Fi・電源完備(ワークカフェエリア)", hoursInfo: "8:00〜23:00(ワークカフェ最終受付22:00、サウナ最終入場22:00)", closedDaysInfo: "年中無休(設備工事等による臨時休業の可能性あり)" },
  { id: "takadanobaba-43", name: "地球を旅するCAFE", address: "東京都新宿区高田馬場2-12-5 プレビル1F", lat: 35.71323, lng: 139.707489, outletInfo: "電源・Wi-Fiともになし、との情報あり", smokingInfo: "全席禁煙", seatCountInfo: "17席(カウンター3席・テーブル14席)", hoursInfo: "09:00〜17:00(L.O.16:30)" },
  { id: "takadanobaba-44", name: "日本茶カフェ 茶々工房", address: "東京都新宿区西早稲田2-21-19", lat: 35.710918, lng: 139.710602, hoursInfo: "11:30〜19:00(L.O.18:30)", closedDaysInfo: "日曜・祝日" },
  { id: "takadanobaba-45", name: "LUNA CAFE ORGANIC & LAUNDRY", address: "東京都新宿区高田馬場1-24-18", lat: 35.712051, lng: 139.705261, outletInfo: "電源席あり、Wi-Fiも利用可", hoursInfo: "カフェ10:00〜18:00、コインランドリー24時間営業", closedDaysInfo: "カフェ:不定休、コインランドリー:なし" },
  { id: "takadanobaba-46", name: "珈琲専門店 預言CAFE", address: "東京都新宿区高田馬場4-2-38 宏陽ビル1F", lat: 35.710461, lng: 139.70253, smokingInfo: "全席禁煙", seatCountInfo: "11席", hoursInfo: "月火水木土祝14:00〜(受付終了18:15)、金16:00〜21:00(受付終了20:45)", closedDaysInfo: "日曜日、第2土曜日(カデンツ公演日)" },
  { id: "takadanobaba-47", name: "Caffe CIELO", address: "東京都新宿区高田馬場1-31-8", lat: 35.710106, lng: 139.703125, smokingInfo: "全席禁煙", seatCountInfo: "60席" },
  { id: "takadanobaba-48", name: "Deli flattoriano", address: "東京都新宿区高田馬場1-25-30 1F", lat: 35.712387, lng: 139.706604, smokingInfo: "全席禁煙", seatCountInfo: "28席(テーブル14卓)", hoursInfo: "月〜土11:00〜22:00(L.O.料理21:00、ドリンク21:30)、日11:00〜21:00(L.O.料理20:00、ドリンク20:30)" },
  { id: "takadanobaba-49", name: "Tasse Coffee Roastery", address: "東京都新宿区高田馬場1-6-12 1F", lat: 35.711575, lng: 139.707642, outletInfo: "コンセントは一部の席のみ利用可、との情報あり", smokingInfo: "全席禁煙", seatCountInfo: "12席(テーブル10席:2人掛け×5、ベンチ2席)", hoursInfo: "11:00〜17:30", closedDaysInfo: "火曜日" },
  { id: "takadanobaba-50", name: "サンリンシャ", address: "東京都新宿区高田馬場4-4-10 コーポラス徳光1F", lat: 35.712376, lng: 139.701767, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "8席(4人掛けテーブル×1、2人掛けテーブル×2)", hoursInfo: "月・土11:15〜17:00、火11:15〜19:00、水11:15〜15:00、木11:15〜20:00、金11:15〜21:00", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-51", name: "CoCo Bubble Tea 高田馬場店", address: "東京都新宿区高田馬場3-4-19", lat: 35.71452, lng: 139.703186, smokingInfo: "全席禁煙", hoursInfo: "11:00〜22:00", closedDaysInfo: "なし" },
  { id: "takadanobaba-52", name: "バーガーキング 高田馬場店", address: "東京都新宿区高田馬場1-27-3 ニュー竹宝ビル1F", lat: 35.712273, lng: 139.70488, outletInfo: "奥の壁際カウンター席に電源あり、5席ほど", smokingInfo: "分煙(禁煙69席・喫煙7席、全76席中)", seatCountInfo: "76席", hoursInfo: "月〜金07:00〜23:00、土08:00〜23:00、日・祝08:00〜22:00", closedDaysInfo: "無休(年中無休)" },
  { id: "takadanobaba-53", name: "KFC+CAFE&BAR 高田馬場店", address: "東京都新宿区高田馬場1-28-10", lat: 35.712284, lng: 139.704681, outletInfo: "木製テーブル席に電源あり、8席ほど" },
  // 以下、2026年8月に食べログの高田馬場・早稲田エリア「カフェ」一覧から追加。
  // 住所・営業時間・席数・禁煙喫煙・Wi-Fi・電源は各店の食べログ店舗ページ記載を確認。
  // 記載のなかった項目はキーごと省略している（推測では埋めていない）。
  { id: "takadanobaba-54", name: "カフェ コットンクラブ", address: "東京都新宿区高田馬場1-17-14 B1F・1F・2F・3F", lat: 35.712204, lng: 139.706924, smokingInfo: "分煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "220席(5フロア)", hoursInfo: "月〜木・土日祝11:30〜23:00、金11:30〜翌4:30(ランチ11:30〜15:00)", closedDaysInfo: "無休" },
  { id: "takadanobaba-55", name: "THE WU", address: "東京都新宿区高田馬場1-27-7 相鉄グランドフレッサ高田馬場1F", lat: 35.712669, lng: 139.704742, outletInfo: "電源あり", smokingInfo: "全席禁煙(1階に喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "64席(入り口側36席、半個室側28席)", hoursInfo: "朝食7:00〜10:00(L.O.9:30)、ランチ11:30〜16:00(L.O.15:00)、ディナー17:30〜22:00(L.O.料理21:00・ドリンク21:30)", closedDaysInfo: "なし" },
  { id: "takadanobaba-56", name: "タウンジー カフェ&バー", address: "東京都新宿区高田馬場2-19-7 タックイレブンビル4F", lat: 35.713772, lng: 139.704422, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "24席(テーブル席)", hoursInfo: "11:30〜21:00(L.O.20:00)" },
  { id: "takadanobaba-57", name: "9SARI CAFE & BAR", address: "東京都新宿区大久保3-13-1 都営西大久保アパート1号棟1F", lat: 35.707752, lng: 139.707809, smokingInfo: "分煙(店内は加熱式たばこのみ可、テラス席は喫煙可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "32席(テーブル12席、カウンター4席、テラステーブル3席)", hoursInfo: "月〜金11:30〜15:00(L.O.14:30)/17:00〜23:00(L.O.22:30)、土日12:00〜23:00(L.O.22:30)" },
  { id: "takadanobaba-58", name: "馬場FLAT", address: "東京都新宿区大久保3-10-1 オレンジコート", lat: 35.70858, lng: 139.704941, smokingInfo: "全席禁煙", seatCountInfo: "16席", hoursInfo: "8:30〜19:00", closedDaysInfo: "毎月第2月曜日" },
  { id: "takadanobaba-59", name: "馬場FLAT HANARE", address: "東京都新宿区大久保3-10 オレンジコート内", lat: 35.70858, lng: 139.704941, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "30席(テラス席あり)", hoursInfo: "ランチ11:00〜15:00(L.O.料理14:00・ドリンク15:00)、ディナー17:00〜21:00(L.O.料理20:00・ドリンク20:30)", closedDaysInfo: "毎月第2月曜日" },
  { id: "takadanobaba-60", name: "Sora Cafe Takadanobaba", address: "東京都新宿区大久保3-10-1 オレンジコート1F", lat: 35.70858, lng: 139.704941, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "8席", hoursInfo: "月〜金・祝10:30〜19:30(L.O.19:00)、土日11:30〜19:30(L.O.19:00) ※焼菓子売り切れ次第終了", closedDaysInfo: "不定休" },
  { id: "takadanobaba-61", name: "ドティ カフェ ベトナム", address: "東京都新宿区大久保3-10-1 オレンジコート", lat: 35.70858, lng: 139.704941, smokingInfo: "全席禁煙", seatCountInfo: "18席", hoursInfo: "月〜金11:00〜20:00、土日祝10:00〜17:00" },
  { id: "takadanobaba-62", name: "tea＆sweets こく〜ん", address: "東京都新宿区大久保3-10-1 オレンジコートショッピングセンター内", lat: 35.70858, lng: 139.704941, smokingInfo: "全席禁煙", seatCountInfo: "22席", hoursInfo: "火〜金11:00〜15:30(L.O.15:00)", closedDaysInfo: "月曜日・土曜日・日曜日" },
  { id: "takadanobaba-63", name: "HERE! tokyo", address: "東京都新宿区大久保3-10-1 ニュータウンオオクボB棟no29", lat: 35.70858, lng: 139.704941, smokingInfo: "全席禁煙", seatCountInfo: "10席", hoursInfo: "月〜金12:00〜18:00(L.O.17:45)、土日祝12:00〜18:00(L.O.17:30)" },
  { id: "takadanobaba-64", name: "Re:s cafebar&sweets", address: "東京都新宿区大久保3-9-5 都営西大久保アパート1F", lat: 35.708603, lng: 139.703735, smokingInfo: "全席禁煙", seatCountInfo: "25席(カウンター5席、テーブル16席、ソファ4席)", hoursInfo: "火〜日・祝11:00〜17:00(L.O.16:30)", closedDaysInfo: "月曜日" },
  { id: "takadanobaba-65", name: "タリーズコーヒー 早大理工店", address: "東京都新宿区大久保3-4-1", lat: 35.70588592, lng: 139.70603536, smokingInfo: "全席禁煙", seatCountInfo: "17席", hoursInfo: "月〜金8:00〜20:00、土9:00〜18:00", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-66", name: "フレッシュネスバーガー 西早稲田店", address: "東京都新宿区大久保3-14-3 トーア早稲田マンション1F", lat: 35.707993, lng: 139.708954, smokingInfo: "分煙", seatCountInfo: "47席", hoursInfo: "9:00〜21:00" },
  { id: "takadanobaba-67", name: "cafe omotenashamoji", address: "東京都新宿区西早稲田3-28-1 リコスビル1F", lat: 35.711506, lng: 139.710449, smokingInfo: "全席禁煙", seatCountInfo: "19席(カウンター3席、テーブル12席、小上がり座敷4席)", hoursInfo: "11:00〜18:00(L.O.17:30)", closedDaysInfo: "不定休" },
  { id: "takadanobaba-68", name: "ネッコカフェ", address: "東京都新宿区西早稲田2-18-21 羽柴ビル202", lat: 35.710968, lng: 139.711456, smokingInfo: "全席禁煙", seatCountInfo: "20席", hoursInfo: "火〜日14:00〜22:00", closedDaysInfo: "月曜日" },
  { id: "takadanobaba-69", name: "DREAMSPARK Brewing Waseda", address: "東京都新宿区西早稲田2-18-25", lat: 35.710663, lng: 139.71199, seatCountInfo: "9席(カウンター3席、テーブル6席)", hoursInfo: "月・水〜土13:00〜22:00、日13:00〜19:00", closedDaysInfo: "火曜日" },
  { id: "takadanobaba-70", name: "グッドモーニングカフェ 早稲田", address: "東京都新宿区西早稲田1-9-12 大隈スクエアビル1F", lat: 35.710617, lng: 139.720032, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "61席(店内テーブル42席、テラス19席)", hoursInfo: "月〜金11:00〜21:30、土日祝9:00〜21:30" },
  { id: "takadanobaba-71", name: "戸山カフェテリア", address: "東京都新宿区戸山1-24-1 早稲田大学戸山キャンパス", lat: 35.705814, lng: 139.717331, seatCountInfo: "200席" },
  { id: "takadanobaba-72", name: "タリーズコーヒー 国立国際医療研究センター店", address: "東京都新宿区戸山1-21-1 国立国際医療研究センター1F", lat: 35.70321497, lng: 139.71579847, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "45席", hoursInfo: "月〜金7:30〜18:00", closedDaysInfo: "土曜日・日曜日" },
  { id: "takadanobaba-73", name: "サブウェイ 高田馬場店", address: "東京都新宿区高田馬場1-26-5 F・Iビル1F", lat: 35.712883, lng: 139.704865, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "14席", hoursInfo: "8:00〜21:00" },
  { id: "takadanobaba-74", name: "フレッシュベーカリー神戸屋 高田馬場メトロピア店", address: "東京都新宿区高田馬場1-35-2 東京メトロ東西線高田馬場駅改札外メトロピア高田馬場", lat: 35.7132822, lng: 139.7049378, smokingInfo: "全席禁煙", seatCountInfo: "16席(フードコート席も利用可)", hoursInfo: "月〜金8:00〜22:00、土日祝9:00〜21:00" },
  { id: "takadanobaba-75", name: "ミスタードーナツ 高田馬場戸山口ショップ", address: "東京都新宿区高田馬場1-34-1", lat: 35.711639, lng: 139.704071, smokingInfo: "全席禁煙", seatCountInfo: "35席(1F・2F)", hoursInfo: "9:00〜21:00" },
  { id: "takadanobaba-76", name: "ゴンチャ 高田馬場店", address: "東京都新宿区高田馬場1-34-1 サンフジビルB1F", lat: 35.711639, lng: 139.704071, smokingInfo: "全席禁煙", hoursInfo: "11:00〜22:00" },
  { id: "takadanobaba-77", name: "700CC 台湾タピオカ", address: "東京都新宿区高田馬場1-26-7 名店ビル1F", lat: 35.713116, lng: 139.705017, smokingInfo: "全席禁煙" },
  { id: "takadanobaba-78", name: "Tigercool シンジキ", address: "東京都新宿区高田馬場1-33-15 TFT高田馬場駅前ビル1F A号室", lat: 35.711117, lng: 139.703964, smokingInfo: "全席禁煙", hoursInfo: "11:00〜22:30" },
  { id: "takadanobaba-79", name: "茶のつたや", address: "東京都新宿区高田馬場1-17-17 つたやビル", lat: 35.711971, lng: 139.707336, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "30席(カウンター10席、2人掛けテーブル11卓)", hoursInfo: "月・火・金11:00〜18:00、土日12:00〜18:00", closedDaysInfo: "水曜日・木曜日" },
  { id: "takadanobaba-80", name: "BYOもちこみCafe ブラックの女王", address: "東京都新宿区高田馬場1-24-18 アサイガーデンコート2F", lat: 35.712051, lng: 139.705261 },
  { id: "takadanobaba-81", name: "ホーミーズ", address: "東京都新宿区高田馬場2-9-1", lat: 35.712009, lng: 139.707825, smokingInfo: "全席禁煙", seatCountInfo: "21席(カウンター席あり)", hoursInfo: "火〜木11:00〜16:00(L.O.15:30)/17:00〜21:00(L.O.20:30)、金・祝前日11:00〜16:00/17:00〜22:00、土11:00〜22:00、日11:00〜21:00", closedDaysInfo: "月曜日(祝日の場合は翌火曜日)" },
  { id: "takadanobaba-82", name: "JaVi", address: "東京都新宿区高田馬場2-10-9 戸蒔ビル1F", lat: 35.713245, lng: 139.707993, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "21席(カウンター3席、テーブル10席、ソファ8席)", hoursInfo: "月・土日11:00〜21:00(L.O.20:15)、木金11:00〜17:00(L.O.16:15)", closedDaysInfo: "火曜日・水曜日" },
  { id: "takadanobaba-83", name: "E Town Cafe&Bar", address: "東京都新宿区高田馬場2-8-2 B1F", lat: 35.71183, lng: 139.70874, outletInfo: "電源あり", smokingInfo: "カフェタイムは禁煙(喫煙スペースあり)、バータイムは全席喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "47席", hoursInfo: "月19:00〜翌2:00、火〜木11:00〜17:30/19:00〜翌2:00、金土11:00〜17:30/19:00〜翌5:00、日祝19:00〜翌5:00" },
  { id: "takadanobaba-84", name: "英会話喫茶 ミッキーハウス", address: "東京都新宿区高田馬場2-14-4", lat: 35.712524, lng: 139.706787, smokingInfo: "全席禁煙", seatCountInfo: "40席", hoursInfo: "月〜金13:00〜17:00/18:00〜22:00、土13:00〜22:00、日13:00〜18:00" },
  { id: "takadanobaba-85", name: "ピアクオーレ", address: "東京都新宿区高田馬場2-14-7 新東ビル3F", lat: 35.712753, lng: 139.706375, smokingInfo: "全席喫煙可(15:00〜18:00は完全禁煙)", seatCountInfo: "35席" },
  { id: "takadanobaba-86", name: "PukuPuku 高田馬場店", address: "東京都新宿区高田馬場2-14-8 Ntビル2F", lat: 35.71283, lng: 139.706238, outletInfo: "電源あり", smokingInfo: "分煙(加熱式たばこ限定)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "30席", hoursInfo: "14:00〜24:00", closedDaysInfo: "不定休" },
  { id: "takadanobaba-87", name: "MELT by MATSUO", address: "東京都新宿区高田馬場2-14-9 明芳ビル102", lat: 35.71291, lng: 139.7061, smokingInfo: "分煙(加熱式たばこ限定、テラスのみ加熱式可)", seatCountInfo: "20席", hoursInfo: "月〜土・祝11:30〜15:00(L.O.14:30)/17:00〜22:30(L.O.料理21:30・ドリンク22:00)", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-88", name: "STARLIGHTSTELLA", address: "東京都新宿区高田馬場2-19-8 阿部大竹ビル2F", lat: 35.713821, lng: 139.70433, hoursInfo: "月〜金11:00〜16:00", closedDaysInfo: "土曜日・日曜日" },
  { id: "takadanobaba-89", name: "あでぃくしょん", address: "東京都新宿区高田馬場2-19-8 アベビル101", lat: 35.713821, lng: 139.70433, outletInfo: "電源あり", smokingInfo: "全席喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "12席(カウンター8席、テーブル4席)", hoursInfo: "月・土日0:00〜12:00/18:00〜24:00、火〜金0:00〜6:00/18:00〜24:00" },
  { id: "takadanobaba-90", name: "Dart's Cafe 301", address: "東京都新宿区高田馬場3-2-15 第26東京ビル3F", lat: 35.714226, lng: 139.703629, seatCountInfo: "20席", hoursInfo: "18:00〜翌4:00", closedDaysInfo: "無休(日曜日に休む場合あり)" },
  { id: "takadanobaba-91", name: "道しるべCafe", address: "東京都新宿区高田馬場3-8-17", lat: 35.713963, lng: 139.700409, hoursInfo: "月11:30〜22:00、火〜金11:00〜18:00、土日11:00〜20:00" },
  { id: "takadanobaba-92", name: "Zuu&Hein Myanmar Tea House 高田馬場店", address: "東京都新宿区高田馬場3-12-6 日拓高田馬場ビル第3", lat: 35.712978, lng: 139.70079, smokingInfo: "全席禁煙", hoursInfo: "10:00〜24:00" },
  { id: "takadanobaba-93", name: "アルバート", address: "東京都新宿区高田馬場3-12-11 河合ビルB1F", lat: 35.712601, lng: 139.700119, smokingInfo: "全席禁煙", hoursInfo: "月〜水・金18:00〜22:00", closedDaysInfo: "木曜日・土曜日・日曜日・祝日" },
  { id: "takadanobaba-94", name: "BLACK DUCK", address: "東京都新宿区高田馬場3-18-26", lat: 35.715305, lng: 139.696976, smokingInfo: "全席禁煙", hoursInfo: "月〜金8:30〜18:00、土10:00〜18:00", closedDaysInfo: "日曜日" },
  { id: "takadanobaba-95", name: "yogay", address: "東京都新宿区高田馬場4-11-10 2F", lat: 35.713467, lng: 139.702148, hoursInfo: "12:00〜18:00" },
  { id: "takadanobaba-96", name: "CACTUS PLANET", address: "東京都新宿区高田馬場4-17-16 ピッコロビル3F", lat: 35.712528, lng: 139.700439, seatCountInfo: "22席", hoursInfo: "12:00〜22:00" },
  { id: "takadanobaba-97", name: "台湾九份芋圓 高田馬場店", address: "東京都新宿区高田馬場4-18-12 中村ビル1F", lat: 35.712368, lng: 139.699966, smokingInfo: "全席禁煙", seatCountInfo: "12席", hoursInfo: "火〜日12:00〜21:00(L.O.20:30)", closedDaysInfo: "月曜日" },
  { id: "takadanobaba-98", name: "残花", address: "東京都新宿区高田馬場4-18-12", lat: 35.712368, lng: 139.699966, smokingInfo: "全席禁煙", seatCountInfo: "12席(カウンター4席、テーブル8席)", hoursInfo: "月〜金11:00〜18:00(L.O.17:30)、土日祝11:00〜18:00(L.O.17:00)" },
  { id: "takadanobaba-99", name: "ROCKETIIDA", address: "東京都豊島区高田3-9-8", lat: 35.714645, lng: 139.706192 },
  { id: "takadanobaba-100", name: "レムナント", address: "東京都豊島区高田3-16-1 2F", lat: 35.714851, lng: 139.706406, smokingInfo: "全席喫煙可", seatCountInfo: "6席(カウンター4席、テーブル2席、最大8席まで可)" },
  { id: "takadanobaba-101", name: "ココロネコウジカフェ", address: "東京都豊島区高田3-30-15 B3ビル1F baba kitchen", lat: 35.716637, lng: 139.706039, closedDaysInfo: "不定休" },
  { id: "takadanobaba-102", name: "ぽこぽこバナナカフェ", address: "東京都豊島区高田3-30-15 B3ビル1F baba kitchen", lat: 35.716637, lng: 139.706039, hoursInfo: "第2・第4土曜日10:30〜17:00", closedDaysInfo: "不定休" },
  { id: "takadanobaba-103", name: "iro", address: "東京都豊島区高田1-6-9", lat: 35.712856, lng: 139.71817, smokingInfo: "全席禁煙", seatCountInfo: "20席(カウンター3席、テーブル11席、テラス6席)", hoursInfo: "水・木・金・土・祝10:00〜18:00", closedDaysInfo: "月曜日・火曜日・日曜日" },
  { id: "takadanobaba-104", name: "マクマカフェ", address: "東京都新宿区百人町3-1-2 東京グローブ座ロビー", lat: 35.705738, lng: 139.700577 },
  { id: "takadanobaba-105", name: "カフェコア", address: "東京都新宿区百人町3-22-1 東京山手メディカルセンター1F", lat: 35.704315, lng: 139.699631, hoursInfo: "月〜金9:00〜14:00", closedDaysInfo: "土曜日・日曜日・祝日(東京山手メディカルセンターに準ずる)" },
];
