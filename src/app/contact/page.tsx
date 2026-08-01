import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "カフェレーダーへのご意見、店舗掲載のご相談、データ利用・取材のお問い合わせはこちらから。",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="text-sm text-blue-600 underline">
          ← カフェレーダーに戻る
        </Link>
      </header>
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8">
        <h1 className="text-lg font-bold text-gray-900 mb-2">お問い合わせ</h1>
        <p className="text-sm text-gray-600 mb-6">
          店舗掲載のご相談、データ連携・取材のご依頼、その他ご意見はこちらのフォームからお送りください。
        </p>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
