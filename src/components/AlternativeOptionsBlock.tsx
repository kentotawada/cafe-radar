type AlternativeOptionsBlockProps = {
  areaName: string;
  noOutlet: boolean;
  crowded: boolean;
};

const CHARGESPOT_URL =
  process.env.NEXT_PUBLIC_CHARGESPOT_URL ??
  "https://chargespot.jp/";

// スペース時間貸し(yoyappin等)のアフィリエイトリンク。未設定の間は
// 従来どおりGoogleマップ検索にフォールバックするので、URLが用意でき
// 次第Vercelの環境変数に入れるだけで切り替わる
const WORKSPACE_URL = process.env.NEXT_PUBLIC_WORKSPACE_AFFILIATE_URL;

// 「電源なし」または「混雑気味」のお店で、困っているユーザーに次の一手を
// 提案するブロック。広告色を出しすぎないよう、あくまで案内・提案の
// トーンでまとめる(枠自体はAdBannerとは別物で、アフィリエイト導線)
export default function AlternativeOptionsBlock({
  areaName,
  noOutlet,
  crowded,
}: AlternativeOptionsBlockProps) {
  if (!noOutlet && !crowded) return null;

  const heading =
    noOutlet && crowded
      ? "電源が無く、席も混み合っているようです"
      : noOutlet
      ? "このお店には電源席が無いようです"
      : "このお店は今、混み合っているようです";

  const coworkingSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    `${areaName} コワーキングスペース ドロップイン`
  )}`;
  const workspaceUrl = WORKSPACE_URL ?? coworkingSearchUrl;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-1.5">
          <div className="text-sm font-bold text-amber-800">💡 {heading}</div>
          {/* ステマ規制(景品表示法)対応。rel="sponsored"はクローラ向けで
              ユーザーには見えないため、目視できる表示が別途必要 */}
          <span className="shrink-0 text-[10px] leading-none text-amber-700 border border-amber-300 bg-amber-100 rounded px-1 py-0.5">
            PR
          </span>
        </div>
        <div className="text-xs text-amber-700 mt-0.5">
          代わりの作業場所や充電手段をチェックしてみませんか？
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <a
          href={CHARGESPOT_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-amber-300"
        >
          <span className="text-xl shrink-0" aria-hidden>
            🔋
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900">
              近くで充電する
            </div>
            <div className="text-xs text-gray-500">
              ChargeSPOTでモバイルバッテリーをレンタル
            </div>
          </div>
          <span className="text-xs text-blue-600 shrink-0">探す →</span>
        </a>

        <a
          href={workspaceUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-amber-300"
        >
          <span className="text-xl shrink-0" aria-hidden>
            🏢
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900">
              別の作業場所を探す
            </div>
            <div className="text-xs text-gray-500">
              {WORKSPACE_URL
                ? "会議室・コワーキングを15分単位で予約"
                : `${areaName}周辺のコワーキングスペース・ドロップイン施設`}
            </div>
          </div>
          <span className="text-xs text-blue-600 shrink-0">探す →</span>
        </a>
      </div>
    </div>
  );
}
