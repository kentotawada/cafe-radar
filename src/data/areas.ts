export type Area = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

// エリアが増えたら、ここに中心駅を追加していく
export const areas: Area[] = [{ id: "shinjuku", name: "新宿駅", lat: 35.6896, lng: 139.7006 }];
