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
// 【要確認】以下は閉店の兆候が強いため、新規項目を追加せず既存情報のままに
// してある:
// - shinagawa-16(フレッシュネスバーガー 品川グランパサージュ店): 食べログ
//   【閉店】表示
// - shinagawa-28(cote cour エキュート品川店): エキュート品川の現行テナント
//   一覧94店に掲載なし、旧URLは404
// - shinagawa-32(カッフェクラシカ エキュート品川店): 4travel.jpで閉鎖を明記
// - shinagawa-37(スワンカフェ品川港南店): 食べログ閉店表示、運営元の店舗
//   一覧にも掲載なし
//
// 【やや不確か・要再確認】以下は情報源はあるが確度が下がる: shinagawa-15
// (日曜休業が恒久措置か一時的措置か未確定)、shinagawa-33(閉店・移転時期
// 未確認とのステータス表示あり)、shinagawa-45(所在階が情報源により相違、
// 公式レストラン一覧に掲載なし)
export const cafes: Cafe[] = [
  { id: "shinagawa-01", name: "マクドナルド 品川港南口店", address: "東京都港区港南2-5-3 オリックス品川ビル1F", lat: 35.628536, lng: 139.743225, outletInfo: "入口側カウンター10席で電源使用可", smokingInfo: "全店舗禁煙方針、喫煙ルームなし(2014年8月より全店舗全席禁煙)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、全店舗共通サービス)", seatCountInfo: "54席", hoursInfo: "6:30〜23:00", closedDaysInfo: "年中無休", website: "https://www.mcdonalds.co.jp/" },
  { id: "shinagawa-02", name: "バーミヤン 品川グランドコモンズ店", address: "東京都港区港南2-16-2 太陽生命品川ビル3F", lat: 35.62718164, lng: 139.74054826, outletInfo: "各席に2口コンセントあり", smokingInfo: "全席禁煙(すかいらーくグループは2019年9月より全店舗敷地内禁煙)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "133席", hoursInfo: "10:00〜23:00", closedDaysInfo: "年中無休" },
  { id: "shinagawa-03", name: "スターバックス コーヒー JR東海 品川駅店", address: "東京都港区港南2丁目 JR品川駅構内(港南口)", lat: 35.629383, lng: 139.741501, outletInfo: "東西自由通路側カウンター8席のみ電源あり", smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか、docomo・Wi2 300も利用可)", seatCountInfo: "50席", hoursInfo: "平日6:30〜22:00、土日祝7:00〜22:00", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "shinagawa-04", name: "スターバックス コーヒー JR東海 品川駅ラチ内店", address: "東京都港区高輪3-26-27 JR品川駅構内(改札内)", lat: 35.629002, lng: 139.737823, outletInfo: "改札内店は電源付き座席7席あり", smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "Wi-Fiあり(Softbank Wi-Fiスポット)", hoursInfo: "6:30〜21:30", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "shinagawa-05", name: "スターバックス コーヒー 品川インターシティ店", address: "東京都港区港南2-15-2 品川インターシティ", lat: 35.6268734, lng: 139.7419509, outletInfo: "窓側カウンター10席に電源、競争率高め", smokingInfo: "禁煙(全店舗禁煙方針、喫煙室なし)", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2ほか)", seatCountInfo: "35席", hoursInfo: "平日7:00〜21:00、土日祝8:00〜20:00", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "shinagawa-06", name: "タリーズコーヒー 品川インターシティ店", address: "東京都港区港南2-15-2 品川インターシティA棟2F", lat: 35.627665, lng: 139.7420481, outletInfo: "窓側テーブル席に電源コンセント多数", smokingInfo: "店内禁煙", seatCountInfo: "56席", hoursInfo: "平日7:00〜21:00、土8:00〜19:00、日祝9:00〜19:00", closedDaysInfo: "定休日なし", website: "https://www.tullys.co.jp/" },
  { id: "shinagawa-07", name: "ドトールコーヒーショップ アレア品川店", address: "東京都港区港南1-9-36 アレア品川2F", lat: 35.6300285, lng: 139.741187, outletInfo: "奥のカウンターと仕切りデスクに電源あり", smokingInfo: "全席禁煙(107席すべて禁煙席)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "107席(全席禁煙)", hoursInfo: "平日6:30〜21:00、土7:30〜20:00、日祝8:00〜20:00", closedDaysInfo: "定休日なし", website: "https://www.doutor.co.jp/dcs/" },
  { id: "shinagawa-08", name: "エクセルシオール カフェ 品川イーストワンタワー店", address: "東京都港区港南2-16-1 品川イーストワンタワー2F", lat: 35.6277399, lng: 139.7407177, outletInfo: "カウンター席中心に電源席が複数あり", smokingInfo: "全席禁煙(喫煙席0席)", wifiInfo: "無料Wi-Fiあり(FREE Wi-Fi)", seatCountInfo: "76席(全席禁煙)", hoursInfo: "平日7:00〜22:00(LO21:30)、土日祝8:00〜21:00", closedDaysInfo: "年中無休", website: "https://www.doutor.co.jp/exc/" },
  { id: "shinagawa-09", name: "サンマルクカフェ 品川インターシティ店", address: "東京都港区港南2-15-2 品川インターシティS&R棟2F", lat: 35.626335, lng: 139.742004, outletInfo: "窓側カウンター約25席・48口の電源", smokingInfo: "喫煙ブースあり(分煙)", seatCountInfo: "52席", hoursInfo: "7:00〜22:00", closedDaysInfo: "年中無休", website: "https://www.saint-marc-hd.com/saintmarccafe/" },
  { id: "shinagawa-10", name: "喫茶室ルノアール 品川高輪口店", address: "東京都港区高輪3-25-22 高輪カネオビル1F", lat: 35.63042, lng: 139.7378456, outletInfo: "電源コンセントあり、Wi-Fiも複数種", smokingInfo: "分煙(禁煙75席、加熱式たばこ喫煙エリア32席、紙巻きたばこ用喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi、Wi2、au Wi-Fi SPOT、BBモバイルポイント)", seatCountInfo: "禁煙75席+加熱式たばこ喫煙32席", hoursInfo: "7:30〜22:00(モーニングは開店〜12:00)", website: "https://www.ginza-renoir.co.jp/" },
  { id: "shinagawa-11", name: "喫茶室ルノアール 品川港南口店", address: "東京都港区港南2-3-29 シーゲンビル1F", lat: 35.6290898, lng: 139.7429397, outletInfo: "大テーブル・カウンター・壁面に電源あり", smokingInfo: "分煙(禁煙席50席・加熱式たばこ専用喫煙席24席)、別途紙巻きたばこ専用喫煙ブースあり", wifiInfo: "無料Wi-Fiあり(Renoir Miyama Wi-Fi、Wi2、au Wi-Fi SPOT、BBモバイルポイント)", seatCountInfo: "全74席(禁煙50・加熱式たばこ専用24)、別途喫煙ブースあり", hoursInfo: "平日7:00〜22:00、土曜8:00〜22:00、日祝8:00〜20:00", website: "https://www.ginza-renoir.co.jp/" },
  { id: "shinagawa-12", name: "PRONTO 品川店", address: "東京都港区港南1-8-27 日新ビル1F", lat: 35.630123, lng: 139.743988, smokingInfo: "分煙(禁煙席/加熱式たばこ専用席/喫煙ブース)", wifiInfo: "PRONTO FREE Wi-Fiあり", seatCountInfo: "76席", hoursInfo: "月〜金7:00〜17:29(モーニング〜10:00)、17:30〜23:00", closedDaysInfo: "土日祝", website: "https://www.pronto.co.jp/" },
  { id: "shinagawa-13", name: "PRONTO 品川高輪店", address: "東京都港区高輪3-25-23 品川横丁", lat: 35.631149, lng: 139.7379, outletInfo: "専用コンセントなし、店員に相談で使える場合も", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "PRONTO FREE Wi-Fiあり", seatCountInfo: "77席", hoursInfo: "月〜水7:00〜22:30、木・金7:00〜23:00、土日10:00〜18:00", closedDaysInfo: "年中無休", website: "https://www.pronto.co.jp/" },
  { id: "shinagawa-14", name: "PRONTO 品川インターシティ店", address: "東京都港区港南2-15-2 品川インターシティB棟B1F", lat: 35.62709559, lng: 139.74202315, outletInfo: "電源・Wi-Fiとも利用可、充電に便利", smokingInfo: "分煙(禁煙席/加熱式たばこ専用席/喫煙ブース)", wifiInfo: "PRONTO FREE Wi-Fiあり(チェーン共通)", seatCountInfo: "101席", hoursInfo: "月〜金7:00〜23:00、土日10:00〜18:00", closedDaysInfo: "年中無休", website: "https://www.pronto.co.jp/" },
  { id: "shinagawa-15", name: "È PRONTO 品川シーズンテラス店", address: "東京都港区港南1-2-70 品川シーズンテラス", lat: 35.631985, lng: 139.743622, outletInfo: "テーブルに電源あり、打ち合わせにも利用可", smokingInfo: "分煙(禁煙席/加熱式たばこ専用席)", wifiInfo: "PRONTO FREE Wi-Fiあり", seatCountInfo: "75席", hoursInfo: "月〜金7:30〜21:00(LO20:30)、土11:00〜18:00(LO17:30)", closedDaysInfo: "日曜(施設側『当面の間休業』表記、恒久措置か要再確認)", website: "https://www.pronto.co.jp/" },
  { id: "shinagawa-16", name: "フレッシュネスバーガー 品川グランパサージュ店", address: "東京都港区港南2-16-3 品川グランドセントラルタワーB1F", lat: 35.626488, lng: 139.740677, outletInfo: "窓際カウンター10席に各2口コンセント" },
  { id: "shinagawa-17", name: "モスバーガー アトレ品川店", address: "東京都港区港南2-18-1 アトレ品川3F", lat: 35.628937, lng: 139.740784, smokingInfo: "全席禁煙", seatCountInfo: "124席", hoursInfo: "10:00〜22:00(LO21:15)", closedDaysInfo: "不定休(アトレ品川の営業日に準ずる)" },
  { id: "shinagawa-18", name: "ブルーボトルコーヒー 品川カフェ", address: "東京都港区港南2-18-1 アトレ品川3F", lat: 35.628937, lng: 139.740784, outletInfo: "コンセントなし、充電は他店を推奨", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "27席(テーブル8・カウンター19)", hoursInfo: "平日8:00〜22:00、土日祝10:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "shinagawa-19", name: "ディーン&デルーカ マーケットストア 品川", address: "東京都港区港南2-18-1 アトレ品川", lat: 35.628937, lng: 139.740784, outletInfo: "窓際カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", hoursInfo: "マーケット10:00〜22:00、エスプレッソバー平日7:00〜22:00(LO21:45)・土日祝8:00〜22:00(LO21:45)" },
  { id: "shinagawa-20", name: "ザ・シティ・ベーカリー 品川", address: "東京都港区港南2-18-1 アトレ品川", lat: 35.628937, lng: 139.740784, smokingInfo: "全席禁煙", seatCountInfo: "80席", hoursInfo: "ベーカリー&カフェ7:00〜22:00、レストラン&バー月〜土11:00〜23:00(LO22:00)・日祝11:00〜22:00(LO21:00)", closedDaysInfo: "不定休(アトレ品川に準ずる)" },
  { id: "shinagawa-21", name: "AW55 アトレ品川店", address: "東京都港区港南2-18-1 アトレ品川4F", lat: 35.628937, lng: 139.740784, smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "総席数68席", hoursInfo: "月〜土11:00〜23:00、日11:00〜22:00", closedDaysInfo: "施設(アトレ品川)に準ずる、2月・8月第3月曜はビル定期点検で休業" },
  { id: "shinagawa-22", name: "サラベス 品川店", address: "東京都港区港南2-18-1 アトレ品川4F", lat: 35.628937, lng: 139.740784, smokingInfo: "全席禁煙", seatCountInfo: "全82席(テーブル74・バー8)", hoursInfo: "月〜土9:30〜22:30、日・祝9:30〜22:00(LO閉店30分前)", closedDaysInfo: "無休" },
  { id: "shinagawa-23", name: "Guzman y Gomez FOOD&TIME 品川店", address: "東京都港区港南2-18-1 アトレ品川", lat: 35.628937, lng: 139.740784, outletInfo: "窓側カウンター席に電源コンセントあり", smokingInfo: "全席禁煙(別フロアに喫煙室あり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "フードコート共用102席", hoursInfo: "10:00〜22:00(LO21:15)", closedDaysInfo: "不定休(施設アトレ品川に準ずる)" },
  { id: "shinagawa-24", name: "サンジェルマン アトレ品川店", address: "東京都港区港南2-18-1 アトレ品川", lat: 35.628937, lng: 139.740784, smokingInfo: "全席禁煙", hoursInfo: "平日8:00〜22:00、土日祝10:00〜22:00(LO21:30)" },
  { id: "shinagawa-25", name: "アンテナ アメリカ アトレ品川店", address: "東京都港区港南2-18-1 アトレ品川3F", lat: 35.628937, lng: 139.740784, smokingInfo: "全席禁煙", seatCountInfo: "4席(フードコート内)", hoursInfo: "10:00〜22:00", closedDaysInfo: "元旦・1月2日、施設休業日" },
  { id: "shinagawa-26", name: "PAUL 品川駅店", address: "東京都港区高輪3-26-27 エキュート品川1F", lat: 35.629002, lng: 139.737823, smokingInfo: "分煙(禁煙席15席)", seatCountInfo: "45席(うち禁煙15席)", hoursInfo: "月〜土8:00〜22:00、日・祝8:00〜20:30", closedDaysInfo: "施設(エキュート品川)に準ずる" },
  { id: "shinagawa-27", name: "サザコーヒー エキュート品川店", address: "東京都港区高輪3-26-27 エキュート品川1F", lat: 35.629002, lng: 139.737823, smokingInfo: "全席禁煙", seatCountInfo: "カウンター10席", hoursInfo: "月〜土7:00〜22:00、日・祝8:00〜20:30" },
  { id: "shinagawa-28", name: "cote cour エキュート品川店", address: "東京都港区高輪3-26-27 エキュート品川1F", lat: 35.629002, lng: 139.737823 },
  { id: "shinagawa-29", name: "タミルズ エキュート品川店", address: "東京都港区高輪3-26-27 エキュート品川サウス", lat: 35.629002, lng: 139.737823, outletInfo: "カウンター席に電源コンセントあり", hoursInfo: "月〜土7:00〜23:00(LO22:00)、日・祝7:00〜22:00(LO21:00)" },
  { id: "shinagawa-30", name: "常陸野ブルーイング品川 Beer&Cafe", address: "東京都港区高輪3-26-27 エキュート品川2F", lat: 35.629002, lng: 139.737823, hoursInfo: "月〜金10:00〜22:00(LO21:30)、土10:00〜21:00(LO20:30)、日・祝10:00〜20:30(LO20:00)", closedDaysInfo: "エキュート品川に準ずる" },
  { id: "shinagawa-31", name: "バル マルシェ コダマ エキュート品川店", address: "東京都港区高輪3-26-27 エキュート品川1F", lat: 35.62871474, lng: 139.73939551, smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiなし", seatCountInfo: "全18席(カウンター・テラス席含む)", hoursInfo: "月〜土8:00〜21:30、日8:00〜19:30", closedDaysInfo: "年中無休" },
  { id: "shinagawa-32", name: "カッフェクラシカ エキュート品川店", address: "東京都港区高輪3-26-27 エキュート品川2F", lat: 35.629002, lng: 139.737823 },
  { id: "shinagawa-33", name: "BECK'S COFFEE SHOP 品川駅店", address: "東京都港区高輪3-26-27 JR品川駅構内(北改札付近)", lat: 35.629002, lng: 139.737823, outletInfo: "窓側カウンター8席、各1口の電源あり", smokingInfo: "全席禁煙、喫煙ブースあり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "32席", hoursInfo: "平日6:15〜21:00、土日祝7:00〜20:00" },
  { id: "shinagawa-34", name: "Caffe LAT.25° 品川駅店", address: "東京都港区高輪3-26-27 JR品川駅構内(新幹線乗換口付近)", lat: 35.629002, lng: 139.737823, smokingInfo: "全席禁煙", hoursInfo: "6:00〜22:00", closedDaysInfo: "年中無休" },
  { id: "shinagawa-35", name: "GOOD MORNING CAFE 品川シーズンテラス", address: "東京都港区港南1-2-70 品川シーズンテラス2F", lat: 35.632524, lng: 139.74308, outletInfo: "電源あり、Wi-Fiも利用可", smokingInfo: "全席禁煙、施設内に喫煙所あり", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "約100席(20〜30名用個室あり)", hoursInfo: "月〜水11:30〜21:00、木・金11:30〜22:00、土日祝11:00〜21:00", closedDaysInfo: "無休(品川シーズンテラス休館日を除く)" },
  { id: "shinagawa-36", name: "ブロッサム アンド ブーケ デリカフェ 品川シーズンテラス店", address: "東京都港区港南1-2-70 品川シーズンテラス", lat: 35.631985, lng: 139.743622, outletInfo: "入口左手カウンター4ヶ所に1口コンセント", smokingInfo: "全席禁煙", seatCountInfo: "14席(カウンターのみ)", hoursInfo: "平日7:30〜20:00、土曜11:00〜18:00", closedDaysInfo: "日曜・祝日" },
  { id: "shinagawa-37", name: "スワンカフェ品川港南店", address: "東京都港区港南2-13-26 ヤマト港南ビル2F", lat: 35.627689, lng: 139.745193 },
  { id: "shinagawa-38", name: "RHYTHMOS カフェ&バー", address: "東京都港区港南2-16-1 品川イーストワンタワー ストリングスホテル", lat: 35.626488, lng: 139.740677, smokingInfo: "全面禁煙(26階ロビーに喫煙室あり)", seatCountInfo: "41席", hoursInfo: "ティータイム6:30〜17:00、アフタヌーンティー14:00〜18:30(LO16:30)、食事11:30〜22:00(LO21:00)、バータイム日〜火17:00〜24:00(LO23:00)・水〜土17:00〜24:30(LO23:30)", closedDaysInfo: "年中無休" },
  { id: "shinagawa-39", name: "Coffee Stand .OTTEN", address: "東京都港区港南1-8-35", lat: 35.630123, lng: 139.743988, outletInfo: "電源・Wi-Fiあり、作業向きの環境", smokingInfo: "全席禁煙", hoursInfo: "平日8:30〜19:30(LO19:00)", closedDaysInfo: "土曜・日曜・祝日" },
  { id: "shinagawa-40", name: "麻布茶房 ウィング高輪店", address: "東京都港区高輪4-10-18 京急ショッピングプラザ ウィング高輪WEST", lat: 35.628574, lng: 139.736984, smokingInfo: "全席禁煙", seatCountInfo: "62席", hoursInfo: "平日・祝前日11:00〜20:00(LO19:30)、土日祝10:00〜20:00(LO19:30)", closedDaysInfo: "ウィング高輪に準ずる" },
  { id: "shinagawa-41", name: "オーバカナル 高輪店", address: "東京都港区高輪4-10-8 京急第7ビル1F", lat: 35.62887573, lng: 139.73580982, smokingInfo: "全席禁煙(テラス席のみペット可)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "全202席(ブラッスリー56・バー24・カフェ122席[うちテラス63])", hoursInfo: "ブーランジェリー11:00〜20:00、カフェ11:30〜22:00(LO21:00)、ブラッスリー昼11:30〜14:00・夜18:00〜22:00(LO21:00)", closedDaysInfo: "年中無休" },
  { id: "shinagawa-42", name: "コーヒーラウンジ マウナケア(品川プリンスホテル)", address: "東京都港区高輪4-10-30 品川プリンスホテル メインタワー2F", lat: 35.628574, lng: 139.736984, outletInfo: "電源コンセントあり、Wi-Fiも利用可", smokingInfo: "禁煙", seatCountInfo: "163席", hoursInfo: "8:00〜20:00(LO19:30)、モーニング8:00〜11:00、ケーキ販売10:00〜", closedDaysInfo: "無休(年中無休)" },
  { id: "shinagawa-43", name: "ACCEA CAFE 品川プリンスホテル店", address: "東京都港区高輪4-10-30 品川プリンスホテル アネックスタワー2F", lat: 35.628574, lng: 139.736984, outletInfo: "全席に電源完備、Wi-Fi無料で作業向け", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "18席(テレワーク個室ブース3・ハイバックソファ席8・カウンター席7)", hoursInfo: "全日10:00〜20:00", closedDaysInfo: "なし" },
  { id: "shinagawa-44", name: "品川キッチン(フードコート)", address: "東京都港区高輪4-10-30 品川プリンスホテル アネックスタワー2F", lat: 35.628574, lng: 139.736984, smokingInfo: "禁煙", seatCountInfo: "300席", hoursInfo: "11:00〜22:00(LO21:30)", closedDaysInfo: "無休(年中無休)" },
  { id: "shinagawa-45", name: "カフェ・ド・シネマ", address: "東京都港区高輪4-10-30 品川プリンスホテル エグゼクティブタワー3F", lat: 35.628574, lng: 139.736984, smokingInfo: "全席禁煙", hoursInfo: "10:00〜20:00", closedDaysInfo: "なし" },
  { id: "shinagawa-46", name: "ナチュラルカフェ&レストラン 椨の木", address: "東京都港区高輪4-9-16 東京療院新館1F", lat: 35.628651, lng: 139.734512, smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "38席", hoursInfo: "火〜金11:00〜21:00(ランチ11:00〜14:00・カフェ14:00〜16:00LO15:30・ディナー17:30〜21:00LO20:00)、土・祝11:00〜17:30", closedDaysInfo: "月曜・日曜" },
  { id: "shinagawa-47", name: "46番地", address: "東京都港区高輪4-13-7", lat: 35.626846, lng: 139.732681, hoursInfo: "火〜木19:30〜24:00、金土日19:00〜24:00", closedDaysInfo: "月曜" },
  { id: "shinagawa-48", name: "カフェガレージ", address: "東京都港区高輪4-24-44", lat: 35.625431, lng: 139.73526, smokingInfo: "全席禁煙", hoursInfo: "月・金〜日9:00〜19:00", closedDaysInfo: "火・水・木(不定休あり)" },
  { id: "shinagawa-49", name: "ミポーズハウス", address: "東京都港区高輪4-24-38", lat: 35.625431, lng: 139.73526 },
  { id: "shinagawa-50", name: "Brasserie la Maison", address: "東京都港区高輪4-24-40 高輪プリンセスガルテン内", lat: 35.625431, lng: 139.73526, smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "41席(テーブル20・ソファ10・カウンター5・テラス6)", hoursInfo: "月・木・日・祝11:00〜16:00(LO食13:30/飲15:30)、金土11:00〜16:00・17:30〜21:30(LO食18:30/飲21:00)", closedDaysInfo: "火・水曜(祝日の場合は営業の場合あり)" },
  // 以下shinagawa-51〜71は2026年8月に追加。高輪ゲートウェイシティ(ニュウマン高輪
  // South/North/LUFTBAUM/MIMURE、2025年9月〜2026年3月開業)を中心に、御殿山・
  // 北品川(京急新馬場駅周辺)まで少し範囲を広げて実在店舗をウェブ検索で確認した。
  // 営業時間等の情報源が店舗ごとに食い違うものは、未確認項目として空欄にしてある。
  { id: "shinagawa-51", name: "スターバックス コーヒー 高輪ゲートウェイ駅店", address: "東京都港区港南2-1-220 JR高輪ゲートウェイ駅改札外3階", lat: 35.631676, lng: 139.740341, smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(STARBUCKS Wi-Fi、docomo、Wi2 300)", hoursInfo: "7:00〜22:00", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "shinagawa-52", name: "スターバックス コーヒー ニュウマン高輪店", address: "東京都港区高輪2-21-1 ニュウマン高輪 North5F", lat: 35.6363667, lng: 139.7400702, smokingInfo: "全店舗禁煙方針、喫煙室なし", wifiInfo: "無料Wi-Fiあり(STARBUCKS Wi-Fi、docomo、Wi2 300)", seatCountInfo: "約140席(品川・高輪エリア最大級のスターバックスと紹介されている)", hoursInfo: "10:00〜22:00", closedDaysInfo: "不定休", website: "https://www.starbucks.co.jp/" },
  { id: "shinagawa-53", name: "TOOTH TOOTH BISTRO&CAFE 高輪店", address: "東京都港区高輪2-21-2 ニュウマン高輪 South5F", lat: 35.635559, lng: 139.739594, smokingInfo: "全席禁煙" },
  { id: "shinagawa-54", name: "Link cafe TOKYO(タリーズコーヒー) 高輪店", address: "東京都港区高輪2-21-2 ニュウマン高輪 South5F", lat: 35.635559, lng: 139.739594, smokingInfo: "全席禁煙", website: "https://www.tullys.co.jp/" },
  { id: "shinagawa-55", name: "LOOPS(ニュウマン高輪 LUFTBAUM)", address: "東京都港区高輪2-21-1 ニュウマン高輪 LUFTBAUM28F", lat: 35.635559, lng: 139.739594 },
  { id: "shinagawa-56", name: "小川珈琲 LABORATORY 高輪", address: "東京都港区高輪2-22-1 NEWoMan TAKANAWA MIMURE2F", lat: 35.638, lng: 139.741013, smokingInfo: "全席禁煙" },
  { id: "shinagawa-57", name: "タリーズコーヒー ソニーシティ店", address: "東京都港区港南1-7-1 ソニーシティ1F", lat: 35.631401, lng: 139.743973, smokingInfo: "全席禁煙", wifiInfo: "タリーズWi-Fiあり", website: "https://www.tullys.co.jp/" },
  { id: "shinagawa-58", name: "ブルーボトルコーヒー 高輪カフェ", address: "東京都港区高輪2-21-2 ニュウマン高輪 South2F", lat: 35.635559, lng: 139.739594, smokingInfo: "全席禁煙", hoursInfo: "10:00〜20:00" },
  { id: "shinagawa-59", name: "ラウンジ 光明(グランドプリンスホテル高輪)", address: "東京都港区高輪3-13-1 グランドプリンスホテル高輪", lat: 35.630711, lng: 139.733948, smokingInfo: "全席禁煙" },
  { id: "shinagawa-60", name: "LA MAISON DU CHOCOLAT 高輪店", address: "東京都港区高輪2-21-2 ニュウマン高輪 South2F", lat: 35.635559, lng: 139.739594 },
  { id: "shinagawa-61", name: "BUNKITSU TOKYO SHARE LOUNGE 高輪ゲートウェイ", address: "東京都港区高輪2-21-2 ニュウマン高輪 South5F", lat: 35.635559, lng: 139.739594, seatCountInfo: "パノラマラウンジ等含め約195席、会議室5室(時間制の有料ラウンジ&コワーキング)", hoursInfo: "11:00〜20:00(LO19:30)", closedDaysInfo: "不定休(ニュウマン高輪に準ずる)" },
  { id: "shinagawa-62", name: "MoN Park Cafe by Spiral", address: "東京都港区三田3-16-1 MoN Takanawa 1F", lat: 35.639671, lng: 139.74173, hoursInfo: "10:00〜19:00" },
  { id: "shinagawa-63", name: "WIRED CAFE Dining Lounge ウィング高輪店", address: "東京都港区高輪4-10-18 京急ショッピングプラザ ウィング高輪WEST2F", lat: 35.628574, lng: 139.736984 },
  { id: "shinagawa-64", name: "365 Days Coffee ニュウマン高輪店", address: "東京都港区高輪2-21-1 ニュウマン高輪 THE LINKPILLAR1 NORTH2F", lat: 35.635559, lng: 139.739594, hoursInfo: "9:00〜19:00", closedDaysInfo: "不定休" },
  { id: "shinagawa-65", name: "MAISON CLASSIC CAFE 高輪ゲートウェイ駅店", address: "東京都港区港南2-1 JR高輪ゲートウェイ駅南改札内2F", lat: 35.631676, lng: 139.740341 },
  { id: "shinagawa-66", name: "FRED'S CAFE 品川フロントビル店", address: "東京都港区港南2-3-13 品川フロントビル", lat: 35.629086, lng: 139.743881, outletInfo: "全席に電源コンセントあり", wifiInfo: "Wi-Fi完備" },
  { id: "shinagawa-67", name: "タリーズコーヒー 御殿山トラストタワー店", address: "東京都品川区北品川4-7-35 御殿山トラストタワー1F", lat: 35.622692, lng: 139.736435, website: "https://www.tullys.co.jp/" },
  { id: "shinagawa-68", name: "KAIDO books & coffee", address: "東京都品川区北品川2-3-7 丸屋ビル1F", lat: 35.619339, lng: 139.742767 },
  { id: "shinagawa-69", name: "カフェ・ベローチェ 北品川店", address: "東京都品川区北品川2-11-1 ベイテラス北品川1F", lat: 35.618679, lng: 139.74147, hoursInfo: "7:00〜22:00", website: "https://c-united.co.jp/veloce/" },
  { id: "shinagawa-70", name: "NOG COFFEE ROASTERS 品川店", address: "東京都品川区東品川1-5-10 COTOCORPビル1F", lat: 35.622387, lng: 139.743729 },
  { id: "shinagawa-71", name: "ドトールコーヒーショップ 京急新馬場駅前店", address: "東京都品川区北品川2-17-9", lat: 35.618134, lng: 139.741104, hoursInfo: "平日6:30〜21:00、土日祝7:00〜20:00", website: "https://www.doutor.co.jp/dcs/" },
];
