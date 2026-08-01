// 文字列(店舗ID・レポーターID)から毎回同じ見た目になる、ゆるい
// キャラクターを生成する。写真が無いお店同士を見分けやすくするためと、
// 報告してくれた人自身のキャラを育てる(レベルに応じてstageが上がり
// 装飾が増える)ゲーミフィケーションの両方で、同じ生成器を使い回す

function hashSeed(seed: string): number {
  // FNV-1a 32bit。暗号強度は不要で、同じ文字列から毎回同じ数値が
  // 安定して得られればよい
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const BODY_COLORS = [
  "#F97316", "#EAB308", "#22C55E", "#06B6D4", "#3B82F6",
  "#8B5CF6", "#EC4899", "#F43F5E", "#84CC16", "#14B8A6",
];
const EYE_STYLES = ["round", "sleepy", "star"] as const;
const MOUTH_STYLES = ["smile", "flat", "open"] as const;
const SHAPES = ["round", "wide", "tall"] as const;

export type CreatureTraits = {
  color: string;
  eye: (typeof EYE_STYLES)[number];
  mouth: (typeof MOUTH_STYLES)[number];
  shape: (typeof SHAPES)[number];
  horn: boolean;
  spots: boolean;
};

export function creatureTraits(seed: string): CreatureTraits {
  const h = hashSeed(seed);
  return {
    color: BODY_COLORS[h % BODY_COLORS.length],
    eye: EYE_STYLES[(h >>> 4) % EYE_STYLES.length],
    mouth: MOUTH_STYLES[(h >>> 8) % MOUTH_STYLES.length],
    shape: SHAPES[(h >>> 12) % SHAPES.length],
    horn: (h >>> 16) % 2 === 0,
    spots: (h >>> 18) % 2 === 0,
  };
}

function bodyPath(shape: CreatureTraits["shape"]): { rx: number; ry: number } {
  if (shape === "wide") return { rx: 17, ry: 12 };
  if (shape === "tall") return { rx: 12, ry: 17 };
  return { rx: 15, ry: 15 };
}

function eyesHtml(eye: CreatureTraits["eye"]): string {
  if (eye === "sleepy") {
    return `<rect x="10" y="17.5" width="8" height="2.4" rx="1.2" fill="#1f2937"/><rect x="22" y="17.5" width="8" height="2.4" rx="1.2" fill="#1f2937"/>`;
  }
  if (eye === "star") {
    return `<rect x="12" y="16" width="4" height="4" fill="#1f2937" transform="rotate(45 14 18)"/><rect x="24" y="16" width="4" height="4" fill="#1f2937" transform="rotate(45 26 18)"/>`;
  }
  return `<circle cx="14" cy="18" r="4" fill="#ffffff"/><circle cx="26" cy="18" r="4" fill="#ffffff"/><circle cx="14" cy="18" r="2" fill="#1f2937"/><circle cx="26" cy="18" r="2" fill="#1f2937"/>`;
}

function mouthHtml(mouth: CreatureTraits["mouth"]): string {
  if (mouth === "flat") {
    return `<line x1="15" y1="28" x2="25" y2="28" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/>`;
  }
  if (mouth === "open") {
    return `<ellipse cx="20" cy="28" rx="3.5" ry="3" fill="#1f2937"/>`;
  }
  return `<path d="M14 27 Q20 33 26 27" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

// stageはレポーター自身のキャラ育成専用(1〜5)。お店のキャラは常にstage=1
// (お店側は「育つ」概念が無いため、装飾なしのシンプルな見た目で統一する)
function stageDecorationHtml(stage: number): string {
  let html = "";
  if (stage >= 3) {
    html += `<ellipse cx="20" cy="21" rx="19" ry="18" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.65"/>`;
  }
  if (stage >= 4) {
    html += `<path d="M11 8 L13.5 3 L17 7.5 L20 2 L23 7.5 L26.5 3 L29 8 L26.5 10 L13.5 10 Z" fill="#FBBF24" stroke="#B45309" stroke-width="0.8"/>`;
  }
  if (stage >= 2) {
    html += `<path d="M33 6 L34 9 L37 10 L34 11 L33 14 L32 11 L29 10 L32 9 Z" fill="#FBBF24"/>`;
  }
  if (stage >= 5) {
    html += `<path d="M4 30 L4.7 32 L6.5 32.7 L4.7 33.4 L4 35.4 L3.3 33.4 L1.5 32.7 L3.3 32 Z" fill="#FBBF24"/>`;
  }
  return html;
}

export function creatureSvgMarkup(seed: string, size = 40, stage = 1): string {
  const t = creatureTraits(seed);
  const { rx, ry } = bodyPath(t.shape);
  const hornHtml = t.horn
    ? `<path d="M17 9 L20 2 L23 9 Z" fill="${t.color}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>`
    : "";
  const spotsHtml = t.spots
    ? `<circle cx="11" cy="26" r="2.2" fill="rgba(255,255,255,0.35)"/><circle cx="29" cy="24" r="1.6" fill="rgba(255,255,255,0.35)"/><circle cx="22" cy="12" r="1.4" fill="rgba(255,255,255,0.35)"/>`
    : "";

  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));">
    ${stageDecorationHtml(stage)}
    ${hornHtml}
    <ellipse cx="20" cy="21" rx="${rx}" ry="${ry}" fill="${t.color}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
    ${spotsHtml}
    ${eyesHtml(t.eye)}
    ${mouthHtml(t.mouth)}
  </svg>`;
}
