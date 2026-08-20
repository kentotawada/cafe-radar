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
// かった項目は空欄のままにしている(推測では埋めていない)。閉店情報は見つから
// なかった(全54件とも営業継続を確認)。
//
// 【要確認】kichijoji-34(かやしま)は営業時間・定休日について情報源間で大きく
// 矛盾があり(公式サイト・食べログ・他媒体でそれぞれ異なる)、確定できなかった
// ため新規項目を追加していない。来店前に電話確認を推奨。
export const cafes: Cafe[] = [
  { id: "kichijoji-01", name: "マクドナルド 吉祥寺店", address: "東京都武蔵野市吉祥寺本町1-9-12", lat: 35.703892, lng: 139.579834, outletInfo: "地下カウンター席に電源あり", hoursInfo: "6:00〜24:00", closedDaysInfo: "年中無休", website: "https://www.mcdonalds.co.jp/", smokingInfo: "全店舗禁煙。2014年8月から屋内禁煙(公式サイトの記載、2026-08確認)" },
  { id: "kichijoji-02", name: "マクドナルド 吉祥寺南口店", address: "東京都武蔵野市吉祥寺南町1-1-1", lat: 35.702724, lng: 139.579529, outletInfo: "2階イートインに電源コンセート席あり", hoursInfo: "24時間営業", seatCountInfo: "全153席(1F・2F、2Fに電源席多数)", website: "https://www.mcdonalds.co.jp/", smokingInfo: "全店舗禁煙。2014年8月から屋内禁煙(公式サイトの記載、2026-08確認)" },
  { id: "kichijoji-03", name: "ガスト 吉祥寺店", address: "東京都武蔵野市吉祥寺本町1-18-3", lat: 35.704422, lng: 139.581085, outletInfo: "一人用ボックス席3席に電源・Wi-Fi・空調完備", smokingInfo: "全面禁煙", hoursInfo: "7:00〜23:30", website: "https://www.skylark.co.jp/gusto/" },
  { id: "kichijoji-04", name: "ガスト 吉祥寺元町通店", address: "東京都武蔵野市吉祥寺本町1-8-5 チェリービル・レンガ館B1", lat: 35.704243, lng: 139.578583, hoursInfo: "7:00〜23:30", website: "https://www.skylark.co.jp/gusto/" },
  { id: "kichijoji-05", name: "サイゼリヤ 吉祥寺駅南口店", address: "東京都武蔵野市吉祥寺南町1-4-3 ニューセンタービル5F", lat: 35.702389, lng: 139.579483, hoursInfo: "10:00〜23:00", website: "https://www.saizeriya.co.jp/" },
  { id: "kichijoji-06", name: "サイゼリヤ 吉祥寺駅北口店", address: "東京都武蔵野市吉祥寺本町1-8-3 コスモ吉祥寺3F", lat: 35.704094, lng: 139.578979, hoursInfo: "10:00〜22:00", website: "https://www.saizeriya.co.jp/" },
  { id: "kichijoji-07", name: "バーミヤン 吉祥寺ダイヤ街店", address: "東京都武蔵野市吉祥寺本町1-7-8 マーブルビルB1", lat: 35.704212, lng: 139.578537, hoursInfo: "11:00〜23:30", closedDaysInfo: "年中無休", website: "https://www.skylark.co.jp/bamiyan/" },
  { id: "kichijoji-08", name: "モスバーガー 吉祥寺サンロード店", address: "東京都武蔵野市吉祥寺本町1-12-5", lat: 35.706127, lng: 139.581116, outletInfo: "電源なしとの情報あり", hoursInfo: "9:00〜21:00", website: "https://www.mos.jp/" },
  { id: "kichijoji-09", name: "フレッシュネスバーガー 吉祥寺東町店", address: "東京都武蔵野市吉祥寺東町1-7-19 鈴木ビル1F", lat: 35.706062, lng: 139.582138, outletInfo: "カウンター席に電源あり、Wi-Fiも完備", hoursInfo: "9:00〜22:30", closedDaysInfo: "店休日なし", website: "https://www.freshnessburger.co.jp/" },
  { id: "kichijoji-10", name: "スターバックス コーヒー 吉祥寺東急店", address: "東京都武蔵野市吉祥寺本町2-3-1 東急百貨店吉祥寺店1F", lat: 35.7049908, lng: 139.5778647, outletInfo: "窓側カウンター手前4席のみ電源コンセントあり", wifiInfo: "無料Wi-Fiあり(STARBUCKS/docomo/Softbank/Wi2 300等複数ネットワーク対応)", hoursInfo: "8:00〜22:00", closedDaysInfo: "不定休(東急百貨店吉祥寺店に準ずる)", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-11", name: "スターバックス コーヒー アトレ吉祥寺店", address: "東京都武蔵野市吉祥寺南町1-1-24 アトレ吉祥寺", lat: 35.703297, lng: 139.579697, outletInfo: "長いテーブルとカウンター席に電源、混雑しやすい", wifiInfo: "無料Wi-Fiあり(STARBUCKS/docomo/Softbank/Wi2 300等複数ネットワーク対応)", hoursInfo: "7:30〜21:30", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-12", name: "スターバックス コーヒー 吉祥寺パルコ店", address: "東京都武蔵野市吉祥寺本町1-5-1 吉祥寺PARCO", lat: 35.70348, lng: 139.578171, outletInfo: "窓際カウンター8席で充電用コンセント使用可", hoursInfo: "8:00〜22:00", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-13", name: "スターバックス コーヒー 吉祥寺駅前店", address: "東京都武蔵野市吉祥寺本町1-15-9 吉祥寺岩崎ビル", lat: 35.703838, lng: 139.580521, outletInfo: "入って左手とレジ側カウンターに電源席、数は少なめ", wifiInfo: "無料Wi-Fiあり(STARBUCKS/docomo/Softbank/Wi2 300等複数ネットワーク対応)", hoursInfo: "6:30〜23:00", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-14", name: "スターバックス ティー&カフェ キラリナ京王吉祥寺 3階店", address: "東京都武蔵野市吉祥寺南町2-1-25 キラリナ京王吉祥寺 3階", lat: 35.702732, lng: 139.580414, outletInfo: "全70席中、テーブル席6席にコンセントあり", smokingInfo: "全席禁煙(喫煙ブース・喫煙席なし)", hoursInfo: "7:00〜22:30", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-15", name: "ドトールコーヒーショップ 吉祥寺公園口店", address: "東京都武蔵野市吉祥寺南町1-8-5", lat: 35.701904, lng: 139.578857, outletInfo: "1階カウンター6席とB1カウンター7席に電源あり", hoursInfo: "7:00〜22:00", website: "https://www.doutor.co.jp/dcs/" },
  { id: "kichijoji-16", name: "ドトールコーヒーショップ 吉祥寺元町通り店", address: "東京都武蔵野市吉祥寺本町1-8-10 元町八番館ビル", lat: 35.704861, lng: 139.578293, outletInfo: "口コミでは電源・Wi-Fiなしとの声が複数", hoursInfo: "平日・祝前7:00〜22:00、土日祝7:30〜22:00", closedDaysInfo: "定休日なし", website: "https://www.doutor.co.jp/dcs/" },
  { id: "kichijoji-17", name: "カフェ・ラミル 吉祥寺ダイヤ街店", address: "東京都武蔵野市吉祥寺本町1-8-5 オリエントビル1F", lat: 35.704243, lng: 139.578583, hoursInfo: "月〜土11:00〜23:00、日11:00〜22:30", closedDaysInfo: "年中無休" },
  { id: "kichijoji-18", name: "エクセルシオールカフェ 吉祥寺サンロード店", address: "東京都武蔵野市吉祥寺本町1-15-4 ムサシノビル", lat: 35.704262, lng: 139.580139, outletInfo: "161席中46席がコンセント席、吉祥寺最大級", seatCountInfo: "全161席(3フロア、コンセント席46席・喫煙席56席)", hoursInfo: "平日6:45〜23:00、土日祝7:00〜23:00", website: "https://www.doutor.co.jp/exc/" },
  { id: "kichijoji-19", name: "エクセルシオールカフェ 吉祥寺南口駅前店", address: "東京都武蔵野市吉祥寺南町1-4-1 井の頭ビル1F", lat: 35.70266, lng: 139.579453, outletInfo: "窓際・中央カウンター席で電源利用可", hoursInfo: "平日・土7:00〜22:30、日7:00〜22:00", website: "https://www.doutor.co.jp/exc/" },
  { id: "kichijoji-20", name: "カフェ・ベローチェ 吉祥寺店", address: "東京都武蔵野市吉祥寺本町2-10-7 くもんぴあ吉祥寺1F", lat: 35.704685, lng: 139.577225, outletInfo: "リニューアルで電源席増加、壁向き席に完備", hoursInfo: "朝7時〜夜11時ごろ", closedDaysInfo: "年中無休", website: "https://c-united.co.jp/veloce/" },
  { id: "kichijoji-21", name: "タリーズコーヒー アトレ吉祥寺店", address: "東京都武蔵野市吉祥寺南町1-1-24 アトレ吉祥寺 東館2F", lat: 35.703297, lng: 139.579697, outletInfo: "壁際カウンター席で電源使用可", hoursInfo: "月〜金7:30〜22:00、土7:30〜20:00", website: "https://www.tullys.co.jp/" },
  { id: "kichijoji-22", name: "プロント DiPUNTO 吉祥寺店", address: "東京都武蔵野市吉祥寺本町1-4-18 ジョージフォーラムビルB1F", lat: 35.703362, lng: 139.579132, hoursInfo: "平日16:00〜24:00、土日祝12:00〜24:00", website: "https://www.pronto.co.jp/" },
  { id: "kichijoji-23", name: "コメダ珈琲店 吉祥寺西口店", address: "東京都武蔵野市吉祥寺本町2-1-10", lat: 35.703346, lng: 139.577347, outletInfo: "Wi-Fiと電源が整った作業向けカフェ", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休", website: "https://www.komeda.co.jp/" },
  { id: "kichijoji-24", name: "コメダ珈琲店 吉祥寺ダイヤ街店", address: "東京都武蔵野市吉祥寺本町1-8-2 吉祥寺西ビル2F", lat: 35.704018, lng: 139.579193, outletInfo: "各テーブルに電源とWi-Fi完備", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休", website: "https://www.komeda.co.jp/" },
  { id: "kichijoji-25", name: "喫茶室ルノアール 吉祥寺南口駅前店", address: "東京都武蔵野市吉祥寺南町1-4-3 ニューセンタービル2F", lat: 35.702389, lng: 139.579483, outletInfo: "作業向け半個室ボックス席6席に電源完備", seatCountInfo: "全99席", hoursInfo: "全日7:30〜22:00", website: "https://www.ginza-renoir.co.jp/" },
  { id: "kichijoji-26", name: "サンマルクカフェ 吉祥寺北口駅前店", address: "東京都武蔵野市吉祥寺本町1-4-17 O.F.ビル", lat: 35.703358, lng: 139.578903, outletInfo: "電源あり、勉強や待ち合わせに使えると口コミ", smokingInfo: "喫煙ブースあり(分煙)", seatCountInfo: "131席", hoursInfo: "7:00〜22:30", website: "https://www.saint-marc-hd.com/saintmarccafe/" },
  { id: "kichijoji-27", name: "COFFEE HALL くぐつ草", address: "東京都武蔵野市吉祥寺本町1-7-7 島田ビルB1F", lat: 35.704281, lng: 139.578354, hoursInfo: "10:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "kichijoji-28", name: "茶房 武蔵野文庫", address: "東京都武蔵野市吉祥寺本町2-13-4 吉祥寺井野ビル1F", lat: 35.70517, lng: 139.576843, hoursInfo: "10:00〜21:00(L.O.20:30)", closedDaysInfo: "月曜(月曜祝日の場合は翌火曜休み)" },
  { id: "kichijoji-29", name: "多奈加亭 本店", address: "東京都武蔵野市吉祥寺本町2-13-4", lat: 35.70517, lng: 139.576843, hoursInfo: "10:00〜20:00(L.O.19:30)", closedDaysInfo: "年中無休(元旦を除く)" },
  { id: "kichijoji-30", name: "武蔵野珈琲店", address: "東京都武蔵野市吉祥寺南町1-16-11 萩上ビル2F", lat: 35.701382, lng: 139.578644, hoursInfo: "11:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "kichijoji-31", name: "喫茶 ロゼ", address: "東京都武蔵野市吉祥寺本町2-14-1 2F", lat: 35.705685, lng: 139.577469, hoursInfo: "11:00〜21:00(L.O.20:30)", closedDaysInfo: "火曜" },
  { id: "kichijoji-32", name: "純喫茶 MORE(モア)", address: "東京都武蔵野市吉祥寺本町1-8-14 山水ビル2F", lat: 35.705181, lng: 139.578827, hoursInfo: "月〜日・祝11:30〜24:30", closedDaysInfo: "1月1日のみ" },
  { id: "kichijoji-33", name: "JOHN HENRY'S STUDY", address: "東京都武蔵野市吉祥寺本町1-8-14", lat: 35.705181, lng: 139.578827, hoursInfo: "ランチ11:30〜17:00、バータイム17:00〜24:00", closedDaysInfo: "無休(1月1日を除く)" },
  { id: "kichijoji-34", name: "かやしま", address: "東京都武蔵野市吉祥寺本町1-10-9", lat: 35.706047, lng: 139.578903 },
  { id: "kichijoji-35", name: "まざあ・ぐうす", address: "東京都武蔵野市吉祥寺本町1-8-14 マルコポーロビルB1F", lat: 35.705181, lng: 139.578827, hoursInfo: "11:00〜23:00(L.O.22:30)", closedDaysInfo: "年中無休" },
  { id: "kichijoji-36", name: "吉祥寺SOMETIME", address: "東京都武蔵野市吉祥寺本町1-11-31 B1F", lat: 35.70475, lng: 139.580322, hoursInfo: "ランチ12:00〜17:00(L.O.16:00)、リキュールタイム18:00〜22:00(L.O.21:00)", closedDaysInfo: "年中無休(年始を除く)" },
  { id: "kichijoji-37", name: "SEINA CAFE(セイナカフェ)", address: "東京都武蔵野市吉祥寺本町1-25-10 ks2ビルB1F", lat: 35.703461, lng: 139.581909, hoursInfo: "11:30〜24:00(L.O.23:00)", closedDaysInfo: "不定休" },
  { id: "kichijoji-38", name: "SCRATCH", address: "東京都武蔵野市吉祥寺本町1-8-14 マルコポーロビル2F", lat: 35.705181, lng: 139.578827, hoursInfo: "ランチ・カフェ11:30〜17:00、カフェ・バー17:00〜22:00(金土は23:00まで)", closedDaysInfo: "バータイムは水曜+不定休" },
  { id: "kichijoji-39", name: "ムレスナティー東京", address: "東京都武蔵野市吉祥寺南町1-12-12", lat: 35.70192, lng: 139.576721, hoursInfo: "11:00〜19:00", closedDaysInfo: "年末年始" },
  { id: "kichijoji-40", name: "ALLEY CAFÉ", address: "東京都武蔵野市吉祥寺南町1-1-8 けやきビル3F", lat: 35.702831, lng: 139.577972, outletInfo: "一部の席でWi-Fiと電源が利用可能", hoursInfo: "月火木金日祝11:30〜21:00、土11:30〜22:00", closedDaysInfo: "水曜(祝日の場合は営業)" },
  { id: "kichijoji-41", name: "ゆりあぺむぺる", address: "東京都武蔵野市吉祥寺南町1-1-6", lat: 35.702831, lng: 139.578415, hoursInfo: "火〜木・日11:30〜20:00、金・土・祝前日11:30〜22:00", closedDaysInfo: "月曜" },
  { id: "kichijoji-42", name: "台湾茶藝館 月和茶 吉祥寺店", address: "東京都武蔵野市吉祥寺本町2-14-28 2F", lat: 35.705708, lng: 139.577606, hoursInfo: "月・金・土・日11:00〜17:00(L.O.16:30)", closedDaysInfo: "火・水・木" },
  { id: "kichijoji-43", name: "cafe Lumiere(カフェ・ルミエール)", address: "東京都武蔵野市吉祥寺南町1-2-2 東山ビル4F", lat: 35.70232, lng: 139.580124, outletInfo: "コンセント3口のみ、時間帯によっては争奪戦", hoursInfo: "月〜金12:00〜20:00、土日11:00〜20:00", closedDaysInfo: "定休日なし" },
  { id: "kichijoji-44", name: "Shiroノmono", address: "東京都武蔵野市吉祥寺本町2-26-2 NAKAMICHI GARDEN 1F", lat: 35.704437, lng: 139.575027, hoursInfo: "11:00〜19:00", closedDaysInfo: "火曜" },
  { id: "kichijoji-45", name: "B² 吉祥寺店", address: "東京都武蔵野市吉祥寺本町2-4-14 吉祥寺エクセルホテル東急1F", lat: 35.706078, lng: 139.57872, outletInfo: "電源ありとの報告あり", hoursInfo: "8:30〜18:00", closedDaysInfo: "年中無休(年末年始を除く)" },
  { id: "kichijoji-46", name: "chai break", address: "東京都武蔵野市御殿山1-3-2", lat: 35.70174, lng: 139.576508, hoursInfo: "平日9:00〜19:00、土日祝8:00〜19:00", closedDaysInfo: "火曜定休(火曜祝日の場合は翌営業日に振替)" },
  { id: "kichijoji-47", name: "四歩", address: "東京都武蔵野市吉祥寺北町1-18-25", lat: 35.70845, lng: 139.577438, hoursInfo: "11:00〜20:00(カフェL.O.19:30)", closedDaysInfo: "定休日なし" },
  { id: "kichijoji-48", name: "リュモンコーヒースタンド", address: "東京都武蔵野市吉祥寺南町2-14-9", lat: 35.701225, lng: 139.583527, outletInfo: "PC作業・勉強は禁止のため電源利用不可", hoursInfo: "9:00〜18:30", closedDaysInfo: "水曜・第一/第三火曜" },
  { id: "kichijoji-49", name: "HATTIFNATT吉祥寺のおうち", address: "東京都武蔵野市吉祥寺南町2-22-1", lat: 35.703289, lng: 139.585312, outletInfo: "電源ありでWi-Fiも利用可能", hoursInfo: "11:30〜21:00(イートインL.O.20:00)", closedDaysInfo: "月曜・第3火曜" },
  { id: "kichijoji-50", name: "LIGHT UP COFFEE 吉祥寺店", address: "東京都武蔵野市吉祥寺本町4-13-15", lat: 35.705471, lng: 139.572662, hoursInfo: "11:00〜19:00", closedDaysInfo: "定休日なし" },
  { id: "kichijoji-51", name: "Tea house はっぱ", address: "東京都武蔵野市吉祥寺本町2-33-2 吉祥寺プティット村", lat: 35.704613, lng: 139.57457, outletInfo: "電源席は要相談、店員に確認を", hoursInfo: "11:00〜19:00", closedDaysInfo: "日曜" },
  { id: "kichijoji-52", name: "MARGARET HOWELL SHOP & CAFE 吉祥寺", address: "東京都武蔵野市吉祥寺本町3-7-14", lat: 35.7052, lng: 139.572861, outletInfo: "電源ありとの報告あり", hoursInfo: "11:00〜18:00(L.O.17:30)", closedDaysInfo: "不定休" },
  { id: "kichijoji-53", name: "Swing Chair & Hemp Cafe 麻よしやす", address: "東京都武蔵野市吉祥寺本町2-7-13 レディーバードビル3F", lat: 35.706738, lng: 139.578476, outletInfo: "全席に電源コンセントとWi-Fi完備", hoursInfo: "12:00〜19:00(L.O.18:30)" },
  { id: "kichijoji-54", name: "BasisPoint 吉祥寺マルイ店", address: "東京都武蔵野市吉祥寺南町1-7-1 吉祥寺マルイ4F", lat: 35.702263, lng: 139.579193, outletInfo: "コワーキング仕様で全席に電源、延長コードも常備", smokingInfo: "全面禁煙(近隣の喫煙所を案内)", wifiInfo: "無料の高速Wi-Fiあり、全席に電源コンセント完備", hoursInfo: "平日/土日祝10:30〜20:00", closedDaysInfo: "基本的に年末年始(12/31〜1/3)のみ" },
  // 以下kichijoji-55〜88は2026年8月に追加調査した店舗。既存54件と同様、店名・住所・各種情報は
  // 公式サイト・食べログ・信頼できるカフェ紹介記事等で確認済み。確認できなかった項目(営業時間・
  // Wi-Fi・電源・座席数など)は空欄のまま(推測では埋めていない)。
  { id: "kichijoji-55", name: "星乃珈琲店 吉祥寺店", address: "東京都武蔵野市吉祥寺本町1-8-5 レンガ館モール2F", lat: 35.704243, lng: 139.578583, hoursInfo: "平日9:00〜21:00(L.O.20:30)、土日祝9:00〜22:00(L.O.21:30)", website: "https://www.hoshinocoffee.com/" },
  { id: "kichijoji-56", name: "デニーズ 吉祥寺北町店", address: "東京都武蔵野市吉祥寺北町5-10-12", lat: 35.72057, lng: 139.568481, hoursInfo: "7:00〜23:00(通年)", website: "https://www.dennys.jp/" },
  { id: "kichijoji-57", name: "ベーカリー&カフェ ルパ 吉祥寺店", address: "東京都武蔵野市吉祥寺南町2-1-25 キラリナ京王吉祥寺1F", lat: 35.702732, lng: 139.580414, outletInfo: "カウンター席にコンセントあり(10席程度)", wifiInfo: "Wi-Fiあり", seatCountInfo: "26席", hoursInfo: "7:00〜21:30" },
  { id: "kichijoji-58", name: "スターバックス コーヒー SHARE LOUNGE キラリナ京王吉祥寺 9階店", address: "東京都武蔵野市吉祥寺南町2-1-25 キラリナ京王吉祥寺9F", lat: 35.702732, lng: 139.580414, outletInfo: "通常のスタバ席(55席)は電源なし、隣接の有料SHARE LOUNGE区画(200席)は全席電源・高速Wi-Fi完備", hoursInfo: "8:00〜22:00", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-59", name: "スターバックス コーヒー 井の頭公園店", address: "東京都武蔵野市吉祥寺南町1-15-7 繁川ビル", lat: 35.700829, lng: 139.578339, outletInfo: "カウンター席で利用可", wifiInfo: "無料Wi-Fiあり(STARBUCKS/docomo/Softbank/Wi2 300等複数ネットワーク対応)", hoursInfo: "8:00〜22:00", website: "https://www.starbucks.co.jp/" },
  { id: "kichijoji-60", name: "喫茶室ルノアール 吉祥寺北口店", address: "東京都武蔵野市吉祥寺本町1-8-3 三松ビルB1F", lat: 35.704094, lng: 139.578979, outletInfo: "電源コンセントあり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "8:00〜22:00", closedDaysInfo: "不定休", website: "https://www.ginza-renoir.co.jp/" },
  { id: "kichijoji-61", name: "ミスタードーナツ 吉祥寺サンロード店", address: "東京都武蔵野市吉祥寺本町1-11-28", lat: 35.705299, lng: 139.580597, outletInfo: "1階左側カウンターに電源あり", wifiInfo: "Wi-Fiなしとの情報あり", hoursInfo: "9:00〜23:00" },
  { id: "kichijoji-62", name: "kawara CAFE&KITCHEN 吉祥寺パルコ店", address: "東京都武蔵野市吉祥寺本町1-5-1 吉祥寺PARCO 7F", lat: 35.70348, lng: 139.578171, outletInfo: "電源ありとの情報あり", wifiInfo: "Wi-Fiあり", hoursInfo: "平日11:30〜20:00、土日10:30〜20:00" },
  { id: "kichijoji-63", name: "サードバーガー 吉祥寺マルイ店", address: "東京都武蔵野市吉祥寺南町1-7-1 吉祥寺マルイ1F", lat: 35.702263, lng: 139.579193, outletInfo: "店内奥の壁側に電源あり", wifiInfo: "Wi-Fiなしとの情報あり", hoursInfo: "10:00〜21:00" },
  { id: "kichijoji-64", name: "但馬屋珈琲店 コピス吉祥寺店", address: "東京都武蔵野市吉祥寺本町1-11-5 コピス吉祥寺B1F", lat: 35.705013, lng: 139.57933 },
  { id: "kichijoji-65", name: "COFFEE STYLE UCC アトレ吉祥寺店", address: "東京都武蔵野市吉祥寺南町1-1-24 アトレ吉祥寺1F", lat: 35.703297, lng: 139.579697 },
  { id: "kichijoji-66", name: "BILLY's CAFE", address: "東京都武蔵野市吉祥寺本町1-11-21 ロイビル4F", lat: 35.706425, lng: 139.581039, outletInfo: "電源あり(テラス席でも利用可)", wifiInfo: "無料Wi-Fi(時間無制限)", hoursInfo: "平日10:00〜18:00(L.O.17:30)、土日13:00〜19:00(L.O.18:00)", closedDaysInfo: "火曜" },
  { id: "kichijoji-67", name: "CAFE ZENON×ZENON SAKABA", address: "東京都武蔵野市吉祥寺南町2-11-1", lat: 35.703457, lng: 139.58371, seatCountInfo: "120席", hoursInfo: "11:30〜21:00(L.O.20:00)", closedDaysInfo: "無休(年末年始を除く)" },
  { id: "kichijoji-68", name: "Cafe247", address: "東京都武蔵野市吉祥寺北町3-4-2", lat: 35.709602, lng: 139.573044, outletInfo: "電源ありとの情報あり", wifiInfo: "Wi-Fiあり", hoursInfo: "11:00〜15:00、17:00〜23:00", closedDaysInfo: "月曜" },
  { id: "kichijoji-69", name: "CAFE & BAR dizzle", address: "東京都武蔵野市吉祥寺本町1-11-27 PAL吉祥寺3F", lat: 35.705471, lng: 139.580673, outletInfo: "全席に電源あり", wifiInfo: "Wi-Fiあり", hoursInfo: "11:00〜24:00" },
  { id: "kichijoji-70", name: "La cour café(ラ・クール・カフェ)", address: "東京都武蔵野市吉祥寺本町2-11-9 プラタ高橋ビル2F", lat: 35.703835, lng: 139.576447, outletInfo: "電源・Wi-Fiともになしとの情報あり", hoursInfo: "11:00〜23:30" },
  { id: "kichijoji-71", name: "バーガー喫茶 ちるとこ", address: "東京都武蔵野市吉祥寺本町2-24-6 吉祥寺グリーンハイツ102", lat: 35.704311, lng: 139.575226 },
  { id: "kichijoji-72", name: "喫茶といろいろ 六ペンス", address: "東京都武蔵野市吉祥寺東町2-45-14 セードル201", lat: 35.709152, lng: 139.590668 },
  { id: "kichijoji-73", name: "ウッドストック", address: "東京都武蔵野市吉祥寺東町4-3-9", lat: 35.705307, lng: 139.592026 },
  { id: "kichijoji-74", name: "珈琲 立吉", address: "東京都武蔵野市吉祥寺南町1-15-5", lat: 35.701176, lng: 139.578506 },
  { id: "kichijoji-75", name: "OVER COFFEE HUB", address: "東京都武蔵野市吉祥寺本町2-10-6", lat: 35.704609, lng: 139.577042, hoursInfo: "10:30〜18:00(L.O.17:30)" },
  { id: "kichijoji-76", name: "カフェ&ブックス ビブリオテーク 東京・吉祥寺", address: "東京都武蔵野市吉祥寺南町1-1-24 アトレ吉祥寺 本館1F", lat: 35.70300015, lng: 139.57837396, hoursInfo: "11:00〜21:00" },
  { id: "kichijoji-77", name: "吉祥寺焙煎 SEPIA COFFEE", address: "東京都武蔵野市吉祥寺東町1-11-3 MAPLE HOUSE1F", lat: 35.706142, lng: 139.583038, hoursInfo: "10:00〜19:00(土曜のみ20:00まで)" },
  { id: "kichijoji-78", name: "Blackwell Coffee", address: "東京都武蔵野市吉祥寺本町3-3-10", lat: 35.704983, lng: 139.573441, hoursInfo: "火〜日11:00〜18:00", closedDaysInfo: "月曜(月曜祝日の場合は翌火曜)" },
  { id: "kichijoji-79", name: "burger kitchen WAKIE WAKIE", address: "東京都武蔵野市吉祥寺南町2-2-3 オリエンタルビル2F", lat: 35.702282, lng: 139.580551, outletInfo: "電源ありとの情報あり", wifiInfo: "Wi-Fiあり", hoursInfo: "11:00〜23:00", closedDaysInfo: "月曜" },
  { id: "kichijoji-80", name: "flower & cafe attohome", address: "東京都武蔵野市吉祥寺南町2-12-8", lat: 35.701439, lng: 139.583282, hoursInfo: "11:00〜19:00", closedDaysInfo: "木曜" },
  { id: "kichijoji-81", name: "自家焙煎 珈琲散歩", address: "東京都武蔵野市吉祥寺本町4-6-1", lat: 35.704994, lng: 139.573547 },
  { id: "kichijoji-82", name: "雨の木なコーヒー", address: "東京都武蔵野市吉祥寺本町3-21-10 Lavie吉祥寺1F", lat: 35.7052, lng: 139.569092 },
  { id: "kichijoji-83", name: "ライブコーヒー 吉祥寺店", address: "東京都武蔵野市吉祥寺南町2-3-10", lat: 35.702133, lng: 139.580917 },
  { id: "kichijoji-84", name: "andoh coffee", address: "東京都武蔵野市吉祥寺本町2-29-13", lat: 35.708019, lng: 139.577499 },
  { id: "kichijoji-85", name: "珈琲 笠間", address: "東京都武蔵野市吉祥寺本町2-14-7", lat: 35.706524, lng: 139.577591 },
  { id: "kichijoji-86", name: "TINY PONTA COFFEE 吉祥寺店", address: "東京都武蔵野市吉祥寺本町2-16-13 スピラーレ3F", lat: 35.705791, lng: 139.577042 },
  { id: "kichijoji-87", name: "ミカフェート アトレ吉祥寺店", address: "東京都武蔵野市吉祥寺南町1-1-24 アトレ吉祥寺1F", lat: 35.70319738, lng: 139.58044341 },
  { id: "kichijoji-88", name: "Mojo Cafe", address: "東京都武蔵野市吉祥寺本町1-12-4 2F", lat: 35.705971, lng: 139.581039 },
];
