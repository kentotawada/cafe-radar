import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  lookupCafeById,
  nearestAreaName,
  nearestStationWalkMinutes,
} from "@/lib/lookupCafe";
import { areas } from "@/data/areas";
import { supabase } from "@/lib/supabaseClient";
import { hasOutlet } from "@/lib/cafeAmenities";
import FavoriteToggleButton from "@/components/FavoriteToggleButton";
import ShareButtons from "@/components/ShareButtons";
import AlternativeOptionsBlock from "@/components/AlternativeOptionsBlock";
import BackToMapLink from "@/components/BackToMapLink";
import CafeReviews from "@/components/CafeReviews";
import CafeHours from "@/components/CafeHours";
import AdBanner from "@/components/AdBanner";
import Footer from "@/components/Footer";
import {
  computeStats,
  filterSimilarTimeSlot,
  getQuickBadges,
} from "@/lib/cafeStats";
import type { Report } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STALE_MINUTES = 30;

async function loadReports(cafeId: string): Promise<Report[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("reports")
    .select("*")
    .eq("cafe_id", cafeId);
  return (data as Report[]) ?? [];
}

function formatRelativeTime(iso: string, now: Date): string {
  const minutes = Math.max(
    0,
    Math.round((now.getTime() - new Date(iso).getTime()) / 60000)
  );
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  return `${Math.round(minutes / 60)}時間前`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cafe = await lookupCafeById(id);
  if (!cafe) {
    return { title: "お店が見つかりません" };
  }
  const area = nearestAreaName(cafe.lat, cafe.lng).replace("駅", "");
  const walkMinutes = nearestStationWalkMinutes(cafe.lat, cafe.lng);

  // <title>・検索結果向けの説明文は、エリア名や実際の営業情報を含めた
  // 詳しい文言のままにする(既存のSEO向け実装を踏襲)
  const title = `【${area}】${cafe.name} - 電源・Wi-Fi情報`;
  const descriptionParts = [
    cafe.address,
    cafe.outletInfo,
    cafe.wifiInfo,
    cafe.hoursInfo,
  ].filter((part): part is string => Boolean(part));
  const description =
    descriptionParts.join(" / ") || "カフェレーダーで見つけたお店です。";

  // SNSシェア時のog:title/og:descriptionは指定のフォーマットに固定する
  // (店舗名を主役にした共通コピーで、統一感のあるシェア表示にするため)
  const ogTitle = `【${cafe.name}】電源・Wi-Fi・混雑状況 | カフェレーダー`;
  const ogDescription = `電源の有無やリアルタイム混雑度、作業環境の口コミをチェック。徒歩${walkMinutes}分。`;
  const canonicalPath = `/cafe/${cafe.id}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalPath,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cafe = await lookupCafeById(id);
  if (!cafe) notFound();

  const area = nearestAreaName(cafe.lat, cafe.lng);
  const areaId = areas.find((a) => a.name === area)?.id ?? null;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    cafe.address ?? `${cafe.lat},${cafe.lng}`
  )}`;

  const allReports = await loadReports(cafe.id);
  const now = new Date();
  const staleCutoff = now.getTime() - STALE_MINUTES * 60000;
  const liveReports = allReports.filter(
    (r) => new Date(r.created_at).getTime() >= staleCutoff
  );
  const liveStats = computeStats(liveReports);
  const predictedStats = liveStats
    ? null
    : computeStats(filterSimilarTimeSlot(allReports, now));

  const badges = getQuickBadges(cafe, liveStats, new Set());

  // 「電源なし」「混雑気味」の代替案ブロックをどちらの理由で出すか判定する。
  // 電源席の混雑はライブ報告があるときだけ判定できる(無ければ「なし」扱い)
  const noOutlet = !hasOutlet(cafe, new Set());
  const outletFull = liveStats
    ? liveStats.outletOccupancyCounts.full > liveStats.totalReporters / 2
    : false;

  // 値が無い項目も行ごと残す。消してしまうと「その情報がまだ無い」ことにすら
  // 気づけず、教えようという気も起きない
  const infoRows: {
    emoji: string;
    label: string;
    value: string | null | undefined;
    href?: string | null;
  }[] = [
    { emoji: "⏰", label: "営業時間", value: cafe.hoursInfo },
    { emoji: "📅", label: "定休日", value: cafe.closedDaysInfo },
    { emoji: "🔌", label: "電源", value: cafe.outletInfo },
    { emoji: "📶", label: "Wi-Fi", value: cafe.wifiInfo },
    { emoji: "🚬", label: "喫煙", value: cafe.smokingInfo },
    { emoji: "🪑", label: "席数", value: cafe.seatCountInfo },
    { emoji: "🎧", label: "WEB会議", value: cafe.webMeetingInfo },
    { emoji: "🔗", label: "公式サイト", value: cafe.website, href: cafe.website },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <BackToMapLink className="text-sm text-blue-600 underline flex items-center gap-1">
          ← カフェレーダーに戻る
        </BackToMapLink>
      </header>
      <main className="p-4 max-w-xl mx-auto flex flex-col gap-3">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-white px-5 pt-5 pb-4 flex flex-col gap-2">
            {/* エリアのまとめページへ送る。検索から個別店舗に来た人が
                同じエリアの他店も見られるようにする(内部リンクにもなる)。
                文言が長いとお気に入りボタンが下の行に落ちてしまうため、
                折り返しを止めて1行に収める */}
            <div className="flex items-center justify-between gap-2 flex-nowrap">
              {areaId ? (
                <Link
                  href={`/area/${areaId}`}
                  className="min-w-0 truncate text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-2.5 py-1 hover:bg-blue-200 whitespace-nowrap"
                >
                  📍 {area}のカフェ一覧
                </Link>
              ) : (
                <span className="min-w-0 truncate text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-2.5 py-1 whitespace-nowrap">
                  📍 {area}周辺
                </span>
              )}
              <div className="shrink-0">
                <FavoriteToggleButton cafeId={cafe.id} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">
              {cafe.name}
            </h1>
            {cafe.address && (
              <div className="text-sm text-gray-500">{cafe.address}</div>
            )}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {badges.map((badge) => (
                  <span
                    key={badge.key}
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${badge.className}`}
                  >
                    {badge.emoji} {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="px-5 py-4 flex flex-col gap-3">
            {liveStats ? (
              <div
                className={`rounded-lg p-3 border ${
                  outletFull
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div
                  className={`text-sm font-bold ${
                    outletFull ? "text-red-700" : "text-green-700"
                  }`}
                >
                  🪑 現在の混雑状況
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  最終更新: {formatRelativeTime(liveStats.latestAt, now)}(
                  {liveStats.totalReporters}人の報告)
                </div>
              </div>
            ) : predictedStats ? (
              <div className="rounded-lg p-3 border border-dashed border-gray-300 bg-gray-50">
                <div className="text-sm font-bold text-gray-500">
                  📊 予測混雑度(参考値)
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  今の報告はまだありません。過去の同じ曜日・時間帯の傾向(
                  {predictedStats.totalReporters}件)からの参考値です
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                まだ混雑度の報告がありません
              </div>
            )}

            {/* 公表されている営業時間。編集部調べで埋まっている店はごく一部
                なので、Googleから取って補う */}
            <CafeHours cafeId={cafe.id} />

            <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-3 px-3 py-2 text-sm"
                >
                  <span className="shrink-0">{row.emoji}</span>
                  <span className="shrink-0 text-gray-500 w-20">{row.label}</span>
                  {row.value ? (
                    row.href ? (
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline break-all"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="text-gray-800">{row.value}</span>
                    )
                  ) : (
                    <span className="text-gray-400">未確認</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-1">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
              >
                経路案内
              </a>
              <BackToMapLink className="flex-1 text-center text-sm bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700">
                地図で見る
              </BackToMapLink>
            </div>

            <ShareButtons title={`【${cafe.name}】電源・Wi-Fi・混雑状況 | カフェレーダー`} />
          </div>
        </div>

        {/* 口コミと写真。設備の一覧のすぐ下に置く。決め手になるのは
            「電源がある」よりも「実際どうだったか」なので、
            代替案や広告より前に読ませる */}
        <CafeReviews cafeId={cafe.id} />

        <AlternativeOptionsBlock
          areaName={area.replace("駅", "")}
          noOutlet={noOutlet}
          crowded={outletFull}
        />

        <AdBanner slot="cafe-detail-main" />
      </main>
      <Footer />
    </div>
  );
}
