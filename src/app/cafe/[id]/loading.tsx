// 店名を押してから店舗ページが出るまでの間に見せるもの。
//
// このページはサーバー側で店舗を引き、混雑報告をSupabaseから取ってから
// 返している。歩きながらの回線だとその往復に数秒かかり、その間ずっと
// 前の画面のままだった。押したのに何も起きないように見えるので、
// すぐ骨組みだけ出して「開いている」と分かるようにする。
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <span className="text-sm text-blue-600">← カフェレーダーに戻る</span>
      </header>
      <main className="p-4 max-w-xl mx-auto flex flex-col gap-3">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3">
          <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
          <div className="mt-2 flex flex-col gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-5 w-full rounded bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-gray-500">店舗情報を読み込んでいます…</p>
      </main>
    </div>
  );
}
