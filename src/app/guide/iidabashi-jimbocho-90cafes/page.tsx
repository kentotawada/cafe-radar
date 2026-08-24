import type { Metadata } from "next";
import Link from "next/link";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { SURVEYED } from "@/data/surveyed";
import { areas } from "@/data/areas";
import { nearestAreaName, nearestStationWalkMinutes } from "@/lib/lookupCafe";
import { hasOutlet } from "@/lib/cafeAmenities";
import { hasWifi } from "@/lib/cafeStats";
import { webMeetingForbidden } from "@/lib/cafeFilters";
import Footer from "@/components/Footer";

// 2026-08-23 の現地調査(約90軒)を1本の記事にしたページ。
//
// 目的は2つ。
// 1. 検索の受け皿。「飯田橋 カフェ 電源」のような語で戦えるのはエリアページ
//    だが、「カフェ Wi-Fi パスワード」「WEB会議 カフェ」のような横断的な
//    話題はここでしか受けられない。
// 2. 内部リンク。調査済みの全店舗ページへここからリンクすることで、
//    未インデックスの店舗ページの発見を速くする。
//
// 一覧はデータから毎ビルド生成する。記事を書いた後に店の情報を訂正しても、
// 記事の中身が古いままにならない。

const DATE = "2026-08-23";

const surveyed = seedCafes.filter((c) => SURVEYED[c.id] === DATE);

// 本文には出所の注記が長々と付いている。記事全体が「この日の現地確認」の
// 話なので、その注記だけ落として短く出す
function strip(text: string | null | undefined): string | null {
  if (!text) return null;
  return text
    .replace(/[、。]?利用者の現地確認 2026-08-23/g, "")
    .replace(/[、。]?店頭の看板、?/g, "")
    .replace(/[(（]\s*[)）]/g, "")
    .trim();
}

const workReady = surveyed
  .filter((c) => hasOutlet(c) && hasWifi(c) && !webMeetingForbidden(c) && c.webMeetingInfo)
  .sort((a, b) => {
    const seats = (c: Cafe) => Number(c.seatCountInfo?.match(/(\d+)席/)?.[1] ?? 0);
    return seats(b) - seats(a);
  });

const stats = {
  total: surveyed.length,
  outlet: surveyed.filter((c) => hasOutlet(c)).length,
  wifiFree: surveyed.filter((c) => c.wifiInfo?.includes("パスワード不要")).length,
  wifiPw: surveyed.filter((c) => c.wifiInfo?.includes("パスワード式")).length,
  webOk: surveyed.filter((c) => c.webMeetingInfo && !webMeetingForbidden(c)).length,
  webNg: surveyed.filter((c) => webMeetingForbidden(c)).length,
};

export const metadata: Metadata = {
  title: `飯田橋・神楽坂・神保町のカフェ${stats.total}軒を1日で歩いて調べた ― 電源・Wi-Fi・WEB会議の現地レポート`,
  description: `飯田橋・神楽坂・水道橋・神保町・九段下のカフェ${stats.total}軒を1日で回り、コンセント(電源)・Wi-Fi・喫煙・席数・WEB会議の可否を1軒ずつ現地で確認しました。Wi-Fiはパスワード式とパスワード不要の2種類があり、チェーンではっきり分かれます。公式サイトにもグルメサイトにも載っていない現地の記録です。`,
  alternates: { canonical: "/guide/iidabashi-jimbocho-90cafes" },
  openGraph: {
    title: `飯田橋・神楽坂・神保町のカフェ${stats.total}軒を1日で歩いて調べた | カフェレーダー`,
    description:
      "電源・Wi-Fi・WEB会議の可否を1軒ずつ現地で確認。Wi-Fiはパスワード式とパスワード不要の2種類があり、チェーンではっきり分かれます。",
    type: "article",
  },
};

// チェーン別のWi-Fi早見表。この調査で実際に確認できた店舗数を添える。
// 確認していないことは書かない(「全店」とは言わない)
const CHAIN_WIFI: { chain: string; type: string; note: string }[] = [
  { chain: "スターバックス", type: "パスワード不要", note: "7店で確認。東京ドームシティ ミーツポート店のみパスワード式" },
  { chain: "ドトール", type: "パスワード不要", note: "8店で確認" },
  { chain: "タリーズ", type: "パスワード不要", note: "3店で確認" },
  { chain: "カフェ・ベローチェ", type: "パスワード式", note: "4店で確認。店員さんに聞くと教えてくれる" },
  { chain: "珈琲館", type: "パスワード式", note: "3店で確認" },
  { chain: "モスバーガー", type: "docomo契約者向けのみ", note: "2店で確認。一般利用できる無料Wi-Fiは無かった" },
  { chain: "コワーキング系(TOKICAFE・WACRÉ・Basis Point など)", type: "パスワード式", note: "体感でも速い" },
];

const chip = "inline-block rounded bg-gray-100 px-1.5 py-0.5 mr-1 mb-1 text-[11px] text-gray-800";

function ShopRow({ cafe }: { cafe: Cafe }) {
  const rows: [string, string | null][] = [
    ["🔌", strip(cafe.outletInfo)],
    ["📶", strip(cafe.wifiInfo)],
    ["🚬", strip(cafe.smokingInfo)],
    ["🪑", strip(cafe.seatCountInfo)],
    ["🎧", strip(cafe.webMeetingInfo)],
  ];
  return (
    <li className="border-b border-gray-100 py-2.5">
      <Link href={`/cafe/${cafe.id}`} className="font-bold text-[14px] text-blue-800 underline">
        {cafe.name}
      </Link>
      <span className="ml-2 text-[11px] text-gray-500">
        🚶 駅から{nearestStationWalkMinutes(cafe.lat, cafe.lng)}分
      </span>
      <p className="mt-1 leading-relaxed">
        {rows
          .filter(([, v]) => v)
          .map(([emoji, v]) => (
            <span key={emoji} className={chip}>
              {emoji} {v}
            </span>
          ))}
      </p>
    </li>
  );
}

export default function GuidePage() {
  const iidabashiArea = areas.find((a) => a.name === "飯田橋駅");
  const ochanomizuArea = areas.find((a) => a.name === "御茶ノ水駅");

  const groups = [
    ["飯田橋・神楽坂・九段下エリア", surveyed.filter((c) => nearestAreaName(c.lat, c.lng) === "飯田橋駅")],
    ["水道橋・神保町エリア", surveyed.filter((c) => nearestAreaName(c.lat, c.lng) === "御茶ノ水駅")],
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="text-sm text-blue-600 underline">
          ← カフェレーダーの地図へ
        </Link>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <article className="rounded-xl bg-white px-5 py-6 shadow-sm">
          <p className="text-[12px] font-bold text-blue-700">現地調査レポート</p>
          <h1 className="mt-1 text-[22px] font-bold leading-snug">
            飯田橋・神楽坂・神保町のカフェ{stats.total}軒を、1日で歩いて調べた
          </h1>
          <p className="mt-2 text-[12px] text-gray-500">2026年8月23日 現地調査 ／ カフェレーダー編集部（1人）</p>

          <p className="mt-4 text-[14px] leading-relaxed">
            カフェの「電源が何席あるか」「Wi-Fiが実際につながるか」「WEB会議をしていいか」は、
            チェーンの公式サイトにもグルメサイトにもほとんど載っていません。
            載っていないなら足で集めるしかない、ということで、飯田橋・神楽坂・水道橋・神保町・九段下の
            カフェ{stats.total}軒を1日で回って、1軒ずつ確かめてきました。
          </p>

          <h2 className="mt-7 border-l-4 border-blue-600 pl-2 text-[17px] font-bold">
            分かったこと① カフェのWi-Fiは2種類ある
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed">
            スマホのWi-Fi設定画面を開くと、店のWi-Fiには<b>鍵マークが付くもの（パスワード式）</b>と
            <b>付かないもの（パスワード不要）</b>があります。今回の{stats.total}軒では、
            パスワード不要が{stats.wifiFree}軒、パスワード式が{stats.wifiPw}軒でした。
            体感では<b>パスワード式のほうが速い</b>傾向がありました。暗号化されているぶん安心感もあります。
            パスワードは店員さんに聞くか、レシートや店内の掲示に書いてあります。
          </p>

          <h2 className="mt-7 border-l-4 border-blue-600 pl-2 text-[17px] font-bold">
            分かったこと② Wi-Fiの方式はチェーンで決まる
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[13px]">
              <thead>
                <tr className="border-b-2 border-gray-300 text-left">
                  <th className="py-1.5 pr-2">チェーン</th>
                  <th className="py-1.5 pr-2">Wi-Fi</th>
                  <th className="py-1.5">今回確認できた範囲</th>
                </tr>
              </thead>
              <tbody>
                {CHAIN_WIFI.map((row) => (
                  <tr key={row.chain} className="border-b border-gray-100 align-top">
                    <td className="py-1.5 pr-2 font-bold">{row.chain}</td>
                    <td className="py-1.5 pr-2 whitespace-nowrap">{row.type}</td>
                    <td className="py-1.5 text-gray-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-gray-500">
            ※ 2026年8月23日時点。筆者が現地で確認した店舗の範囲です。
          </p>
          <p className="mt-3 text-[14px] leading-relaxed">
            一方で<b>電源の有無と席数は、同じチェーンでも店ごとにバラバラ</b>でした。
            スターバックスでも「電源つきの席が5席だけ」の店もあれば「電源なし」の店もあります。
            ここはチェーン名では判断できず、店ごとに見るしかありません。
          </p>

          <h2 className="mt-7 border-l-4 border-blue-600 pl-2 text-[17px] font-bold">
            分かったこと③ WEB会議は「できる店」が多数派
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed">
            張り紙などで禁止していた店は{stats.webNg}軒。周囲の雰囲気的にできると判断した店が{stats.webOk}軒でした。
            没頭型の作業カフェ(会話自体が禁止)や、静かな純喫茶では禁止・不向きの店があります。
            コワーキングスペースは高い。でも電源とWi-Fiがそろって通話もできるカフェなら、
            コーヒー1杯で同じことができます。
          </p>

          <h2 className="mt-7 border-l-4 border-blue-600 pl-2 text-[17px] font-bold">
            作業向きの店（電源＋Wi-Fi＋WEB会議OK）
          </h2>
          <ul className="mt-2">
            {workReady.slice(0, 10).map((cafe) => (
              <ShopRow key={cafe.id} cafe={cafe} />
            ))}
          </ul>
          <p className="mt-3 text-[13px]">
            地図で探すなら:{" "}
            <Link href="/" className="text-blue-700 underline">
              カフェレーダーの地図
            </Link>
            で「💻作業向き」を押すと、この条件の店だけが出ます。
          </p>

          <h2 className="mt-8 border-l-4 border-blue-600 pl-2 text-[17px] font-bold">
            調べた全{stats.total}軒
          </h2>
          {groups.map(([label, cafes]) => (
            <section key={label}>
              <h3 className="mt-4 text-[15px] font-bold">{label}（{cafes.length}軒）</h3>
              <ul className="mt-1">
                {cafes.map((cafe) => (
                  <ShopRow key={cafe.id} cafe={cafe} />
                ))}
              </ul>
            </section>
          ))}

          <h2 className="mt-8 border-l-4 border-blue-600 pl-2 text-[17px] font-bold">調べ方とお断り</h2>
          <ul className="mt-2 list-disc pl-5 text-[13px] leading-relaxed text-gray-700">
            <li>2026年8月23日に1人で歩いて回りました。すべてその日の現地の状態です。</li>
            <li>Wi-Fiの方式は、スマホのWi-Fi候補に出る店名入りネットワークの鍵マークで判定しました。</li>
            <li>電源の席数は、見て数えるか店員さんに聞きました。</li>
            <li>WEB会議の可否は、禁止の掲示の有無と店内の雰囲気からの判断です。個室ではない以上、周囲への配慮は必要です。</li>
            <li>営業時間・メニュー・店内の状況は変わります。違いを見つけたら、各店舗ページの報告機能で教えてください。すぐ直します。</li>
          </ul>

          <div className="mt-6 rounded-lg bg-blue-50 px-4 py-3 text-[13px] leading-relaxed">
            エリアのまとめはこちら:{" "}
            {iidabashiArea && (
              <Link href={`/area/${iidabashiArea.id}`} className="text-blue-700 underline">
                飯田橋の電源カフェ一覧
              </Link>
            )}
            {" ／ "}
            {ochanomizuArea && (
              <Link href={`/area/${ochanomizuArea.id}`} className="text-blue-700 underline">
                御茶ノ水・神保町の電源カフェ一覧
              </Link>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
