export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-sm leading-relaxed text-gray-800">
      <h1 className="text-lg font-bold mb-4">プライバシーポリシー</h1>

      <p className="mb-4">
        新宿カフェレーダー（以下「本サービス」）における情報の取り扱いについて説明します。
      </p>

      <h2 className="font-semibold mt-4 mb-1">アカウント登録について</h2>
      <p className="mb-4">
        本サービスはログインやアカウント登録を必要としません。氏名・メールアドレス・電話番号などの個人情報は取得しません。
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

      <h2 className="font-semibold mt-4 mb-1">アクセス解析について</h2>
      <p className="mb-4">
        本サービスは現時点でアクセス解析ツール（Google Analytics等）を導入していません。導入した場合はこのページで改めてお知らせします。
      </p>

      <h2 className="font-semibold mt-4 mb-1">お問い合わせ</h2>
      <p>
        本サービスは個人が運営するプロトタイプです。ご不明点はGitHubリポジトリのIssueなどでご連絡ください。
      </p>
    </div>
  );
}
