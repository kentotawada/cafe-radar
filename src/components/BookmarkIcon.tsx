// しおり(保存)の印。押す前と後で絵柄は変えず、色だけが変わる。
//
// 前は 🏷 と 🔖 の絵文字を切り替えていたが、形そのものが変わるので
// 「押したのか、別の何かになったのか」が分からないと言われた。
// 同じ形のまま、灰色の枠線 → 塗りつぶし に変えるほうが状態が読み取れる。
// 絵文字は端末ごとに色も形も変わり、こちらで色を指定できないので図形で描く。
export default function BookmarkIcon({
  filled,
  size = 16,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.5 3h11a1 1 0 0 1 1 1v17l-6.5-4-6.5 4V4a1 1 0 0 1 1-1z"
        fill={filled ? "#2563eb" : "none"}
        stroke={filled ? "#2563eb" : "#9ca3af"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
