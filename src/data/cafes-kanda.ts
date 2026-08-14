import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は国土地理院の住所検索APIで解決した街区(番地)レベルの地点です
// (2026-08-14に全件更新)。建物単位ではないため、同じ番地の店は同じ点に
// なります。それ以前は住所からの大まかな推定で、実測で中央値174mずれて
// いました。経路・写真検索は店名+住所のテキストでGoogleマップに渡して
// いるため、座標が多少ずれていても案内自体は正確です。
// 秋葉原エリア(cafes-akihabara.ts)と重複する店舗（ガスト秋葉原駅前店・バーミヤン
// アトレ秋葉原2店・デニーズ秋葉原中央口店・ジョナサン秋葉原駅前店・
// フレッシュネスバーガー神田須田町店・Cafe&bar sampo）は重複ピンを避けるため除外。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認・閉店】新規項目を追加せず既存情報のままにしてある:
// - kanda-18(喫茶室ルノアール 神田南口駅前店): 2023年6月頃閉店、食べログに
//   「【閉店】」表記あり
// - kanda-19(喫茶室ルノアール 神田北口駅前店): 食べログに「【閉店】」表記あり
// - kanda-34(ほぉーバル): 2020年12月28日閉店
// - kanda-37(Terrace8890): 2024年8月末日閉店
// - kanda-41(米本珈琲 神田店): 食べログに「【閉店】このお店は現在閉店してお
//   ります」と明記
// - kanda-45(WIRED CAFE NEWS日本橋店): 食べログに閉店表記あり、運営元Cafe
//   Company公式サイトの現行店舗一覧にも記載なし
//
// 【要確認・不明】
// - kanda-15(カフェ・ベローチェ 神田美土代町店): 食べログは閉店表記だが
//   エキテンでは営業中と表示、情報源が矛盾しており確認できず
// - kanda-46(カフェ＆グリル Crescent Cafe 三越前): 食べログで「掲載保留」
//   (運営状況確認できず)、店舗独自サイトも404エラー
export const cafes: Cafe[] = [
  { id: "kanda-02", name: "スターバックス コーヒー 神田駅前店", address: "東京都千代田区神田鍛冶町3-2 神田サンミビル", lat: 35.693409, lng: 139.771225, outletInfo: "電源席は1階と2階のカウンター席にあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(STARBUCKS docomo Wi2 300)", seatCountInfo: "約70席", hoursInfo: "月〜木6:30〜22:00、金6:30〜22:30、土日祝8:00〜21:00", closedDaysInfo: "不定休" },
  { id: "kanda-03", name: "スターバックス コーヒー 神田駅南口店", address: "東京都千代田区鍛冶町2-13-1 JR神田駅南改札口外", lat: 35.69072, lng: 139.770676, outletInfo: "コンセント付き席21席、全席の半数以上に電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(STARBUCKS docomo Wi2 300)", seatCountInfo: "約20席", hoursInfo: "月〜金7:00〜21:30、土日祝8:00〜20:00", closedDaysInfo: "不定休" },
  { id: "kanda-04", name: "スターバックス コーヒー 神田小川町2丁目店", address: "東京都千代田区神田小川町2-5-5 紀陽東京ビル1F", lat: 35.694206, lng: 139.763412, outletInfo: "入口すぐの長テーブル8席のみ電源あり、他は無し", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(Starbucks Wi-Fi/docomo/Softbank/Wi2 300)", seatCountInfo: "約50〜58席", hoursInfo: "月〜金7:00〜22:00、土日祝8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "kanda-06", name: "ドトールコーヒーショップ 神田中央通り店", address: "東京都千代田区鍛冶町2-6-1", lat: 35.691917, lng: 139.771942, outletInfo: "カウンター席に電源あり、充電しやすい", smokingInfo: "喫煙ブース(紙・加熱)完全分煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全99席", hoursInfo: "平日6:30〜21:00、土曜7:30〜20:00、日祝7:30〜19:00" },
  { id: "kanda-07", name: "ドトールコーヒーショップ 神田南口店", address: "東京都中央区日本橋本石町4-6-7 日本橋日銀通りビル", lat: 35.689507, lng: 139.771042, outletInfo: "電源は仕切り席・窓際カウンター・喫煙室の4カ所のみ", smokingInfo: "喫煙席(加熱)・喫煙ブース(紙・加熱)あり、完全分煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全100席(禁煙84・喫煙16)", hoursInfo: "平日6:30〜21:00、土曜8:00〜19:00、日祝8:00〜18:00" },
  { id: "kanda-08", name: "ドトールコーヒーショップ 神田淡路町店", address: "東京都千代田区神田須田町1-2-1 カルフール神田", lat: 35.695206, lng: 139.767776, outletInfo: "コンセントなし、Wi-Fiのみ利用可", smokingInfo: "喫煙席(加熱)・喫煙ブース(紙・加熱)あり、完全分煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全34席(禁煙30・喫煙4)", hoursInfo: "月〜金7:00〜21:00、土7:30〜19:00、日祝8:00〜19:00" },
  { id: "kanda-09", name: "タリーズコーヒー 神田スクエア店", address: "東京都千代田区神田錦町2-2-1 神田スクエア1F", lat: 35.693214, lng: 139.763214, outletInfo: "客席に電源を用意、充電しやすい店舗", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(Tully's Wi-Fi、店内Wi-Fi・電源完備)", hoursInfo: "平日7:00〜20:00、土日10:00〜19:00" },
  { id: "kanda-10", name: "タリーズコーヒー 神田橋本郷通り店", address: "東京都千代田区内神田1-2-8", lat: 35.69075, lng: 139.76474, smokingInfo: "全席禁煙(テラス席のみ喫煙可)", wifiInfo: "無料Tully's Wi-Fiあり", seatCountInfo: "全41席", hoursInfo: "平日7:00〜21:00、土日は休業(営業なし)", closedDaysInfo: "土曜・日曜定休(平日のみ営業)" },
  { id: "kanda-12", name: "エクセルシオール カフェ 神田小川町店", address: "東京都千代田区神田小川町1-5-1", lat: 35.694424, lng: 139.765564, outletInfo: "交差点側カウンターに電源席が複数あり", smokingInfo: "完全分煙(客席は全席禁煙、紙たばこ・加熱式たばこ専用の喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全89席", hoursInfo: "平日6:45〜21:00、土曜8:00〜20:00、日祝8:00〜20:00" },
  { id: "kanda-13", name: "カフェ・ベローチェ 神田駅北口店", address: "東京都千代田区内神田3-22-7 AN内神田ビル1F", lat: 35.692749, lng: 139.770157, outletInfo: "窓側カウンター席にコンセントあり", smokingInfo: "全席禁煙・喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全80席(カウンター席・テーブル席、1階40席・2階40席)", hoursInfo: "平日6:45〜21:00、土日祝7:00〜19:00" },
  { id: "kanda-14", name: "カフェ・ベローチェ 鍛冶町店", address: "東京都千代田区鍛冶町1-8-3 神田91ビル1F", lat: 35.690914, lng: 139.772415, outletInfo: "全席にコンセント設置、Free-WiFiも利用可", smokingInfo: "客席は全席禁煙、加熱式たばこ専用喫煙室・喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり(+veloce_free_wifi、docomo/SoftBank Wi-Fiスポット対応)", hoursInfo: "平日6:45〜22:00、土日祝7:00〜21:00" },
  { id: "kanda-15", name: "カフェ・ベローチェ 神田美土代町店", address: "東京都千代田区内神田1-15-10 SC内神田ビル1F", lat: 35.692284, lng: 139.765656, outletInfo: "客席にコンセントあり、口コミでも好評" },
  { id: "kanda-16", name: "PRONTO 神田店", address: "東京都千代田区鍛冶町2-1-6 第2櫻井ビル", lat: 35.691364, lng: 139.771194, smokingInfo: "分煙(禁煙席/加熱式たばこ専用席/喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "全217席", hoursInfo: "平日7:00〜23:00(カフェ7:00〜17:00、バー17:00〜23:00)、土曜8:00〜22:30、日曜8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "kanda-17", name: "PRONTO 神田グランドセントラルホテル店", address: "東京都千代田区神田司町2-2", lat: 35.692726, lng: 139.767853, outletInfo: "中央大テーブルとベンチ席付近に電源あり", smokingInfo: "分煙(禁煙席/加熱式たばこ専用席/喫煙ブースあり)", seatCountInfo: "全81席", hoursInfo: "平日6:45〜22:30、土日6:45〜10:00(モーニングのみ営業)", closedDaysInfo: "不定休" },
  { id: "kanda-18", name: "喫茶室ルノアール 神田南口駅前店", address: "東京都千代田区鍛冶町2-1-4 東和ビル2F", lat: 35.691124, lng: 139.771057, outletInfo: "テーブルにコンセントあり、PC・Wi-Fi利用可" },
  { id: "kanda-19", name: "喫茶室ルノアール 神田北口駅前店", address: "東京都千代田区内神田3-21-8 神田駅北口合同ビル2F", lat: 35.692669, lng: 139.770767 },
  { id: "kanda-20", name: "喫茶室ルノアール 神田淡路町店", address: "東京都千代田区神田小川町1-1 山甚ビルB1F", lat: 35.694908, lng: 139.766891, outletInfo: "電源・Wi-Fiなし、静かな喫煙可の空間", smokingInfo: "全席喫煙可(禁煙席なし)", seatCountInfo: "全120席", hoursInfo: "平日(月〜金)7:30〜19:50、土曜・祝日10:00〜17:50、日曜定休", closedDaysInfo: "日曜定休(年末年始12/30〜1/4も休業)" },
  { id: "kanda-22", name: "サイゼリヤ お茶の水駅前店", address: "東京都千代田区神田駿河台2-1-19", lat: 35.699497, lng: 139.762421, hoursInfo: "7:00〜0:00(公式サイト表記)", closedDaysInfo: "無休" },
  { id: "kanda-23", name: "Cafe&Bar TerraCotta", address: "東京都千代田区内神田3-18-6 藤田ビルB1", lat: 35.692291, lng: 139.77037, smokingInfo: "分煙(加熱式たばこ限定、全席電子タバコのみ可、24時以降は紙タバコ可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全33席(カウンター9・テーブル16・ソファ8)", hoursInfo: "月〜土11:00〜翌7:00(日曜・祝日は貸切のみ)", closedDaysInfo: "日曜・祝日定休(通常営業なし、貸切のみ可)" },
  { id: "kanda-24", name: "Cafe PON", address: "東京都千代田区神田鍛冶町3-6-4", lat: 35.694111, lng: 139.771072, smokingInfo: "全席喫煙可(専用喫煙室なし)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "総席数15席", hoursInfo: "11:00〜23:00", closedDaysInfo: "火曜定休" },
  { id: "kanda-25", name: "淡路町カフェ カプチェット・ロッソ", address: "東京都千代田区神田淡路町2-1 クオリア御茶ノ水1F", lat: 35.696259, lng: 139.767242, outletInfo: "3階の広めのスペースに電源あり", smokingInfo: "全席禁煙(店舗入口付近に喫煙スペースあり)", wifiInfo: "Wi-Fiあり", seatCountInfo: "26席(立食は最大40名まで対応可)", hoursInfo: "月・土・日・祝11:30〜18:00(L.O.17:30)、火〜金・祝前日11:30〜21:00(L.O.20:30)", closedDaysInfo: "不定休" },
  { id: "kanda-26", name: "COMFORT Stand KANDA", address: "東京都千代田区鍛冶町2-7-14", lat: 35.692211, lng: 139.772034, smokingInfo: "分煙", hoursInfo: "月〜金9:00〜17:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-27", name: "Poru", address: "東京都千代田区神田西福田町4-5", lat: 35.69133, lng: 139.774109, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "14席", hoursInfo: "9:00〜17:00" },
  { id: "kanda-28", name: "アシストコーヒーロースタリー", address: "東京都千代田区岩本町1-1-4 サンサイド岩本町ビル1F", lat: 35.691319, lng: 139.775604, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "15席", hoursInfo: "月・火・水・木・金・土11:30〜17:00", closedDaysInfo: "日曜定休" },
  { id: "kanda-29", name: "サロンクリスティ", address: "東京都千代田区神田多町2-2", lat: 35.693542, lng: 139.769714, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(電源も完備)", seatCountInfo: "全32席(最大32名着席/40名立食)", hoursInfo: "平日11:00〜14:30(L.O.14:00)、16:00〜21:00(L.O.20:00)", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-30", name: "swimy", address: "東京都千代田区鍛冶町1-4-6 東京神田ビル3F", lat: 35.689724, lng: 139.770889, outletInfo: "Wi-Fiと電源完備、作業利用も可", smokingInfo: "喫煙可(2020年4月1日より加熱式たばこ限定)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全19席(カウンター4席+テーブル15席、最大22名着席/30名立食)", hoursInfo: "平日12:00〜翌4:30(料理L.O.翌3:00、ドリンクL.O.翌4:00)、土14:00〜翌4:30(同L.O.)、日祝14:00〜24:00(料理L.O.23:00、ドリンクL.O.23:30)", closedDaysInfo: "年中無休" },
  { id: "kanda-31", name: "Connect-Lounge神田", address: "東京都千代田区神田多町2-1 神田東山ビル7F/8F", lat: 35.693218, lng: 139.769333, wifiInfo: "高速インターネット(有線/無線)完備、会員料金に含まれる", seatCountInfo: "フリーデスク82席+個室ブース12室(7F/8Fの2フロア)", hoursInfo: "月額会員は24時間365日利用可。ドロップイン(非会員)は平日9:00〜17:40(最終受付17:00)", closedDaysInfo: "会員は年中無休(24時間365日)。コンシェルジュ対応・受付は休止日あり" },
  { id: "kanda-32", name: "アクセアカフェ神田店", address: "東京都千代田区神田須田町1-16-5 ヒューリック神田ビル1F", lat: 35.695324, lng: 139.770599, outletInfo: "全席電源完備のコワーキングカフェ", wifiInfo: "フリーWi-Fiあり", seatCountInfo: "全28席(カウンター2席、個別テーブル6席、ハイバックソファ3席、ソファ12席、個室ワークブース5室)", hoursInfo: "平日24時間営業(月曜朝8:00〜土曜19:00まで休まず営業)、日祝10:00〜19:00。22:00〜翌6:00はBizSPOTアプリ本人確認済み利用者のみ", closedDaysInfo: "年中無休(定休日なし)" },
  { id: "kanda-33", name: "ビジネスエアポート神田", address: "東京都千代田区神田鍛冶町3-4 oak神田鍛冶町7F", lat: 35.693726, lng: 139.77121, outletInfo: "会員制シェアオフィスで電源利用込み", smokingInfo: "喫煙スペースあり", wifiInfo: "Wi-Fi完備(会員料金に含まれる)", hoursInfo: "シェアワークプレイス: 平日8:00〜20:00(受付9:00〜18:00)、土曜10:00〜18:00。サービスオフィスは全日24時間入退室可能", closedDaysInfo: "日曜・祝日・年末年始・当館指定日は休館" },
  { id: "kanda-34", name: "ほぉーバル", address: "東京都千代田区鍛冶町2-13-1 神田駅南改札内", lat: 35.69072, lng: 139.770676 },
  { id: "kanda-35", name: "BIZ SMART 神田富山町", address: "東京都千代田区神田富山町7", lat: 35.693672, lng: 139.77359, outletInfo: "24席に電源とWi-Fi完備", wifiInfo: "有線・無線LAN回線完備", hoursInfo: "コワーキングスペース: 平日8:00〜22:00(1Day利用は平日9:00〜20:00)。事務窓口(コンシェルジュ)は平日9:00〜18:00", closedDaysInfo: "土曜・日曜・祝日定休(サービスオフィスは24時間365日、夏季・年末年始・設備点検日は休館あり)" },
  { id: "kanda-36", name: "BIZ SMART 神田", address: "東京都千代田区鍛冶町1-10-6", lat: 35.690479, lng: 139.773132, outletInfo: "各席に電源完備、コピー機等も併設", wifiInfo: "有線・無線LAN回線完備", hoursInfo: "コワーキングスペース: 平日8:00〜22:00(1Day利用は平日9:00〜20:00)。事務窓口は平日9:00〜18:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-37", name: "Terrace8890", address: "東京都千代田区神田淡路町2-101", lat: 35.697632, lng: 139.766876, outletInfo: "中央テーブル10席に6口の電源あり" },
  { id: "kanda-38", name: "上島珈琲店 御茶ノ水ワテラス店", address: "東京都千代田区神田淡路町2-105 ワテラスアネックス1F", lat: 35.697571, lng: 139.768066, outletInfo: "51席中、電源利用可能席あり", smokingInfo: "分煙(禁煙38席・喫煙13席)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "51席", hoursInfo: "平日7:30〜22:00、土日祝8:00〜22:00", closedDaysInfo: "不定休" },
  { id: "kanda-39", name: "挽きたてプレス珈琲 TeeTime", address: "東京都千代田区内神田3-10-5 満留賀ビル2F", lat: 35.691467, lng: 139.769119, outletInfo: "窓側の一人用カウンター席に電源あり", smokingInfo: "店内禁煙(近隣に喫煙所あり)", seatCountInfo: "23席(カウンター7席、テーブル16席)", hoursInfo: "平日8:00〜(お客様ホールアウトまで)、土曜10:00〜18:00", closedDaysInfo: "日曜・祝日定休" },
  { id: "kanda-40", name: "COLAZIONE VARIO", address: "東京都千代田区内神田2-3-7 栗原ビル1F", lat: 35.689636, lng: 139.767868, outletInfo: "一部の席に電源あり、口コミでも好評", smokingInfo: "全席喫煙可(屋外に喫煙スペースあり)", wifiInfo: "Wi-Fiあり", seatCountInfo: "32席", hoursInfo: "月〜金12:00〜15:00、17:00〜22:00(L.O.21:00)", closedDaysInfo: "土日祝定休" },
  { id: "kanda-41", name: "米本珈琲 神田店", address: "東京都千代田区神田錦町2-1-8", lat: 35.692371, lng: 139.763367, outletInfo: "電源・Wi-Fi完備、全31席" },
  { id: "kanda-42", name: "KANDA LOUNGE", address: "東京都千代田区鍛冶町2-12-12 2F", lat: 35.692772, lng: 139.771683, smokingInfo: "喫煙ルームあり(作業エリアとは別)", wifiInfo: "無線LAN(Wi-Fi)あり(要パスワード)", seatCountInfo: "90席", hoursInfo: "9:00〜19:00", closedDaysInfo: "日曜・祝日定休" },
  { id: "kanda-43", name: "神田珈琲園 神田駅北口店", address: "東京都千代田区鍛冶町2-13-12", lat: 35.692123, lng: 139.770782, outletInfo: "コンセントあり、作業利用にも便利", smokingInfo: "分煙(1階全席禁煙、2階全席喫煙)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "21席(1F：4人卓×6、カウンター×2)", hoursInfo: "平日7:00〜21:00、土曜8:00〜18:00、日曜9:00〜18:00" },
  { id: "kanda-44", name: "ムロマチカフェ ハチ", address: "東京都中央区日本橋室町4-4-10 東短室町ビルB1F", lat: 35.688862, lng: 139.773315, outletInfo: "電源・Wi-Fi完備で作業利用しやすい", smokingInfo: "全席禁煙", seatCountInfo: "120席(立食含む最大収容、着席は最大50席程度)", hoursInfo: "平日・祝前日7:00〜22:00(L.O.フード21:00、ドリンク21:30)、土・祝11:00〜20:00(L.O.19:00)", closedDaysInfo: "日曜定休" },
  { id: "kanda-45", name: "WIRED CAFE NEWS日本橋店", address: "東京都中央区日本橋室町2-1-1 日本橋三井タワー2F", lat: 35.686001, lng: 139.772644, outletInfo: "電源利用可能、分煙対応" },
  { id: "kanda-46", name: "カフェ＆グリル Crescent Cafe 三越前", address: "東京都中央区日本橋本町4-2-1", lat: 35.689388, lng: 139.773422, outletInfo: "コンセントあり、Wi-Fiも完備" },
  // 以下、2026年8月に追加調査した47件目以降。店名・住所はウェブ検索・食べログ等で
  // 実在確認済み。座標は住所から推定した目安地点。確認できなかった項目(電源/Wi-Fi/
  // 喫煙/席数/営業時間/定休日)は空欄のまま(推測では埋めていない)。神田須田町の
  // 住所は秋葉原エリア(cafes-akihabara.ts)の担当のため対象外とした。
  { id: "kanda-47", name: "星乃珈琲店 神田店", address: "東京都千代田区鍛冶町2-1-3 保志場ビル2F", lat: 35.690987, lng: 139.770981, smokingInfo: "分煙(客席は禁煙、喫煙ブースあり)", hoursInfo: "月〜金7:00〜22:00、土8:00〜22:00、日・祝8:00〜19:30", closedDaysInfo: "無休" },
  { id: "kanda-48", name: "サンマルクカフェ 神田西口駅前店", address: "東京都千代田区内神田3-12-10", lat: 35.691242, lng: 139.770279 },
  { id: "kanda-49", name: "モスバーガー 神田北口店", address: "東京都千代田区内神田3-22-7", lat: 35.692749, lng: 139.770157, hoursInfo: "平日7:00〜22:00、土日祝10:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "kanda-50", name: "フレッシュネスバーガー 神田鍛冶町店", address: "東京都千代田区鍛冶町1-8-2 スズトミビル1・2F", lat: 35.690865, lng: 139.772263 },
  { id: "kanda-51", name: "斎藤コーヒー店 内神田店", address: "東京都千代田区内神田3-9-3 森元ビル1F", lat: 35.690941, lng: 139.769073, hoursInfo: "平日7:30〜18:30、土曜11:30〜17:30", closedDaysInfo: "日曜・祝日・年末年始定休" },
  { id: "kanda-52", name: "ポワン エ リーニュ 神田スクエア店", address: "東京都千代田区神田錦町2-2-1 KANDA SQUARE 1F", lat: 35.693214, lng: 139.763214, outletInfo: "電源あり", smokingInfo: "全席禁煙(館内に喫煙室あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "34席(ペット可テラス16席含む)", hoursInfo: "11:00〜19:00(ランチ11:00〜14:00、カフェ14:00〜18:00)", closedDaysInfo: "年末年始を除き年中無休" },
  { id: "kanda-53", name: "Lovers", address: "東京都千代田区神田鍛冶町1-3-8 神田南口ビルB1F", lat: 35.693611, lng: 139.770981, outletInfo: "電源あり", smokingInfo: "全席喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "20席(テーブル8・カウンター12)", hoursInfo: "月7:30〜17:00、火〜金7:30〜17:00・18:00〜24:00(L.O.23:30)", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-54", name: "AKENO CONNECT", address: "東京都千代田区神田多町2-9-20 CELESTIA 1F", lat: 35.693966, lng: 139.768631, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "8席(最大10名)", hoursInfo: "火〜金15:00〜23:00(L.O.22:00)、土15:00〜21:00(L.O.20:00)", closedDaysInfo: "月曜・日曜・祝日定休" },
  { id: "kanda-55", name: "AirsBURGER CAFE", address: "東京都千代田区神田岩本町1-12 坂田ビル1F", lat: 35.69606, lng: 139.774963, smokingInfo: "全席禁煙", seatCountInfo: "11席(カウンター5・2名テーブル3卓)", hoursInfo: "月〜土11:30〜15:00(L.O.14:20)・17:00〜22:00(L.O.21:20)、日・祝11:30〜16:00(L.O.15:00)・17:00〜21:00(L.O.20:20)", closedDaysInfo: "夏季・年末年始休業あり" },
  { id: "kanda-56", name: "Café Bleu Montagne", address: "東京都千代田区鍛冶町1-8-8 神田鍛冶町ビル", lat: 35.691139, lng: 139.773178, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "20席", hoursInfo: "平日8:00〜20:00(L.O.19:30)", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-57", name: "やなか珈琲店 神田店", address: "東京都千代田区神田淡路町1-1", lat: 35.695511, lng: 139.767044, smokingInfo: "全席禁煙", seatCountInfo: "10席(カウンター)", hoursInfo: "平日10:00〜20:00、土日11:00〜19:00" },
  { id: "kanda-58", name: "カフェ珈琲館 内神田店", address: "東京都千代田区内神田2-15-4", lat: 35.691734, lng: 139.767685, seatCountInfo: "38席", hoursInfo: "平日8:00〜19:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-59", name: "DILL Coffee Parlor", address: "東京都千代田区神田錦町2-4-6 ワダビル1・2F", lat: 35.693901, lng: 139.763351, outletInfo: "電源あり", smokingInfo: "全席禁煙", seatCountInfo: "40席(1階20席・2階20席)", hoursInfo: "8:00〜20:00" },
  { id: "kanda-60", name: "イトウコーヒー店", address: "東京都千代田区神田錦町3-8 ランドステージお茶の水1F", lat: 35.693272, lng: 139.762115, smokingInfo: "全席禁煙" },
  { id: "kanda-61", name: "司", address: "東京都千代田区岩本町3-9-12", lat: 35.696114, lng: 139.777039, smokingInfo: "全席喫煙可" },
  { id: "kanda-62", name: "Coffee House LOFT", address: "東京都千代田区内神田3-2-10", lat: 35.689495, lng: 139.768982, smokingInfo: "全席喫煙可(2023年2月時点)", seatCountInfo: "38席(カウンター4・テーブル34)", hoursInfo: "平日7:00〜16:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-63", name: "BROS TOKYO 神田岩本町店", address: "東京都千代田区岩本町2-16-10 1F", lat: 35.694965, lng: 139.778366, hoursInfo: "平日11:00〜17:00", closedDaysInfo: "土曜・日曜定休" },
  { id: "kanda-64", name: "GOODMAN TOKYO", address: "東京都千代田区神田錦町2-1-8 竹橋ビル1F", lat: 35.692371, lng: 139.763367, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日8:00〜17:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-65", name: "ソーシャル グッド ロースターズ 千代田", address: "東京都千代田区神田錦町1-14-13 LANDPOOL KANDA TERRACE 2F", lat: 35.693806, lng: 139.764252, smokingInfo: "全席禁煙", hoursInfo: "平日10:00〜18:00、土曜11:00〜17:00", closedDaysInfo: "日曜定休" },
  { id: "kanda-66", name: "single O kanda awaji", address: "東京都千代田区神田淡路町2-101 ワテラスタワー3F", lat: 35.697632, lng: 139.766876, hoursInfo: "8:00〜19:00", closedDaysInfo: "年中無休" },
  { id: "kanda-67", name: "タリーズコーヒー 淡路町靖国通り店", address: "東京都千代田区神田淡路町1-1-1", lat: 35.695511, lng: 139.767044, outletInfo: "各席に電源あり", smokingInfo: "全席禁煙", seatCountInfo: "58席", hoursInfo: "平日7:00〜21:00、土日8:00〜20:00" },
  { id: "kanda-68", name: "Coquette", address: "東京都千代田区神田多町2-8-14", lat: 35.694981, lng: 139.769119, hoursInfo: "水〜土11:00〜19:00", closedDaysInfo: "月曜・火曜・日曜定休" },
  { id: "kanda-69", name: "think coffee", address: "東京都千代田区神田錦町2-9-15 神田SDGsコネクション1F", lat: 35.691303, lng: 139.762848, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "58席(1〜2階カフェ、6階は子供専用スペース)", hoursInfo: "8:00〜19:00" },
  { id: "kanda-70", name: "ONCA COFFEE 神田店", address: "東京都千代田区神田錦町3-1 安田シーケンスタワー1F", lat: 35.692589, lng: 139.761765, wifiInfo: "無料Wi-Fiあり", seatCountInfo: "22席", hoursInfo: "平日9:00〜17:00", closedDaysInfo: "土曜・日曜・祝日・年末年始定休" },
  { id: "kanda-71", name: "馬亞車 神田店", address: "東京都千代田区内神田2-2-1", lat: 35.689606, lng: 139.767609, smokingInfo: "全席禁煙", hoursInfo: "平日7:00〜17:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-72", name: "ムラタヤ珈琲店", address: "東京都千代田区神田小川町1-7 神田小川町ハイツ1F", lat: 35.694077, lng: 139.765594, seatCountInfo: "4席", hoursInfo: "月・水〜金8:00〜19:00、火8:00〜18:30、土11:30〜17:00", closedDaysInfo: "日曜定休" },
  { id: "kanda-73", name: "ブレス(Cafe & Bar BLESS)", address: "東京都千代田区鍛冶町1-10-1 よこいビル1F", lat: 35.690178, lng: 139.772491, smokingInfo: "分煙(1階禁煙・地下1階喫煙可)", hoursInfo: "平日7:30〜翌2:00(モーニング7:30〜12:00、ランチ12:00〜17:30、バー17:30〜翌2:00)、土日17:30〜翌2:00", closedDaysInfo: "不定休" },
  { id: "kanda-74", name: "RAILWAY STATION", address: "東京都千代田区鍛冶町2-13-8 ルークス神田B", lat: 35.691566, lng: 139.770554, outletInfo: "電源あり", smokingInfo: "分煙(喫煙所完備)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "120席", hoursInfo: "月〜土16:00〜23:00(L.O.22:00)", closedDaysInfo: "日曜定休" },
  { id: "kanda-75", name: "ドトールコーヒーショップ 神田小川町店", address: "東京都千代田区神田小川町2-2 センタークレストビル1F", lat: 35.694706, lng: 139.764847, outletInfo: "電源あり", smokingInfo: "分煙(禁煙59席・喫煙10席)", seatCountInfo: "69席(禁煙59・喫煙10)", hoursInfo: "平日6:45〜21:00、土日祝8:00〜20:00" },
  { id: "kanda-76", name: "豆香房 神田錦町店", address: "東京都千代田区神田錦町1-12-9 アーク錦町ビル", lat: 35.693584, lng: 139.76413, smokingInfo: "全席禁煙", hoursInfo: "平日7:30〜18:30、土曜12:00〜17:00", closedDaysInfo: "日曜・祝日定休" },
  { id: "kanda-77", name: "豆香房 神田西口店", address: "東京都千代田区内神田1-12-12 美土代ビル1F", lat: 35.691391, lng: 139.765915, smokingInfo: "全席禁煙", wifiInfo: "無料・有料Wi-Fiあり", seatCountInfo: "37席(カウンター15・テーブル22)", hoursInfo: "平日7:00〜18:00、土曜12:00〜16:30", closedDaysInfo: "日曜・祝日定休" },
  { id: "kanda-78", name: "珈琲館 神田北口店", address: "東京都千代田区鍛冶町2-10-11 リョービイマジクスビル1F", lat: 35.693546, lng: 139.772263, seatCountInfo: "44席", hoursInfo: "平日7:30〜19:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-79", name: "カフェ メリア", address: "東京都千代田区神田錦町2-4 上田ビル1F", lat: 35.693901, lng: 139.763351, smokingInfo: "全席喫煙可", hoursInfo: "平日10:00〜18:00、土曜10:00〜17:00、日曜12:00〜17:00", closedDaysInfo: "祝日定休" },
  { id: "kanda-80", name: "かんだデザート", address: "東京都千代田区鍛冶町2-11-20 JR高架下A3ビル1F", lat: 35.693638, lng: 139.771988, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "5席(カウンターのみ)", hoursInfo: "平日12:00〜20:00、土曜14:00〜20:00", closedDaysInfo: "日曜・祝日定休" },
  { id: "kanda-81", name: "茶釜コーヒーカフェ トップ", address: "東京都千代田区神田多町2-9-4", lat: 35.693966, lng: 139.768631 },
  { id: "kanda-82", name: "カフェ ビィオット", address: "東京都千代田区神田美倉町1", lat: 35.69104, lng: 139.774216, smokingInfo: "全席禁煙", seatCountInfo: "42席(カウンター8・テーブル34)", hoursInfo: "平日7:00〜19:00(L.O.18:00)、土曜10:00〜17:00(L.O.16:00)", closedDaysInfo: "日曜・祝日定休" },
  { id: "kanda-83", name: "Walkabout Coffee", address: "東京都千代田区神田錦町2-5-16 名古路ビル新館1F", lat: 35.692017, lng: 139.76268, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "20席(窓側カウンター4席含む)", hoursInfo: "平日7:00〜19:00、土日祝8:00〜18:00" },
  { id: "kanda-84", name: "モリンガカフェ 神田店", address: "東京都千代田区内神田3-21-6 森山ビル2F", lat: 35.692856, lng: 139.770615, smokingInfo: "全席禁煙", seatCountInfo: "10席", hoursInfo: "平日11:00〜17:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-85", name: "nono coffee 神田店", address: "東京都千代田区内神田3-11-1", lat: 35.691097, lng: 139.769806 },
  { id: "kanda-86", name: "ロックカフェ イワタ楽器", address: "東京都千代田区鍛冶町2-9-4 ラカンダビルB1F", lat: 35.693024, lng: 139.771851, smokingInfo: "全席喫煙可", seatCountInfo: "15席" },
  { id: "kanda-87", name: "THE LAST SMOKERS 神田店", address: "東京都千代田区内神田1-18-2 MIWAビル1F", lat: 35.691395, lng: 139.766937, outletInfo: "電源あり", smokingInfo: "全席喫煙可", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "18席", hoursInfo: "平日11:00〜20:00", closedDaysInfo: "土曜・日曜・祝日定休" },
  { id: "kanda-88", name: "高架画廊 カフェスペース 無題", address: "東京都千代田区鍛冶町2-11-17", lat: 35.693989, lng: 139.772141, hoursInfo: "月・水〜土11:00〜21:00", closedDaysInfo: "火曜・日曜・祝日定休" },
  { id: "kanda-89", name: "茶 一条", address: "東京都千代田区神田小川町1-11 相葉ビル1F", lat: 35.694466, lng: 139.766907, smokingInfo: "全席禁煙", hoursInfo: "12:00〜19:00(店主在店時のみ営業)" },
  { id: "kanda-90", name: "My Charaful Cafe", address: "東京都千代田区神田淡路町1-4-1 友泉淡路町ビルB1F", lat: 35.695992, lng: 139.7677, smokingInfo: "全席禁煙", closedDaysInfo: "完全予約制" },
  { id: "kanda-91", name: "大喜利カフェボケルバ", address: "東京都千代田区岩本町3-7-11 神田KSビル3F", lat: 35.696098, lng: 139.777878, outletInfo: "電源あり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "32席(ソファ席あり)", hoursInfo: "13:00〜18:00、18:00〜23:00", closedDaysInfo: "不定休" },
  { id: "kanda-92", name: "Craft Shelter", address: "東京都千代田区神田淡路町1-21-4", lat: 35.695724, lng: 139.765671, smokingInfo: "全席禁煙", seatCountInfo: "12席", hoursInfo: "月〜木17:00〜24:00", closedDaysInfo: "金曜・土曜・日曜定休" },
  { id: "kanda-93", name: "equinox", address: "東京都千代田区内神田3-21-6 森山ビル1F", lat: 35.692856, lng: 139.770615, outletInfo: "電源あり", seatCountInfo: "13席(カウンター7席含む)", hoursInfo: "月〜土14:00〜24:00", closedDaysInfo: "日曜定休" },
  { id: "kanda-94", name: "WANTOK", address: "東京都千代田区鍛冶町1-2-10", lat: 35.690369, lng: 139.770508, smokingInfo: "全席禁煙", seatCountInfo: "4席", hoursInfo: "平日8:00〜21:00、祝日8:00〜17:00", closedDaysInfo: "土曜・日曜定休" },
  { id: "kanda-95", name: "SUNNY'S CAFE", address: "東京都千代田区神田小川町2-6-3 東英小川町ビル1F", lat: 35.695225, lng: 139.763611, hoursInfo: "平日8:30〜17:30", closedDaysInfo: "土曜・日曜定休" },
  { id: "kanda-96", name: "カフェ・ベローチェ 岩本町店", address: "東京都千代田区岩本町3-9-17 スリーセブンビル1F", lat: 35.695698, lng: 139.776978, smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "90席", hoursInfo: "平日7:00〜21:00、土曜7:00〜20:00、日祝8:00〜20:00" },
];
