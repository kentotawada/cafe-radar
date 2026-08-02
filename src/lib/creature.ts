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
const EYE_STYLES = ["round", "sleepy", "star", "wink"] as const;
const MOUTH_STYLES = ["smile", "cat", "open", "fang"] as const;
const SHAPES = ["round", "wide", "tall"] as const;
const TOPPERS = ["none", "horn", "ears", "antenna", "leaf"] as const;
const PATTERNS = ["none", "spots", "stripes", "hearts"] as const;
const ACCESSORIES = ["none", "bowtie", "bean", "sticker"] as const;

export type CreatureTraits = {
  color: string;
  colorAccent: string;
  eye: (typeof EYE_STYLES)[number];
  mouth: (typeof MOUTH_STYLES)[number];
  shape: (typeof SHAPES)[number];
  topper: (typeof TOPPERS)[number];
  pattern: (typeof PATTERNS)[number];
  accessory: (typeof ACCESSORIES)[number];
  tail: boolean;
  eyebrows: boolean;
};

export function creatureTraits(seed: string): CreatureTraits {
  const h = hashSeed(seed);
  const colorIndex = h % BODY_COLORS.length;
  return {
    color: BODY_COLORS[colorIndex],
    colorAccent: BODY_COLORS[(colorIndex + 3 + ((h >>> 2) % 4)) % BODY_COLORS.length],
    eye: EYE_STYLES[(h >>> 4) % EYE_STYLES.length],
    mouth: MOUTH_STYLES[(h >>> 7) % MOUTH_STYLES.length],
    shape: SHAPES[(h >>> 10) % SHAPES.length],
    topper: TOPPERS[(h >>> 13) % TOPPERS.length],
    pattern: PATTERNS[(h >>> 17) % PATTERNS.length],
    accessory: ACCESSORIES[(h >>> 20) % ACCESSORIES.length],
    tail: (h >>> 23) % 2 === 0,
    eyebrows: (h >>> 25) % 2 === 0,
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
  if (shape === "wide") return { x: 3, y: 12, w: 34, h: 21, rx: 15 };
  if (shape === "tall") return { x: 9, y: 7, w: 22, h: 29, rx: 12 };
  return { x: 6, y: 9, w: 28, h: 26, rx: 13 };
}

function heartPath(cx: number, cy: number, s: number): string {
  return `M${cx} ${cy + s * 0.6} C${cx - s} ${cy - s * 0.2} ${cx - s * 0.4} ${cy - s} ${cx} ${cy - s * 0.3} C${cx + s * 0.4} ${cy - s} ${cx + s} ${cy - s * 0.2} ${cx} ${cy + s * 0.6} Z`;
}

function topperHtml(topper: CreatureTraits["topper"], color: string, accent: string): string {
  if (topper === "horn") {
    return `<path d="M17 9 L20 1.5 L23 9 Z" fill="${accent}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>`;
  }
  if (topper === "ears") {
    return `<ellipse cx="9" cy="8" rx="4.6" ry="6" fill="${color}" stroke="rgba(0,0,0,0.12)" stroke-width="1" transform="rotate(-25 9 8)"/><ellipse cx="9" cy="8" rx="2.1" ry="3.2" fill="rgba(255,255,255,0.4)" transform="rotate(-25 9 8)"/><ellipse cx="31" cy="8" rx="4.6" ry="6" fill="${color}" stroke="rgba(0,0,0,0.12)" stroke-width="1" transform="rotate(25 31 8)"/><ellipse cx="31" cy="8" rx="2.1" ry="3.2" fill="rgba(255,255,255,0.4)" transform="rotate(25 31 8)"/>`;
  }
  if (topper === "antenna") {
    return `<path d="M20 9 Q17.5 4.5 20 2.5" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="20" cy="2.5" r="2.4" fill="${accent}" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>`;
  }
  if (topper === "leaf") {
    return `<path d="M20 9 Q20 2 20 0.5 Q25.5 0.5 23.8 5.5 Q22 9 20 9 Z" fill="#65A30D" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/><path d="M20 8 Q21.8 4.5 23 1.8" stroke="#3F6212" stroke-width="0.7" fill="none"/>`;
  }
  return "";
}

function eyesHtml(eye: CreatureTraits["eye"]): string {
  if (eye === "sleepy") {
    return `<path d="M9.5 20 Q14 16 18.5 20" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M21.5 20 Q26 16 30.5 20" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  }
  if (eye === "wink") {
    return `<g><circle cx="14" cy="19" r="4.4" fill="#1f2937"/><circle cx="15.4" cy="17.4" r="1.4" fill="#ffffff"/><path d="M22 20 Q26 16.5 30 20" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
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
    <circle cx="14" cy="19" r="4.6" fill="#1f2937"/>
    <circle cx="15.5" cy="17.2" r="1.5" fill="#ffffff"/>
    <circle cx="13" cy="20.5" r="0.8" fill="#ffffff" opacity="0.7"/>
    <circle cx="26" cy="19" r="4.6" fill="#1f2937"/>
    <circle cx="27.5" cy="17.2" r="1.5" fill="#ffffff"/>
    <circle cx="25" cy="20.5" r="0.8" fill="#ffffff" opacity="0.7"/>
  </g>`;
}

function eyebrowsHtml(): string {
  return `<path d="M10 13.5 Q14 10.5 18 13" stroke="#1f2937" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M22 13 Q26 10.5 30 13.5" stroke="#1f2937" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

function mouthHtml(mouth: CreatureTraits["mouth"]): string {
  if (mouth === "cat") {
    return `<path d="M20 27.5 L17 30 M20 27.5 L23 30 M20 27.5 L20 29.5" stroke="#1f2937" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="27" x2="14" y2="26" stroke="#1f2937" stroke-width="0.7" opacity="0.6"/><line x1="4" y1="29.5" x2="14" y2="29" stroke="#1f2937" stroke-width="0.7" opacity="0.6"/><line x1="26" y1="26" x2="36" y2="27" stroke="#1f2937" stroke-width="0.7" opacity="0.6"/><line x1="26" y1="29" x2="36" y2="29.5" stroke="#1f2937" stroke-width="0.7" opacity="0.6"/>`;
  }
  if (mouth === "open") {
    return `<g><ellipse cx="20" cy="28.5" rx="3.6" ry="3" fill="#1f2937"/><ellipse cx="20" cy="30.2" rx="1.8" ry="1" fill="#FB7185"/></g>`;
  }
  if (mouth === "fang") {
    return `<g><path d="M14.5 27 Q20 32 25.5 27" stroke="#1f2937" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M17.5 28.5 L18.3 31.5 L19.4 28.8 Z" fill="#ffffff" stroke="#1f2937" stroke-width="0.4"/></g>`;
  }
  return `<path d="M14.5 27 Q20 33 25.5 27" stroke="#1f2937" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
}

function patternHtml(pattern: CreatureTraits["pattern"], box: ReturnType<typeof bodyBox>, accent: string): string {
  if (pattern === "spots") {
    return `<circle cx="${box.x + 4.5}" cy="${box.y + 6}" r="2" fill="${accent}" opacity="0.55"/><circle cx="${box.x + box.w - 5}" cy="${box.y + 9}" r="1.5" fill="${accent}" opacity="0.55"/><circle cx="${box.x + 6}" cy="${box.y + box.h - 5}" r="1.7" fill="${accent}" opacity="0.55"/>`;
  }
  if (pattern === "stripes") {
    return `<g opacity="0.5"><rect x="${box.x}" y="${box.y + box.h * 0.18}" width="${box.w}" height="2.6" fill="${accent}" transform="rotate(-6 20 ${box.y + box.h * 0.18})"/><rect x="${box.x}" y="${box.y + box.h * 0.75}" width="${box.w}" height="2.6" fill="${accent}" transform="rotate(-6 20 ${box.y + box.h * 0.75})"/></g>`;
  }
  if (pattern === "hearts") {
    return `<path d="${heartPath(box.x + 5, box.y + 7, 2.4)}" fill="${accent}" opacity="0.65"/><path d="${heartPath(box.x + box.w - 6, box.y + box.h - 6, 2.2)}" fill="${accent}" opacity="0.65"/>`;
  }
  return "";
}

function accessoryHtml(accessory: CreatureTraits["accessory"], box: ReturnType<typeof bodyBox>): string {
  const cy = box.y + box.h - 4;
  if (accessory === "bowtie") {
    return `<path d="M15 ${cy} L19 ${cy - 2.2} L19 ${cy + 2.2} Z M25 ${cy} L21 ${cy - 2.2} L21 ${cy + 2.2} Z" fill="#EF4444" stroke="rgba(0,0,0,0.15)" stroke-width="0.5"/><circle cx="20" cy="${cy}" r="1.4" fill="#B91C1C"/>`;
  }
  if (accessory === "bean") {
    return `<ellipse cx="20" cy="${cy}" rx="3.6" ry="2.6" fill="#6b4226" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" transform="rotate(-10 20 ${cy})"/><path d="M17 ${cy} Q20 ${cy - 2.2} 23 ${cy}" stroke="#fff" stroke-width="0.8" fill="none" transform="rotate(-10 20 ${cy})"/>`;
  }
  if (accessory === "sticker") {
    return `<path d="M20 ${cy - 3} L21.2 ${cy - 0.8} L23.6 ${cy - 0.5} L21.8 ${cy + 1.1} L22.3 ${cy + 3.4} L20 ${cy + 2.2} L17.7 ${cy + 3.4} L18.2 ${cy + 1.1} L16.4 ${cy - 0.5} L18.8 ${cy - 0.8} Z" fill="#FBBF24" stroke="#B45309" stroke-width="0.4"/>`;
  }
  return "";
}

// stageはレポーター自身のキャラ育成専用(1〜5)。お店のキャラは常にstage=1
// (お店側は「育つ」概念が無いため、装飾なしのシンプルな見た目で統一する)
function stageDecorationHtml(stage: number): string {
  let html = "";
  if (stage >= 3) {
    html += `<ellipse cx="20" cy="21" rx="19.5" ry="19" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.65"/>`;
  }
  if (stage >= 4) {
    html += `<path d="M10 6 L12.5 1 L16 5.5 L20 0 L24 5.5 L27.5 1 L30 6 L27.5 8 L12.5 8 Z" fill="#FBBF24" stroke="#B45309" stroke-width="0.8"/>`;
  }
  if (stage >= 2) {
    html += `<path d="M34 4 L35 7 L38 8 L35 9 L34 12 L33 9 L30 8 L33 7 Z" fill="#FBBF24"/>`;
  }
  if (stage >= 5) {
    html += `<path d="M3 28 L3.8 30.2 L6 31 L3.8 31.8 L3 34 L2.2 31.8 L0 31 L2.2 30.2 Z" fill="#FBBF24"/>`;
  }
  return html;
}

export function creatureSvgMarkup(seed: string, size = 40, stage = 1): string {
  const t = creatureTraits(seed);
  const box = bodyBox(t.shape);
  const legColor = darken(t.color, 35);
  const gradId = `cf-body-${hashSeed(seed)}`;

  // wide/tall形状によってbox.x+box.wの位置が大きく変わるため、しっぽは
  // ビューボックス(0-40)内に収まる固定座標にして、はみ出て見切れるのを防ぐ
  const tailBaseX = Math.min(box.x + box.w - 3, 30);
  const tailHtml = t.tail
    ? `<path d="M${tailBaseX} ${box.y + box.h - 4} Q${tailBaseX + 8} ${box.y + box.h - 6} ${tailBaseX + 5} ${Math.max(box.y + box.h - 15, 6)}" stroke="${t.color}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    : "";

  const armsHtml = `<ellipse cx="${box.x - 0.5}" cy="${box.y + box.h * 0.6}" rx="3.2" ry="4.4" fill="${t.color}" stroke="rgba(0,0,0,0.1)" stroke-width="0.6" transform="rotate(25 ${box.x - 0.5} ${box.y + box.h * 0.6})"/><ellipse cx="${box.x + box.w + 0.5}" cy="${box.y + box.h * 0.6}" rx="3.2" ry="4.4" fill="${t.color}" stroke="rgba(0,0,0,0.1)" stroke-width="0.6" transform="rotate(-25 ${box.x + box.w + 0.5} ${box.y + box.h * 0.6})"/>`;

  const legsHtml = `<ellipse cx="${box.x + box.w * 0.28}" cy="${box.y + box.h + 1}" rx="3.6" ry="2.6" fill="${legColor}"/><ellipse cx="${box.x + box.w * 0.72}" cy="${box.y + box.h + 1}" rx="3.6" ry="2.6" fill="${legColor}"/>`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 1.5px 2px rgba(0,0,0,0.28));">
    <defs>
      <radialGradient id="${gradId}" cx="35%" cy="28%" r="80%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
        <stop offset="45%" stop-color="${t.color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    ${stageDecorationHtml(stage)}
    ${tailHtml}
    ${armsHtml}
    ${legsHtml}
    <rect x="${box.x - 1.6}" y="${box.y - 1.6}" width="${box.w + 3.2}" height="${box.h + 3.2}" rx="${box.rx + 1.6}" fill="${t.colorAccent}"/>
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${box.rx}" fill="${t.color}"/>
    ${patternHtml(t.pattern, box, t.colorAccent)}
    <ellipse cx="20" cy="${box.y + box.h - 6}" rx="${box.w * 0.26}" ry="${box.h * 0.2}" fill="rgba(255,255,255,0.3)"/>
    <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${box.rx}" fill="url(#${gradId})"/>
    ${topperHtml(t.topper, t.color, t.colorAccent)}
    ${t.eyebrows ? eyebrowsHtml() : ""}
    <ellipse cx="10" cy="24.5" rx="2.8" ry="1.8" fill="rgba(244,63,94,0.35)"/>
    <ellipse cx="30" cy="24.5" rx="2.8" ry="1.8" fill="rgba(244,63,94,0.35)"/>
    ${eyesHtml(t.eye)}
    ${mouthHtml(t.mouth)}
    ${accessoryHtml(t.accessory, box)}
  </svg>`;
}
