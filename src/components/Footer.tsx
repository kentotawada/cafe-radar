import Link from "next/link";

// 通常のスクロールページ(店舗詳細・プライバシーポリシー・お問い合わせ等)
// の末尾に置くフッター。トップページは地図が画面いっぱいに固定表示される
// レイアウトのため、代わりにヘッダー内の小さなリンクで案内している
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-6 text-xs text-gray-500">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/" className="hover:text-gray-700 underline">
            カフェレーダー
          </Link>
          <Link href="/privacy" className="hover:text-gray-700 underline">
            プライバシーポリシー
          </Link>
          <Link href="/contact" className="hover:text-gray-700 underline">
            お問い合わせ
          </Link>
        </div>
        <p className="text-gray-400">© {new Date().getFullYear()} カフェレーダー</p>
      </div>
    </footer>
  );
}
