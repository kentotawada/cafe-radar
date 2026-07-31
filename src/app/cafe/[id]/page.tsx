import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { lookupCafeById, nearestAreaName } from "@/lib/lookupCafe";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cafe = await lookupCafeById(id);
  if (!cafe) {
    return { title: "お店が見つかりません | カフェレーダー" };
  }
  const area = nearestAreaName(cafe.lat, cafe.lng).replace("駅", "");
  const title = `【${area}】${cafe.name} - 電源・Wi-Fi情報 | カフェレーダー`;
  const descriptionParts = [
    cafe.address,
    cafe.outletInfo,
    cafe.wifiInfo,
    cafe.hoursInfo,
  ].filter((part): part is string => Boolean(part));
  const description =
    descriptionParts.join(" / ") || "カフェレーダーで見つけたお店です。";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CafeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cafe = await lookupCafeById(id);
  if (!cafe) notFound();

  const area = nearestAreaName(cafe.lat, cafe.lng);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    cafe.address ?? `${cafe.lat},${cafe.lng}`
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="text-sm text-blue-600 underline">
          ← カフェレーダーに戻る
        </Link>
      </header>
      <main className="p-4 max-w-xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
          <div className="text-xs text-gray-400">{area}周辺</div>
          <h1 className="text-lg font-bold text-gray-900">{cafe.name}</h1>
          {cafe.address && (
            <div className="text-sm text-gray-500">{cafe.address}</div>
          )}
          <div className="flex flex-col gap-1 text-sm text-gray-700 mt-2">
            {cafe.hoursInfo && <div>⏰ 営業時間: {cafe.hoursInfo}</div>}
            {cafe.closedDaysInfo && <div>📅 定休日: {cafe.closedDaysInfo}</div>}
            {cafe.outletInfo && <div>🔌 電源: {cafe.outletInfo}</div>}
            {cafe.wifiInfo && <div>📶 Wi-Fi: {cafe.wifiInfo}</div>}
            {cafe.smokingInfo && <div>🚬 喫煙: {cafe.smokingInfo}</div>}
            {cafe.seatCountInfo && <div>🪑 席数: {cafe.seatCountInfo}</div>}
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline mt-2"
          >
            経路案内(Googleマップ)
          </a>
          <div className="text-xs text-gray-400 mt-2">
            最新の混雑状況・電源席の口コミはカフェレーダーの地図でご確認ください
          </div>
          <Link
            href="/"
            className="text-sm bg-blue-600 text-white rounded px-3 py-2 text-center mt-1"
          >
            地図で混雑状況を見る
          </Link>
        </div>
      </main>
    </div>
  );
}
