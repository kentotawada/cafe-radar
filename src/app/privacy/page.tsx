import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b bg-white px-4 py-3">
        <Link href="/" className="text-sm text-blue-600 underline">
          ← カフェレーダーに戻る
        </Link>
      </header>
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 text-sm leading-relaxed text-gray-800">
        <h1 className="text-lg font-bold mb-4">プライバシーポリシー</h1>

        <p className="mb-4">
          カフェレーダー（以下「本サービス」）における情報の取り扱いについて説明します。
        </p>

        <h2 className="font-semibold mt-4 mb-1">アカウント登録について</h2>
        <p className="mb-4">
          本サービスはログインやアカウント登録を必要としません。氏名・メールアドレス・電話番号などの個人情報は取得しません。ただし「お問い合わせ」フォームをご利用いただいた場合は、入力いただいたお名前・メールアドレス・お問い合わせ内容を、対応のためだけに保存します。
        </p>

        <h2 className="font-semibold mt-4 mb-1">位置情報について</h2>
        <p className="mb-4">
          現在地表示・地図の初期表示のため、ブラウザの位置情報取得機能（Geolocation
          API）を使用することがあります。取得は端末の許可が得られた場合のみ行われ、地図の表示のためだけに使われます。位置情報をサーバーに保存することはありません。
        </p>

        <h2 className="font-semibold mt-4 mb-1">端末に保存する情報</h2>
        <p className="mb-4">
          「同じ人の複数回投稿を1票として数える」「お気に入り店舗を覚えておく」ために、匿名のランダムなID（個人を特定できない文字列）とお気に入り店舗の一覧をお使いの端末（ブラウザのlocalStorage）に保存します。これらは他のサイトやサービスと共有されません。
        </p>

        <h2 className="font-semibold mt-4 mb-1">投稿データについて</h2>
        <p className="mb-4">
          電源席・座席の混雑度、騒がしさ、コメント（電源席の場所やだいたいの座席数など）は、匿名の状態でデータベース（Supabase）に保存され、本サービスの利用者全員に表示されます。投稿内容に個人情報を含めないようご注意ください。
        </p>

        <h2 className="font-semibold mt-4 mb-1">Cookieについて</h2>
        <p className="mb-4">
          本サービスおよび本サービスに掲載する広告は、利用状況の分析や、利用者の興味に応じた広告（パーソナライズ広告）の配信のためにCookieを使用することがあります。Cookieには個人を特定する情報は含まれません。ブラウザの設定によりCookieを無効にすることも可能ですが、その場合一部機能が正しく動作しないことがあります。
        </p>

        <h2 className="font-semibold mt-4 mb-1">アクセス解析ツールについて</h2>
        <p className="mb-4">
          本サービスは、サイトの利用状況を把握するためにGoogle
          Analytics等のアクセス解析ツールを利用することがあります。これらのツールはCookieを利用してデータを収集しますが、氏名・住所・メールアドレス・電話番号など個人を特定する情報は含まれません。収集されたデータは各ツール提供者のプライバシーポリシーに基づいて管理されます。
        </p>

        <h2 className="font-semibold mt-4 mb-1">広告配信について（Google AdSense）</h2>
        <p className="mb-4">
          本サービスは、第三者配信の広告サービス「Google
          AdSense」を利用しています。Google
          AdSenseを含む第三者配信事業者は、Cookieを使用して、本サービスや他のサイトへの過去のアクセス情報に基づいて広告を配信することがあります（パーソナライズ広告）。Googleが広告配信に使用するCookieを無効にするには、
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google広告設定ページ
          </a>
          をご覧ください。
        </p>

        <h2 className="font-semibold mt-4 mb-1">外部リンク・アフィリエイトについて</h2>
        <p className="mb-4">
          本サービスでは、モバイルバッテリーレンタルサービスやコワーキングスペースなど、外部サービスへのリンク（アフィリエイトリンクを含む）を掲載することがあります。リンク先のサービスの内容・利用条件については、各サービス提供者のサイトをご確認ください。
        </p>

        <h2 className="font-semibold mt-4 mb-1">お問い合わせ</h2>
        <p>
          本サービスに関するご不明点は、
          <Link href="/contact" className="text-blue-600 underline">
            お問い合わせフォーム
          </Link>
          よりご連絡ください。
        </p>
      </main>
      <Footer />
    </div>
  );
}
