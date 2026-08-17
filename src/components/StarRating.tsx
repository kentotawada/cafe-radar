"use client";

// 星の評価。表示と入力を1つの部品にまとめる。
//
// 平均は半端な値になるので、星の内側を割合で塗って表す。数字だけだと
// 「3.7」がどのくらい良いのか掴みにくい。
export default function StarRating({
  value,
  size = 14,
  onRate,
  disabled,
}: {
  /** 表示する点。null なら空の星 */
  value: number | null;
  size?: number;
  /** 渡すと押して点を付けられる。渡さなければ表示だけ */
  onRate?: (score: number) => void;
  disabled?: boolean;
}) {
  const filled = value ?? 0;
  return (
    <span className="inline-flex items-center" style={{ gap: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        // n 番目の星が何割塗られるか
        const ratio = Math.max(0, Math.min(1, filled - (n - 1)));
        const star = (
          <span
            className="relative inline-block leading-none"
            style={{ width: size, height: size, fontSize: size }}
            aria-hidden="true"
          >
            <span className="absolute inset-0 text-gray-300">★</span>
            <span
              className="absolute inset-0 overflow-hidden text-amber-500"
              style={{ width: `${ratio * 100}%` }}
            >
              ★
            </span>
          </span>
        );
        if (!onRate) return <span key={n}>{star}</span>;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onRate(n)}
            aria-label={`${n}`}
            className="leading-none disabled:opacity-50"
          >
            {star}
          </button>
        );
      })}
    </span>
  );
}
