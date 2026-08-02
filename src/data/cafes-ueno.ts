import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年7月時点、各公式サイト・食べログ等）。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
//
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoは2026年8月、
// 各チェーンの公式店舗ページ・食べログ等で個別に確認して追加した。確認できな
// かった項目は空欄のままにしている(推測では埋めていない)。
//
// 【要確認・閉店】ueno-35(PRONTO 上野広小路店): 食べログ【閉店】表示。
// 新規項目を追加せず既存情報のままにしてある。
//
// 【要確認・営業状況不明】ueno-30(マクドナルド 上野中通り店): 食べログは
// 同住所の旧店名を閉店表示、別サイトは現店名で営業中と案内(店名変更の可能性)。
// ueno-41(アメ横ダンケ): 食べログが「掲載保留」(営業状況未確認)。どちらも
// 閉店の確証はないため情報は残したが、公開前の実地確認を推奨。
export const cafes: Cafe[] = [
  { id: "ueno-01", name: "スターバックス コーヒー パルコヤ上野店", address: "東京都台東区上野3-24-6 パルコヤ 5階", lat: 35.7091, lng: 139.7745, outletInfo: "カウンター席のみ電源コンセント利用可", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "40席", hoursInfo: "10:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ueno-02", name: "スターバックス コーヒー JR上野駅 入谷改札前店", address: "東京都台東区上野7-1-1 上野駅構内3階入谷口改札外", lat: 35.7137, lng: 139.7775, outletInfo: "カウンター3席のみ充電用コンセントあり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "31席", hoursInfo: "7:00〜21:00", closedDaysInfo: "不定休" },
  { id: "ueno-03", name: "スターバックス コーヒー 上野恩賜公園店", address: "東京都台東区上野公園8-22", lat: 35.7156, lng: 139.7745, outletInfo: "壁側に電源コンセント4口ありとの情報", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "全140席(店内71席・テラス69席)", hoursInfo: "8:00〜21:00", closedDaysInfo: "不定休" },
  { id: "ueno-04", name: "スターバックス コーヒー エキュート上野 公園口店", address: "東京都台東区上野7-1-1 エキュート上野", lat: 35.7139, lng: 139.7768, outletInfo: "平日は大テーブルで電源利用可、土日は不可", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜木8:00〜20:00、金8:00〜21:00、土日祝8:00〜20:00", closedDaysInfo: "不定休" },
  { id: "ueno-05", name: "スターバックス コーヒー アトレ上野店", address: "東京都台東区上野7-1-1 アトレ上野 1F", lat: 35.7133, lng: 139.7771, outletInfo: "中央大テーブル16席に電源、常に満席気味", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "110席", hoursInfo: "7:00〜23:00", closedDaysInfo: "不定休" },
  { id: "ueno-06", name: "スターバックス コーヒー 上野マルイ店", address: "東京都台東区上野6-15-1 上野マルイ B1F", lat: 35.7113, lng: 139.7758, outletInfo: "カウンター席のみ電源コンセントあり", smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", seatCountInfo: "60席", hoursInfo: "7:00〜22:30", closedDaysInfo: "不定休" },
  { id: "ueno-07", name: "ドトールコーヒーショップ 上野浅草通り店", address: "東京都台東区東上野4-2-3 上野パークビル1F・2F", lat: 35.7115, lng: 139.7810, outletInfo: "1F禁煙窓側席に電源あり、数は少なめ", smokingInfo: "全席禁煙(91席)、加熱式・紙巻対応の喫煙ブースを別途設置", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "91席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜20:00(L.O.19:30)、土曜8:00〜20:00(L.O.19:30)、日祝8:00〜20:00(L.O.19:30)" },
  { id: "ueno-08", name: "ドトールコーヒーショップ アトレ上野店", address: "東京都台東区上野7-1-1 アトレ上野", lat: 35.7133, lng: 139.7771, outletInfo: "カウンター各席に電源コンセント完備", smokingInfo: "全席禁煙(63席)、加熱式・紙巻対応の喫煙ブースを別途設置", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "63席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "6:45〜22:30(L.O.22:00)" },
  { id: "ueno-09", name: "ドトールコーヒーショップ 上野昭和通り店", address: "東京都台東区東上野2-18-6 常磐ビル1F", lat: 35.7095, lng: 139.7795, outletInfo: "電源コンセント設置なしとの情報", smokingInfo: "分煙(禁煙37席・喫煙5席)", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "42席(禁煙37席・喫煙5席)", hoursInfo: "7:00〜20:00" },
  { id: "ueno-10", name: "ドトールコーヒーショップ 上野御徒町中央通り店", address: "東京都台東区上野6-13-6", lat: 35.7100, lng: 139.7757, outletInfo: "電源コンセント完備のカウンター・テーブル席", smokingInfo: "分煙(禁煙49席・喫煙11席)", wifiInfo: "無料Wi-Fiあり(DOUTOR FREE Wi-Fi)", seatCountInfo: "60席(禁煙49席・喫煙11席)", hoursInfo: "平日7:00〜21:00、土日祝8:00〜21:00" },
  { id: "ueno-11", name: "タリーズコーヒー 上野御徒町店", address: "東京都台東区上野5-25-11", lat: 35.7083, lng: 139.7757, outletInfo: "カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(tullys_Wi-Fi)", seatCountInfo: "30席", hoursInfo: "7:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "ueno-12", name: "タリーズコーヒー 上野の森さくらテラス店", address: "東京都台東区上野公園1-54 上野の森さくらテラス1F", lat: 35.7164, lng: 139.7739, outletInfo: "カウンター席のみ電源利用可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(tullys_Wi-Fi)", hoursInfo: "月〜土7:00〜23:00、日7:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "ueno-13", name: "PRONTO 東上野店", address: "東京都台東区東上野2-21-11 上野ターミナルホテル", lat: 35.7100, lng: 139.7800, smokingInfo: "全席禁煙、喫煙ブースあり", seatCountInfo: "71席", hoursInfo: "月〜金7:00〜17:29/17:30〜23:00、土7:00〜17:29/17:30〜22:00、日8:00〜18:00", closedDaysInfo: "年中無休" },
  { id: "ueno-14", name: "カフェ・ベローチェ 上野三丁目店", address: "東京都台東区上野3-17-7 G-SQUARE上野 1F", lat: 35.7096, lng: 139.7749, outletInfo: "2F禁煙奥カウンターに電源9口あり", smokingInfo: "全席禁煙、喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり(Free-WiFi)", hoursInfo: "7:00〜21:00" },
  { id: "ueno-15", name: "コメダ珈琲店 上野広小路店", address: "東京都台東区上野2-6-12 上野東洋ビル2F", lat: 35.7072, lng: 139.7743, outletInfo: "カウンター・一部テーブルに2口コンセント", smokingInfo: "全席禁煙、喫煙専用室(飲食不可)あり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "79席", hoursInfo: "7:00〜23:00(L.O.22:30)", closedDaysInfo: "年中無休" },
  { id: "ueno-16", name: "サンマルクカフェ Echikafit上野店", address: "東京都台東区東上野3-19-6 Echikafit上野 B1F", lat: 35.7113, lng: 139.7793, outletInfo: "カウンター全席にAC・USBコンセント完備", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "103席", hoursInfo: "平日7:00〜22:00、土日祝7:00〜21:00", closedDaysInfo: "年中無休" },
  { id: "ueno-17", name: "サンマルクカフェ 上野広小路店", address: "東京都台東区上野4-5-8", lat: 35.7104, lng: 139.7752, outletInfo: "カウンター席で電源コンセント利用可", smokingInfo: "全席禁煙、喫煙ブースあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "91席", hoursInfo: "7:30〜22:00", closedDaysInfo: "年中無休" },
  { id: "ueno-18", name: "上島珈琲店 東上野店", address: "東京都台東区東上野3-19-6", lat: 35.7113, lng: 139.7793, outletInfo: "電源コンセントあり、Wi-Fiも利用可", smokingInfo: "分煙(禁煙38席・加熱式たばこ専用8席)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "46席(禁煙38席、加熱式たばこ専用8席)", hoursInfo: "平日7:00〜20:00、土日祝8:00〜20:00", closedDaysInfo: "年中無休" },
  { id: "ueno-19", name: "上島珈琲店 黒田記念館店", address: "東京都台東区上野公園12-53 黒田記念館別館1・2F", lat: 35.7186, lng: 139.7737, outletInfo: "電源コンセント10箇所設置", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "54席(1F11席・2F43席)", hoursInfo: "7:30〜19:00", closedDaysInfo: "不定休" },
  { id: "ueno-20", name: "珈琲 王城", address: "東京都台東区上野6-8-15", lat: 35.7106, lng: 139.7767, outletInfo: "電源コンセントなし", smokingInfo: "全席禁煙", seatCountInfo: "52席、90分制", hoursInfo: "8:00〜19:00(L.O.料理18:00、ドリンク18:30)", closedDaysInfo: "無休" },
  { id: "ueno-21", name: "喫茶 古城", address: "東京都台東区東上野3-39-10 光和ビルB1", lat: 35.7118, lng: 139.7799, outletInfo: "2階席にコンセントありとの口コミ", smokingInfo: "全席喫煙可(喫煙目的店)", seatCountInfo: "69席", hoursInfo: "月〜土9:00〜20:00", closedDaysInfo: "日曜日" },
  { id: "ueno-22", name: "喫茶 丘", address: "東京都台東区上野6-5-4 尾中ビルB1F", lat: 35.7115, lng: 139.7762, smokingInfo: "全席禁煙", seatCountInfo: "34席", hoursInfo: "火〜金10:00〜16:00、土日祝10:30〜17:00", closedDaysInfo: "月曜日(祝日の場合は翌日休)" },
  { id: "ueno-23", name: "Coffee Shop ギャラン", address: "東京都台東区上野6-14-4 2階", lat: 35.7108, lng: 139.7773, smokingInfo: "全席喫煙可(「煙の少ない席もあります」)", seatCountInfo: "約100席(個人利用は約75席)", hoursInfo: "8:00〜22:30(L.O.22:00)" },
  { id: "ueno-24", name: "喫茶室ルノアール 上野しのばず口店", address: "東京都台東区上野4-10-7 タツミビルB1F", lat: 35.7100, lng: 139.7748, outletInfo: "壁側の席にまんべんなく電源あり", smokingInfo: "分煙(禁煙54席・加熱式たばこ専用喫煙29席、紙巻き専用ブースあり)", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "全83席(禁煙54・加熱式喫煙29)", hoursInfo: "8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "ueno-25", name: "喫茶室ルノアール 京成上野駅前店", address: "東京都台東区上野2-14-31 上野レイクサイドビル2F", lat: 35.7124, lng: 139.7737, outletInfo: "入口左奥の席にコンセントありと口コミ", smokingInfo: "分煙(禁煙60席・加熱式たばこ専用喫煙26席、紙巻き専用ブースあり)", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi)", seatCountInfo: "全86席(禁煙60・加熱式喫煙26)", hoursInfo: "8:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "ueno-26", name: "カフェ・ド・クリエ 御徒町駅南口店", address: "東京都台東区上野3-22-4 MOTビル1・2階", lat: 35.7085, lng: 139.7752, outletInfo: "コンセント付きの席が多数、Wi-Fiも完備", smokingInfo: "分煙(加熱式たばこ専用喫煙室あり)", wifiInfo: "無料Wi-Fiあり(Free-WiFi)", seatCountInfo: "85席", hoursInfo: "平日7:00〜21:00、土日祝8:00〜21:00" },
  { id: "ueno-27", name: "カフェ・ド・クリエ 御徒町店", address: "東京都台東区上野5-23-13", lat: 35.7082, lng: 139.7758, outletInfo: "壁側カウンター全席に電源コンセント付", smokingInfo: "分煙(1階禁煙、加熱式たばこ専用喫煙室あり)", wifiInfo: "無料Wi-Fiあり(Free-WiFi)", seatCountInfo: "110席(1階・2階)", hoursInfo: "月〜木7:00〜21:00、金〜日8:00〜20:00" },
  { id: "ueno-28", name: "麻布茶房 アトレ上野店", address: "東京都台東区上野7-1-1 アトレ上野レトロ館2F", lat: 35.7133, lng: 139.7772, smokingInfo: "全席禁煙", seatCountInfo: "49席", hoursInfo: "11:00〜22:30(L.O.21:30)", closedDaysInfo: "アトレ上野の営業日に準ずる" },
  { id: "ueno-29", name: "マクドナルド 上野御徒町店", address: "東京都台東区上野4-4-6 B&Vビル", lat: 35.7079, lng: 139.7745, outletInfo: "AC電源なし、2-3Fカウンターのみ USB充電可", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "130席", hoursInfo: "24時間営業(平日朝マック5:00〜10:30)", closedDaysInfo: "無休(24時間営業)" },
  { id: "ueno-30", name: "マクドナルド 上野中通り店", address: "東京都台東区上野4-3-10", lat: 35.7081, lng: 139.7748, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "103席", hoursInfo: "24時間営業", closedDaysInfo: "無休(24時間営業)" },
  { id: "ueno-31", name: "マクドナルド 稲荷町駅前店", address: "東京都台東区東上野3-33-11 吉川ビルディング", lat: 35.7099, lng: 139.7825, outletInfo: "2Fカウンター3席に電源コンセントあり", smokingInfo: "全店舗禁煙(2014年〜チェーン方針)", wifiInfo: "無料Wi-Fiあり(FREE WiFi)", seatCountInfo: "70席", hoursInfo: "6:30〜24:00(平日・土日祝共通)" },
  { id: "ueno-32", name: "ガスト 上野広小路店", address: "東京都台東区上野4-4-4 広小路2000ビルB1", lat: 35.7082, lng: 139.7746, outletInfo: "テーブル間に電源コンセントあり", smokingInfo: "全席禁煙(敷地内全面禁煙、すかいらーくグループ方針)", wifiInfo: "無料Wi-Fiあり(すかいらーくグループ共通)", seatCountInfo: "88席", hoursInfo: "7:00〜翌5:00", closedDaysInfo: "年中無休" },
  { id: "ueno-33", name: "ジョナサン 御徒町店", address: "東京都台東区上野5-10-21", lat: 35.7068, lng: 139.7757, outletInfo: "各席に電源コンセントあり", smokingInfo: "全席禁煙(敷地内全面禁煙、すかいらーくグループ方針)", wifiInfo: "無料Wi-Fiあり(すかいらーくグループ共通)", seatCountInfo: "114席", hoursInfo: "7:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "ueno-34", name: "星乃珈琲店 上野店", address: "東京都台東区上野2-12-1 セントラル21ビル2F", lat: 35.7108, lng: 139.7738, smokingInfo: "全席禁煙", seatCountInfo: "80席", hoursInfo: "9:00〜22:00(L.O.21:30)", closedDaysInfo: "年中無休" },
  { id: "ueno-35", name: "PRONTO 上野広小路店", address: "東京都文京区湯島3-40-7", lat: 35.7077, lng: 139.7712 },
  { id: "ueno-36", name: "ドトールコーヒーショップ 御徒町南口店", address: "東京都台東区上野5-20-6", lat: 35.7062, lng: 139.7758, outletInfo: "電源コンセントなし、Wi-Fiもなし", smokingInfo: "全席禁煙(47席)、喫煙ブースあり", seatCountInfo: "47席(全席禁煙、別途喫煙ブース)", hoursInfo: "平日・土7:30〜21:00、日祝8:00〜20:00" },
  { id: "ueno-37", name: "ドトールコーヒーショップ 御徒町昭和通り店", address: "東京都台東区上野6-6-1", lat: 35.7057, lng: 139.7778, outletInfo: "電源・Wi-Fiともになし", smokingInfo: "全席禁煙(59席)、喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "59席(全席禁煙、別途喫煙ブース)", hoursInfo: "平日6:45〜20:30、土日祝8:00〜20:30", closedDaysInfo: "不定休" },
  { id: "ueno-38", name: "ドトールコーヒーショップ 仲御徒町店", address: "東京都台東区上野5-15-15", lat: 35.7071, lng: 139.7768, outletInfo: "電源コンセント利用可", smokingInfo: "禁煙43席・喫煙17席(完全分煙)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "60席(禁煙43・喫煙17)", hoursInfo: "平日6:45〜20:00、土日8:00〜18:00" },
  { id: "ueno-39", name: "カフェ・ベローチェ 仲御徒町店", address: "東京都台東区台東4-8-5 T&T御徒町ビル1F", lat: 35.7071, lng: 139.7772, outletInfo: "電源コンセント・Wi-Fiあり", smokingInfo: "全席禁煙・喫煙ブース(専用室)あり", wifiInfo: "無料Wi-Fiあり", hoursInfo: "平日・土7:00〜21:00、日祝7:00〜20:00" },
  { id: "ueno-40", name: "カフェ・ラパン", address: "東京都台東区上野3-15-7", lat: 35.7091, lng: 139.7738, smokingInfo: "全席禁煙(屋外喫煙スペースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "30席(カウンター6・テーブル24)", hoursInfo: "8:30〜17:00(月〜土)", closedDaysInfo: "日曜定休" },
  { id: "ueno-41", name: "アメ横ダンケ", address: "東京都台東区上野4-1-8 長谷ビル1F", lat: 35.7098, lng: 139.7743, smokingInfo: "全席禁煙", seatCountInfo: "5席(カウンターのみ)" },
  { id: "ueno-42", name: "珈琲処ボナール", address: "東京都台東区上野1-18-11 山光堂ビル1F", lat: 35.7115, lng: 139.7737, smokingInfo: "全席禁煙", seatCountInfo: "62席(1F38席・2F24席)", hoursInfo: "月〜土11:00〜21:30(L.O.21:00)、日・祝11:00〜20:00(L.O.19:30)", closedDaysInfo: "年中無休(臨時休業あり)" },
  { id: "ueno-43", name: "喫茶トリコロール 松坂屋上野店", address: "東京都台東区上野3-29-5 松坂屋上野店本館4F", lat: 35.7086, lng: 139.7739, smokingInfo: "全席禁煙", seatCountInfo: "40席", hoursInfo: "10:00〜18:30(L.O.18:00)", closedDaysInfo: "松坂屋上野店の休業日に準ずる" },
  { id: "ueno-44", name: "椿屋珈琲 上野茶廊", address: "東京都台東区上野6-14-6 山田ビル1・2F", lat: 35.7104, lng: 139.7767, smokingInfo: "喫煙ブースあり(一部加熱式タバコ専用席)", wifiInfo: "Wi-Fiあり", seatCountInfo: "142席", hoursInfo: "9:00〜翌5:00(L.O.4:30)" },
  { id: "ueno-45", name: "うさぎや CAFE", address: "東京都台東区上野1-17-5", lat: 35.7113, lng: 139.7736, smokingInfo: "全席禁煙", seatCountInfo: "23席", hoursInfo: "9:00〜18:00", closedDaysInfo: "水曜日" },
  { id: "ueno-46", name: "CAFÉ すいれん", address: "東京都台東区上野公園7-7 国立西洋美術館内", lat: 35.7154, lng: 139.7745, outletInfo: "電源コンセントなし", hoursInfo: "通常10:00〜17:30、金・土10:00〜20:00", closedDaysInfo: "毎週月曜日(祝日/振替休日の場合翌平日)、年末年始(12/28〜1/1)ほか国立西洋美術館の休館日に準ずる" },
  { id: "ueno-47", name: "マドンナー", address: "東京都台東区上野6-16-4", lat: 35.7100, lng: 139.7773, smokingInfo: "分煙(1階禁煙・2階喫煙可、満席時は地下も使用)", seatCountInfo: "1階11席程・2階13席程(地下は満席時のみ)", hoursInfo: "月・火・木・金11:00〜18:00、土・日11:00〜19:00", closedDaysInfo: "水曜日" },
  { id: "ueno-48", name: "珈琲店 桂 台東区役所西横店", address: "東京都台東区東上野4-3-10 たちばなビル1F", lat: 35.7108, lng: 139.7756, outletInfo: "電源コンセントなし", smokingInfo: "全席禁煙", seatCountInfo: "31席", hoursInfo: "平日7:30〜19:00、土日祝8:30〜18:00" },
  { id: "ueno-49", name: "珈琲家 東上野店", address: "東京都台東区東上野2-10-2 第5政木ビル1F", lat: 35.7095, lng: 139.7757, outletInfo: "電源コンセントあり", smokingInfo: "全席喫煙可", hoursInfo: "平日8:30〜18:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "ueno-50", name: "ひまわり", address: "東京都台東区東上野4-7-12", lat: 35.7168, lng: 139.7776, smokingInfo: "全面喫煙可", seatCountInfo: "カウンター10数席", hoursInfo: "平日8:00〜17:00", closedDaysInfo: "土曜日、日曜日、祝日" },
];
