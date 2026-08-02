import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
// マクドナルド恵比寿駅前店は2025年9月に閉店確認済みのため未掲載。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認・閉店】新規項目を追加せず既存情報のままにしてある:
// - ebisu-11(エクセルシオール カフェ 恵比寿ガーデンプレイス店): 食べログに
//   「【閉店】」表記あり
// - ebisu-12(エクセルシオール カフェ アトレ恵比寿店): 食べログに閉店表記、
//   アトレ恵比寿公式カフェ一覧にも記載なし
// - ebisu-13(サイゼリヤ 恵比寿駅東口店): 2026年5月11日閉店(家賃高騰が理由と
//   の食べログ投稿あり)
// - ebisu-20(フレッシュネスバーガー 恵比寿店): 2025年7月12日閉店
// - ebisu-21(フレッシュネスバーガー 恵比寿1丁目店): 食べログに閉店表記あり
// - ebisu-22(フレッシュネスバーガー 恵比寿西): 食べログに閉店表記あり、跡地に
//   ミスタードーナツ出店との情報も
// - ebisu-39(Rue Favart): 2026年1月25日、28年の歴史に幕を閉じ閉店
// - ebisu-45(ダカフェ 恵比寿店): 2024年12月9日閉店(ダイワスーパー公式より)
// - ebisu-46(カフェ ボニーニ 恵比寿店): 2025年8月31日閉店(公式Instagramより)
export const cafes: Cafe[] = [
  { id: "ebisu-01", name: "スターバックス コーヒー 恵比寿ユニオンビル店", address: "東京都渋谷区恵比寿南1-2-10 エビスユニオンビル1F", lat: 35.6458, lng: 139.7098, outletInfo: "コンセント付きの席はなし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo、Softbank利用可)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "ebisu-02", name: "スターバックス コーヒー 恵比寿ガーデンプレイスタワー１Ｆ店", address: "東京都渋谷区恵比寿4-20-3 恵比寿ガーデンプレイスタワー", lat: 35.6422, lng: 139.7152, outletInfo: "窓際カウンター12席中6席に電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo)", seatCountInfo: "48席", hoursInfo: "平日7:00〜22:00、土日祝8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "ebisu-03", name: "スターバックス コーヒー 恵比寿ファーストスクエア店", address: "東京都渋谷区恵比寿1-18-14 恵比寿ファーストスクエア", lat: 35.6498, lng: 139.7128, outletInfo: "電源が使える席はなし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "平日7:00〜21:00、土日祝8:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ebisu-04", name: "スターバックス コーヒー アトレ恵比寿店(2F)", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿", lat: 35.6461, lng: 139.7101, outletInfo: "電源席なし、コンセント利用不可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "ebisu-05", name: "スターバックス コーヒー アトレ恵比寿店(5F)", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿", lat: 35.6461, lng: 139.7102, outletInfo: "電源席なし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "10:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ebisu-06", name: "スターバックス ティー&カフェ 恵比寿ガーデンプレイス B1店", address: "東京都渋谷区恵比寿4-20-7 恵比寿ガーデンプレイス センタープラザ B1", lat: 35.6419, lng: 139.715, outletInfo: "電源席なし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "ebisu-07", name: "ドトールコーヒーショップ 恵比寿駅前店", address: "東京都渋谷区恵比寿南1-4-1", lat: 35.6463, lng: 139.7096, outletInfo: "電源が使えない店との情報あり", smokingInfo: "分煙(禁煙51席・喫煙24席、総席数75)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全75席", hoursInfo: "7:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "ebisu-08", name: "ドトールコーヒーショップ 恵比寿東店", address: "東京都渋谷区東3-25-5 グランドメゾン恵比寿東", lat: 35.6505, lng: 139.7138, outletInfo: "電源カフェとして掲載、コンセントあり", smokingInfo: "全席禁煙(公式には喫煙ブース記載あるが喫煙席は0席)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全20席(禁煙20・喫煙0)", hoursInfo: "平日6:30〜19:30、土7:30〜19:00、日祝7:30〜19:00" },
  { id: "ebisu-09", name: "ドトールコーヒーショップ 恵比寿一丁目店", address: "東京都渋谷区恵比寿1-11-1", lat: 35.6483, lng: 139.7108, outletInfo: "1階・2階の窓際カウンターに1口コンセント", smokingInfo: "分煙(禁煙99席・喫煙18席、喫煙席は加熱式・紙たばこブース)", seatCountInfo: "全117席", hoursInfo: "平日6:45〜22:00、土7:00〜22:00、日祝7:00〜21:30" },
  { id: "ebisu-10", name: "タリーズコーヒー エビススバルビル店", address: "東京都渋谷区恵比寿1-20-8 エビススバルビル1F", lat: 35.65, lng: 139.713, outletInfo: "窓際にコンセント席、人気ですぐ埋まる", smokingInfo: "全席禁煙", wifiInfo: "Softbank Wi-Fi利用可", seatCountInfo: "50席", hoursInfo: "平日7:30〜19:00、土日8:00〜18:00", closedDaysInfo: "無休" },
  { id: "ebisu-11", name: "エクセルシオール カフェ 恵比寿ガーデンプレイス店", address: "東京都渋谷区恵比寿4-20-3 恵比寿ガーデンプレイスタワー1F", lat: 35.6421, lng: 139.7151, outletInfo: "コンセント席が多く打ち合わせ利用も" },
  { id: "ebisu-12", name: "エクセルシオール カフェ アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿", lat: 35.646, lng: 139.71 },
  { id: "ebisu-13", name: "サイゼリヤ 恵比寿駅東口店", address: "東京都渋谷区恵比寿4-3-1 クイズ恵比寿3F", lat: 35.6448, lng: 139.7118 },
  { id: "ebisu-14", name: "PRONTO 恵比寿東口店", address: "東京都渋谷区恵比寿1-11-13", lat: 35.6484, lng: 139.7112, outletInfo: "1階に電源席8席あり", smokingInfo: "分煙(1階禁煙33席・2階喫煙32席、11:30〜13:30は全席禁煙)", wifiInfo: "無料Wi-Fiあり(au/softbank/docomo/wimaxスポットも利用可)", seatCountInfo: "全65席(1F33・2F32)", hoursInfo: "平日(月〜木)7:00〜23:00、金7:00〜23:30、土日祝9:00〜22:00", closedDaysInfo: "無休" },
  { id: "ebisu-15", name: "喫茶室ルノアール 恵比寿第1店", address: "東京都渋谷区恵比寿南1-5-2 恵比寿JEBL1F", lat: 35.6459, lng: 139.7099, outletInfo: "電源・Wi-Fiサービスなし", smokingInfo: "全席喫煙可(2020年法改正後の現況は要確認)", hoursInfo: "月〜金8:00〜23:00、土8:30〜23:00", closedDaysInfo: "日曜定休" },
  { id: "ebisu-16", name: "喫茶室ルノアール 恵比寿東口店", address: "東京都渋谷区恵比寿1-13-10 恵比寿壱番館1F", lat: 35.6486, lng: 139.7113, outletInfo: "電源コンセントなし", smokingInfo: "全席喫煙可", hoursInfo: "月〜金8:00〜23:00、土8:30〜23:00", closedDaysInfo: "日曜定休" },
  { id: "ebisu-17", name: "サンマルクカフェ+R 恵比寿駅前店", address: "東京都渋谷区恵比寿西1-8-8", lat: 35.6474, lng: 139.7083, outletInfo: "コンセントある席とない席あり、要確認", smokingInfo: "分煙", seatCountInfo: "107席", hoursInfo: "7:00〜23:00(L.O.22:30)", closedDaysInfo: "無休" },
  { id: "ebisu-18", name: "サンマルクカフェ 恵比寿東口店", address: "東京都渋谷区恵比寿1-8-1 サン栄ビル", lat: 35.6481, lng: 139.7104, outletInfo: "電源席ありも混雑時は埋まりやすい", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "Wi-Fiあり", seatCountInfo: "91席", hoursInfo: "7:00〜23:00(L.O.22:30)", closedDaysInfo: "無休" },
  { id: "ebisu-19", name: "モスバーガー 恵比寿東店", address: "東京都渋谷区恵比寿1-10-7", lat: 35.6482, lng: 139.7107, outletInfo: "電源カフェとして掲載されている", smokingInfo: "全席禁煙(モスバーガーは2020年3月末までに全店禁煙化済み)", hoursInfo: "9:00〜21:00" },
  { id: "ebisu-20", name: "フレッシュネスバーガー 恵比寿店", address: "東京都渋谷区恵比寿南1-1-11", lat: 35.6465, lng: 139.7092, outletInfo: "ほぼ全席にコンセントあり" },
  { id: "ebisu-21", name: "フレッシュネスバーガー 恵比寿1丁目店", address: "東京都渋谷区恵比寿1-11-3 村田ビル1F", lat: 35.6483, lng: 139.7109 },
  { id: "ebisu-22", name: "フレッシュネスバーガー 恵比寿西", address: "東京都渋谷区恵比寿西1-21-5 West21 1・2F", lat: 35.6488, lng: 139.7062, outletInfo: "各階数席にコンセントあり" },
  { id: "ebisu-23", name: "カフェ・ド・クリエ グラン 恵比寿ガーデンプレイス店", address: "東京都渋谷区恵比寿4-20-3 恵比寿ガーデンプレイスタワー1F", lat: 35.642, lng: 139.7153, outletInfo: "コンセント付きカウンター多数", smokingInfo: "分煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "月〜木7:00〜21:00、金〜日8:00〜21:00" },
  { id: "ebisu-24", name: "茶和(Cha-wa)", address: "東京都渋谷区恵比寿1-9-5 EBISUマルトビル1F", lat: 35.648, lng: 139.7104, outletInfo: "テーブル・カウンター共に電源とUSBあり", smokingInfo: "ランチタイムは禁煙、夜間は喫煙可", hoursInfo: "平日11:00〜22:00(L.O.21:30)", closedDaysInfo: "土日定休" },
  { id: "ebisu-25", name: "ESPRESSO D WORKS 恵比寿", address: "東京都渋谷区恵比寿1-22-19 プライムメゾン1F", lat: 35.6503, lng: 139.7135, outletInfo: "電源あり、一部の席のみ", smokingInfo: "全席禁煙", seatCountInfo: "40席", hoursInfo: "月〜土11:00〜23:00(L.O.22:00)、日11:00〜22:00(L.O.21:00)", closedDaysInfo: "不定休" },
  { id: "ebisu-26", name: "torch cafe", address: "東京都渋谷区恵比寿南2-1-12 サトウビル2F", lat: 35.6445, lng: 139.7095, outletInfo: "電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "64席", hoursInfo: "12:00〜23:00", closedDaysInfo: "無休" },
  { id: "ebisu-27", name: "TimeOut Cafe & Diner", address: "東京都渋谷区東3-16-6 リキッドルーム2F", lat: 35.6512, lng: 139.7128, outletInfo: "床沿いの延長コードで電源自由に使用可", smokingInfo: "全席喫煙可(電子タバコも終日可)", seatCountInfo: "30席(立食時最大70名)", hoursInfo: "火〜金11:30〜21:00、土13:00〜20:00", closedDaysInfo: "日・月・祝定休(不定休あり、SNSで要確認)" },
  { id: "ebisu-28", name: "loger cafe", address: "東京都渋谷区恵比寿1-7-3 第一協栄ビル2F", lat: 35.6479, lng: 139.7102, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "46席", hoursInfo: "12:00〜23:00", closedDaysInfo: "無休" },
  { id: "ebisu-29", name: "HARBS アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿本館4F", lat: 35.6461, lng: 139.71, outletInfo: "電源席はなし", smokingInfo: "全席禁煙", seatCountInfo: "78席", hoursInfo: "11:00〜20:00" },
  { id: "ebisu-30", name: "猿田彦珈琲 アトレ恵比寿ウエストサイドストア", address: "東京都渋谷区恵比寿南1-6-1 アトレ恵比寿西館1F", lat: 35.6459, lng: 139.7097, outletInfo: "カウンター席で電源が取れる", smokingInfo: "全席禁煙", closedDaysInfo: "無休", hoursInfo: "8:00〜22:00", seatCountInfo: "24席" },
  { id: "ebisu-31", name: "猿田彦珈琲 恵比寿本店", address: "東京都渋谷区恵比寿1-6-6 斎藤ビル1F", lat: 35.6478, lng: 139.71, outletInfo: "15席中5席ほどに電源あり", smokingInfo: "全席禁煙", seatCountInfo: "11席(テーブル4+カウンター3)", hoursInfo: "月〜木8:00〜22:30、金8:00〜23:30、土10:00〜23:30、日10:00〜22:30", closedDaysInfo: "年末年始・お盆休みあり(要問合せ)" },
  { id: "ebisu-32", name: "MERCER BRUNCH EBISU", address: "東京都渋谷区恵比寿4-23-13 MERCER BLDG.1F", lat: 35.6432, lng: 139.7148, smokingInfo: "全席禁煙(喫煙エリアあり)", seatCountInfo: "60席(1F34・2F26)", hoursInfo: "月〜木11:00〜16:30/17:30〜22:30、金11:00〜16:30/17:30〜23:00、土11:00〜23:00、日11:00〜22:30" },
  { id: "ebisu-33", name: "CAFE GITANE", address: "東京都渋谷区恵比寿南1-16-11 ABC WACOビル1F", lat: 35.6448, lng: 139.7088, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "65席(カウンター10含む)", hoursInfo: "平日11:30〜23:00、土日祝11:00〜23:00" },
  { id: "ebisu-34", name: "medel deli", address: "東京都渋谷区恵比寿西1-17-1", lat: 35.6486, lng: 139.7068, outletInfo: "電源あり", smokingInfo: "全席禁煙", seatCountInfo: "10席", hoursInfo: "月〜土9:00〜19:00、日祝10:00〜19:00", closedDaysInfo: "年末年始のみ休業" },
  { id: "ebisu-35", name: "アナログ カフェ ラウンジ トーキョー", address: "東京都渋谷区恵比寿南1-8-3 東亜恵比寿ビル4F", lat: 35.6456, lng: 139.7096, smokingInfo: "喫煙可(20歳未満入店不可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "39席", hoursInfo: "ランチ12:00〜17:00(L.O.16:00)、ディナー17:00〜23:00、ティータイム12:00〜23:00", closedDaysInfo: "年末年始のみ休業" },
  { id: "ebisu-36", name: "備屋珈琲店 恵比寿店", address: "東京都渋谷区恵比寿4-4-11", lat: 35.6446, lng: 139.7122, smokingInfo: "全席禁煙", seatCountInfo: "41席", hoursInfo: "月〜土11:00〜21:00、日祝11:00〜20:00" },
  { id: "ebisu-37", name: "KO-SO CAFE BIORISE", address: "東京都渋谷区東3-25-3 ライオンズプラザ恵比寿1F", lat: 35.6506, lng: 139.7136, outletInfo: "コンセントあり、一部の席のみ", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "23席", hoursInfo: "11:00〜20:00(L.O.19:30)", closedDaysInfo: "水曜定休" },
  { id: "ebisu-38", name: "ライオンのいるサーカス", address: "東京都渋谷区恵比寿南2-3-1", lat: 35.644, lng: 139.7098, smokingInfo: "全席禁煙(入口に喫煙スペースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "38席", hoursInfo: "月〜金11:30〜15:00(L.O.14:30)・17:00〜23:00(L.O.21:30)、土11:30〜23:00、日祝11:30〜23:00(L.O.21:30)", closedDaysInfo: "年中無休(年末は12/29まで営業)" },
  { id: "ebisu-39", name: "Rue Favart", address: "東京都渋谷区恵比寿3-28-12", lat: 35.6435, lng: 139.7148, outletInfo: "各テーブルにコンセント設置" },
  { id: "ebisu-40", name: "JAPANESE GELATERIA&CAFE ASANOHA", address: "東京都渋谷区恵比寿西1-8-11 昴Aビル1F", lat: 35.6476, lng: 139.708, smokingInfo: "全席禁煙", seatCountInfo: "22席(カウンター6・テーブル12・ソファ4)", hoursInfo: "月11:30〜14:30、火〜日祝11:30〜22:00" },
  { id: "ebisu-41", name: "珈琲家族", address: "東京都渋谷区恵比寿南1-2-8 雨宮ビルB1", lat: 35.6462, lng: 139.7093, smokingInfo: "全席喫煙可", seatCountInfo: "21席", hoursInfo: "火水7:00〜18:00、木金土7:00〜20:00", closedDaysInfo: "月・日定休" },
  { id: "ebisu-42", name: "cafe&dining nurikabe", address: "東京都渋谷区恵比寿南3-1-2 サウスビル4F", lat: 35.6428, lng: 139.7092, outletInfo: "電源コンセントあり", smokingInfo: "店内全席禁煙、テラスは状況により喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "26席", hoursInfo: "12:00〜23:00(ランチ12:00〜14:30、ディナー17:00〜23:00 L.O.22:00)", closedDaysInfo: "第一月曜日定休" },
  { id: "ebisu-43", name: "写真集食堂 めぐたま", address: "東京都渋谷区東3-2-7 1F", lat: 35.6498, lng: 139.7122, outletInfo: "コンセント5口あり", smokingInfo: "全席禁煙", seatCountInfo: "20席", hoursInfo: "12:00〜22:00(L.O.21:00)", closedDaysInfo: "月曜・祝日定休" },
  { id: "ebisu-44", name: "cafe accueil", address: "東京都渋谷区恵比寿西2-10-10 エレガンテヴィータ1F", lat: 35.6455, lng: 139.7058, outletInfo: "電源・Wi-Fi利用可", smokingInfo: "全席禁煙", seatCountInfo: "160席(1F・2F合計)", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "年末年始のみ休業" },
  { id: "ebisu-45", name: "ダカフェ 恵比寿店", address: "東京都渋谷区恵比寿南3-11-25 プリンススマートイン恵比寿1F", lat: 35.6418, lng: 139.7085 },
  { id: "ebisu-46", name: "カフェ ボニーニ 恵比寿店", address: "東京都渋谷区恵比寿南1-4-15 恵比寿銀座クロスビル1F", lat: 35.6464, lng: 139.7094, outletInfo: "中央大テーブルと窓際カウンターに2口コンセント" },
  { id: "ebisu-47", name: "アルファ", address: "東京都渋谷区恵比寿1-13-6 第2伊藤ビル1F", lat: 35.6488, lng: 139.7115, smokingInfo: "全席喫煙可", seatCountInfo: "30席", hoursInfo: "8:00〜20:00(祝日は〜19:00)", closedDaysInfo: "無休" },
  { id: "ebisu-48", name: "Beige Cafe", address: "東京都渋谷区恵比寿1-4-1 恵比寿アーバンハウス1F", lat: 35.6476, lng: 139.7098, smokingInfo: "全席禁煙", seatCountInfo: "12席", hoursInfo: "月〜金7:30〜15:00", closedDaysInfo: "土日定休" },
  { id: "ebisu-49", name: "STABLER Shimokitazawa Meatsand EBISU", address: "東京都渋谷区恵比寿南1-2-2 横倉屋店舗1-A", lat: 35.646, lng: 139.7095, smokingInfo: "全席禁煙", seatCountInfo: "10席(カウンター3・テーブル7)", hoursInfo: "11:00〜20:00(L.O.19:30、日により〜22:30の場合あり)", closedDaysInfo: "12/31〜1/4" },
  { id: "ebisu-50", name: "喫茶銀座", address: "東京都渋谷区恵比寿南1-3-9 新井ビル1F", lat: 35.6463, lng: 139.7095, smokingInfo: "全席喫煙可(現況は法改正後要確認)", seatCountInfo: "70席", hoursInfo: "火〜金10:00〜18:30、土日祝11:30〜18:30", closedDaysInfo: "月曜定休" },
  { id: "ebisu-51", name: "マーサー カフェ ダンロ", address: "東京都渋谷区恵比寿南1-16-12 ABCMAMIES2F", lat: 35.6447, lng: 139.7089, smokingInfo: "全席禁煙", seatCountInfo: "65席", hoursInfo: "平日17:00〜23:00(L.O.22:00)、土日祝11:00〜23:00(ランチ11:00〜17:00)", closedDaysInfo: "年末年始(12/31〜1/3頃)" },
  { id: "ebisu-52", name: "パイル カフェ エビス", address: "東京都渋谷区恵比寿西1-8-2 恵比寿ウエストパレスビル207", lat: 35.6475, lng: 139.7082, outletInfo: "コンセントあり", smokingInfo: "全席禁煙(屋外に喫煙エリアあり)", seatCountInfo: "42席", hoursInfo: "12:00〜23:30", closedDaysInfo: "無休" },
  { id: "ebisu-53", name: "ヴェルデ", address: "東京都渋谷区恵比寿西1-20-8 コンド恵比寿1F", lat: 35.6491, lng: 139.706, smokingInfo: "全席禁煙", seatCountInfo: "20席(カウンター10・テーブル10)", hoursInfo: "月火水金12:00〜19:00、土日祝12:00〜18:00", closedDaysInfo: "木曜定休" },
  { id: "ebisu-54", name: "Cafe Tram", address: "東京都渋谷区恵比寿西1-7-13 スイングビル2F", lat: 35.6474, lng: 139.7084, smokingInfo: "全席禁煙(2026年2月より禁煙化)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "31席(カウンター8・テーブル23)", hoursInfo: "水〜日祝カフェ13:00〜19:00、バー19:00〜翌2:00", closedDaysInfo: "月火定休" },
  { id: "ebisu-55", name: "uRn. chAi&TeA 恵比寿店", address: "東京都渋谷区恵比寿1-22-23 ヴェラハイツ恵比寿1F", lat: 35.6504, lng: 139.7137, outletInfo: "窓際カウンター席に電源あり", smokingInfo: "全席禁煙", seatCountInfo: "18席", hoursInfo: "9:30〜20:00", closedDaysInfo: "無休" },
  { id: "ebisu-56", name: "it COFFEE 恵比寿店", address: "東京都渋谷区恵比寿1-20-2 恵比寿ファーストビル1F", lat: 35.6499, lng: 139.7127, outletInfo: "ほぼ全席にコンセント完備", smokingInfo: "全席禁煙", hoursInfo: "8:00〜20:00", closedDaysInfo: "無休" },
  { id: "ebisu-57", name: "THE NEW NORMAL", address: "東京都渋谷区恵比寿南2-3-13 山燃ビル2F", lat: 35.6438, lng: 139.7096, smokingInfo: "全席禁煙", seatCountInfo: "26席", hoursInfo: "月木金土日祝11:30〜23:30(L.O.フード22:30/ドリンク23:00)、火水11:30〜23:00(L.O.フード22:00/ドリンク22:30)", closedDaysInfo: "基本無休" },
  { id: "ebisu-58", name: "京橋千疋屋 アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿3F", lat: 35.6461, lng: 139.7101, smokingInfo: "全席禁煙", seatCountInfo: "44席", hoursInfo: "10:00〜21:00(パーラーL.O.20:30)", closedDaysInfo: "無休(アトレ恵比寿全館休館日を除く)" },
];
