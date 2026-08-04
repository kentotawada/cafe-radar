import type { Cafe } from "./cafes";

// 店名・住所はウェブ検索で実在店舗を確認済み（2026年8月時点、各公式サイト・食べログ等）。
// smokingInfo/wifiInfo/seatCountInfo/hoursInfo/closedDaysInfoも同時に、各チェーンの
// 公式店舗ページ・食べログ等で個別に確認して追加した。確認できなかった項目は空欄の
// ままにしている(推測では埋めていない)。
// 座標は住所から推定した目安地点です。経路・写真検索は店名+住所のテキストで
// Googleマップに渡しているため、座標が多少ずれていても案内自体は正確です。
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
export const cafes: Cafe[] = [
  { id: "hamamatsucho-01", name: "マクドナルド 大門店", address: "東京都港区芝大門2-3-1 常泉ビル", lat: 35.6588, lng: 139.7538, smokingInfo: "全店舗禁煙方針、喫煙ルームなし(2014年8月より全店舗全席禁煙)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、全店舗共通サービス)", seatCountInfo: "62席", hoursInfo: "24時間営業(0:00〜5:00はテイクアウトのみ)", closedDaysInfo: "年中無休" },
  { id: "hamamatsucho-02", name: "マクドナルド 芝浦シーバンス店", address: "東京都港区芝浦1-2-2 シーバンス ア・モール", lat: 35.6497, lng: 139.7558, smokingInfo: "全店舗禁煙方針、喫煙ルームなし(2014年8月より全店舗全席禁煙)", wifiInfo: "無料Wi-Fiあり(00_MCD-FREE-WIFI、全店舗共通サービス)", seatCountInfo: "76席", hoursInfo: "平日7:00〜21:00、土日祝10:00〜18:00" },
  { id: "hamamatsucho-03", name: "モスバーガー 芝大門店", address: "東京都港区芝大門1-15-7", lat: 35.6592, lng: 139.7535, hoursInfo: "7:00〜23:00" },
  { id: "hamamatsucho-04", name: "スターバックス コーヒー 芝大門店", address: "東京都港区芝公園2-3-4 リッチモンドホテル東京芝", lat: 35.6560, lng: 139.7497, smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金6:30〜21:00、土日祝7:00〜20:00", closedDaysInfo: "不定休" },
  { id: "hamamatsucho-05", name: "スターバックス コーヒー ブルーフロント芝浦店", address: "東京都港区芝浦1-1-1 BLUE FRONT SHIBAURA 3F", lat: 35.6493, lng: 139.7548, smokingInfo: "全店舗禁煙方針、喫煙所なし", wifiInfo: "無料Wi-Fiあり(at_STARBUCKS_Wi2、登録不要で利用規約に同意するだけ)", hoursInfo: "月〜金7:00〜21:00、土8:00〜18:00", closedDaysInfo: "日・祝" },
  { id: "hamamatsucho-06", name: "ドトールコーヒーショップ 浜松町1丁目店", address: "東京都港区浜松町1-29-9 FA小林ビル", lat: 35.6578, lng: 139.7558, outletInfo: "コンセントあり", smokingInfo: "完全分煙、全29席は禁煙で紙巻き・加熱式たばこ用の喫煙ブースを別途設置", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "29席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日7:00〜21:00、土7:30〜20:00、日祝8:00〜19:00" },
  { id: "hamamatsucho-07", name: "ドトールコーヒーショップ 浜松町2丁目店", address: "東京都港区浜松町2-6-2 浜松町262ビル1F", lat: 35.6538, lng: 139.7568, smokingInfo: "完全分煙、全53席は禁煙で紙巻き・加熱式たばこ用の喫煙ブースを別途設置", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "53席(全席禁煙、別途喫煙ブースあり)", hoursInfo: "平日6:45〜20:00、土9:00〜18:00" },
  { id: "hamamatsucho-08", name: "エクセルシオール カフェ 浜松町ハマサイト店", address: "東京都港区海岸1-2-20 汐留ビルディング ハマサイトグルメ2F", lat: 35.6608, lng: 139.7608, outletInfo: "中央の大テーブル・L字テーブル席を中心にコンセント多数", smokingInfo: "完全分煙(禁煙56席・喫煙23席、紙巻き・加熱式たばこ用の喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり", seatCountInfo: "79席(禁煙56・喫煙23)", hoursInfo: "平日7:30〜21:00、土9:00〜20:00、日祝9:00〜19:00" },
  { id: "hamamatsucho-09", name: "タリーズコーヒー 浜松町駅北口店", address: "東京都港区浜松町1-30 浜松町スクエア1F", lat: 35.6575, lng: 139.7562, outletInfo: "カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:30〜22:00、土日9:00〜20:00" },
  { id: "hamamatsucho-10", name: "タリーズコーヒー 日本生命浜松町クレアタワー店", address: "東京都港区浜松町2-3-1 日本生命浜松町クレアタワー1F", lat: 35.6543, lng: 139.7570, outletInfo: "窓側カウンター席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "Tully's Wi-Fiあり", hoursInfo: "平日7:00〜21:00", closedDaysInfo: "土曜日、日曜日" },
  { id: "hamamatsucho-11", name: "PRONTO 浜松町店", address: "東京都港区芝大門2-4-4 富士ビル", lat: 35.6585, lng: 139.7533, outletInfo: "カウンター席などに電源コンセントあり", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "43席", hoursInfo: "月〜金7:00〜16:59・17:00〜23:00、土11:00〜17:00", closedDaysInfo: "日曜日、祝日" },
  { id: "hamamatsucho-12", name: "PRONTO 浜松町2丁目店", address: "東京都港区浜松町2-6-1", lat: 35.6540, lng: 139.7566, outletInfo: "カウンター席・一部テーブル席に電源コンセントあり", smokingInfo: "全席禁煙(喫煙ブースあり)", wifiInfo: "無料Wi-Fiあり(PRONTO FREE Wi-Fi)", seatCountInfo: "37席", hoursInfo: "月〜金7:00〜16:59・17:00〜23:00", closedDaysInfo: "土曜日、日曜日、祝日" },
  { id: "hamamatsucho-13", name: "喫茶室ルノアール 芝大門店", address: "東京都港区芝大門2-3-1 常泉ビル2F", lat: 35.6588, lng: 139.7538, outletInfo: "窓側テーブル席を中心に電源コンセントあり", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "無料Wi-Fiあり(有料オプションWi-Fiも提供)", seatCountInfo: "77席" },
  { id: "hamamatsucho-14", name: "カフェ・ド・クリエ 浜松町店", address: "東京都港区浜松町2-1-3 第二森ビル1F・2F", lat: 35.6560, lng: 139.7575, outletInfo: "2階カウンター席に電源コンセントあり", smokingInfo: "分煙(1階禁煙・2階喫煙)", wifiInfo: "Wi-Fiあり", seatCountInfo: "75席" },
  { id: "hamamatsucho-15", name: "カフェ・ド・クリエ プラス 汐留芝離宮店", address: "東京都港区海岸1-2-3 汐留芝離宮ビルディング1F", lat: 35.6605, lng: 139.7603, outletInfo: "テーブル席の壁側に電源コンセントあり", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "32席" },
  { id: "hamamatsucho-16", name: "デニーズ 浜松町店", address: "東京都港区浜松町1-31 文化放送メディアプラス2F", lat: 35.6572, lng: 139.7555, smokingInfo: "全席禁煙(すかいらーくグループは2019年9月より全店舗敷地内禁煙)" },
  { id: "hamamatsucho-17", name: "乙女珈琲店", address: "東京都港区浜松町1-12-12", lat: 35.6595, lng: 139.7548, outletInfo: "窓側2名掛けテーブル席に電源コンセントあり", smokingInfo: "全席禁煙", seatCountInfo: "14席", hoursInfo: "月火水8:00〜18:00、木金13:00〜18:00、土14:00〜17:00", closedDaysInfo: "日曜日" },
  { id: "hamamatsucho-18", name: "BYRON BAY COFFEE 大門店", address: "東京都港区浜松町1-23-9 セゾン浜松町1F", lat: 35.6580, lng: 139.7548, outletInfo: "壁側の席に電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "12席", hoursInfo: "月〜金・祝前日7:30〜18:00、土日祝8:00〜18:00" },
  { id: "hamamatsucho-19", name: "上島珈琲店 大門店", address: "東京都港区芝大門2-4-1 イズミビル1F", lat: 35.6583, lng: 139.7533, outletInfo: "窓側カウンター・ソファ・テーブル席に電源コンセントあり", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "86席" },
  { id: "hamamatsucho-20", name: "モリバコーヒー 竹芝カフェ", address: "東京都港区海岸1-9-11", lat: 35.6588, lng: 139.7622, outletInfo: "電源コンセントあり、作業向きとの口コミも", smokingInfo: "分煙、喫煙エリアあり", wifiInfo: "Wi-Fiあり", seatCountInfo: "41席" },
  { id: "hamamatsucho-21", name: "EIGHT COFFEE 浜松町", address: "東京都港区浜松町2-5-2 田中ビル1F", lat: 35.6535, lng: 139.7572, outletInfo: "電源コンセントあり(小規模なコーヒースタンド)", smokingInfo: "全席禁煙", wifiInfo: "Wi-Fiあり", seatCountInfo: "5席程度" },
  { id: "hamamatsucho-22", name: "JAHO COFFEE & TEA ブルーフロント芝浦店", address: "東京都港区芝浦1-1-1 BLUE FRONT SHIBAURA GREEN WALK", lat: 35.6490, lng: 139.7545, hoursInfo: "平日7:30〜20:00、土日祝8:00〜20:00" },
  { id: "hamamatsucho-23", name: "CAFE AZUR(ベイサイドホテル アジュール竹芝)", address: "東京都港区海岸1-11-2 ベイサイドホテル アジュール竹芝 4F", lat: 35.6583, lng: 139.7630, outletInfo: "電源コンセントあり", smokingInfo: "全席禁煙", wifiInfo: "無料Wi-Fiあり", hoursInfo: "11:00〜17:00(L.O.16:30)" },
];
