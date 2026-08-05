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

// A8の素材はリンクと対で1x1のインプレッション計測gifが配布される。
// 無くても成果(クリック→予約)は計測されるが、入れないと管理画面の
// 表示回数が0のままでクリック率が出せない。任意設定
const WORKSPACE_IMPRESSION_URL =
  process.env.NEXT_PUBLIC_WORKSPACE_AFFILIATE_IMPRESSION_URL;

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
          rel="noopener noreferrer sponsored nofollow"
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
              {/* 広告主提供のPR文は「運営サイトへの転載は広告表示に適さない
                  場合がある」と明記されているため転載しない。ここは公式サイト
                  記載の事実(最短15分から/貸会議室・レンタルスペース)だけで書く */}
              {WORKSPACE_URL
                ? "貸会議室・レンタルスペースを最短15分から予約"
                : `${areaName}周辺のコワーキングスペース・ドロップイン施設`}
            </div>
          </div>
          <span className="text-xs text-blue-600 shrink-0">探す →</span>
        </a>
      </div>

      {/* A8のインプレッション計測用1x1gif。リンクを実際に出している時だけ送る */}
      {WORKSPACE_URL && WORKSPACE_IMPRESSION_URL && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={WORKSPACE_IMPRESSION_URL} width={1} height={1} alt="" aria-hidden />
      )}
    </div>
  );
}
