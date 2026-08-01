import type { Metadata } from "next";
import Link from "next/link";
import BusinessInquiryForm from "@/components/BusinessInquiryForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "店舗掲載・法人の方へ",
  description:
    "カフェレーダーに店舗の空き時間集客や電源席のPRを掲載しませんか？作業目的でお店を探すユーザーに直接届けます。",
};

const FEATURES = [
  {
    emoji: "📊",
    title: "空いている時間を可視化して集客",
    body: "リアルタイムの混雑度・電源席の空き状況が地図とお店ページに表示されます。閑散時間帯こそ「今なら入れる」ことが一目でわかり、新しいお客様の来店につながります。",
  },
  {
    emoji: "🔌",
    title: "電源・Wi-Fi・作業環境をPR",
    body: "「電源あり」「Wi-Fiあり」といった作業目的の来店に直結する情報を、お店ページとSNSシェア時の画像に自動で表示。カフェで作業したい人に的確にリーチできます。",
  },
  {
    emoji: "📍",
    title: "地図・口コミベースの自然な集客",
    body: "エリア検索や利用者の口コミを通じて見つけてもらえます。広告色の強い掲載ではなく、実際に役立つ情報として自然にお店の魅力が伝わります。",
  },
];

const STEPS = [
  { step: "1", title: "フォームから相談", body: "下のフォームから店舗名とご相談内容をお送りください。" },
  { step: "2", title: "内容の確認・ご連絡", body: "担当より2〜3営業日以内にメールでご連絡し、掲載内容をすり合わせます。" },
  { step: "3", title: "掲載開始", body: "情報を反映後、カフェレーダー上でお店の情報が表示されるようになります。" },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="text-sm text-blue-600 underline">
          ← カフェレーダーに戻る
        </Link>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-12 sm:py-16">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-3 py-1">
              店舗様・法人のご担当者様へ
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug text-balance">
              空いている時間も、電源席も、
              <br />
              カフェレーダーで届けよう
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg">
              カフェレーダーに店舗の空き時間集客や電源席のPRを掲載しませんか？
              作業目的でお店を探しているユーザーに、リアルタイムの混雑・電源情報とあわせて直接届けます。
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:py-12">
          <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="text-2xl" aria-hidden>
                  {f.emoji}
                </div>
                <div className="text-sm font-bold text-gray-900">{f.title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{f.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-10 sm:py-12 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
              掲載までの流れ
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.step} className="flex flex-col gap-1.5">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                    {s.step}
                  </div>
                  <div className="text-sm font-bold text-gray-900">{s.title}</div>
                  <div className="text-xs text-gray-600 leading-relaxed">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">
              掲載・データ連携のご相談
            </h2>
            <p className="text-xs text-gray-500 mb-6 text-center">
              掲載内容やご不明点など、まずはお気軽にご相談ください。
            </p>
            <BusinessInquiryForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
