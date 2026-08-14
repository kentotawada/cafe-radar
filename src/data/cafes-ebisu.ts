import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は国土地理院の住所検索APIで解決した街区(番地)レベルの地点です
// (2026-08-14に全件更新)。建物単位ではないため、同じ番地の店は同じ点に
// なります。それ以前は住所からの大まかな推定で、実測で中央値174mずれて
// いました。経路・写真検索は店名+住所のテキストでGoogleマップに渡して
// いるため、座標が多少ずれていても案内自体は正確です。
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
  { id: "ebisu-01", name: "スターバックス コーヒー 恵比寿ユニオンビル店", address: "東京都渋谷区恵比寿南1-2-10 エビスユニオンビル1F", lat: 35.646236, lng: 139.70784, outletInfo: "コンセント付きの席はなし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo、Softbank利用可)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "ebisu-02", name: "スターバックス コーヒー 恵比寿ガーデンプレイスタワー１Ｆ店", address: "東京都渋谷区恵比寿4-20-3 恵比寿ガーデンプレイスタワー", lat: 35.6421682, lng: 139.7134557, outletInfo: "窓際カウンター12席中6席に電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、docomo)", seatCountInfo: "48席", hoursInfo: "平日7:00〜22:00、土日祝8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "ebisu-03", name: "スターバックス コーヒー 恵比寿ファーストスクエア店", address: "東京都渋谷区恵比寿1-18-14 恵比寿ファーストスクエア", lat: 35.647221, lng: 139.714584, outletInfo: "電源が使える席はなし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "平日7:00〜21:00、土日祝8:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ebisu-04", name: "スターバックス コーヒー アトレ恵比寿店(2F)", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿", lat: 35.647175, lng: 139.709305, outletInfo: "電源席なし、コンセント利用不可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "ebisu-05", name: "スターバックス コーヒー アトレ恵比寿店(5F)", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿", lat: 35.6466232, lng: 139.7101809, outletInfo: "電源席なし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "10:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ebisu-06", name: "スターバックス ティー&カフェ 恵比寿ガーデンプレイス B1店", address: "東京都渋谷区恵比寿4-20-7 恵比寿ガーデンプレイス センタープラザ B1", lat: 35.643665, lng: 139.713364, outletInfo: "電源席なし", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", hoursInfo: "8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "ebisu-07", name: "ドトールコーヒーショップ 恵比寿駅前店", address: "東京都渋谷区恵比寿南1-4-1", lat: 35.646618, lng: 139.709183, outletInfo: "電源が使えない店との情報あり", smokingInfo: "分煙(禁煙51席・喫煙24席、総席数75)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全75席", hoursInfo: "7:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "ebisu-08", name: "ドトールコーヒーショップ 恵比寿東店", address: "東京都渋谷区東3-25-5 グランドメゾン恵比寿東", lat: 35.648594, lng: 139.710266, outletInfo: "電源カフェとして掲載、コンセントあり", smokingInfo: "全席禁煙(公式には喫煙ブース記載あるが喫煙席は0席)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全20席(禁煙20・喫煙0)", hoursInfo: "平日6:30〜19:30、土7:30〜19:00、日祝7:30〜19:00" },
  { id: "ebisu-09", name: "ドトールコーヒーショップ 恵比寿一丁目店", address: "東京都渋谷区恵比寿1-11-1", lat: 35.646801, lng: 139.711502, outletInfo: "1階・2階の窓際カウンターに1口コンセント", smokingInfo: "分煙(禁煙99席・喫煙18席、喫煙席は加熱式・紙たばこブース)", seatCountInfo: "全117席", hoursInfo: "平日6:45〜22:00、土7:00〜22:00、日祝7:00〜21:30" },
  { id: "ebisu-10", name: "タリーズコーヒー エビススバルビル店", address: "東京都渋谷区恵比寿1-20-8 エビススバルビル1F", lat: 35.647106, lng: 139.713562, outletInfo: "窓際にコンセント席、人気ですぐ埋まる", smokingInfo: "全席禁煙", wifiInfo: "Softbank Wi-Fi利用可", seatCountInfo: "50席", hoursInfo: "平日7:30〜19:00、土日8:00〜18:00", closedDaysInfo: "無休" },
  { id: "ebisu-11", name: "エクセルシオール カフェ 恵比寿ガーデンプレイス店", address: "東京都渋谷区恵比寿4-20-3 恵比寿ガーデンプレイスタワー1F", lat: 35.64237929, lng: 139.71341963, outletInfo: "コンセント席が多く打ち合わせ利用も" },
  { id: "ebisu-12", name: "エクセルシオール カフェ アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿", lat: 35.647175, lng: 139.709305 },
  { id: "ebisu-13", name: "サイゼリヤ 恵比寿駅東口店", address: "東京都渋谷区恵比寿4-3-1 クイズ恵比寿3F", lat: 35.646194, lng: 139.711212 },
  { id: "ebisu-14", name: "PRONTO 恵比寿東口店", address: "東京都渋谷区恵比寿1-11-13", lat: 35.646648, lng: 139.710983, outletInfo: "1階に電源席8席あり", smokingInfo: "分煙(1階禁煙33席・2階喫煙32席、11:30〜13:30は全席禁煙)", wifiInfo: "無料Wi-Fiあり(au/softbank/docomo/wimaxスポットも利用可)", seatCountInfo: "全65席(1F33・2F32)", hoursInfo: "平日(月〜木)7:00〜23:00、金7:00〜23:30、土日祝9:00〜22:00", closedDaysInfo: "無休" },
  { id: "ebisu-15", name: "喫茶室ルノアール 恵比寿第1店", address: "東京都渋谷区恵比寿南1-5-2 恵比寿JEBL1F", lat: 35.646809, lng: 139.709549, outletInfo: "電源・Wi-Fiサービスなし", smokingInfo: "全席喫煙可(2020年法改正後の現況は要確認)", hoursInfo: "月〜金8:00〜23:00、土8:30〜23:00", closedDaysInfo: "日曜定休" },
  { id: "ebisu-16", name: "喫茶室ルノアール 恵比寿東口店", address: "東京都渋谷区恵比寿1-13-10 恵比寿壱番館1F", lat: 35.647118, lng: 139.711578, outletInfo: "電源コンセントなし", smokingInfo: "全席喫煙可", hoursInfo: "月〜金8:00〜23:00、土8:30〜23:00", closedDaysInfo: "日曜定休" },
  { id: "ebisu-17", name: "サンマルクカフェ+R 恵比寿駅前店", address: "東京都渋谷区恵比寿西1-8-8", lat: 35.647255, lng: 139.708649, outletInfo: "コンセントある席とない席あり、要確認", smokingInfo: "分煙", seatCountInfo: "107席", hoursInfo: "7:00〜23:00(L.O.22:30)", closedDaysInfo: "無休" },
  { id: "ebisu-18", name: "サンマルクカフェ 恵比寿東口店", address: "東京都渋谷区恵比寿1-8-1 サン栄ビル", lat: 35.648045, lng: 139.710114, outletInfo: "電源席ありも混雑時は埋まりやすい", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "Wi-Fiあり", seatCountInfo: "91席", hoursInfo: "7:00〜23:00(L.O.22:30)", closedDaysInfo: "無休" },
  { id: "ebisu-19", name: "モスバーガー 恵比寿東店", address: "東京都渋谷区恵比寿1-10-7", lat: 35.646877, lng: 139.710739, outletInfo: "電源カフェとして掲載されている", smokingInfo: "全席禁煙(モスバーガーは2020年3月末までに全店禁煙化済み)", hoursInfo: "9:00〜21:00" },
  { id: "ebisu-20", name: "フレッシュネスバーガー 恵比寿店", address: "東京都渋谷区恵比寿南1-1-11", lat: 35.646652, lng: 139.708481, outletInfo: "ほぼ全席にコンセントあり" },
  { id: "ebisu-21", name: "フレッシュネスバーガー 恵比寿1丁目店", address: "東京都渋谷区恵比寿1-11-3 村田ビル1F", lat: 35.646591, lng: 139.711731 },
  { id: "ebisu-22", name: "フレッシュネスバーガー 恵比寿西", address: "東京都渋谷区恵比寿西1-21-5 West21 1・2F", lat: 35.646435, lng: 139.705963, outletInfo: "各階数席にコンセントあり" },
  { id: "ebisu-23", name: "カフェ・ド・クリエ グラン 恵比寿ガーデンプレイス店", address: "東京都渋谷区恵比寿4-20-3 恵比寿ガーデンプレイスタワー1F", lat: 35.6421682, lng: 139.7134502, outletInfo: "コンセント付きカウンター多数", smokingInfo: "分煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", hoursInfo: "月〜木7:00〜21:00、金〜日8:00〜21:00" },
  { id: "ebisu-24", name: "茶和(Cha-wa)", address: "東京都渋谷区恵比寿1-9-5 EBISUマルトビル1F", lat: 35.647064, lng: 139.711212, outletInfo: "テーブル・カウンター共に電源とUSBあり", smokingInfo: "ランチタイムは禁煙、夜間は喫煙可", hoursInfo: "平日11:00〜22:00(L.O.21:30)", closedDaysInfo: "土日定休" },
  { id: "ebisu-25", name: "ESPRESSO D WORKS 恵比寿", address: "東京都渋谷区恵比寿1-22-19 プライムメゾン1F", lat: 35.646042, lng: 139.714127, outletInfo: "電源あり、一部の席のみ", smokingInfo: "全席禁煙", seatCountInfo: "40席", hoursInfo: "月〜土11:00〜23:00(L.O.22:00)、日11:00〜22:00(L.O.21:00)", closedDaysInfo: "不定休" },
  { id: "ebisu-26", name: "torch cafe", address: "東京都渋谷区恵比寿南2-1-12 サトウビル2F", lat: 35.646095, lng: 139.707413, outletInfo: "電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "64席", hoursInfo: "12:00〜23:00", closedDaysInfo: "無休" },
  { id: "ebisu-27", name: "TimeOut Cafe & Diner", address: "東京都渋谷区東3-16-6 リキッドルーム2F", lat: 35.649357, lng: 139.71077, outletInfo: "床沿いの延長コードで電源自由に使用可", smokingInfo: "全席喫煙可(電子タバコも終日可)", seatCountInfo: "30席(立食時最大70名)", hoursInfo: "火〜金11:30〜21:00、土13:00〜20:00", closedDaysInfo: "日・月・祝定休(不定休あり、SNSで要確認)" },
  { id: "ebisu-28", name: "loger cafe", address: "東京都渋谷区恵比寿1-7-3 第一協栄ビル2F", lat: 35.64819, lng: 139.710892, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "46席", hoursInfo: "12:00〜23:00", closedDaysInfo: "無休" },
  { id: "ebisu-29", name: "HARBS アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿本館4F", lat: 35.647175, lng: 139.709305, outletInfo: "電源席はなし", smokingInfo: "全席禁煙", seatCountInfo: "78席", hoursInfo: "11:00〜20:00" },
  { id: "ebisu-30", name: "猿田彦珈琲 アトレ恵比寿ウエストサイドストア", address: "東京都渋谷区恵比寿南1-6-1 アトレ恵比寿西館1F", lat: 35.646698, lng: 139.709763, outletInfo: "カウンター席で電源が取れる", smokingInfo: "全席禁煙", closedDaysInfo: "無休", hoursInfo: "8:00〜22:00", seatCountInfo: "24席" },
  { id: "ebisu-31", name: "猿田彦珈琲 恵比寿本店", address: "東京都渋谷区恵比寿1-6-6 斎藤ビル1F", lat: 35.647659, lng: 139.710876, outletInfo: "15席中5席ほどに電源あり", smokingInfo: "全席禁煙", seatCountInfo: "11席(テーブル4+カウンター3)", hoursInfo: "月〜木8:00〜22:30、金8:00〜23:30、土10:00〜23:30、日10:00〜22:30", closedDaysInfo: "年末年始・お盆休みあり(要問合せ)" },
  { id: "ebisu-32", name: "MERCER BRUNCH EBISU", address: "東京都渋谷区恵比寿4-23-13 MERCER BLDG.1F", lat: 35.644733, lng: 139.715256, smokingInfo: "全席禁煙(喫煙エリアあり)", seatCountInfo: "60席(1F34・2F26)", hoursInfo: "月〜木11:00〜16:30/17:30〜22:30、金11:00〜16:30/17:30〜23:00、土11:00〜23:00、日11:00〜22:30" },
  { id: "ebisu-33", name: "CAFE GITANE", address: "東京都渋谷区恵比寿南1-16-11 ABC WACOビル1F", lat: 35.644566, lng: 139.709335, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "65席(カウンター10含む)", hoursInfo: "平日11:30〜23:00、土日祝11:00〜23:00" },
  { id: "ebisu-34", name: "medel deli", address: "東京都渋谷区恵比寿西1-17-1", lat: 35.648369, lng: 139.707275, outletInfo: "電源あり", smokingInfo: "全席禁煙", seatCountInfo: "10席", hoursInfo: "月〜土9:00〜19:00、日祝10:00〜19:00", closedDaysInfo: "年末年始のみ休業" },
  { id: "ebisu-35", name: "アナログ カフェ ラウンジ トーキョー", address: "東京都渋谷区恵比寿南1-8-3 東亜恵比寿ビル4F", lat: 35.646069, lng: 139.709351, smokingInfo: "喫煙可(20歳未満入店不可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "39席", hoursInfo: "ランチ12:00〜17:00(L.O.16:00)、ディナー17:00〜23:00、ティータイム12:00〜23:00", closedDaysInfo: "年末年始のみ休業" },
  { id: "ebisu-36", name: "備屋珈琲店 恵比寿店", address: "東京都渋谷区恵比寿4-4-11", lat: 35.645138, lng: 139.711578, smokingInfo: "全席禁煙", seatCountInfo: "41席", hoursInfo: "月〜土11:00〜21:00、日祝11:00〜20:00" },
  { id: "ebisu-37", name: "KO-SO CAFE BIORISE", address: "東京都渋谷区東3-25-3 ライオンズプラザ恵比寿1F", lat: 35.648815, lng: 139.710114, outletInfo: "コンセントあり、一部の席のみ", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "23席", hoursInfo: "11:00〜20:00(L.O.19:30)", closedDaysInfo: "水曜定休" },
  { id: "ebisu-38", name: "ライオンのいるサーカス", address: "東京都渋谷区恵比寿南2-3-1", lat: 35.645679, lng: 139.707779, smokingInfo: "全席禁煙(入口に喫煙スペースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "38席", hoursInfo: "月〜金11:30〜15:00(L.O.14:30)・17:00〜23:00(L.O.21:30)、土11:30〜23:00、日祝11:30〜23:00(L.O.21:30)", closedDaysInfo: "年中無休(年末は12/29まで営業)" },
  { id: "ebisu-39", name: "Rue Favart", address: "東京都渋谷区恵比寿3-28-12", lat: 35.643745, lng: 139.715347, outletInfo: "各テーブルにコンセント設置" },
  { id: "ebisu-40", name: "JAPANESE GELATERIA&CAFE ASANOHA", address: "東京都渋谷区恵比寿西1-8-11 昴Aビル1F", lat: 35.647427, lng: 139.708328, smokingInfo: "全席禁煙", seatCountInfo: "22席(カウンター6・テーブル12・ソファ4)", hoursInfo: "月11:30〜14:30、火〜日祝11:30〜22:00" },
  { id: "ebisu-41", name: "珈琲家族", address: "東京都渋谷区恵比寿南1-2-8 雨宮ビルB1", lat: 35.646072, lng: 139.707642, smokingInfo: "全席喫煙可", seatCountInfo: "21席", hoursInfo: "火水7:00〜18:00、木金土7:00〜20:00", closedDaysInfo: "月・日定休" },
  { id: "ebisu-42", name: "cafe&dining nurikabe", address: "東京都渋谷区恵比寿南3-1-2 サウスビル4F", lat: 35.645954, lng: 139.706818, outletInfo: "電源コンセントあり", smokingInfo: "店内全席禁煙、テラスは状況により喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "26席", hoursInfo: "12:00〜23:00(ランチ12:00〜14:30、ディナー17:00〜23:00 L.O.22:00)", closedDaysInfo: "第一月曜日定休" },
  { id: "ebisu-43", name: "写真集食堂 めぐたま", address: "東京都渋谷区東3-2-7 1F", lat: 35.651985, lng: 139.712982, outletInfo: "コンセント5口あり", smokingInfo: "全席禁煙", seatCountInfo: "20席", hoursInfo: "12:00〜22:00(L.O.21:00)", closedDaysInfo: "月曜・祝日定休" },
  { id: "ebisu-44", name: "cafe accueil", address: "東京都渋谷区恵比寿西2-10-10 エレガンテヴィータ1F", lat: 35.649391, lng: 139.706589, outletInfo: "電源・Wi-Fi利用可", smokingInfo: "全席禁煙", seatCountInfo: "160席(1F・2F合計)", hoursInfo: "11:00〜22:00(L.O.21:00)", closedDaysInfo: "年末年始のみ休業" },
  { id: "ebisu-45", name: "ダカフェ 恵比寿店", address: "東京都渋谷区恵比寿南3-11-25 プリンススマートイン恵比寿1F", lat: 35.644878, lng: 139.707214 },
  { id: "ebisu-46", name: "カフェ ボニーニ 恵比寿店", address: "東京都渋谷区恵比寿南1-4-15 恵比寿銀座クロスビル1F", lat: 35.646461, lng: 139.708817, outletInfo: "中央大テーブルと窓際カウンターに2口コンセント" },
  { id: "ebisu-47", name: "アルファ", address: "東京都渋谷区恵比寿1-13-6 第2伊藤ビル1F", lat: 35.647034, lng: 139.712128, smokingInfo: "全席喫煙可", seatCountInfo: "30席", hoursInfo: "8:00〜20:00(祝日は〜19:00)", closedDaysInfo: "無休" },
  { id: "ebisu-48", name: "Beige Cafe", address: "東京都渋谷区恵比寿1-4-1 恵比寿アーバンハウス1F", lat: 35.647991, lng: 139.711655, smokingInfo: "全席禁煙", seatCountInfo: "12席", hoursInfo: "月〜金7:30〜15:00", closedDaysInfo: "土日定休" },
  { id: "ebisu-49", name: "STABLER Shimokitazawa Meatsand EBISU", address: "東京都渋谷区恵比寿南1-2-2 横倉屋店舗1-A", lat: 35.646248, lng: 139.708267, smokingInfo: "全席禁煙", seatCountInfo: "10席(カウンター3・テーブル7)", hoursInfo: "11:00〜20:00(L.O.19:30、日により〜22:30の場合あり)", closedDaysInfo: "12/31〜1/4" },
  { id: "ebisu-50", name: "喫茶銀座", address: "東京都渋谷区恵比寿南1-3-9 新井ビル1F", lat: 35.645973, lng: 139.708099, smokingInfo: "全席喫煙可(現況は法改正後要確認)", seatCountInfo: "70席", hoursInfo: "火〜金10:00〜18:30、土日祝11:30〜18:30", closedDaysInfo: "月曜定休" },
  { id: "ebisu-51", name: "マーサー カフェ ダンロ", address: "東京都渋谷区恵比寿南1-16-12 ABCMAMIES2F", lat: 35.64463, lng: 139.709488, smokingInfo: "全席禁煙", seatCountInfo: "65席", hoursInfo: "平日17:00〜23:00(L.O.22:00)、土日祝11:00〜23:00(ランチ11:00〜17:00)", closedDaysInfo: "年末年始(12/31〜1/3頃)" },
  { id: "ebisu-52", name: "パイル カフェ エビス", address: "東京都渋谷区恵比寿西1-8-2 恵比寿ウエストパレスビル207", lat: 35.647854, lng: 139.708435, outletInfo: "コンセントあり", smokingInfo: "全席禁煙(屋外に喫煙エリアあり)", seatCountInfo: "42席", hoursInfo: "12:00〜23:30", closedDaysInfo: "無休" },
  { id: "ebisu-53", name: "ヴェルデ", address: "東京都渋谷区恵比寿西1-20-8 コンド恵比寿1F", lat: 35.646484, lng: 139.706451, smokingInfo: "全席禁煙", seatCountInfo: "20席(カウンター10・テーブル10)", hoursInfo: "月火水金12:00〜19:00、土日祝12:00〜18:00", closedDaysInfo: "木曜定休" },
  { id: "ebisu-54", name: "Cafe Tram", address: "東京都渋谷区恵比寿西1-7-13 スイングビル2F", lat: 35.647835, lng: 139.708801, smokingInfo: "全席禁煙(2026年2月より禁煙化)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "31席(カウンター8・テーブル23)", hoursInfo: "水〜日祝カフェ13:00〜19:00、バー19:00〜翌2:00", closedDaysInfo: "月火定休" },
  { id: "ebisu-55", name: "uRn. chAi&TeA 恵比寿店", address: "東京都渋谷区恵比寿1-22-23 ヴェラハイツ恵比寿1F", lat: 35.646141, lng: 139.71347, outletInfo: "窓際カウンター席に電源あり", smokingInfo: "全席禁煙", seatCountInfo: "18席", hoursInfo: "9:30〜20:00", closedDaysInfo: "無休" },
  { id: "ebisu-56", name: "it COFFEE 恵比寿店", address: "東京都渋谷区恵比寿1-20-2 恵比寿ファーストビル1F", lat: 35.64698, lng: 139.712524, outletInfo: "ほぼ全席にコンセント完備", smokingInfo: "全席禁煙", hoursInfo: "8:00〜20:00", closedDaysInfo: "無休" },
  { id: "ebisu-57", name: "THE NEW NORMAL", address: "東京都渋谷区恵比寿南2-3-13 山燃ビル2F", lat: 35.645611, lng: 139.707306, smokingInfo: "全席禁煙", seatCountInfo: "26席", hoursInfo: "月木金土日祝11:30〜23:30(L.O.フード22:30/ドリンク23:00)、火水11:30〜23:00(L.O.フード22:00/ドリンク22:30)", closedDaysInfo: "基本無休" },
  { id: "ebisu-58", name: "京橋千疋屋 アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿3F", lat: 35.64697871, lng: 139.70983926, smokingInfo: "全席禁煙", seatCountInfo: "44席", hoursInfo: "10:00〜21:00(パーラーL.O.20:30)", closedDaysInfo: "無休(アトレ恵比寿全館休館日を除く)" },
  // 2026年8月、追加調査で確認した恵比寿駅周辺の実在店舗(ebisu-59以降)。
  // 座標は住所からの推定値。出典が単一のブログ・まとめ記事のみの店舗は
  // 電源/Wi-Fi/喫煙等の項目を推測で埋めず住所のみ掲載としている。
  { id: "ebisu-59", name: "麻布珈琲 恵比寿館", address: "東京都渋谷区恵比寿1-11-3 アキックスエビスビル1F・2F", lat: 35.646591, lng: 139.711731, hoursInfo: "9:00〜24:00" },
  { id: "ebisu-60", name: "カルフール", address: "東京都渋谷区恵比寿4-6-1 恵比寿MFビルB1", lat: 35.646111, lng: 139.712433, hoursInfo: "平日9:00〜21:00、土10:00〜20:00、日10:00〜19:00" },
  { id: "ebisu-61", name: "Cafe&Bar BASHI", address: "東京都渋谷区東3-16-6 リキッドルーム2F", lat: 35.649357, lng: 139.71077, hoursInfo: "カフェ8:00〜16:00、バー16:00〜LAST" },
  { id: "ebisu-62", name: "シーシャ・水タバコ カフェ&バー PukuPuku 恵比寿店", address: "東京都渋谷区恵比寿西1-10-8 本間ビルB1F", lat: 35.646515, lng: 139.707748, outletInfo: "カウンター席に電源あり", smokingInfo: "シーシャ提供店のため喫煙可", hoursInfo: "18:00〜翌5:00" },
  { id: "ebisu-63", name: "COFFEE HERE!", address: "東京都渋谷区恵比寿西1-3-8 吉田ビル3F", lat: 35.648678, lng: 139.708344 },
  { id: "ebisu-64", name: "Spice&Cafe FamFam", address: "東京都渋谷区代官山町9-10 SodaCCoビル2 T01", lat: 35.651814, lng: 139.704651, wifiInfo: "無料Wi-Fiあり", hoursInfo: "月〜土・祝前日11:00〜22:00、日・祝11:00〜18:00" },
  { id: "ebisu-65", name: "CAF'E MID STAMP EBISU", address: "東京都渋谷区恵比寿南1-20-3 パインハイツ4F", lat: 35.643768, lng: 139.710541, outletInfo: "Wi-Fi・電源席あり", hoursInfo: "12:00〜23:00(L.O.22:00)", closedDaysInfo: "火曜定休" },
  { id: "ebisu-66", name: "ジャパニーズアイス櫻花", address: "東京都渋谷区恵比寿1-6-7 animo ebisu 1F", lat: 35.647766, lng: 139.710831 },
  { id: "ebisu-67", name: "フルーツ アンド シーズン", address: "東京都渋谷区恵比寿西1-10-1 クリーンパレス1F", lat: 35.647125, lng: 139.707718, hoursInfo: "11:00〜20:00(売り切れ次第終了)", closedDaysInfo: "月曜定休" },
  { id: "ebisu-68", name: "JOE TALK COFFEE", address: "東京都渋谷区東3-16-10 三浦ビル1F", lat: 35.648857, lng: 139.710815 },
  { id: "ebisu-69", name: "INARI TEA", address: "東京都渋谷区恵比寿1-5-2 こうげつビル101", lat: 35.647537, lng: 139.711212 },
  { id: "ebisu-70", name: "アンティコ カフェ アルアビス アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-5-5 アトレ恵比寿1F", lat: 35.647175, lng: 139.709305 },
  { id: "ebisu-71", name: "薬膳&米粉カフェ やまのひつじ", address: "東京都渋谷区恵比寿西1-26-2", lat: 35.647884, lng: 139.705963 },
  { id: "ebisu-72", name: "NEW YORK CAFE", address: "東京都渋谷区恵比寿南1-8-4 オクミヤビル2F", lat: 35.646023, lng: 139.709183 },
  { id: "ebisu-73", name: "Tsunami Ebisu TOKYO", address: "東京都渋谷区恵比寿1-22-3 シルバープラザ恵比寿1F", lat: 35.646423, lng: 139.713013 },
  { id: "ebisu-74", name: "シェイクシャック アトレ恵比寿店", address: "東京都渋谷区恵比寿南1-6-1 アトレ恵比寿西館1F", lat: 35.646698, lng: 139.709763, smokingInfo: "全席禁煙" },
  { id: "ebisu-75", name: "ハース", address: "東京都渋谷区恵比寿西1-15-8 SUN恵比寿1F・B1F", lat: 35.648163, lng: 139.707321 },
  { id: "ebisu-76", name: "JANAI COFFEE", address: "東京都渋谷区恵比寿南2-3-13 山燃ビルB1F", lat: 35.645611, lng: 139.707306, hoursInfo: "18:00〜24:00" },
  { id: "ebisu-77", name: "Cafe and Shisha Bar Yellow", address: "東京都渋谷区恵比寿南1-8-9 第一黄色いビル4F", lat: 35.646122, lng: 139.708969 },
  { id: "ebisu-78", name: "シロノニワ", address: "東京都渋谷区恵比寿南1-6-1 アトレ恵比寿西館8F", lat: 35.646698, lng: 139.709763 },
  { id: "ebisu-79", name: "マディソン ニューヨーク キッチン", address: "東京都渋谷区恵比寿南2-3-14 キュープラザ恵比寿南1F", lat: 35.64566, lng: 139.707458 },
  { id: "ebisu-80", name: "パラドール", address: "東京都渋谷区恵比寿南2-3-1 パイザ恵比寿ビル2F", lat: 35.645679, lng: 139.707779 },
  { id: "ebisu-81", name: "Franky Hotel", address: "東京都渋谷区恵比寿南1-17-17 タイムゾーンテラスビル5F", lat: 35.644863, lng: 139.710449 },
  { id: "ebisu-82", name: "バーガーマニア 恵比寿店", address: "東京都渋谷区恵比寿4-9-5 マンションニュー恵比寿1F", lat: 35.646034, lng: 139.713226 },
  { id: "ebisu-83", name: "WE ARE THE FARM EBISU", address: "東京都渋谷区恵比寿西2-8-10 ORIX恵比寿西ビル1F", lat: 35.649368, lng: 139.707489 },
  { id: "ebisu-84", name: "マーサー ビス エビス", address: "東京都渋谷区恵比寿1-26-17 阿部ビル", lat: 35.647198, lng: 139.715622 },
  { id: "ebisu-85", name: "ブルーボトルコーヒー 恵比寿カフェ", address: "東京都渋谷区恵比寿南1-5-5", lat: 35.647175, lng: 139.709305, wifiInfo: "Wi-Fiなし", seatCountInfo: "21席", hoursInfo: "8:00〜21:00" },
  { id: "ebisu-86", name: "宮越屋珈琲 恵比寿店", address: "東京都渋谷区恵比寿4-20-7 恵比寿ガーデンプレイス センタープラザB1", lat: 35.6428737, lng: 139.7140696, hoursInfo: "10:00〜22:00" },
  { id: "ebisu-87", name: "EBISU CLASS COFFEE", address: "東京都渋谷区恵比寿西1-3-2 恵比寿テラスビル2F", lat: 35.648994, lng: 139.708618, seatCountInfo: "15席", hoursInfo: "カフェ12:00〜19:00(L.O.18:00〜18:30)、バー20:00〜深夜", closedDaysInfo: "年中無休" },
  { id: "ebisu-88", name: "ever green cafe restaurant EBISU", address: "東京都渋谷区恵比寿1-26-1 第一公園内", lat: 35.64727, lng: 139.715271 },
  { id: "ebisu-89", name: "A MOMENT 恵比寿", address: "東京都渋谷区恵比寿南1-23-1 ABC亜米利加橋ビル3F", lat: 35.643436, lng: 139.711685 },
  { id: "ebisu-90", name: "フロムトップ", address: "東京都目黒区三田1-13-3 恵比寿ガーデンプレイス 東京都写真美術館1F", lat: 35.642181, lng: 139.715027 },
  { id: "ebisu-91", name: "Two shisha cafe & bar 恵比寿店", address: "東京都渋谷区恵比寿西1-12-12 ルネスE.B.I 2階", lat: 35.647438, lng: 139.70723, smokingInfo: "全席喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "40席", hoursInfo: "17:00〜翌5:00", closedDaysInfo: "不定休" },
];
