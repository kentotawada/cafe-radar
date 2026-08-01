// 報告(reports)が送信された瞬間に、ヘッダーのレポーターレベル表示
// (MyReporterBadge)へ「数え直して」と伝えるだけの軽量なpub/sub。
// favorites.tsのemitChangeと同じパターン
const listeners = new Set<() => void>();

export function emitReportSubmitted() {
  for (const listener of listeners) listener();
}

export function subscribeReportSubmitted(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
