import { creatureSvgMarkup } from "@/lib/creature";

type CafeCreatureIconProps = {
  cafeId: string;
  size?: number;
  className?: string;
};

// お店ごとに毎回同じ見た目になる、ゆるいキャラクター。写真が無いお店同士を
// 一覧・詳細ページでひと目で見分けやすくするための、純粋に見た目だけの
// マスコット(育成要素は無い。育つのはレポーター自身のキャラの方)
export default function CafeCreatureIcon({
  cafeId,
  size = 32,
  className = "",
}: CafeCreatureIconProps) {
  return (
    <span
      className={`inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: creatureSvgMarkup(cafeId, size, 1) }}
    />
  );
}
