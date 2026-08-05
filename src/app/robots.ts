import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 管理者用・広告主用の画面とAPIはクロールされても意味がない。
      // ログインで保護されてはいるが、検索結果に出す理由も無いので除外する
      disallow: ["/admin", "/advertiser", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
