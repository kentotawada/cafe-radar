import type { Cafe } from "@/lib/seedCafes";
import type { CafeUsageStyle } from "@/lib/types";
import { isLateNight } from "@/lib/cafeStats";

// お店の名前から「チェーン店(気軽・短時間利用)」「深夜/24時間営業
// (夜間・早朝のノマド利用)」を推定する。それ以外は「コワーキング併設」
// らしき記載があればcoworking、なければ独立店・おしゃれ系として扱う
// (店名からの推定のため厳密ではないが、地図上でざっくり見分ける用途)
//
// CafeMap.tsx の中に置いていたが、Googleマップ版の比較ページからも
// 同じピンを描きたいので切り出した。判定を1か所にしておかないと、
// 2つの地図でピンの見た目がずれる
const CHAIN_NAME_PATTERNS: RegExp[] = [
  /スターバックス/,
  /ドトール/,
  /タリーズ/,
  /PRONTO|プロント/i,
  /星乃珈琲/,
  /エクセルシオール/,
  /ベローチェ/,
  /コメダ/,
  /サンマルク/,
  /マクドナルド/,
  /ガスト/,
  /ジョナサン/,
  /デニーズ/,
  /ド・クリエ/,
  /ルノアール/,
];
const COWORKING_NAME_PATTERNS = /コワーキング|co-?working/i;

export function getCafeUsageStyle(cafe: Cafe): CafeUsageStyle {
  if (CHAIN_NAME_PATTERNS.some((pattern) => pattern.test(cafe.name))) return "chain";
  if (isLateNight(cafe)) return "night";
  if (
    COWORKING_NAME_PATTERNS.test(cafe.name) ||
    (cafe.outletInfo && COWORKING_NAME_PATTERNS.test(cafe.outletInfo))
  ) {
    return "coworking";
  }
  return "independent";
}
