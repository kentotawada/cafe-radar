export type NoiseLevel = "quiet" | "normal" | "noisy" | "loud";
export type OccupancyLevel = "empty" | "sparse" | "moderate" | "full";
export type WifiSpeed = "fast" | "standard" | "restricted" | "none";
// 電源席の配置。編集部調べのテキストから推測する(実測ではないので目安)
export type PowerSupplyTier = "all" | "counter" | "few" | "none";

// カフェの利用シーン・滞在スタイルによる分類(店名から推定、編集部調べ)。
// チェーン=気軽に入れる・短時間利用、コワーキング=フルタイム作業向け、
// 個人経営/おしゃれ=気分転換・ゆったり作業、深夜=夜間・早朝のノマド利用
export type CafeUsageStyle = "chain" | "coworking" | "independent" | "night";

export type Report = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  outlet_occupancy: OccupancyLevel;
  seating_occupancy: OccupancyLevel;
  noise_level: NoiseLevel;
  created_at: string;
};

// 「電源席の場所」「だいたいの座席数」など、その場の混雑度と違って
// 時間が経っても変わらない情報。30分で消える reports とは別に、ずっと残す。
export type CafeFact = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  note: string | null;
  seat_count: number | null;
  outlet_seat_count: number | null;
  // Wi-Fiの速度・WEB会議可否は編集部調べのデータが無いため、
  // みんなの投稿で少しずつ集めていく新項目
  wifi_speed: WifiSpeed | null;
  web_meeting_ok: boolean | null;
  created_at: string;
};

// ユーザーが追加した店舗に対する「存在しない・間違っている」という報告
export type CafeFlag = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  created_at: string;
};

// 店舗情報(喫煙・電源・Wi-Fi等の編集部調べ情報)が実際と違うという指摘報告
export type InfoCorrection = {
  id: string;
  cafe_id: string;
  reporter_id: string | null;
  message: string;
  created_at: string;
};

// 店舗に紐づかない、アプリ全体へのお問い合わせ。/contact ページ(一般のご意見・
// データ利用/取材の依頼)、/business ページ(店舗掲載・法人向け)、アプリ内の
// 簡易お問い合わせボタンの3つがこのテーブルに書き込む。name/email/category/
// store_nameは/contact・/business経由の時だけ入る(store_nameは/business限定)
export type InquiryCategory = "general" | "listing" | "media";

export type Inquiry = {
  id: string;
  reporter_id: string | null;
  message: string;
  name: string | null;
  email: string | null;
  category: InquiryCategory | null;
  store_name: string | null;
  created_at: string;
};

export type CafeStats = {
  totalReporters: number;
  outletOccupancyCounts: Record<OccupancyLevel, number>;
  seatingOccupancyCounts: Record<OccupancyLevel, number>;
  noiseCounts: Record<NoiseLevel, number>;
  latestAt: string;
};

// Googleマップと見比べて調べた主要な目印(駅出口・有名な建物・学校など)。
// カフェのピンとは別の控えめな見た目で地図に重ね、周辺の位置関係が
// つかみやすいようにする(編集部調べ、クラウドソースの報告対象ではない)
export type LandmarkCategory =
  | "station_exit"
  | "building"
  | "school"
  | "bank"
  | "conveni_seven"
  | "conveni_lawson"
  | "conveni_familymart"
  | "traffic_signal"
  | "restaurant"
  | "drugstore"
  | "other";

export type Landmark = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: LandmarkCategory;
};

// 広告主。カフェオーナー(自店舗の掲載促進)・第三者企業(バナー出稿)の
// どちらにも対応できるようtypeで区別する(MVPの実装フローはどちらか一方)
export type AdvertiserType = "cafe_owner" | "business";
export type AdvertiserStatus = "invited" | "active" | "suspended";

export type Advertiser = {
  id: string;
  user_id: string | null;
  name: string;
  type: AdvertiserType;
  cafe_id: string | null;
  contact_email: string;
  status: AdvertiserStatus;
  created_at: string;
};

// 広告主が投稿する掲載クリエイティブ。差し替えは新規行のpending投稿として
// 扱い、表示側はstatus='approved'かつ期間内で最新の1件を選ぶ
export type AdCreativeStatus = "pending" | "approved" | "rejected";

export type AdCreative = {
  id: string;
  advertiser_id: string;
  slot: "banner";
  image_url: string;
  link_url: string;
  alt_text: string;
  status: AdCreativeStatus;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};
