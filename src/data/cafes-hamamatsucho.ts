import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年8月時点、各公式サイト・食べログ等）。
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoも同時に、各チェーンの
// 公式店舗ページ・食べログ等で個別に確認して追加した。確認できなかった項目は空欄の
// ままにしている(推測では埋めていない)。
// 座標は国土地理院の住所検索APIで解決した街区(番地)レベルの地点です
// (2026-08-14に全件更新)。建物単位ではないため、同じ番地の店は同じ点に
// なります。それ以前は住所からの大まかな推定で、実測で中央値174mずれて
// いました。経路・写真検索は店名+住所のテキストでGoogleマップに渡して
// いるため、座標が多少ずれていても案内自体は正確です。
//
// 【調査で判明した閉店・対象外につき掲載を見送った店舗】
// - サンマルクカフェ 浜松町貿易センタービル店(浜松町2-4-1 世界貿易センター
//   ビルディングB1F): 同ビルは建替えのため2021年6月30日に閉館・解体済み(新ビルは
//   2027年より順次開業予定)、食べログも閉店表示。
// - カフェ・ベローチェ 浜松町店(浜松町2-1-17 松永ビル1F): Foursquare等で閉業表示。
// - スターバックス コーヒー 浜松町東芝ビル店(芝浦1-1-1 東芝ビルディング): 旧ビル
//   解体に伴い閉店。同住所の新ビル「ブルーフロント芝浦」に後継店が2025年9月開業
//   しており、そちらを掲載(hamamatsucho-05)。
// - 喫茶店「グリーンクローバー」(ホテルメルパルク東京内、芝公園2-5-20): ホテルが
//   老朽化により2022年10月末で閉館済み。
//
// 【2026年8月追加分(hamamatsucho-24以降)の調査で判明した閉店につき掲載を見送った店舗】
// - カボットカフェ(芝2-12-13 ASITIS芝1F): 食べログ・SNSで「リニューアルのため長期休業」
//   から「36年間ありがとうございました」との閉店告知を確認、閉店済み。
// - タリーズコーヒー 芝浦海岸通り店(芝浦4-13-23 MS芝浦ビル1F): 食べログで閉店表示、
//   かつ田町駅寄りで浜松町エリアからやや外れるため掲載対象外。
// 追加分は北は汐留・東新橋、南東は竹芝・ウォーターズ竹芝、西は芝2丁目・芝公園まで
// 少し範囲を広げて調査した(浜松町駅から徒歩10〜15分圏内)。
export const cafes: Cafe[] = [
  { id: "hamamatsucho-01", name: "マクドナルド 大門店", address: "東京都港区芝大門2-3-1 常泉ビル", lat: 35.656261, lng: 139.753845, smokingInfo: "全店舗禁煙方針、喫煙ルームなし(2014年8月より全店舗全席禁煙)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、全店舗共通サービス)", seatCountInfo: "62席", hoursInfo: "24時間営業(0:00〜5:00はテイクアウトのみ)", closedDaysInfo: "年中無休" },
  { id: "hamamatsucho-02", name: "マクドナルド 芝浦シーバンス店", address: "東京都港区芝浦1-2-2 シーバンス ア・モール", lat: 35.649799, lng: 139.756607, smokingInfo: "全店舗禁煙方針、喫煙ルームなし(2014年8月より全店舗全席禁煙)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、全店舗共通サービス)", seatCountInfo: "76席", hoursInfo: "平日7:00〜21:00、土日祝10:00〜18:00" },
  { id: "hamamatsucho-03", name: "モスバーガー 芝大門店", address: "東京都港区芝大門1-15-7", lat: 35.657246, lng: 139.753998, hoursInfo: "7:00〜23:00" },
  { id: "hamamatsucho-04", name: "スターバックス コーヒー 芝大門店", address: "東京都港区芝公園2-3-4 リッチモンドホテル東京芝", lat: 35.656536, lng: 139.752151, smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金6:30〜21:00、土日祝7:00〜20:00", closedDaysInfo: "不定休" },
  { id: "hamamatsucho-05", name: "スターバックス コーヒー ブルーフロント芝浦店", address: "東京都港区芝浦1-1-1 BLUE FRONT SHIBAURA 3F", lat: 35.651527, lng: 139.757477, smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金7:00〜21:00、土8:00〜18:00", closedDaysInfo: "日・祝" },
  { id: "hamamatsucho-06", name: "ドトールコーヒーショップ 浜松町1丁目店", address: "東京都港区浜松町1-29-9 FA小林ビル", lat: 35.65683, lng: 139.755798, outletInfo: "コンセントあり", smokingInfo: "完全分煙、全29席は禁煙で紙巻き・加熱式たばこ用の喫煙ブースを別途設置", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "29席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜21:00、土7:30〜20:00、日祝8:00〜19:00" },
  { id: "hamamatsucho-07", name: "ドトールコーヒーショップ 浜松町2丁目店", address: "東京都港区浜松町2-6-2 浜松町262ビル1F", lat: 35.654381, lng: 139.755508, smokingInfo: "完全分煙、全53席は禁煙で紙巻き・加熱式たばこ用の喫煙ブースを別途設置", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "53席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日6:45〜20:00、土9:00〜18:00" },
  { id: "hamamatsucho-08", name: "エクセルシオール カフェ 浜松町ハマサイト店", address: "東京都港区海岸1-2-20 汐留ビルディング ハマサイトグルメ2F", lat: 35.656849, lng: 139.759186, outletInfo: "中央の大テーブル・L字テーブル席を中心にコンセント多数", smokingInfo: "完全分煙(禁煙56席・喫煙23席、紙巻き・加熱式たばこ用の喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "79席(禁煙56・喫煙23)", hoursInfo: "平日7:30〜21:00、土9:00〜20:00、日祝9:00〜19:00" },
  { id: "hamamatsucho-09", name: "タリーズコーヒー 浜松町駅北口店", address: "東京都港区浜松町1-30 浜松町スクエア1F", lat: 35.656891, lng: 139.756607, outletInfo: "カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:30〜22:00、土日9:00〜20:00" },
  { id: "hamamatsucho-10", name: "タリーズコーヒー 日本生命浜松町クレアタワー店", address: "東京都港区浜松町2-3-1 日本生命浜松町クレアタワー1F", lat: 35.65564, lng: 139.755569, outletInfo: "窓側カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:00〜21:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "hamamatsucho-11", name: "PRONTO 浜松町店", address: "東京都港区芝大門2-4-4 富士ビル", lat: 35.656204, lng: 139.754333, outletInfo: "カウンター席などに電源コンセントあり", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "43席", hoursInfo: "月〜金7:00〜16:59・17:00〜23:00、土11:00〜17:00", closedDaysInfo: "日曜日、祝日" },
  { id: "hamamatsucho-12", name: "PRONTO 浜松町2丁目店", address: "東京都港区浜松町2-6-1", lat: 35.654381, lng: 139.755508, outletInfo: "カウンター席・一部テーブル席に電源コンセントあり", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "37席", hoursInfo: "月〜金7:00〜16:59・17:00〜23:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "hamamatsucho-13", name: "喫茶室ルノアール 芝大門店", address: "東京都港区芝大門2-3-1 常泉ビル2F", lat: 35.656261, lng: 139.753845, outletInfo: "窓側テーブル席を中心に電源コンセントあり", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "無料Wi-Fiあり(有料オプションWi-Fiも提供)", seatCountInfo: "77席" },
  { id: "hamamatsucho-14", name: "カフェ・ド・クリエ 浜松町店", address: "東京都港区浜松町2-1-3 第二森ビル1F・2F", lat: 35.656143, lng: 139.754929, outletInfo: "2階カウンター席に電源コンセントあり", smokingInfo: "分煙(1階禁煙・2階喫煙)", wifiInfo: "Wi-Fiあり", seatCountInfo: "75席" },
  { id: "hamamatsucho-15", name: "カフェ・ド・クリエ プラス 汐留芝離宮店", address: "東京都港区海岸1-2-3 汐留芝離宮ビルディング1F", lat: 35.656849, lng: 139.759186, outletInfo: "テーブル席の壁側に電源コンセントあり", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "32席" },
  { id: "hamamatsucho-16", name: "デニーズ 浜松町店", address: "東京都港区浜松町1-31 文化放送メディアプラス2F", lat: 35.656849, lng: 139.757126, smokingInfo: "全席禁煙(すかいらーくグループは2019年9月より全店舗敷地内禁煙)" },
  { id: "hamamatsucho-17", name: "乙女珈琲店", address: "東京都港区浜松町1-12-12", lat: 35.658531, lng: 139.756042, outletInfo: "窓側2名掛けテーブル席に電源コンセントあり", smokingInfo: "全席禁煙", seatCountInfo: "14席", hoursInfo: "月火水8:00〜18:00、木金13:00〜18:00、土14:00〜17:00", closedDaysInfo: "日曜日" },
  { id: "hamamatsucho-18", name: "BYRON BAY COFFEE 大門店", address: "東京都港区浜松町1-23-9 セゾン浜松町1F", lat: 35.657532, lng: 139.756683, outletInfo: "壁側の席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "12席", hoursInfo: "月〜金・祝前日7:30〜18:00、土日祝8:00〜18:00" },
  { id: "hamamatsucho-19", name: "上島珈琲店 大門店", address: "東京都港区芝大門2-4-1 イズミビル1F", lat: 35.656204, lng: 139.754333, outletInfo: "窓側カウンター・ソファ・テーブル席に電源コンセントあり", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "86席" },
  { id: "hamamatsucho-20", name: "モリバコーヒー 竹芝カフェ", address: "東京都港区海岸1-9-11", lat: 35.655586, lng: 139.761871, outletInfo: "電源コンセントあり、作業向きとの口コミも", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "41席" },
  { id: "hamamatsucho-21", name: "EIGHT COFFEE 浜松町", address: "東京都港区浜松町2-5-2 田中ビル1F", lat: 35.654194, lng: 139.756317, outletInfo: "電源コンセントあり(小規模なコーヒースタンド)", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "5席程度" },
  { id: "hamamatsucho-22", name: "JAHO COFFEE & TEA ブルーフロント芝浦店", address: "東京都港区芝浦1-1-1 BLUE FRONT SHIBAURA GREEN WALK", lat: 35.651527, lng: 139.757477, hoursInfo: "平日7:30〜20:00、土日祝8:00〜20:00" },
  { id: "hamamatsucho-23", name: "CAFE AZUR(ベイサイドホテル アジュール竹芝)", address: "東京都港区海岸1-11-2 ベイサイドホテル アジュール竹芝 4F", lat: 35.655239, lng: 139.763412, outletInfo: "電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜17:00(L.O.16:30)" },
  { id: "hamamatsucho-24", name: "ジョナサン 芝公園店", address: "東京都港区芝2-1-27 穴水ビル2F", lat: 35.65324, lng: 139.751038, smokingInfo: "全席禁煙(すかいらーくグループは2019年9月より全店舗敷地内禁煙)", wifiInfo: "無料Wi-Fiあり(au Wi-Fi、Wi2 300、Travel Japan Wi-Fi等)", hoursInfo: "7:00〜23:00" },
  { id: "hamamatsucho-25", name: "フレッシュネスバーガー 汐留シティセンター店", address: "東京都港区東新橋1-5-2 汐留シティセンター1F", lat: 35.665634, lng: 139.761398, smokingInfo: "全席禁煙", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "hamamatsucho-26", name: "タリーズコーヒー アトレ竹芝店", address: "東京都港区海岸1-10-45 アトレ竹芝", lat: 35.657009, lng: 139.761902, smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日8:00〜22:00、土日10:00〜22:00" },
  { id: "hamamatsucho-27", name: "タリーズコーヒー 芝タワー店", address: "東京都港区芝大門1-1-30 芝タワー1F", lat: 35.659733, lng: 139.753326, smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日8:00〜16:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "hamamatsucho-28", name: "タリーズコーヒー 東京ポートシティ竹芝店", address: "東京都港区海岸1-7-1 東京ポートシティ竹芝1F", lat: 35.655045, lng: 139.760864, smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "月・火〜金7:30〜22:00、土日9:00〜19:00" },
  { id: "hamamatsucho-29", name: "タリーズコーヒー 芝公園店", address: "東京都港区芝公園2-4-1 芝パークビル1F", lat: 35.655499, lng: 139.75235, smokingInfo: "全席禁煙", hoursInfo: "平日7:30〜18:00、土9:00〜17:00", closedDaysInfo: "日曜日" },
  { id: "hamamatsucho-30", name: "タリーズコーヒー 汐留シティセンター店", address: "東京都港区東新橋1-5-2 汐留シティセンターB2F", lat: 35.665634, lng: 139.761398, smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:00〜21:00、土10:00〜19:00、日10:00〜18:00" },
  { id: "hamamatsucho-31", name: "エクセルシオール カフェ バリスタ 東京汐留ビルディング店", address: "東京都港区東新橋1-9-1 東京汐留ビルディング2F202", lat: 35.662498, lng: 139.760895, hoursInfo: "月火水木金7:00〜19:00、土日祝8:00〜18:00" },
  { id: "hamamatsucho-32", name: "珈琲館 アトレ竹芝店", address: "東京都港区海岸1-10-45 アトレ竹芝", lat: 35.657009, lng: 139.761902, hoursInfo: "平日8:00〜22:00、土日祝10:00〜22:00", closedDaysInfo: "アトレ竹芝の休館日に準ずる" },
  { id: "hamamatsucho-33", name: "ブルーボトルコーヒー 竹芝カフェ", address: "東京都港区海岸1-7-1 東京ポートシティ竹芝オフィスタワー3F", lat: 35.655045, lng: 139.760864, hoursInfo: "平日8:00〜21:00、土日祝9:00〜19:00" },
  { id: "hamamatsucho-34", name: "スターバックス コーヒー 日テレプラザ店", address: "東京都港区東新橋1-6-1 日本テレビタワー2F", lat: 35.664265, lng: 139.760147, smokingInfo: "全店舗禁煙方針、喫煙所なし", hoursInfo: "平日7:00〜22:00、土日祝8:00〜20:00" },
  { id: "hamamatsucho-35", name: "スターバックス コーヒー 汐留シティセンター店", address: "東京都港区東新橋1-5-2 汐留シティセンター", lat: 35.665634, lng: 139.761398, smokingInfo: "全店舗禁煙方針、喫煙所なし", hoursInfo: "平日7:00〜22:00、土日祝9:00〜18:00", closedDaysInfo: "不定休" },
  { id: "hamamatsucho-36", name: "さち福やCAFE 汐留シティセンター店", address: "東京都港区東新橋1-5-2 汐留シティセンターB1F", lat: 35.665634, lng: 139.761398, hoursInfo: "平日11:00〜22:00、土日祝11:00〜21:00", closedDaysInfo: "施設に準ずる" },
  { id: "hamamatsucho-37", name: "LIT COFFEE & TEA STAND", address: "東京都港区芝2-15-15 ラディーチェ芝1F", lat: 35.650814, lng: 139.752762, smokingInfo: "全席禁煙" },
  { id: "hamamatsucho-38", name: "カフェ ラ・ボエム 浜松町", address: "東京都港区浜松町2-5-3 リブポート浜松町ビル1F・B1", lat: 35.654194, lng: 139.756317, outletInfo: "電源・コンセントあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "60席", hoursInfo: "11:30〜23:00" },
  { id: "hamamatsucho-39", name: "ポコベーグルカフェ 本店", address: "東京都港区東新橋2-10-7-200", lat: 35.661266, lng: 139.756332 },
  { id: "hamamatsucho-40", name: "ル・パン・コティディアン 芝公園店", address: "東京都港区芝公園3-3-1 東京プリンスホテル", lat: 35.6581178, lng: 139.750154, hoursInfo: "7:30〜22:00(L.O.21:00)" },
  { id: "hamamatsucho-41", name: "甘酒・雑貨かふぇ こめどりーみんぐ", address: "東京都港区芝公園1-7-14 KSひかりビル", lat: 35.657593, lng: 139.752365, smokingInfo: "全席禁煙" },
  { id: "hamamatsucho-42", name: "やなか珈琲店 芝大門店", address: "東京都港区芝大門2-9-18", lat: 35.654316, lng: 139.752823 },
  { id: "hamamatsucho-43", name: "COMFORT STAND", address: "東京都港区東新橋2-9-1 CIRCLES汐留1F", lat: 35.661331, lng: 139.757401, hoursInfo: "平日8:00〜18:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "hamamatsucho-44", name: "beyond the box -Tower side cafe-", address: "東京都港区芝大門2-9-14 加登ビル1F", lat: 35.654316, lng: 139.752823 },
  { id: "hamamatsucho-45", name: "place in the sun(プレイスインザサン)", address: "東京都港区芝2-20-3", lat: 35.651657, lng: 139.749817, closedDaysInfo: "日曜日、月曜日、祝日" },
];
