import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas } from "@/data/areas";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { nearestAreaName, nearestStationWalkMinutes } from "@/lib/lookupCafe";
import { hasOutlet } from "@/lib/cafeAmenities";
import { getQuickBadges, hasWifi, isNonSmoking } from "@/lib/cafeStats";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import HistoryBackLink from "@/components/HistoryBackLink";

// エリアごとのまとめページ。個別店舗ページ(/cafe/[id])は1店舗ずつで
// 情報量が薄く、「渋谷 カフェ 電源」のような検索では戦いにくい。
// エリア単位でまとめた一覧を用意して、そこを検索の受け皿にする。
// 全23エリアぶんを事前生成する(データは静的なので毎回作り直す必要がない)

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return areas.map((area) => ({ id: area.id }));
}

function cafesForArea(areaName: string): Cafe[] {
  const list = seedCafes.filter((cafe) => nearestAreaName(cafe.lat, cafe.lng) === areaName);
  // 「電源が使えるか」がこのアプリを使う理由なので、電源あり→Wi-Fiあり→
  // 座席数がわかる、の順で上に持ってくる。同条件なら駅から近い順
  return list.sort((a, b) => {
    const score = (cafe: Cafe) =>
      (hasOutlet(cafe) ? 4 : 0) +
      (hasWifi(cafe) ? 2 : 0) +
      (cafe.seatCountInfo ? 1 : 0);
    const diff = score(b) - score(a);
    if (diff !== 0) return diff;
    return (
      nearestStationWalkMinutes(a.lat, a.lng) - nearestStationWalkMinutes(b.lat, b.lng)
    );
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const area = areas.find((a) => a.id === id);
  if (!area) return { title: "エリアが見つかりません" };

  const cafes = cafesForArea(area.name);
  const shortName = area.name.replace("駅", "");
  const outletCount = cafes.filter((cafe) => hasOutlet(cafe)).length;

  // 実際に検索されるのは「電源」より「コンセント」が多い(例:
  // 「新宿 コンセント カフェ」)。データ側には「コンセント」を含む
  // 記述が多数あるのに、ページ側の文言が「電源」だけで揃っていたため
  // 検索語と一致していなかった。両方を含める
  return {
    title: `${shortName}でコンセント・電源が使えるカフェ${cafes.length}選`,
    description: `${shortName}周辺のカフェ${cafes.length}軒を、コンセント(電源)の有無・Wi-Fi・座席数・喫煙可否まで1軒ずつ調べてまとめました。電源が使えるお店は${outletCount}軒。仕事や勉強の作業場所探しに。混雑状況は利用者の投稿でリアルタイムに更新されます。`,
    alternates: { canonical: `/area/${area.id}` },
    openGraph: {
      title: `${shortName}でコンセント・電源が使えるカフェ${cafes.length}選 | カフェレーダー`,
      description: `コンセントが使えるお店は${outletCount}軒。座席数や喫煙可否まで1軒ずつ調べています。`,
      type: "article",
    },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { id } = await params;
  const area = areas.find((a) => a.id === id);
  if (!area) notFound();

  const cafes = cafesForArea(area.name);
  const shortName = area.name.replace("駅", "");
  const outletCount = cafes.filter((cafe) => hasOutlet(cafe)).length;
  const wifiCount = cafes.filter((cafe) => hasWifi(cafe)).length;
  const nonSmokingCount = cafes.filter((cafe) => isNonSmoking(cafe)).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 店舗詳細からこのページに来た場合、そこへ戻る手段が無かった。
            検索から直接開いた人には戻り先が無いので地図へ送る */}
        <div className="flex items-center gap-3">
          <HistoryBackLink
            fallbackHref="/"
            className="text-sm text-blue-600 underline"
          >
            ← 戻る
          </HistoryBackLink>
          <Link href="/" className="text-sm text-blue-600 underline">
            地図で見る
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-3">
          {shortName}でコンセント・電源が使えるカフェ{cafes.length}選
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {shortName}周辺のカフェを1軒ずつ調べ、コンセント(電源)の有無・Wi-Fi・喫煙可否・座席数をまとめました。
          仕事や勉強で作業できる場所を探すときにお使いください。
          営業時間や座席数は各店舗の公表情報をもとにしています。混雑状況は利用者の投稿でリアルタイムに更新されます。
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 rounded-full px-3 py-1">
            🔌 電源あり {outletCount}軒
          </span>
          <span className="text-xs font-semibold bg-sky-100 text-sky-800 rounded-full px-3 py-1">
            📶 Wi-Fiあり {wifiCount}軒
          </span>
          <span className="text-xs font-semibold bg-green-100 text-green-800 rounded-full px-3 py-1">
            🚭 禁煙 {nonSmokingCount}軒
          </span>
        </div>

        <AdBanner slot="area-top" className="my-6" />

        <ul className="flex flex-col gap-3">
          {cafes.map((cafe, index) => {
            // 実際の混雑報告はクライアント側でしか取れないので、ここでは
            // 編集部調べの情報だけでバッジを出す(statsはnull)
            const badges = getQuickBadges(cafe, null, new Set());
            const walk = nearestStationWalkMinutes(cafe.lat, cafe.lng);
            return (
              <li key={cafe.id}>
                <Link
                  href={`/cafe/${cafe.id}`}
                  className="block bg-white border border-gray-200 rounded-lg shadow-sm p-3 hover:border-blue-300"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-gray-400 mt-0.5 shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900">
                        {cafe.name}
                      </div>
                      {cafe.address && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {cafe.address}
                        </div>
                      )}
                      {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {badges.map((badge) => (
                            <span
                              key={badge.key}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.className}`}
                            >
                              {badge.emoji} {badge.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* 電源の説明文そのものを出す。このページを開く人が
                          一番知りたい情報であり、原文には「コンセント」を
                          含む記述が多く、検索語とも一致する */}
                      {cafe.outletInfo && (
                        <div className="text-xs text-blue-800 bg-blue-50 rounded px-2 py-1 mt-1.5">
                          🔌 {cafe.outletInfo}
                        </div>
                      )}
                      {cafe.wifiInfo && (
                        <div className="text-xs text-gray-600 mt-1">
                          📶 {cafe.wifiInfo}
                        </div>
                      )}
                      {cafe.hoursInfo && (
                        <div className="text-xs text-gray-500 mt-1">
                          ⏰ {cafe.hoursInfo}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 shrink-0">
                      🚶 {walk}分
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <h2 className="text-base font-bold text-gray-900 mt-10 mb-2">
          ほかのエリアから探す
        </h2>
        <div className="flex flex-wrap gap-2">
          {areas
            .filter((other) => other.id !== area.id)
            .map((other) => (
              <Link
                key={other.id}
                href={`/area/${other.id}`}
                className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1.5 text-gray-700 hover:border-blue-300"
              >
                {other.name.replace("駅", "")}
              </Link>
            ))}
        </div>

        <Footer />
      </div>
    </div>
  );
}
