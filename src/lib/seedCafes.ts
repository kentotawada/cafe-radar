import { cafes as shinjukuCafes, type Cafe } from "@/data/cafes";
import { cafes as shibuyaCafes } from "@/data/cafes-shibuya";
import { cafes as ikebukuroCafes } from "@/data/cafes-ikebukuro";
import { cafes as tokyoCafes } from "@/data/cafes-tokyo";
import { cafes as uenoCafes } from "@/data/cafes-ueno";
import { cafes as shinagawaCafes } from "@/data/cafes-shinagawa";
import { cafes as shimbashiCafes } from "@/data/cafes-shimbashi";
import { cafes as akihabaraCafes } from "@/data/cafes-akihabara";
import { cafes as yurakuchoCafes } from "@/data/cafes-yurakucho";
import { cafes as kandaCafes } from "@/data/cafes-kanda";
import { cafes as takadanobabaCafes } from "@/data/cafes-takadanobaba";
import { cafes as kichijojiCafes } from "@/data/cafes-kichijoji";
import { cafes as ebisuCafes } from "@/data/cafes-ebisu";
import { cafes as roppongiCafes } from "@/data/cafes-roppongi";
import { cafes as akasakaCafes } from "@/data/cafes-akasaka";
import { cafes as gotandaCafes } from "@/data/cafes-gotanda";
import { cafes as iidabashiCafes } from "@/data/cafes-iidabashi";
import { cafes as nakanoCafes } from "@/data/cafes-nakano";
import { cafes as tachikawaCafes } from "@/data/cafes-tachikawa";
import { cafes as ochanomizuCafes } from "@/data/cafes-ochanomizu";

export type { Cafe } from "@/data/cafes";

// 全エリアの編集部調べ(静的)カフェデータをまとめたもの。CafeMapと管理画面の
// 両方から同じ一覧を参照できるよう、ここに1箇所だけ定義する
export const seedCafes: Cafe[] = [
  ...shinjukuCafes,
  ...shibuyaCafes,
  ...ikebukuroCafes,
  ...tokyoCafes,
  ...uenoCafes,
  ...shinagawaCafes,
  ...shimbashiCafes,
  ...akihabaraCafes,
  ...yurakuchoCafes,
  ...kandaCafes,
  ...takadanobabaCafes,
  ...kichijojiCafes,
  ...ebisuCafes,
  ...roppongiCafes,
  ...akasakaCafes,
  ...gotandaCafes,
  ...iidabashiCafes,
  ...nakanoCafes,
  ...tachikawaCafes,
  ...ochanomizuCafes,
];
