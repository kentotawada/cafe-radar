// 地図と店舗詳細ページの間で共有する、sessionStorageのキー。
//
// CafeMap.tsx側に置くと、詳細ページのボタンがこの定数をimportしただけで
// leafletと全店舗データを含むCafeMapのチャンクを巻き込んでしまう。
// 文字列2つだけの独立モジュールに切り出しておく。

// 地図の表示範囲(中心とズーム)。詳細ページから戻った時の復元に使う
export const MAP_VIEW_KEY = "cafe-radar:map-view";

// 地図から詳細ページへ遷移したことを示す目印。詳細ページの「地図で見る」が、
// 新しい履歴を積むか履歴を1つ戻るかを判断するのに使う
export const FROM_MAP_KEY = "cafe-radar:from-map";
