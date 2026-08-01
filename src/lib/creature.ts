// 文字列(店舗ID・レポーターID)から毎回同じ見た目になる、ゆるいキャラを
// 生成する。写真が無いお店同士を見分けやすくするためと、報告してくれた
// 人自身のキャラを育てる(レベルに応じてstageが上がり装飾が増える)
// ゲーミフィケーションの両方で、同じ生成器を使い回す

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
  "#FB923C", "#FACC15", "#4ADE80", "#22D3EE", "#60A5FA",
  "#A78BFA", "#F472B6", "#FB7185", "#A3E635", "#2DD4BF",
];
const EYE_STYLES = ["round", "sleepy", "star"] as const;
const MOUTH_STYLES = ["smile", "cat", "open"] as const;
const SHAPES = ["round", "wide", "tall"] as const;
const TOPPERS = ["none", "horn", "ears", "antenna"] as const;

export type CreatureTraits = {
  color: string;
  eye: (typeof EYE_STYLES)[number];
  mouth: (typeof MOUTH_STYLES)[number];
  shape: (typeof SHAPES)[number];
  topper: (typeof TOPPERS)[number];
  tail: boolean;
  spots: boolean;
};

export function creatureTraits(seed: string): CreatureTraits {
  const h = hashSeed(seed);
  return {
    color: BODY_COLORS[h % BODY_COLORS.length],
    eye: EYE_STYLES[(h >>> 4) % EYE_STYLES.length],
    mouth: MOUTH_STYLES[(h >>> 8) % MOUTH_STYLES.length],
    shape: SHAPES[(h >>> 12) % SHAPES.length],
    topper: TOPPERS[(h >>> 16) % TOPPERS.length],
    tail: (h >>> 20) % 2 === 0,
    spots: (h >>> 22) % 2 === 0,
  };
}

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - amount);
  const g = Math.max(0, ((n >> 8) & 255) - amount);
  const b = Math.max(0, (n & 255) - amount);
  return `rgb(${r},${g},${b})`;
}

function bodyBox(shape: CreatureTraits["shape"]) {
  if (shape === "wide") return { x: 3, y: 12, w: 34, h: 22, rx: 16 };
  if (shape === "tall") return { x: 8, y: 8, w: 24, h: 28, rx: 13 };
  return { x: 5, y: 9, w: 30, h: 27, rx: 14 };
}

function topperHtml(topper: CreatureTraits["topper"], color: string): string {
  if (topper === "horn") {
    return `<path d="M17 9 L20 1 L23 9 Z" fill="${color}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>`;
  }
  if (topper === "ears") {
    return `<ellipse cx="10" cy="8" rx="4.5" ry="6" fill="${color}" stroke="rgba(0,0,0,0.12)" stroke-width="1" transform="rotate(-25 10 8)"/><ellipse cx="30" cy="8" rx="4.5" ry="6" fill="${color}" stroke="rgba(0,0,0,0.12)" stroke-width="1" transform="rotate(25 30 8)"/>`;
  }
  if (topper === "antenna") {
    return `<line x1="20" y1="9" x2="20" y2="1.5" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/><circle cx="20" cy="1.5" r="2.6" fill="#FDE68A" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>`;
  }
  return "";
}

function eyesHtml(eye: CreatureTraits["eye"]): string {
  if (eye === "sleepy") {
    return `<path d="M9.5 20 Q14 16 18.5 20" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M21.5 20 Q26 16 30.5 20" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
  if (eye === "star") {
    return `<g>
      <rect x="11.5" y="16.5" width="5" height="5" fill="#1f2937" transform="rotate(45 14 19)"/>
      <circle cx="15.3" cy="17.5" r="1" fill="#ffffff"/>
      <rect x="23.5" y="16.5" width="5" height="5" fill="#1f2937" transform="rotate(45 26 19)"/>
      <circle cx="27.3" cy="17.5" r="1" fill="#ffffff"/>
    </g>`;
  }
  return `<g>
    <circle cx="14" cy="19" r="4.4" fill="#1f2937"/>
    <circle cx="15.4" cy="17.4" r="1.4" fill="#ffffff"/>
    <circle cx="26" cy="19" r="4.4" fill="#1f2937"/>
    <circle cx="27.4" cy="17.4" r="1.4" fill="#ffffff"/>
  </g>`;
}

function mouthHtml(mouth: CreatureTraits["mouth"]): string {
  if (mouth === "cat") {
    return `<path d="M20 27.5 L17 30 M20 27.5 L23 30 M20 27.5 L20 29.5" stroke="#1f2937" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (mouth === "open") {
    return `<g><ellipse cx="20" cy="28.5" rx="3.6" ry="3" fill="#1f2937"/><ellipse cx="20" cy="30.2" rx="1.8" ry="1" fill="#FB7185"/></g>`;
  }
  return `<path d="M14.5 27 Q20 33 25.5 27" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
}

// stageはレポーター自身のキャラ育成専用(1〜5)。お店のキャラは常にstage=1
// (お店側は「育つ」概念が無いため、装飾なしのシンプルな見た目で統一する)
function stageDecorationHtml(stage: number): string {
  let html = "";
  if (stage >= 3) {
    html += `<ellipse cx="20" cy="21" rx="19" ry="18.5" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.65"/>`;
  }
  if (stage >= 4) {
    html += `<path d="M11 8 L13.5 3 L17 7.5 L20 2 L23 7.5 L26.5 3 L29 8 L26.5 10 L13.5 10 Z" fill="#FBBF24" stroke="#B45309" stroke-width="0.8"/>`;
  }
  if (stage >= 2) {
    html += `<path d="M33 5 L34 8 L37 9 L34 10 L33 13 L32 10 L29 9 L32 8 Z" fill="#FBBF24"/>`;
  }
  if (stage >= 5) {
    html += `<path d="M4 29 L4.8 31.2 L7 32 L4.8 32.8 L4 35 L3.2 32.8 L1 32 L3.2 31.2 Z" fill="#FBBF24"/>`;
  }
  return html;
}

export function creatureSvgMarkup(seed: string, size = 40, stage = 1): string {
  const t = creatureTraits(seed);
  const box = bodyBox(t.shape);
  const shade = darken(t.color, 40);
  const gradId = `cf-body-${hashSeed(seed)}`;

  const tailHtml = t.tail
    ? `<path d="M${box.x + box.w - 3} ${box.y + box.h - 4} Q${box.x + box.w + 8} ${box.y + box.h - 6} ${box.x + box.w + 4} ${box.y + box.h - 14}" stroke="${t.color}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    : "";

  const spotsHtml = t.spots
    ? `<circle cx="${box.x + 5}" cy="${box.y + box.h - 6}" r="2.2" fill="rgba(255,255,255,0.4)"/><circle cx="${box.x + box.w - 6}" cy="${box.y + box.h - 10}" r="1.6" fill="rgba(255,255,255,0.4)"/>`
    : "";

  const legsHtml = `<ellipse cx="${box.x + box.w * 0.3}" cy="${box.y + box.h + 1}" rx="4" ry="2.6" fill="${shade}"/><ellipse cx="${box.x + box.w * 0.7}" cy="${box.y + box.h + 1}" rx="4" ry="2.6" fill="${shade}"/>`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1.5px 2px rgba(0,0,0,0.28));">
    <defs>
      <radialGradient id="${gradId}" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
        <stop offset="45%" stop-color="${t.color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    ${stageDecorationHtml(stage)}
    ${tailHtml}
    ${legsHtml}
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${box.rx}" fill="${t.color}"/>
    <ellipse cx="20" cy="${box.y + box.h - 6}" rx="${box.w * 0.28}" ry="${box.h * 0.22}" fill="rgba(255,255,255,0.3)"/>
    ${spotsHtml}
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${box.rx}" fill="url(#${gradId})"/>
    ${topperHtml(t.topper, t.color)}
    <ellipse cx="10.5" cy="24" rx="2.6" ry="1.7" fill="rgba(244,63,94,0.35)"/>
    <ellipse cx="29.5" cy="24" rx="2.6" ry="1.7" fill="rgba(244,63,94,0.35)"/>
    ${eyesHtml(t.eye)}
    ${mouthHtml(t.mouth)}
  </svg>`;
}
