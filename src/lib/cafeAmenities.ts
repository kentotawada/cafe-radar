import type { Cafe } from "@/lib/seedCafes";

// 編集部調べのテキストから簡易判定するヘルパー。CafeMapのバッジ表示・
// 絞り込みフィルターと、管理画面の電源報告承認機能の両方で同じ判定
// 基準を使うために共通化する。編集部調べでは未確認でも、ユーザーからの
// 報告を管理者が承認したお店(verifiedOutletCafeIds)は電源ありとして扱う
export function hasOutlet(cafe: Cafe, verifiedOutletCafeIds?: Set<string>): boolean {
  if (verifiedOutletCafeIds?.has(cafe.id)) return true;
  if (!cafe.outletInfo) return false;
  return !/電源.*(なし|不可)|コンセント.*(なし|不可)/.test(cafe.outletInfo);
}
