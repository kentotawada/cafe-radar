// 地図と店舗詳細ページの間で共有する、sessionStorageのキー。
//
// CafeMap.tsx側に置くと、詳細ページのボタンがこの定数をimportしただけで
// leafletと全店舗データを含むCafeMapのチャンクを巻き込んでしまう。
// 文字列2つだけの独立モジュールに切り出しておく。

// 地図の表示範囲(中心とズーム)。詳細ページから戻った時の復元に使う
export const MAP_VIEW_KEY = "cafe-radar:map-view";

// エリアの絞り込み・並び順・リスト欄の高さ。地図の位置だけ復元しても、
// 戻った瞬間に絞り込みが「すべて」に戻り、畳んでいたリストが開いて
// 横スライドのカードが消えてしまうため、あわせて覚えておく
export const MAP_UI_KEY = "cafe-radar:map-ui";

// 地図から詳細ページへ遷移したことを示す目印。詳細ページの「地図で見る」が、
// 新しい履歴を積むか履歴を1つ戻るかを判断するのに使う
export const FROM_MAP_KEY = "cafe-radar:from-map";

// どの地図から詳細ページへ来たか(/ か /map-google か)。
//
// 戻り先が分からないときは / へ送っていたが、/ は古いほうの地図なので
// 「押したら別のカフェレーダーに着く」状態になっていた。履歴が使えない
// ときでも、見ていた地図に帰れるようにするために覚えておく
export const MAP_PATH_KEY = "cafe-radar:map-path";

/** 地図から詳細ページへ移るときに、帰り道の目印を置く */
export function markCameFromMap(): void {
  try {
    window.sessionStorage.setItem(FROM_MAP_KEY, "1");
    window.sessionStorage.setItem(MAP_PATH_KEY, window.location.pathname);
    // タブを開き直しても帰れるように、こちらにも残す
    window.localStorage.setItem(MAP_PATH_KEY, window.location.pathname);
  } catch {
    // 使えない設定なら、戻り先の判定は referrer に任せる
  }
}

/** 帰る先の地図。分からなければ古いほうの地図(/)へ */
export function mapPathToReturnTo(): string {
  try {
    return (
      window.sessionStorage.getItem(MAP_PATH_KEY) ??
      window.localStorage.getItem(MAP_PATH_KEY) ??
      "/"
    );
  } catch {
    return "/";
  }
}
