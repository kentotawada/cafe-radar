import type { CafeUsageStyle } from "@/lib/types";

// フチ・持ち手・プラグの線色。黒に近い色だと不気味に見えるため、
// 珈琲を連想させる温かみのある焦茶色にする(視認性は保ったまま)
export const CUP_LINE_COLOR = "#6b4226";

// 利用スタイルごとの内側アイコンの色。白フチで縁取ってどのカップの色の
// 上でもはっきり見えるようにする
export const USAGE_STYLE_ICON_COLOR: Record<CafeUsageStyle, string> = {
  chain: "",
  coworking: "#4b5563",
  independent: "#6b4226",
  night: "#f59e0b",
};

// 利用スタイルごとの内側アイコン。チェーン店は外側のカップ型そのもので
// 「気軽な1杯」を表せるため、あえて内側は無地のままにする
function usageStyleIconHtml(usageStyle: CafeUsageStyle): string {
  const color = USAGE_STYLE_ICON_COLOR[usageStyle];
  if (usageStyle === "coworking") {
    // ノートPC(画面＋台形のキーボード部分)。カップの内側に収まる
    // サイズ・位置にする
    return `<rect x="10" y="6" width="16" height="8" rx="1" fill="${color}" stroke="white" stroke-width="0.8"/><path d="M8 14h20l-1.6 2.4a1 1 0 0 1-.9.5H10.5a1 1 0 0 1-.9-.5L8 14z" fill="${color}" stroke="white" stroke-width="0.8"/>`;
  }
  if (usageStyle === "independent") {
    // コーヒー豆(楕円＋中央の白い筋)
    return `<ellipse cx="18" cy="11" rx="8" ry="6" fill="${color}" stroke="white" stroke-width="0.8" transform="rotate(-8 18 11)"/><path d="M11 11 Q18 7.5 25 11" stroke="white" stroke-width="1.6" fill="none" transform="rotate(-8 18 11)"/>`;
  }
  if (usageStyle === "night") {
    // 三日月(1本のパスで描く塗りつぶしの三日月シルエット)
    return `<g transform="translate(8.4,1.4) scale(0.8)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="${color}" stroke="white" stroke-width="0.8"/></g>`;
  }
  return "";
}

export const CUP_PIN_VIEWBOX = 42;

// 円だけだと地図タイルの色(緑の公園、青の水面など)と紛れて見えにくいため、
// カップ型のピン＋焦茶色のフチ＋影で背景色に関係なく視認できる形にする。
// カプチーノカップのように「低め・横広がり」な形にし、カップ全体の色は
// 混雑度の色(最優先で一目でわかるようにする)、内側のアイコンで利用
// スタイル(チェーン/コワーキング/個人経営/深夜)を表す。電源席の情報が
// 確認できたお店だけ、先端を電源プラグの形にする(電源の有無が不明な
// お店にまで「電源あり」を示唆しないようにするため)。地図のピンにも
// ヘッダーの凡例プレビューにも同じ関数を使い、見た目を一致させる
export function cupPinSvgMarkup(
  statusColor: string,
  usageStyle: CafeUsageStyle,
  showOutletPlug: boolean,
  size: number = CUP_PIN_VIEWBOX
): string {
  const plugHtml = showOutletPlug
    ? `
    <rect x="13" y="19" width="10" height="9" rx="2.5" fill="${CUP_LINE_COLOR}"/>
    <rect x="15.6" y="27" width="1.8" height="6" fill="${CUP_LINE_COLOR}"/>
    <rect x="18.6" y="27" width="1.8" height="6" fill="${CUP_LINE_COLOR}"/>`
    : "";
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${CUP_PIN_VIEWBOX} ${CUP_PIN_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.45));">
    <path d="M4,5 Q4,3 6,3 L30,3 Q32,3 32,5 L32,9 L28,19 Q18,23 8,19 L4,9 Z" fill="${statusColor}" stroke="${CUP_LINE_COLOR}" stroke-width="1.5"/>
    <ellipse cx="18" cy="19.5" rx="6" ry="1.6" fill="${CUP_LINE_COLOR}"/>
    <path d="M31,8 Q39,8.5 39,13.5 Q39,18.5 31,19" fill="none" stroke="${CUP_LINE_COLOR}" stroke-width="1.5"/>
    ${usageStyleIconHtml(usageStyle)}${plugHtml}
  </svg>`;
}
