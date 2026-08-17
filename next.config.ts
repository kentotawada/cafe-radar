import type { NextConfig } from "next";

// 口コミに付く写真は Supabase の storage から配る。next/image は外部の
// 置き場を明示しないと表示を拒む。URLは環境変数なので、そこから組み立てる。
//
// 変数が無いとき(手元で未設定のとき)は何も足さない。写真が出ないだけで、
// ビルドは通したい
const supabaseHost = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https" as const,
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
