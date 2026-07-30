import type { Landmark } from "@/lib/types";

// Googleマップと見比べて確認した新宿駅周辺の主要な目印(駅出口・有名な建物など)。
// 座標は住所から推定した目安地点です。
export const landmarks: Landmark[] = [
  { id: "landmark-shinjuku-01", name: "新宿駅西口", lat: 35.6906, lng: 139.6995, category: "station_exit" },
  { id: "landmark-shinjuku-02", name: "新宿駅東口", lat: 35.6902, lng: 139.7016, category: "station_exit" },
  { id: "landmark-shinjuku-03", name: "新宿駅南口", lat: 35.6883, lng: 139.7017, category: "station_exit" },
  { id: "landmark-shinjuku-04", name: "新宿駅新南口", lat: 35.6875, lng: 139.7008, category: "station_exit" },
  { id: "landmark-shinjuku-05", name: "東京都庁第一本庁舎", lat: 35.6896, lng: 139.6917, category: "building" },
  { id: "landmark-shinjuku-06", name: "モード学園コクーンタワー", lat: 35.6912, lng: 139.6971, category: "building" },
  { id: "landmark-shinjuku-07", name: "新宿住友ビル", lat: 35.6912, lng: 139.6939, category: "building" },
  { id: "landmark-shinjuku-08", name: "新宿三井ビルディング", lat: 35.6923, lng: 139.6944, category: "building" },
  { id: "landmark-shinjuku-09", name: "新宿NSビル", lat: 35.6889, lng: 139.6935, category: "building" },
  { id: "landmark-shinjuku-10", name: "新宿センタービル", lat: 35.6906, lng: 139.6957, category: "building" },
  { id: "landmark-shinjuku-11", name: "伊勢丹新宿店", lat: 35.6938, lng: 139.7038, category: "building" },
  { id: "landmark-shinjuku-12", name: "新宿マルイ本館", lat: 35.6906, lng: 139.7048, category: "building" },
  { id: "landmark-shinjuku-13", name: "ルミネエスト新宿", lat: 35.69, lng: 139.7008, category: "building" },
  { id: "landmark-shinjuku-14", name: "ルミネ新宿", lat: 35.69, lng: 139.6987, category: "building" },
  { id: "landmark-shinjuku-15", name: "京王百貨店新宿店", lat: 35.6899, lng: 139.6989, category: "building" },
  { id: "landmark-shinjuku-16", name: "ヨドバシカメラ新宿西口本店", lat: 35.6935, lng: 139.6989, category: "building" },
  { id: "landmark-shinjuku-17", name: "新宿高島屋タイムズスクエア", lat: 35.6857, lng: 139.7013, category: "building" },
  { id: "landmark-shinjuku-18", name: "バスタ新宿", lat: 35.6871, lng: 139.7003, category: "building" },
  { id: "landmark-shinjuku-19", name: "花園神社", lat: 35.6944, lng: 139.7048, category: "other" },
  { id: "landmark-shinjuku-20", name: "新宿東宝ビル(ゴジラヘッド)", lat: 35.6945, lng: 139.7022, category: "other" },
];
