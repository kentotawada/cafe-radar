import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// マクドナルドは駅から800m圏内を徹底的に調べた結果、現存1店舗のみでした（他は閉店済み）
// ……という調査結果だったが、2026年8月の再調査でその最後の1店舗(shimbashi-01)も
// 2026年6月30日付で閉店したことが判明した。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認・閉店】新規項目を追加せず既存情報のままにしてある:
// - shimbashi-01(マクドナルド 新橋日比谷口店): 2026年6月30日閉店
// - shimbashi-06(スターバックス JR新橋駅 汐留改札内店): 2023年1月31日閉店
// - shimbashi-16(PRONTO IL BAR ウィング新橋店): 食べログ【閉店】表示
// - shimbashi-19(サンマルクカフェ 汐留店): 食べログ【閉店】表示
// - shimbashi-50(カフェ モルゲン・グロッケ): 2025年12月26日閉店
//
// 【要確認・改称】shimbashi-11(エクセルシオール カフェ 東京汐留ビルディング
// 店): 同住所で上位業態「エクセルシオール カフェ バリスタ 東京汐留ビル
// ディング店」にリニューアルされた模様。新業態の情報を反映したが店名表記の
// 更新を推奨。
//
// 【要確認・営業状況不明】shimbashi-24・shimbashi-25(カフェ・ド・クリエ):
// 食べログで「掲載保留」(休業期間未確定、移転・閉店の事実確認ができない)
// の注記あり。閉店の確証はないため追加情報は残したが、確度は低め。
export const cafes: Cafe[] = [
  { id: "shimbashi-01", name: "マクドナルド 新橋日比谷口店", address: "東京都港区新橋2-6-7", lat: 35.6674, lng: 139.7581, outletInfo: "4階に電源席多数、2階にも数席あり" },
  { id: "shimbashi-02", name: "フレッシュネスバーガー 汐留シティセンター店", address: "東京都港区東新橋1-5-2 汐留シティセンター1F", lat: 35.6618, lng: 139.7600, outletInfo: "コンセントあり、Wi-Fiも完備", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(FREE-WiFi)", hoursInfo: "月〜金10:00〜21:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "shimbashi-03", name: "モスバーガー MOSH Burger&Bar 銀座ナイン店", address: "東京都中央区銀座8-7 銀座ナイン2号館1F", lat: 35.6672, lng: 139.7608, seatCountInfo: "75席", hoursInfo: "月〜木・土10:00〜22:00、金10:00〜23:00、日祝10:00〜21:00", closedDaysInfo: "定休日なし(銀座ナインの営業に準ずる)" },
  { id: "shimbashi-04", name: "スターバックス コーヒー JR新橋駅 銀座口店", address: "東京都港区新橋2-17", lat: 35.6669, lng: 139.7591, outletInfo: "電源なしとの評判、PC作業には不向き", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "平日6:30〜22:00、土日祝8:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "shimbashi-05", name: "スターバックス コーヒー 新橋駅前店", address: "東京都港区新橋2-19-3 カシケイビル", lat: 35.6666, lng: 139.7590, outletInfo: "外堀通り面の窓側カウンター8席に電源あり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "51席(テーブル・カウンター席)", hoursInfo: "月〜木6:30〜22:00、金6:30〜22:30、土7:00〜22:30、日祝8:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "shimbashi-06", name: "スターバックス コーヒー JR新橋駅 汐留改札内店", address: "東京都港区新橋2-17-14 新橋駅地下1階", lat: 35.6663, lng: 139.7588, outletInfo: "USB充電専用、通常コンセントは無し" },
  { id: "shimbashi-07", name: "ドトールコーヒーショップ 新橋銀座口店", address: "東京都港区新橋1-8-4 丸忠ビル1F", lat: 35.6683, lng: 139.7593, smokingInfo: "分煙、2階21席が喫煙可能エリア、他の階は禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全78席(1階12・2階32・3階34)", hoursInfo: "平日6:30〜21:00、土8:00〜20:00、日祝8:00〜19:00" },
  { id: "shimbashi-08", name: "ドトールコーヒーショップ 新橋外堀通り店", address: "東京都港区新橋1-16-4", lat: 35.6680, lng: 139.7600, smokingInfo: "分煙、喫煙ブースあり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "71席", hoursInfo: "平日6:45〜21:00、土8:00〜20:00、日8:00〜19:00" },
  { id: "shimbashi-09", name: "エクセルシオール カフェ 新橋2丁目店", address: "東京都港区新橋2-5-1 EXCEL新橋1F・2F", lat: 35.6672, lng: 139.7578, outletInfo: "長テーブル6席、1席ごとに電源コンセントあり", smokingInfo: "分煙(禁煙91席・喫煙53席)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "144席", hoursInfo: "平日7:00〜21:00、土日祝8:00〜20:00" },
  { id: "shimbashi-10", name: "エクセルシオール カフェ ウィング新橋店", address: "東京都港区新橋2丁目 ウィング新橋 B1F", lat: 35.6660, lng: 139.7585, outletInfo: "窓際の複数席に電源コンセントあり", smokingInfo: "分煙", hoursInfo: "平日7:00〜22:00、土日祝9:00〜22:00" },
  { id: "shimbashi-11", name: "エクセルシオール カフェ 東京汐留ビルディング店", address: "東京都港区東新橋1-9-1 東京汐留ビルディング2F", lat: 35.6620, lng: 139.7605, outletInfo: "壁側中心に電源席計30席程度あり", smokingInfo: "分煙", hoursInfo: "平日7:00〜19:00、土日祝8:00〜18:00" },
  { id: "shimbashi-12", name: "タリーズコーヒー 汐留シティセンター店", address: "東京都港区東新橋1-5-2 汐留シティセンターB2F", lat: 35.6618, lng: 139.7600, outletInfo: "電源なし、充電目的には不向きな店舗", smokingInfo: "全席禁煙", seatCountInfo: "60席", hoursInfo: "平日7:00〜21:00、土10:00〜19:00、日10:00〜18:00" },
  { id: "shimbashi-13", name: "タリーズコーヒー 日テレプラザ店", address: "東京都港区東新橋1-6-1 日テレタワーB2F", lat: 35.6622, lng: 139.7598, outletInfo: "電源のあるカウンター席が人気、朝は混雑", smokingInfo: "全席禁煙", seatCountInfo: "35席", hoursInfo: "平日7:00〜21:00、土日8:00〜18:00" },
  { id: "shimbashi-14", name: "タリーズコーヒー 日比谷セントラルビル店", address: "東京都港区西新橋1-2-9 日比谷セントラルビル1F", lat: 35.6700, lng: 139.7560, outletInfo: "電源が使えない店舗として紹介されている", smokingInfo: "全席禁煙", hoursInfo: "平日8:00〜19:30", closedDaysInfo: "土曜日、日曜日" },
  { id: "shimbashi-15", name: "PRONTO 新橋駅前店", address: "東京都港区新橋2-8-7 新橋東和ビル1F", lat: 35.6668, lng: 139.7592, outletInfo: "1階10席・地下3席に電源コンセントあり", smokingInfo: "分煙(禁煙席・加熱式タバコ専用席・喫煙ブース)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "107席", hoursInfo: "月〜金6:45〜23:00(バー営業17:00〜)、土7:00〜23:00、日祝9:00〜22:00", closedDaysInfo: "年末年始" },
  { id: "shimbashi-16", name: "PRONTO IL BAR ウィング新橋店", address: "東京都港区新橋2丁目 東口地下街1号", lat: 35.6661, lng: 139.7584 },
  { id: "shimbashi-17", name: "コメダ珈琲店 新橋烏森通り店", address: "東京都港区新橋2-15-17 ホテルチェックイン新橋2F", lat: 35.6658, lng: 139.7582, smokingInfo: "全席禁煙", hoursInfo: "7:00〜23:00" },
  { id: "shimbashi-18", name: "サンマルクカフェ 西新橋店", address: "東京都港区西新橋2-6-2 ザイマックス西新橋ビル1F", lat: 35.6670, lng: 139.7540, smokingInfo: "全席禁煙、喫煙ブースあり", seatCountInfo: "64席", hoursInfo: "7:00〜22:00" },
  { id: "shimbashi-19", name: "サンマルクカフェ 汐留店", address: "東京都港区東新橋1-9-1 東京汐留ビルディング ペディ汐留2F", lat: 35.6620, lng: 139.7605 },
  { id: "shimbashi-20", name: "喫茶室ルノアール 新橋汐留口駅前店", address: "東京都港区新橋2-21-1 新橋駅前ビル2号館2F", lat: 35.6663, lng: 139.7586, outletInfo: "電源が使えるブース型デスク席あり", smokingInfo: "分煙(加熱式タバコ限定)、禁煙60席・喫煙32席", wifiInfo: "無料Wi-Fiあり(有料オプションWi-Fiも提供)", seatCountInfo: "92席(禁煙60・喫煙32)", hoursInfo: "月〜土7:00〜22:00、日祝8:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "shimbashi-21", name: "喫茶室ルノアール 新橋日比谷口店", address: "東京都港区新橋2-6-1 さくら新橋ビルB1F", lat: 35.6674, lng: 139.7580, outletInfo: "コンセントあり、電源サービス完備の店舗", smokingInfo: "分煙(加熱式タバコ限定)、禁煙35席・喫煙28席", wifiInfo: "無料Wi-Fiあり(有料オプションWi-Fiも提供)", seatCountInfo: "70席(禁煙35・喫煙28・ビジネスブース7)", hoursInfo: "平日7:30〜22:00、土日祝8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "shimbashi-22", name: "喫茶室ルノアール 新橋烏森口店", address: "東京都港区新橋4-10-2 ホテルオリエンタルエクスプレス銀座ウエスト2F", lat: 35.6635, lng: 139.7578, outletInfo: "電源のとれる店として口コミで紹介あり", smokingInfo: "分煙(加熱式タバコ限定)、禁煙26席・喫煙50席", wifiInfo: "無料Wi-Fiあり(有料オプションWi-Fiも提供)", seatCountInfo: "76席(禁煙26・喫煙50)", hoursInfo: "平日7:00〜22:00、土日祝7:00〜20:00", closedDaysInfo: "年中無休" },
  { id: "shimbashi-23", name: "カフェ・ド・クリエ 日比谷通り内幸町店", address: "東京都港区新橋1-18-1 航空会館ビル1F", lat: 35.6690, lng: 139.7565, outletInfo: "入口窓際の数席のみ電源コンセントあり", smokingInfo: "分煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日7:00〜20:00、土日祝9:00〜18:00" },
  { id: "shimbashi-24", name: "カフェ・ド・クリエ 新橋烏森口店", address: "東京都港区新橋2-17-27 1F", lat: 35.6655, lng: 139.7590, outletInfo: "カウンター席で電源コンセントが使える", smokingInfo: "分煙(詳細確認できず)", wifiInfo: "利用可能との記載あり(詳細不明)" },
  { id: "shimbashi-25", name: "カフェ・ド・クリエ 西新橋2丁目店", address: "東京都港区西新橋2-39-3 SVAX西新橋ビル1F", lat: 35.6650, lng: 139.7520, outletInfo: "10席に6口、2席で1コンセント共有", smokingInfo: "分煙", wifiInfo: "利用可能との記載あり(詳細不明)", hoursInfo: "平日7:00〜21:00、土7:30〜19:00、日祝8:00〜18:00" },
  { id: "shimbashi-26", name: "カフェ・ベローチェ 新橋四丁目店", address: "東京都港区新橋4-9-1 新橋プラザビル1F", lat: 35.6636, lng: 139.7580, outletInfo: "カウンター席にACコンセント等間隔設置", smokingInfo: "分煙(詳細な禁煙・喫煙席数は確認できず)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "月〜木6:45〜22:00、金土日7:00〜21:00" },
  { id: "shimbashi-27", name: "カフェ・ベローチェ 新橋駅銀座口店", address: "東京都港区新橋1-9-5 KDX新橋駅前ビル1F", lat: 35.6682, lng: 139.7592, outletInfo: "客用コンセントとフリーWi-Fiが利用可", hoursInfo: "平日6:45〜21:00、土8:00〜20:00、日祝8:00〜19:00" },
  { id: "shimbashi-28", name: "カフェ・ベローチェ 新橋三丁目店", address: "東京都港区新橋3-1-11 長友ランディックビル1F", lat: 35.6650, lng: 139.7583, outletInfo: "客用コンセント完備、Wi-Fiも利用可", smokingInfo: "全席禁煙、喫煙ブースあり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "70席", hoursInfo: "月〜木7:00〜21:00、金土日7:00〜20:00" },
  { id: "shimbashi-29", name: "星乃珈琲店 銀座8丁目店", address: "東京都中央区銀座8-8-5 太陽ビル2F", lat: 35.6675, lng: 139.7612, outletInfo: "コンセントなしとの口コミ、電源設備なし", smokingInfo: "全席禁煙", hoursInfo: "平日11:00〜21:00、土日10:00〜21:00" },
  { id: "shimbashi-30", name: "カフェテラス ポンヌフ", address: "東京都港区新橋2-20-15 新橋駅前ビル1号館1F", lat: 35.6664, lng: 139.7587, smokingInfo: "全席禁煙", seatCountInfo: "22席(カウンター6・テーブル2人×8)", hoursInfo: "月〜金11:00〜14:50(金は18:00〜売り切れ次第終了)", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "shimbashi-31", name: "パーラー キムラヤ", address: "東京都港区新橋2-20-15 新橋駅前ビル1号館B1F", lat: 35.6664, lng: 139.7587, smokingInfo: "全席禁煙", seatCountInfo: "46席", hoursInfo: "平日8:00〜19:30、土11:00〜17:30", closedDaysInfo: "日曜日、祝日" },
  { id: "shimbashi-32", name: "カトレア", address: "東京都港区新橋2-16-1 ニュー新橋ビル3F", lat: 35.6660, lng: 139.7584, outletInfo: "コンセントなし、電源設備は無いとの情報", smokingInfo: "全席喫煙可(2020年の改正健康増進法施行後の最新状況は要確認)", seatCountInfo: "90席", hoursInfo: "平日10:00〜20:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "shimbashi-33", name: "フジ", address: "東京都港区新橋2-16-1 ニュー新橋ビルB1F", lat: 35.6660, lng: 139.7584, outletInfo: "電源コンセントとWi-Fi完備の老舗喫茶", smokingInfo: "分煙(加熱式タバコのみ店内可、紙巻きタバコ用の喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "80席(カウンター・ソファー席、コンセント付き座席あり)", hoursInfo: "平日10:00〜19:00、土10:00〜18:00", closedDaysInfo: "日曜日、祝日、第4月曜日" },
  { id: "shimbashi-34", name: "椿屋珈琲 新橋茶寮", address: "東京都港区新橋2-8-7 新橋東和ビル2F・3F", lat: 35.6668, lng: 139.7592, outletInfo: "2-3階の一部席に電源あり、要スタッフ確認", smokingInfo: "全席禁煙、喫煙ブース(紙巻タバコ可)あり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "86席", hoursInfo: "平日・祝前日7:30〜翌5:00、土9:00〜翌5:00、日9:00〜23:00" },
  { id: "shimbashi-35", name: "椿屋珈琲 新橋はなれ", address: "東京都港区新橋2-16-1 ニュー新橋ビル1F", lat: 35.6660, lng: 139.7584, smokingInfo: "分煙(加熱式タバコ限定)、喫煙ブース(紙巻可)あり", seatCountInfo: "66席", hoursInfo: "平日・祝前日8:00〜23:00、土日9:00〜23:00", closedDaysInfo: "不定休" },
  { id: "shimbashi-36", name: "宮越屋珈琲 東京新橋店", address: "東京都港区新橋1-7-10 汐留スペリアビル", lat: 35.6678, lng: 139.7588, outletInfo: "2階の一部席に電源コンセントあり", smokingInfo: "全席喫煙可(2020年の改正健康増進法施行後の最新状況は要確認)", hoursInfo: "平日10:00〜22:00、土日祝10:00〜21:00" },
  { id: "shimbashi-37", name: "北欧", address: "東京都中央区銀座8-7 銀座ナイン2 1F", lat: 35.6672, lng: 139.7608, smokingInfo: "分煙", hoursInfo: "平日10:00〜22:00、土日11:00〜20:00" },
  { id: "shimbashi-38", name: "ツバキCafe 新橋駅前店", address: "東京都港区新橋3-21-12 IKENO-1ビル1F～3F", lat: 35.6648, lng: 139.7592, outletInfo: "カウンター壁側など多くの席に電源あり", smokingInfo: "全席喫煙可", seatCountInfo: "57席(1階はスタンディング、2・3階に座席)", hoursInfo: "月〜金6:45〜23:00、土9:00〜21:00", closedDaysInfo: "日曜日、祝日、祝日の翌日" },
  { id: "shimbashi-39", name: "サザコーヒー エキュートエディション新橋店", address: "東京都港区新橋2-17-14 JR新橋駅1F", lat: 35.6663, lng: 139.7588, outletInfo: "カウンター席テーブル下に2口コンセント計7席", smokingInfo: "全席禁煙", seatCountInfo: "14席(カウンター10・テーブル4)", hoursInfo: "平日・祝前後日8:00〜21:00、土日祝9:00〜19:00" },
  { id: "shimbashi-40", name: "COMFORT STAND", address: "東京都港区東新橋2-9-1 CIRCLES汐留1F", lat: 35.6608, lng: 139.7615, outletInfo: "全カウンター席に電源コンセント完備", smokingInfo: "全席禁煙", hoursInfo: "平日10:00〜18:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "shimbashi-41", name: "ロジカフェ", address: "東京都港区西新橋1-5-9 ル・グラシエルBLDG.70 B1F", lat: 35.6688, lng: 139.7555, outletInfo: "全席にコンセントあり、Wi-Fiも完備", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "14席", hoursInfo: "平日10:00〜19:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "shimbashi-42", name: "Hualalai", address: "東京都港区西新橋1-16-7 三甲新橋ビル1F", lat: 35.6693, lng: 139.7548, outletInfo: "窓側カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "26席(うちカウンター9席)", hoursInfo: "平日7:00〜21:00(L.O.20:30)", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "shimbashi-43", name: "CHAYA 1899 TOKYO", address: "東京都港区新橋6-4-1 ホテル1899東京1F", lat: 35.6600, lng: 139.7565, outletInfo: "一部の席に電源コンセントとWi-Fiあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "36席", hoursInfo: "11:00〜17:00(L.O.16:30)", closedDaysInfo: "不定休(臨時休業あり)" },
  { id: "shimbashi-44", name: "田村町 木村屋本店", address: "東京都港区新橋1-18-19 大塚ビルB1F～1F", lat: 35.6692, lng: 139.7562, smokingInfo: "全席禁煙", seatCountInfo: "20席", hoursInfo: "平日9:00〜19:30(L.O.19:00)", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "shimbashi-45", name: "西新橋 珈琲館", address: "東京都港区西新橋1-17-7 西新橋小川ビル", lat: 35.6695, lng: 139.7545, smokingInfo: "一部座席で喫煙可(詳細な分煙構成は確認できず)", hoursInfo: "月〜土8:00〜19:00", closedDaysInfo: "日曜日" },
  { id: "shimbashi-46", name: "珈琲大使館 新橋店", address: "東京都港区新橋4-30-4", lat: 35.6605, lng: 139.7570, smokingInfo: "全席喫煙可(2020年の改正健康増進法施行後の最新状況は要確認)", hoursInfo: "平日7:00〜18:00、土8:00〜15:00", closedDaysInfo: "日曜日、祝日" },
  { id: "shimbashi-47", name: "カフェ・ラ・ミル 新橋店", address: "東京都港区新橋2-16-1 ニュー新橋ビル1F", lat: 35.6660, lng: 139.7584, smokingInfo: "全席禁煙、喫煙専用スペースあり", seatCountInfo: "85席", hoursInfo: "月〜木8:00〜23:00、金8:00〜23:30、土9:00〜22:00、日祝10:00〜19:00", closedDaysInfo: "年中無休" },
  { id: "shimbashi-48", name: "Cafe Deux", address: "東京都港区新橋3-16-3 生涯学習センター1F", lat: 35.6645, lng: 139.7590, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "40席(カウンター8・大テーブル10・テーブル14・テラス8)", hoursInfo: "平日9:00〜17:00(L.O.16:30)、土10:00〜16:00", closedDaysInfo: "日曜日、祝日、第3月曜日" },
  { id: "shimbashi-49", name: "珈琲 メルシィー", address: "東京都港区新橋6-8-2 全国生衛会館1F", lat: 35.6598, lng: 139.7568, smokingInfo: "全席禁煙", hoursInfo: "平日8:00〜17:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "shimbashi-50", name: "カフェ モルゲン・グロッケ", address: "東京都港区新橋3-4-11", lat: 35.6650, lng: 139.7595 },
  { id: "shimbashi-51", name: "旅の停車場", address: "東京都港区新橋2-16-1 ニュー新橋ビルB1F", lat: 35.6660, lng: 139.7584, smokingInfo: "全席禁煙", seatCountInfo: "8席(カウンターのみ)", hoursInfo: "平日12:00〜17:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "shimbashi-52", name: "草枕", address: "東京都港区西新橋1-10-1 日美ビル1F", lat: 35.6685, lng: 139.7530, smokingInfo: "全席禁煙", seatCountInfo: "11席(カウンター5・テーブル3卓6席)", hoursInfo: "火水木金11:00〜20:00(L.O.19:30)、土12:00〜18:00(L.O.17:30)", closedDaysInfo: "月曜日、日曜日、祝日" },
  { id: "shimbashi-53", name: "みやざわ", address: "東京都中央区銀座8-5-25 西銀座会館1F", lat: 35.6678, lng: 139.7615, smokingInfo: "分煙(2020年の改正健康増進法施行時点の情報、最新状況は要確認)", seatCountInfo: "32席(4人卓×6・2人卓×4)", hoursInfo: "平日11:30〜14:30、16:00〜翌3:00", closedDaysInfo: "土曜日、日曜日、祝日" },
];
