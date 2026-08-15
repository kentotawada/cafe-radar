import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は国土地理院の住所検索APIで解決した街区(番地)レベルの地点です
// (2026-08-14に全件更新)。建物単位ではないため、同じ番地の店は同じ点に
// なります。それ以前は住所からの大まかな推定で、実測で中央値174mずれて
// いました。経路・写真検索は店名+住所のテキストでGoogleマップに渡して
// いるため、座標が多少ずれていても案内自体は正確です。
//
// 【削除した店舗】2026-08-13
// 五反田東急スクエア4Fの2軒を削除した。どちらもGoogleマップで閉業。
//   - gotanda-42 マイニチパスタ
//   - gotanda-50 Sign gotanda
// この2軒は住所も座標も完全に同一だった。同じ区画に別々の店として
// 両方を載せていたのは調査時点の見落としで、実際には入れ替わっていた
// 可能性が高い。同一住所・同一座標の組み合わせは、以後こうした
// 取りこぼしを疑う手がかりにする。
// 同じ建物ではスターバックス五反田東急スクエア店(5F, gotanda-02)が
// 営業中のため、建物ごと消してはいない。
//
// 【現地確認】2026-08-14 — 五反田で4軒を実際に訪問し、2軒が閉店だった
//   - gotanda-30 マジョルカ … 閉店。削除
//   - メゾンカイザー五反田店(gotanda-66) … 営業中だがイートインの席が無く、
//     作業目的では使えない。削除はせず seatCountInfo に事実を記載した
// 同日、大崎側でも ティーハウス マユール 五反田店(osaki-27)が閉店を確認。
// 4軒中2軒という割合は、他エリアにも同程度の閉店が混ざっている可能性を
// 示す。特にチェーン以外の個人店は入れ替わりが速い。
export const cafes: Cafe[] = [
  { id: "gotanda-01", name: "マクドナルド アトレ五反田店", address: "東京都品川区東五反田1-26-14 アトレ五反田 2F・3F", lat: 35.626205, lng: 139.723297, outletInfo: "3F窓際カウンター26席、各席に電源コンセントあり" },
  { id: "gotanda-02", name: "スターバックス コーヒー 五反田東急スクエア店", address: "東京都品川区東五反田2-1-2 五反田東急スクエア 5F", lat: 35.625713, lng: 139.724411, outletInfo: "レジ前カウンター席に電源、混雑時は取りにくい" },
  { id: "gotanda-03", name: "スターバックス コーヒー 西五反田店", address: "東京都品川区西五反田1-18-1 ゴタンダ エクス 1F", lat: 35.623718, lng: 139.722961, outletInfo: "1F窓側カウンター席に充電用コンセントあり" },
  { id: "gotanda-04", name: "ドトールコーヒーショップ 都営五反田店", address: "東京都品川区東五反田1-26-2", lat: 35.626339, lng: 139.723907, outletInfo: "電源コンセントは使えない店舗" },
  { id: "gotanda-05", name: "ドトールコーヒーショップ 五反田駅前店", address: "東京都品川区東五反田5-27-5", lat: 35.626976, lng: 139.723602, outletInfo: "電源コンセントが使える店舗" },
  { id: "gotanda-06", name: "ドトールコーヒーショップ 五反田桜田通り店", address: "東京都品川区西五反田1-30-2 ウィン五反田ビル 1F・2F", lat: 35.624878, lng: 139.721985, outletInfo: "2F窓際に電源席多数、ソファ席にも完備" },
  { id: "gotanda-07", name: "エクセルシオール カフェ 五反田東口店", address: "東京都品川区東五反田1-13-10 さくらビル 1F・2F", lat: 35.626568, lng: 139.724365, outletInfo: "店内にコンセント完備、Wi-Fiはなし" },
  { id: "gotanda-08", name: "エクセルシオール カフェ 五反田TOC店", address: "東京都品川区西五反田7-22-17 TOCビル 1F", lat: 35.62190399, lng: 139.71932062, outletInfo: "コンセントあり、Wi-Fiも利用可" },
  { id: "gotanda-09", name: "エクセルシオール カフェ 大崎シンクパーク店", address: "東京都品川区大崎2-1-1 ThinkPark Tower 2F", lat: 35.6185906, lng: 139.7274497, outletInfo: "大テーブル席とカウンター席に電源あり" },
  { id: "gotanda-10", name: "カフェ・ベローチェ 西五反田七丁目店", address: "東京都品川区西五反田7-9-2 KDX五反田ビル 1F", lat: 35.623779, lng: 139.720703, outletInfo: "コンセントありだが見当たらないとの口コミも" },
  { id: "gotanda-12", name: "タリーズコーヒー 五反田西店", address: "東京都品川区西五反田7-9-4", lat: 35.623539, lng: 139.720627, outletInfo: "禁煙席の端の席ならコンセントありとの口コミ" },
  { id: "gotanda-13", name: "タリーズコーヒー 五反田JPビルディング店", address: "東京都品川区西五反田8-4-13", lat: 35.6225234, lng: 139.7219722, outletInfo: "窓側の席に電源コンセントあり" },
  { id: "gotanda-14", name: "PRONTO 五反田西口店", address: "東京都品川区西五反田1-7-1 五反田プラグマGタワー 1F", lat: 35.625332, lng: 139.723969 },
  { id: "gotanda-15", name: "PRONTO IL BAR アトレ五反田店", address: "東京都品川区東五反田1-26-3 アトレ五反田2", lat: 35.626221, lng: 139.723984, outletInfo: "カウンター席で充電可能との口コミ" },
  { id: "gotanda-16", name: "珈琲茶館 集 五反田東口店", address: "東京都品川区東五反田5-27-6 第一五反田ビル 2F", lat: 35.626926, lng: 139.72348, outletInfo: "全席に電源あり、3時間1オーダー制" },
  { id: "gotanda-17", name: "珈琲茶館 集 五反田西口店", address: "東京都品川区西五反田1-5-2 トラヤビル 2F", lat: 35.625572, lng: 139.723572, outletInfo: "全席に電源あり、Wi-Fiと充電器貸出も" },
  { id: "gotanda-18", name: "神乃珈琲 五反田駅前店", address: "東京都品川区西五反田1-5-2 トラヤビル 1F", lat: 35.625572, lng: 139.723572, outletInfo: "コンセントもWi-Fiもなしとの口コミ" },
  { id: "gotanda-19", name: "サイゼリヤ 五反田西口店", address: "東京都品川区西五反田1-11-1 アイオス五反田駅前 2F", lat: 35.624599, lng: 139.723541 },
  { id: "gotanda-20", name: "デニーズ ThinkPark店", address: "東京都品川区大崎2-1-1 Think Park Tower 1F", lat: 35.6184351, lng: 139.7275663, outletInfo: "店内にコンセントあり、充電可能" },
  { id: "gotanda-21", name: "フレッシュネスバーガー 東五反田店", address: "東京都品川区東五反田1-11-7 三ッ星ビル", lat: 35.627068, lng: 139.725632, outletInfo: "公式サイトにコンセントありと記載" },
  { id: "gotanda-22", name: "モスバーガー 大崎店", address: "東京都品川区大崎2-1-1 ThinkPark Plaza 2F", lat: 35.6184879, lng: 139.727608, outletInfo: "窓際カウンター6席+手前10席に電源あり" },
  { id: "gotanda-23", name: "ウェンディーズ・ファーストキッチン 五反田東口店", address: "東京都品川区東五反田1-13-12 営和五反田ビル", lat: 35.626823, lng: 139.724442, outletInfo: "窓際カウンターに電源とUSB、21口設置" },
  { id: "gotanda-24", name: "WIRED CAFE Dining Lounge アトレヴィ五反田店", address: "東京都品川区東五反田1-26-14 アトレヴィ五反田 2F", lat: 35.626205, lng: 139.723297, outletInfo: "無料電源・無料Wi-Fi完備" },
  { id: "gotanda-25", name: "カフェオレトーキョーヨル", address: "東京都品川区東五反田1-13-3 加藤ビル 3F", lat: 35.626648, lng: 139.724808 },
  { id: "gotanda-26", name: "MOBaCAFE", address: "東京都品川区東五反田2-3-2 タイセイビル 1F", lat: 35.62561, lng: 139.725922, outletInfo: "全席に電源、コンセント+USBポートも", webMeetingInfo: "有料のWEB会議スペースがあるとの口コミが複数あり(Googleマップ、2026年8月時点)" },
  { id: "gotanda-27", name: "TONER", address: "東京都品川区西五反田3-8-3 町原ビル 1F", lat: 35.626705, lng: 139.717773, outletInfo: "カウンター周りのみ電源コンセントあり" },
  { id: "gotanda-28", name: "Times CAFÉ", address: "東京都品川区西五反田2-20-4 パーク24グループ本社ビル 2F", lat: 35.625961, lng: 139.722061, outletInfo: "電源とUSBポート付きの席あり" },
  { id: "gotanda-29", name: "カフェ ビアンコ", address: "東京都品川区西五反田2-9-7 ドルミ五反田アンメゾン 1F", lat: 35.626808, lng: 139.721085 },
  { id: "gotanda-31", name: "星乃珈琲店 五反田店", address: "東京都品川区東五反田1-21-5 2F", lat: 35.626003, lng: 139.726471, outletInfo: "コンセント・Wi-Fiともになしとの情報" },
  { id: "gotanda-32", name: "カフェ トゥジュール デビュテ", address: "東京都品川区東五反田5-27-12 扇寿ビル B1", lat: 35.627064, lng: 139.72374 },
  { id: "gotanda-33", name: "gicca 池田山", address: "東京都品川区東五反田5-1-1 OURA BLDG", lat: 35.632252, lng: 139.720932 },
  { id: "gotanda-34", name: "OMOカフェ&バル(OMO5東京五反田 by 星野リゾート)", address: "東京都品川区西五反田8-4-13 14F", lat: 35.623024, lng: 139.722321, outletInfo: "OMOベースにコンセント付きテーブル席" },
  { id: "gotanda-35", name: "SUNAO COFFEE", address: "東京都品川区西五反田7-19-3 POINT NO.39 1F", lat: 35.623871, lng: 139.718735 },
  { id: "gotanda-36", name: "BASECAMP.MEGURO", address: "東京都品川区西五反田3-1-7 オークビル 1F", lat: 35.630234, lng: 139.716995 },
  { id: "gotanda-37", name: "喫茶 白夜", address: "東京都品川区西五反田2-26-7 加賀屋ビル 2F", lat: 35.624931, lng: 139.720245 },
  { id: "gotanda-38", name: "usubane store", address: "東京都品川区東五反田3-17-21 ダモビル 1F", lat: 35.626221, lng: 139.728119, outletInfo: "電源あり、Wi-Fiも利用可能" },
  { id: "gotanda-39", name: "SAISON bakery&coffee", address: "東京都品川区東五反田2-8-3 五反田ASビル 1F", lat: 35.624973, lng: 139.725403, outletInfo: "Wi-Fi・電源あり、作業向きではとの声も" },
  { id: "gotanda-40", name: "東京豆漿生活", address: "東京都品川区西五反田1-20-3 MKYビル 1F", lat: 35.623093, lng: 139.723755 },
  { id: "gotanda-41", name: "Bread&Coffee IKEDAYAMA 五反田駅前店", address: "東京都品川区西五反田1-2-10 CIRCLES五反田 1F", lat: 35.625889, lng: 139.722748 },
  { id: "gotanda-43", name: "デスタン", address: "東京都品川区西五反田2-11-11", lat: 35.627022, lng: 139.720474 },
  { id: "gotanda-44", name: "EL TRES", address: "東京都品川区東五反田2-9-11 さくらてらす五反田", lat: 35.624344, lng: 139.726685 },
  { id: "gotanda-45", name: "フォレスト", address: "東京都品川区西五反田1-32-3 DAIビル 2F", lat: 35.624222, lng: 139.721848 },
  { id: "gotanda-46", name: "アクセアカフェ五反田店", address: "東京都品川区西五反田1-24-4 タキゲンビル 1F/2F", lat: 35.6236, lng: 139.722443, outletInfo: "全席電源あり、24時間営業のコワーキング" },
  { id: "gotanda-47", name: "HONEYCOMB COFFEE", address: "東京都品川区大崎3-15-23 鈴木ビル 1F", lat: 35.618809, lng: 139.722473, outletInfo: "ほぼ全席とベンチ席にコンセントあり" },
  { id: "gotanda-48", name: "カフェテラス ミモザ", address: "東京都品川区西五反田3-8-3 町原ビル", lat: 35.626705, lng: 139.717773, outletInfo: "壁側席の両端、ソファ下に電源あり" },
  { id: "gotanda-49", name: "CARROLL", address: "東京都品川区東五反田1-26-3 アトレ五反田2 3F", lat: 35.626221, lng: 139.723984, smokingInfo: "全席禁煙", hoursInfo: "6:30〜23:00" },
  { id: "gotanda-51", name: "ケンタッキーフライドチキン 五反田店", address: "東京都品川区東五反田5-27-6 第一五反田ビル", lat: 35.626926, lng: 139.72348, outletInfo: "入口付近カウンター6席・奥壁際カウンター6席に各1口、奥窓際カウンターは2席に1口" },
  { id: "gotanda-52", name: "デニーズ 五反田TOCビル店", address: "東京都品川区西五反田7-22-17 TOCビル", lat: 35.621418, lng: 139.719604 },
  { id: "gotanda-53", name: "ガスト 目黒不動前店", address: "東京都品川区西五反田5-9-2", lat: 35.625656, lng: 139.714737, smokingInfo: "禁煙(すかいらーくグループ全店禁煙方針)", hoursInfo: "7:00〜23:00" },
  { id: "gotanda-54", name: "Bar&Cafe Orphée", address: "東京都品川区西五反田2-5-8 野津ビル 2F", lat: 35.62672, lng: 139.722641, hoursInfo: "カフェタイム平日10:00〜17:00、バータイム19:00〜", closedDaysInfo: "年中無休" },
  { id: "gotanda-55", name: "A.KIRA Cafe", address: "東京都品川区東五反田1-18-14 2F", lat: 35.626835, lng: 139.725906 },
  { id: "gotanda-56", name: "Think food LOTUS CAFE", address: "東京都品川区西五反田7-3-7 TSTJハウス 1F", lat: 35.62418, lng: 139.718781, smokingInfo: "禁煙" },
  { id: "gotanda-57", name: "Masyuko's Buffalo Cafe", address: "東京都品川区西五反田2-30-10", lat: 35.624714, lng: 139.719818, hoursInfo: "火〜金18:00〜22:00、土11:30〜15:00・18:00〜22:00", closedDaysInfo: "日・月・祝定休" },
  { id: "gotanda-58", name: "ハワイアンカフェ マハロ MAHALO", address: "東京都品川区西五反田7-22-17 TOCビル B1F", lat: 35.621418, lng: 139.719604, closedDaysInfo: "火曜定休" },
  { id: "gotanda-59", name: "EARTH CAFE", address: "東京都品川区東五反田5-22-33 TK池田山ビル 1F", lat: 35.627953, lng: 139.722229, wifiInfo: "無料Wi-Fiあり", smokingInfo: "全席禁煙", hoursInfo: "月・水〜日11:00〜21:00(L.O.20:00)", closedDaysInfo: "火曜定休" },
  { id: "gotanda-60", name: "Le Café Perfumes", address: "東京都品川区東五反田4-7-29 NKビル 1F", lat: 35.629871, lng: 139.726959, hoursInfo: "11:30〜15:00(L.O.14:00)・17:30〜22:00(L.O.21:00)" },
  { id: "gotanda-61", name: "ChocoLapin", address: "東京都品川区西五反田4-28-14", lat: 35.625038, lng: 139.712204, smokingInfo: "禁煙", hoursInfo: "水〜日12:00〜18:00", closedDaysInfo: "月・火定休" },
  { id: "gotanda-62", name: "SpecialtyCoffee AMAMERIA 五反田食堂店", address: "東京都品川区西五反田8-4-13 五反田JPビルディング 1F", lat: 35.623024, lng: 139.722321 },
  { id: "gotanda-63", name: "it's so you coffee", address: "東京都品川区西五反田2-14-13 1F", lat: 35.626354, lng: 139.71965, hoursInfo: "火〜金8:30〜16:00、土・祝8:30〜17:00", closedDaysInfo: "日・月定休" },
  { id: "gotanda-64", name: "Koti", address: "東京都品川区東五反田2-3-2 IM五反田ビル 3F", lat: 35.62561, lng: 139.725922, hoursInfo: "10:00〜17:00", closedDaysInfo: "水・土・日定休" },
  { id: "gotanda-65", name: "Kua Aina 五反田店", address: "東京都品川区西五反田1-26-7 カノウビル 1F", lat: 35.624012, lng: 139.722687 },
  { id: "gotanda-66", name: "メゾンカイザー 五反田店", address: "東京都品川区東五反田2-10-1 パークタワーグランスカイ 1F", lat: 35.62422088, lng: 139.72726955, seatCountInfo: "イートインの座席なし(2026年8月、現地で確認)", hoursInfo: "7:00〜20:00" },
  { id: "gotanda-67", name: "ゲンロンカフェ", address: "東京都品川区西五反田1-11-9 司ビル 6F", lat: 35.62439, lng: 139.723282 },
  { id: "gotanda-68", name: "Coffee Stand M", address: "東京都品川区東五反田1-18-6", lat: 35.626534, lng: 139.726761 },
  { id: "gotanda-69", name: "コーヒーポスト", address: "東京都品川区西五反田1-22-4", lat: 35.623035, lng: 139.723038 },
  { id: "gotanda-70", name: "快活CLUB 五反田駅東口店", address: "東京都品川区東五反田1-16-4 MINAMIビル 6F", lat: 35.626652, lng: 139.725449 },
  { id: "gotanda-71", name: "Bakerys", address: "東京都品川区西五反田8-5-1 グリーンプラザ五反田", lat: 35.62207, lng: 139.721588 },
  { id: "gotanda-72", name: "池田山 garden café COFFEE SHOP", address: "東京都品川区東五反田5-9-22 NTT東日本関東病院 2F", lat: 35.63055, lng: 139.726303, wifiInfo: "無料Wi-Fiあり", smokingInfo: "全席禁煙", hoursInfo: "月〜金9:00〜15:00", closedDaysInfo: "土日祝定休" },
  { id: "gotanda-73", name: "サブウェイ 五反田西口店", address: "東京都品川区西五反田1-4-2 秀和五反田駅前レジデンス 101", lat: 35.6253516, lng: 139.7233614 },
];
