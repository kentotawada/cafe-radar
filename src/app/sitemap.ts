import type { MetadataRoute } from "next";
import { seedCafes } from "@/lib/seedCafes";
import { areas } from "@/data/areas";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// 店舗ページが検索から見つかるようにする。地図のポップアップに詳細への
// 導線を足したのが最近で内部リンクがまだ薄いため、sitemapで直接申請する。
// Googleの上限は1ファイル50,000URLなので、現在の約2,000件では分割不要。
//
// lastModifiedは意図的に付けていない。店舗ごとの更新日時を持っておらず、
// ビルド時刻を入れると「全件が今更新された」という誤った申告になるため。
//
// /favorites と /list は端末内のお気に入りやクエリパラメータで中身が
// 決まるので、クローラーから見ると内容が無い。sitemapには載せない。
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/business`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ユーザーが「お店を追加」で登録した店舗(Supabase側)は、まだ他の人の
  // 確認が取れていないものが混じるため載せない。編集部調べの分だけ出す
  const cafePages: MetadataRoute.Sitemap = seedCafes.map((cafe) => ({
    url: `${SITE_URL}/cafe/${cafe.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // エリア別まとめページ。個別店舗より検索で戦える受け皿なので、
  // 店舗ページより高い優先度にしておく
  const areaPages: MetadataRoute.Sitemap = areas.map((area) => ({
    url: `${SITE_URL}/area/${area.id}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...areaPages, ...cafePages];
}
