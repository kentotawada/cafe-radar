"use client";

import ReactDOM from "react-dom";

// 地図ページの表示が遅い原因を実測したところ、TTFB 0.28秒に対して
// LCP 5.1秒だった。自分のJSは830msで揃っているのに、そこから地図タイルが
// 出るまでが長い。地図は ssr:false なので、タイルの取得は
// 「HTML → JS読込 → hydrate → Leaflet初期化」がすべて終わってから
// 初めて始まる。その時点で初めてDNS解決とTLS handshakeが走るため、
// モバイル回線では数百ミリ秒がまるごと待ち時間になる。
//
// 接続だけを先に張っておけば、Leafletがタイルを要求した瞬間に
// リクエストを送れる。ダウンロード量は増えないので副作用はない。
//
// Next.jsのMetadata APIはpreconnectに対応していないため、
// ReactDOMのメソッドを使う(node_modules/next/dist/docs/01-app/
// 03-api-reference/04-functions/generate-metadata.md の
// 「Resource hints」に、この方法が指定されている)。

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

// CafeMapのTILE_URLと同じ分岐。キーの有無で接続先が変わるので揃えておく
const TILE_ORIGIN = MAPTILER_KEY
  ? "https://api.maptiler.com"
  : "https://a.basemaps.cartocdn.com";

export default function PreloadResources() {
  // タイルはCORSで取るのでcrossOriginを合わせないと接続が再利用されない
  ReactDOM.preconnect(TILE_ORIGIN, { crossOrigin: "anonymous" });

  // 混雑報告の取得。実測で1.6秒かかっていた
  if (SUPABASE_URL) {
    ReactDOM.preconnect(SUPABASE_URL, { crossOrigin: "anonymous" });
  }

  // 広告は連鎖して4つのホストに繋ぎに行く。こちらは実際に読むか
  // わからない(広告ブロッカー・未配信)ため、接続までは張らずDNSだけ引く
  if (ADSENSE_ID) {
    ReactDOM.prefetchDNS("https://googleads.g.doubleclick.net");
    ReactDOM.prefetchDNS("https://tpc.googlesyndication.com");
  }

  return null;
}
