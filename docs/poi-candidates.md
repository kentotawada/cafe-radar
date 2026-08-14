# 座標をPOIに差し替える場合の影響範囲

2026-08-15 時点。Yahoo! の場所情報検索で店名からPOIを引き、いまの座標(国土地理院の街区代表点)と比べた。
**まだ何も適用していない。** 判断のための資料。

## 全体

| 区分 | 軒数 | 扱い |
|---|---|---|
| POIが見つからない | 943 | GSIのまま。個人店に多い |
| 名前が一致せず却下 | 69 | GSIのまま。別店舗を掴むのを防ぐため |
| 差が20m未満 | 504 | GSIのまま。既に基準内 |
| 差が20〜50m | 238 | GSIのまま。どちらが正しいか判断できない |
| **差が50〜150m** | **187** | **差し替え候補** |
| 差が150m以上 | 44 | 目視で1件ずつ判断 |

## 差し替え候補 (50〜150m)

| 差 | エリア | 店舗 | Yahoo側の名前 | 現在 | POI |
|---|---|---|---|---|---|
| 148m | ikebukuro | タリーズコーヒー 池袋サンシャインシティアルパ店 | タリーズコーヒー 池袋サンシャインシティアルパ店 | [地図](https://www.google.com/maps?q=35.727776,139.720123) | [地図](https://www.google.com/maps?q=35.7290316,139.7195656) |
| 148m | shinagawa | タリーズコーヒー 品川インターシティ店 | タリーズコーヒー品川インターシティ店 | [地図](https://www.google.com/maps?q=35.626335,139.742004) | [地図](https://www.google.com/maps?q=35.627665,139.7420481) |
| 146m | shinagawa | バル マルシェ コダマ エキュート品川店 | バル マルシェ コダマ エキュート品川店 | [地図](https://www.google.com/maps?q=35.629002,139.737823) | [地図](https://www.google.com/maps?q=35.62871474,139.73939551) |
| 146m | tokyo | マクドナルド JR東京駅店 | マクドナルドJR東京駅店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.6800431,139.767869) |
| 142m | shinjuku | カフェ・ベローチェ 西武新宿Brick St.店 | カフェ・ベローチェ西武新宿Brick St.店 | [地図](https://www.google.com/maps?q=35.695972,139.699722) | [地図](https://www.google.com/maps?q=35.6947342,139.7001159) |
| 141m | hamamatsucho | 珈琲館 アトレ竹芝店 | 珈琲館アトレ竹芝店 | [地図](https://www.google.com/maps?q=35.657009,139.761902) | [地図](https://www.google.com/maps?q=35.6559761,139.7628036) |
| 139m | shinagawa | エクセルシオール カフェ 品川イーストワンタワー店 | エクセルシオールカフェ品川イーストワンタワー店 | [地図](https://www.google.com/maps?q=35.626488,139.740677) | [地図](https://www.google.com/maps?q=35.6277399,139.7407177) |
| 136m | tamachi | エクセルシオール カフェ 田町東口店 | エクセルシオール　カフェ　田町東口店 | [地図](https://www.google.com/maps?q=35.643284,139.747253) | [地図](https://www.google.com/maps?q=35.64388545,139.74856638) |
| 133m | tamachi | グーテ・ド・ママン | グーテ・ド・ママン | [地図](https://www.google.com/maps?q=35.648575,139.739655) | [地図](https://www.google.com/maps?q=35.64744886,139.74016205) |
| 131m | akasaka | スターバックス コーヒー 赤坂Bizタワー店 | スターバックスコーヒー赤坂Bizタワー店 | [地図](https://www.google.com/maps?q=35.672558,139.735168) | [地図](https://www.google.com/maps?q=35.6731958,139.7363886) |
| 131m | akasaka | サブウェイ 赤坂メトロピア店 | サブウェイ赤坂メトロピア店 | [地図](https://www.google.com/maps?q=35.672558,139.735168) | [地図](https://www.google.com/maps?q=35.673118,139.7364441) |
| 131m | ikebukuro | 星乃珈琲店 池袋東武ホープセンター店 | 星乃珈琲店池袋東武ホープセンター店 | [地図](https://www.google.com/maps?q=35.729939,139.71051) | [地図](https://www.google.com/maps?q=35.7310526,139.7100275) |
| 130m | akasaka | スターバックス コーヒー 赤坂溜池タワー店 | スターバックスコーヒー赤坂溜池タワー店 | [地図](https://www.google.com/maps?q=35.670219,139.738419) | [地図](https://www.google.com/maps?q=35.6711739,139.7392551) |
| 130m | takadanobaba | フレッシュベーカリー神戸屋 高田馬場メトロピア店 | フレッシュベーカリー神戸屋 高田馬場メトロピア店 | [地図](https://www.google.com/maps?q=35.712494,139.703873) | [地図](https://www.google.com/maps?q=35.7132822,139.7049378) |
| 128m | yurakucho | スターバックス コーヒー JR有楽町駅京橋口店 | スターバックスコーヒーJR有楽町駅京橋口店 | [地図](https://www.google.com/maps?q=35.674507,139.762558) | [地図](https://www.google.com/maps?q=35.6751241,139.7637501) |
| 128m | shinjuku | Paul Bassett 新宿 | Paul Bassett 新宿 | [地図](https://www.google.com/maps?q=35.692776,139.696732) | [地図](https://www.google.com/maps?q=35.69301205,139.69534978) |
| 127m | akasaka | 神乃珈琲 赤坂店 | 神乃珈琲赤坂店 | [地図](https://www.google.com/maps?q=35.673645,139.735352) | [地図](https://www.google.com/maps?q=35.6739346,139.7367163) |
| 127m | roppongi | Mercer Brunch | MERCER BRUNCH ROPPONGI | [地図](https://www.google.com/maps?q=35.665585,139.734467) | [地図](https://www.google.com/maps?q=35.6647231,139.733546) |
| 127m | shinagawa | スターバックス コーヒー JR東海 品川駅店 | スターバックスコーヒーJR東海品川駅店 | [地図](https://www.google.com/maps?q=35.629383,139.741501) | [地図](https://www.google.com/maps?q=35.6291953,139.7401121) |
| 127m | tokyo | タリーズコーヒー 常盤橋タワー店 | タリーズコーヒー常盤橋タワー店 | [地図](https://www.google.com/maps?q=35.684868,139.769455) | [地図](https://www.google.com/maps?q=35.6842372,139.7706215) |
| 126m | akasaka | ドイツ＆オーストリア カフェレストラン マールツァイト | ドイツ&オーストリアカフェレストランマールツァイト | [地図](https://www.google.com/maps?q=35.672016,139.730377) | [地図](https://www.google.com/maps?q=35.67310416,139.7300039) |
| 125m | gotanda | メゾンカイザー 五反田店 | メゾンカイザー五反田店 | [地図](https://www.google.com/maps?q=35.625313,139.726929) | [地図](https://www.google.com/maps?q=35.62422088,139.72726955) |
| 124m | kichijoji | カフェ&ブックス ビブリオテーク 東京・吉祥寺 | カフェ&ブックスビブリオテーク 東京・吉祥寺 | [地図](https://www.google.com/maps?q=35.703297,139.579697) | [地図](https://www.google.com/maps?q=35.70300015,139.57837396) |
| 122m | iidabashi | スターバックス コーヒー 飯田橋アイガーデンテラス店 | スターバックスコーヒー飯田橋アイガーデンテラス店 | [地図](https://www.google.com/maps?q=35.700607,139.748947) | [地図](https://www.google.com/maps?q=35.7009792,139.7502196) |
| 122m | roppongi | 紅茶専門店 TEAPOND 麻布台ヒルズ店 | 紅茶専門店TEAPOND 麻布台ヒルズ店 | [地図](https://www.google.com/maps?q=35.662197,139.741791) | [地図](https://www.google.com/maps?q=35.66169701,139.74059201) |
| 120m | akasaka | ボロンテール | ボロンテール | [地図](https://www.google.com/maps?q=35.673645,139.735352) | [地図](https://www.google.com/maps?q=35.67428222,139.73642501) |
| 120m | osaki | レ・ミルフォイユ・ドゥ・リベルテ 大崎店 | レミルフォイユドゥリベルテ 大崎店 | [地図](https://www.google.com/maps?q=35.619057,139.726501) | [地図](https://www.google.com/maps?q=35.61836069,139.72751424) |
| 119m | gotanda | デニーズ ThinkPark店 | デニーズThinkPark店 | [地図](https://www.google.com/maps?q=35.619057,139.726501) | [地図](https://www.google.com/maps?q=35.6184351,139.7275663) |
| 118m | akasaka | エクセルシオール カフェ 永田町店 | エクセルシオールカフェ 永田町店 | [地図](https://www.google.com/maps?q=35.680222,139.740143) | [地図](https://www.google.com/maps?q=35.67923964,139.74062746) |
| 118m | gotanda | モスバーガー 大崎店 | モスバーガー大崎店 | [地図](https://www.google.com/maps?q=35.619057,139.726501) | [地図](https://www.google.com/maps?q=35.6184879,139.727608) |
| 115m | ueno | ムーセイオン | ムーセイオン | [地図](https://www.google.com/maps?q=35.716393,139.776062) | [地図](https://www.google.com/maps?q=35.71546212,139.77660674) |
| 114m | tokyo | スターバックス コーヒー 東京駅八重洲北口 東京ギフトパレット店 | スターバックスコーヒー東京駅八重洲北口東京ギフトパレット店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.6821262,139.7679079) |
| 113m | osaki | スターバックス コーヒー ゲートシティ大崎店 | スターバックスコーヒーゲートシティ大崎店 | [地図](https://www.google.com/maps?q=35.619953,139.731201) | [地図](https://www.google.com/maps?q=35.618949,139.7310383) |
| 111m | shinagawa | オーバカナル 高輪店 | オーバカナル 高輪店 | [地図](https://www.google.com/maps?q=35.628574,139.736984) | [地図](https://www.google.com/maps?q=35.62887573,139.73580982) |
| 110m | osaki | ドトールコーヒーショップ アートヴィレッジ大崎セントラルタワー店 | ドトールコーヒーショップ　アートヴィレッジ大崎セントラルタワー店 | [地図](https://www.google.com/maps?q=35.621803,139.728378) | [地図](https://www.google.com/maps?q=35.62230686,139.72733011) |
| 109m | ebisu | 宮越屋珈琲 恵比寿店 | 宮越屋珈琲恵比寿店 | [地図](https://www.google.com/maps?q=35.643665,139.713364) | [地図](https://www.google.com/maps?q=35.6428737,139.7140696) |
| 109m | roppongi | マクドナルド 六本木ヒルズ店 | マクドナルド六本木ヒルズ店 | [地図](https://www.google.com/maps?q=35.660206,139.729202) | [地図](https://www.google.com/maps?q=35.66085039,139.72829623) |
| 109m | yurakucho | プロント ライブラリーショップ＆カフェ日比谷 | プロントライブラリーショップ&カフェ日比谷 | [地図](https://www.google.com/maps?q=35.672764,139.754089) | [地図](https://www.google.com/maps?q=35.6718492,139.7545371) |
| 108m | yurakucho | カフェ レクセル 東京国際フォーラム店 | カフェレクセル東京国際フォーラム店 | [地図](https://www.google.com/maps?q=35.676849,139.76387) | [地図](https://www.google.com/maps?q=35.6760267,139.7632251) |
| 107m | tokyo | タリーズコーヒー ヤエチカ店 | タリーズコーヒーヤエチカ店 | [地図](https://www.google.com/maps?q=35.679485,139.770126) | [地図](https://www.google.com/maps?q=35.6795516,139.7713132) |
| 106m | roppongi | スターバックスコーヒー 東京ミッドタウン店 | スターバックスコーヒー 東京ミッドタウン店 | [地図](https://www.google.com/maps?q=35.666023,139.732208) | [地図](https://www.google.com/maps?q=35.66581339,139.73106256) |
| 106m | shimbashi | スターバックス コーヒー JR新橋駅 銀座口店 | スターバックスコーヒーJR新橋駅銀座口店 | [地図](https://www.google.com/maps?q=35.667126,139.758163) | [地図](https://www.google.com/maps?q=35.6661721,139.7582259) |
| 104m | nakano | マクドナルド 中野坂上店 | マクドナルド中野坂上店 | [地図](https://www.google.com/maps?q=35.695862,139.683975) | [地図](https://www.google.com/maps?q=35.6966835,139.6834257) |
| 102m | shinagawa | ドトールコーヒーショップ アレア品川店 | ドトールコーヒーショップアレア品川店 | [地図](https://www.google.com/maps?q=35.63068,139.741974) | [地図](https://www.google.com/maps?q=35.6300285,139.741187) |
| 102m | tamachi | むさしの森Diner ムスブ田町店 | むさしの森Dinerムスブ田町店 | [地図](https://www.google.com/maps?q=35.644985,139.748886) | [地図](https://www.google.com/maps?q=35.6456242,139.7496968) |
| 102m | yurakucho | 珈琲茶館 集 有楽町アネックス店 | 珈琲茶館集 有楽町アネックス店 | [地図](https://www.google.com/maps?q=35.674484,139.760544) | [地図](https://www.google.com/maps?q=35.67365506,139.76101453) |
| 100m | ebisu | スターバックス コーヒー アトレ恵比寿店(5F) | スターバックスコーヒーアトレ恵比寿店（5F） | [地図](https://www.google.com/maps?q=35.647175,139.709305) | [地図](https://www.google.com/maps?q=35.6466232,139.7101809) |
| 100m | gotanda | エクセルシオール カフェ 大崎シンクパーク店 | エクセルシオールカフェ大崎シンクパーク店 | [地図](https://www.google.com/maps?q=35.619057,139.726501) | [地図](https://www.google.com/maps?q=35.6185906,139.7274497) |
| 100m | shinagawa | スターバックス コーヒー ニュウマン高輪店 | スターバックスコーヒーニュウマン高輪店 | [地図](https://www.google.com/maps?q=35.635559,139.739594) | [地図](https://www.google.com/maps?q=35.6363667,139.7400702) |
| 98m | akasaka | マクドナルド 赤坂駅前店 | マクドナルド 赤坂駅前店 | [地図](https://www.google.com/maps?q=35.671631,139.735382) | [地図](https://www.google.com/maps?q=35.67229333,139.73610279) |
| 98m | akasaka | サイゼリヤ 赤坂駅前店 | サイゼリヤ 赤坂駅前店 | [地図](https://www.google.com/maps?q=35.672062,139.737106) | [地図](https://www.google.com/maps?q=35.67281254,139.73768293) |
| 96m | tokyo | エクセルシオールカフェ 八重洲地下街店 | エクセルシオール　カフェ　八重洲地下街店 | [地図](https://www.google.com/maps?q=35.679859,139.769608) | [地図](https://www.google.com/maps?q=35.680470282777,139.7688611755) |
| 95m | akihabara | タリーズコーヒー 秋葉原UDX店 | タリーズコーヒー秋葉原UDX店 | [地図](https://www.google.com/maps?q=35.699703,139.772049) | [地図](https://www.google.com/maps?q=35.7004244,139.7726155) |
| 95m | osaki | 麻布茶房 ゲートシティ大崎店 | 麻布茶房ゲートシティ 大崎店 | [地図](https://www.google.com/maps?q=35.619953,139.731201) | [地図](https://www.google.com/maps?q=35.61953291,139.73028091) |
| 94m | takadanobaba | タリーズコーヒー 国立国際医療研究センター店 | タリーズコーヒー国立国際医療研究センター店 | [地図](https://www.google.com/maps?q=35.703987,139.716217) | [地図](https://www.google.com/maps?q=35.70321497,139.71579847) |
| 92m | akasaka | タリーズコーヒー ニューオータニガーデンコート店 | タリーズコーヒー ニューオータニガーデンコート店 | [地図](https://www.google.com/maps?q=35.680435,139.734283) | [地図](https://www.google.com/maps?q=35.68107853,139.73492746) |
| 92m | nakano | Aライセンス | Aライセンス | [地図](https://www.google.com/maps?q=35.709923,139.665665) | [地図](https://www.google.com/maps?q=35.70917092,139.66609141) |
| 92m | nakano | さかこし珈琲店 | さかこし珈琲店 | [地図](https://www.google.com/maps?q=35.709923,139.665665) | [地図](https://www.google.com/maps?q=35.70917092,139.66609141) |
| 92m | nakano | チャレンジャー | チャレンジャー | [地図](https://www.google.com/maps?q=35.709923,139.665665) | [地図](https://www.google.com/maps?q=35.70917092,139.66609141) |
| 92m | tamachi | スターバックス コーヒー 田町タワー店 | スターバックスコーヒー田町タワー店 | [地図](https://www.google.com/maps?q=35.646549,139.747559) | [地図](https://www.google.com/maps?q=35.6467712,139.7485385) |
| 91m | nakano | 絵夢 | 絵夢 | [地図](https://www.google.com/maps?q=35.709923,139.665665) | [地図](https://www.google.com/maps?q=35.70916258,139.66603586) |
| 91m | roppongi | サイゼリヤ 六本木店 | サイゼリヤ 六本木店 | [地図](https://www.google.com/maps?q=35.662838,139.730423) | [地図](https://www.google.com/maps?q=35.66231349,139.72964795) |
| 91m | roppongi | アマンド 六本木店 | 株式会社アマンド 六本木店 | [地図](https://www.google.com/maps?q=35.662449,139.731354) | [地図](https://www.google.com/maps?q=35.66292728,139.7321709) |
| 91m | roppongi | オリエンタルカフェ&レストラン | オリエンタルカフェ&レストラン | [地図](https://www.google.com/maps?q=35.659779,139.738678) | [地図](https://www.google.com/maps?q=35.66046736,139.7392173) |
| 91m | tamachi | 社中交歡 萬來舍 | 社中交歡萬來舍 | [地図](https://www.google.com/maps?q=35.649147,139.742828) | [地図](https://www.google.com/maps?q=35.64921275,139.74182594) |
| 90m | akasaka | Paul Bassett 永田町店 | Paul Bassett 永田町店 | [地図](https://www.google.com/maps?q=35.675842,139.738007) | [地図](https://www.google.com/maps?q=35.67587057,139.73900214) |
| 88m | iidabashi | タリーズコーヒー 神楽坂店 | タリーズコーヒー神楽坂店 | [地図](https://www.google.com/maps?q=35.700603,139.734436) | [地図](https://www.google.com/maps?q=35.7002428,139.7335683) |
| 88m | roppongi | ペリカンカフェ 麻布台ヒルズ店 | ペリカンカフェ 麻布台ヒルズ店 | [地図](https://www.google.com/maps?q=35.661549,139.740921) | [地図](https://www.google.com/maps?q=35.66075903,139.74094508) |
| 88m | tachikawa | ANDERSEN ルミネ立川店 | ANDERSEN ルミネ立川店 | [地図](https://www.google.com/maps?q=35.698551,139.413223) | [地図](https://www.google.com/maps?q=35.69811832,139.41403236) |
| 87m | akihabara | 丸福珈琲店 ヨドバシAkiba店 | 丸福珈琲店ヨドバシAKIBA店 | [地図](https://www.google.com/maps?q=35.698639,139.774612) | [地図](https://www.google.com/maps?q=35.69851938,139.77365742) |
| 87m | tachikawa | こなな ルミネ立川店 | こなな ルミネ立川店 | [地図](https://www.google.com/maps?q=35.698551,139.413223) | [地図](https://www.google.com/maps?q=35.69811809,139.41402907) |
| 87m | tachikawa | ラ・メゾン アンソレイユターブル ルミネ立川店 | ラ・メゾン アンソレイユターブル ルミネ立川店 | [地図](https://www.google.com/maps?q=35.698551,139.413223) | [地図](https://www.google.com/maps?q=35.69811809,139.41402907) |
| 86m | nakano | ドトールコーヒーショップ 中野坂上店 | ドトールコーヒーショップ 中野坂上店 | [地図](https://www.google.com/maps?q=35.695965,139.682465) | [地図](https://www.google.com/maps?q=35.69668619,139.682124) |
| 86m | roppongi | カフェ・ド・ラペ | カフェド・ラペ | [地図](https://www.google.com/maps?q=35.668777,139.725967) | [地図](https://www.google.com/maps?q=35.66811895,139.72645979) |
| 86m | ueno | みはし アトレ上野店 | あんみつみはし アトレ上野店 | [地図](https://www.google.com/maps?q=35.713696,139.776917) | [地図](https://www.google.com/maps?q=35.71302045,139.7764484) |
| 86m | ueno | Pensta | Pensta | [地図](https://www.google.com/maps?q=35.713696,139.776917) | [地図](https://www.google.com/maps?q=35.71302045,139.7764484) |
| 85m | shinagawa | 喫茶室ルノアール 品川港南口店 | 喫茶室ルノアール品川港南口店 | [地図](https://www.google.com/maps?q=35.629086,139.743881) | [地図](https://www.google.com/maps?q=35.6290898,139.7429397) |
| 85m | shinagawa | PRONTO 品川インターシティ店 | PRONTO 品川インターシティ店 | [地図](https://www.google.com/maps?q=35.626335,139.742004) | [地図](https://www.google.com/maps?q=35.62709559,139.74202315) |
| 85m | tokyo | PRONTO 大手町OOTEMORI店 | PRONTO 大手町OOTEMORI店 | [地図](https://www.google.com/maps?q=35.685574,139.764664) | [地図](https://www.google.com/maps?q=35.68553965,139.76560521) |
| 84m | nakano | ジョナサン 中野坂上店 | ジョナサン中野坂上店 | [地図](https://www.google.com/maps?q=35.695793,139.683838) | [地図](https://www.google.com/maps?q=35.6965447,139.6838895) |
| 84m | shibuya | マクドナルド 渋谷MIYASHITAPARK店 | マクドナルド渋谷MIYASHITAPARK店 | [地図](https://www.google.com/maps?q=35.662376,139.702011) | [地図](https://www.google.com/maps?q=35.661667152557,139.7016885101) |
| 83m | tokyo | タリーズコーヒー 大手町パークビルディング店 | タリーズコーヒー大手町パークビルディング店 | [地図](https://www.google.com/maps?q=35.685982,139.762329) | [地図](https://www.google.com/maps?q=35.686695,139.7626082) |
| 82m | iidabashi | スターバックス コーヒー 飯田橋サクラテラス店 | スターバックスコーヒー飯田橋サクラテラス店 | [地図](https://www.google.com/maps?q=35.699116,139.744629) | [地図](https://www.google.com/maps?q=35.6989126,139.7437564) |
| 81m | shimbashi | PRONTO 新橋駅前店 | PRONTO 新橋駅前店 | [地図](https://www.google.com/maps?q=35.667465,139.756302) | [地図](https://www.google.com/maps?q=35.66731919,139.75717869) |
| 81m | shinagawa | 喫茶室ルノアール 品川高輪口店 | 喫茶室ルノアール品川高輪口店 | [地図](https://www.google.com/maps?q=35.631149,139.7379) | [地図](https://www.google.com/maps?q=35.63042,139.7378456) |
| 81m | shinjuku | タリーズコーヒー 新宿イーストサイドスクエア店 | タリーズコーヒー 新宿イーストサイドスクエア店 | [地図](https://www.google.com/maps?q=35.696678,139.707687) | [地図](https://www.google.com/maps?q=35.69679798,139.70857458) |
| 80m | ikebukuro | タリーズコーヒー with U ルミネ池袋店 | タリーズコーヒーwith Uルミネ池袋店 | [地図](https://www.google.com/maps?q=35.728321,139.709702) | [地図](https://www.google.com/maps?q=35.729025,139.7095165) |
| 78m | akasaka | フレッシュネスバーガー 東京ガーデンテラス紀尾井町店 | フレッシュネスバーガー東京ガーデンテラス紀尾井町店 | [地図](https://www.google.com/maps?q=35.67992,139.737183) | [地図](https://www.google.com/maps?q=35.6792618,139.7374716) |
| 78m | osaki | cisca 大崎フォレストビル店 | cisca大崎フォレストビル店 | [地図](https://www.google.com/maps?q=35.624874,139.72908) | [地図](https://www.google.com/maps?q=35.6242622,139.7295076) |
| 78m | shinagawa | バーミヤン 品川グランドコモンズ店 | バーミヤン 品川グランドコモンズ店 | [地図](https://www.google.com/maps?q=35.626488,139.740677) | [地図](https://www.google.com/maps?q=35.62718164,139.74054826) |
| 77m | akihabara | やなか珈琲店 CHABARA店 | やなか珈琲店 CHABARA店 | [地図](https://www.google.com/maps?q=35.700634,139.773331) | [地図](https://www.google.com/maps?q=35.69994715,139.7732602) |
| 77m | ikebukuro | スターバックス コーヒー ルミネ池袋2階店 | スターバックスコーヒールミネ池袋2階店 | [地図](https://www.google.com/maps?q=35.728321,139.709702) | [地図](https://www.google.com/maps?q=35.7289667,139.7093943) |
| 77m | shinagawa | GOOD MORNING CAFE 品川シーズンテラス | GOOD MORNING CAFE 品川シーズンテラス | [地図](https://www.google.com/maps?q=35.631985,139.743622) | [地図](https://www.google.com/maps?q=35.632524,139.74308) |
| 77m | tokyo | 京橋千疋屋 東京駅一番街店 | 京橋千疋屋 東京駅一番街店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.68183174,139.76677464) |
| 77m | yurakucho | THE BLUE | THE BLUE | [地図](https://www.google.com/maps?q=35.672913,139.759964) | [地図](https://www.google.com/maps?q=35.67356858,139.76025319) |
| 76m | tokyo | タリーズコーヒー OEDO日本橋店 | タリーズコーヒーOEDO日本橋店 | [地図](https://www.google.com/maps?q=35.682316,139.773773) | [地図](https://www.google.com/maps?q=35.6817931,139.774313) |
| 75m | takadanobaba | タリーズコーヒー 早大理工店 | タリーズコーヒー 早大理工店 | [地図](https://www.google.com/maps?q=35.706059,139.706833) | [地図](https://www.google.com/maps?q=35.70588592,139.70603536) |
| 75m | tokyo | ドトールコーヒーショップ 大手町フィナンシャルシティ店 | ドトールコーヒーショップ大手町フィナンシャルシティ店 | [地図](https://www.google.com/maps?q=35.688286,139.765411) | [地図](https://www.google.com/maps?q=35.6876589,139.7657218) |
| 74m | tokyo | ドトールコーヒーショップ 東京駅八重洲中央口店 | ドトールコーヒーショップ 東京駅八重洲中央口店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.68178749,139.76676144) |
| 74m | tokyo | タリーズコーヒー ＆TEA KITTE丸の内店 | タリーズコーヒー&TEA KITTE丸の内店 | [地図](https://www.google.com/maps?q=35.679085,139.764679) | [地図](https://www.google.com/maps?q=35.6797458,139.7645999) |
| 73m | iidabashi | カナルカフェ | カナルカフェ | [地図](https://www.google.com/maps?q=35.700066,139.742065) | [地図](https://www.google.com/maps?q=35.70027393,139.7428268) |
| 73m | iidabashi | 喫茶室ルノアール 市ヶ谷駅前店 | 喫茶室ルノアール市ヶ谷駅前店 | [地図](https://www.google.com/maps?q=35.689857,139.734955) | [地図](https://www.google.com/maps?q=35.6903578,139.7354769) |
| 73m | ikebukuro | タリーズコーヒー ルミネ池袋店 | タリーズコーヒー ルミネ池袋店 | [地図](https://www.google.com/maps?q=35.728321,139.709702) | [地図](https://www.google.com/maps?q=35.72897512,139.70959716) |
| 73m | shinjuku | latte chano-mama | latte chano-mama | [地図](https://www.google.com/maps?q=35.691074,139.704651) | [地図](https://www.google.com/maps?q=35.69172633,139.70466012) |
| 72m | akihabara | カフェ・ベローチェ 秋葉原駅東口店 | カフェ・ベローチェ秋葉原駅東口店 | [地図](https://www.google.com/maps?q=35.698009,139.776367) | [地図](https://www.google.com/maps?q=35.6986274,139.7761155) |
| 72m | iidabashi | スターバックス コーヒー 飯田橋サクラテラス2階店 | スターバックスコーヒー飯田橋サクラテラス2階店 | [地図](https://www.google.com/maps?q=35.699116,139.744629) | [地図](https://www.google.com/maps?q=35.6990348,139.7438341) |
| 71m | osaki | スターバックス コーヒー 大崎ブライトタワー店 | スターバックスコーヒー 大崎ブライトタワー店 | [地図](https://www.google.com/maps?q=35.622047,139.730103) | [地図](https://www.google.com/maps?q=35.62141255,139.73022511) |
| 71m | osaki | ドトールコーヒーショップ ゲートシティ大崎店 | ドトールコーヒーショップゲートシティ大崎店 | [地図](https://www.google.com/maps?q=35.619953,139.731201) | [地図](https://www.google.com/maps?q=35.6193212,139.731116) |
| 71m | osaki | マクドナルド 大崎ゲートシティ店 | マクドナルド 大崎ゲートシティ店 | [地図](https://www.google.com/maps?q=35.619953,139.731201) | [地図](https://www.google.com/maps?q=35.6193968,139.73080868) |
| 71m | takadanobaba | スターバックス コーヒー 西武高田馬場駅店 | スターバックスコーヒー西武高田馬場駅店 | [地図](https://www.google.com/maps?q=35.712494,139.703873) | [地図](https://www.google.com/maps?q=35.7131017,139.7041121) |
| 70m | ochanomizu | スターバックス コーヒー お茶の水村田ビル店 | スターバックスコーヒー お茶の水村田ビル店 | [地図](https://www.google.com/maps?q=35.700001,139.760956) | [地図](https://www.google.com/maps?q=35.70014957,139.76171363) |
| 70m | tokyo | ザ・ラウンジ by アマン | ザ・ラウンジ by アマン/アマン東京 | [地図](https://www.google.com/maps?q=35.685574,139.764664) | [地図](https://www.google.com/maps?q=35.6854396,139.765416) |
| 69m | iidabashi | 神楽坂 和茶 | 神楽坂和茶 | [地図](https://www.google.com/maps?q=35.701759,139.73613) | [地図](https://www.google.com/maps?q=35.70114059,139.73613236) |
| 69m | shibuya | エクセルシオール カフェ 渋谷マークシティ店 | エクセルシオールカフェ渋谷マークシティ店 | [地図](https://www.google.com/maps?q=35.658337,139.698578) | [地図](https://www.google.com/maps?q=35.6579605,139.6979648) |
| 69m | tokyo | タリーズコーヒー 東京日本橋タワー7階店 | タリーズコーヒー 東京日本橋タワー7階店 | [地図](https://www.google.com/maps?q=35.682316,139.773773) | [地図](https://www.google.com/maps?q=35.68191004,139.77435764) |
| 69m | yurakucho | Shake Shack 東京国際フォーラム店 | SHAKE SHACK東京国際フォーラム店 | [地図](https://www.google.com/maps?q=35.676849,139.76387) | [地図](https://www.google.com/maps?q=35.6764489,139.7632862) |
| 68m | akasaka | パンジー | パンジー | [地図](https://www.google.com/maps?q=35.672611,139.738983) | [地図](https://www.google.com/maps?q=35.67314888,139.73862223) |
| 68m | hamamatsucho | スターバックス コーヒー ブルーフロント芝浦店 | スターバックスコーヒーブルーフロント芝浦店 | [地図](https://www.google.com/maps?q=35.651527,139.757477) | [地図](https://www.google.com/maps?q=35.6509238,139.757357) |
| 68m | iidabashi | カフェ・ベローチェ 神楽坂店 | ベローチェ 神楽坂店 | [地図](https://www.google.com/maps?q=35.702408,139.740189) | [地図](https://www.google.com/maps?q=35.70212115,139.73952958) |
| 68m | iidabashi | カフェ・ド・クリエ 市ヶ谷駅前店 | カフェ・ド・クリエ 市ヶ谷駅前店 | [地図](https://www.google.com/maps?q=35.69017,139.736176) | [地図](https://www.google.com/maps?q=35.69078317,139.73623269) |
| 68m | ikebukuro | スターバックス コーヒー ルミネ池袋9階店 | スターバックスコーヒー ルミネ池袋9階店 | [地図](https://www.google.com/maps?q=35.728321,139.709702) | [地図](https://www.google.com/maps?q=35.72884734,139.70930827) |
| 68m | kichijoji | ミカフェート アトレ吉祥寺店 | ミカフェートアトレ 吉祥寺店 | [地図](https://www.google.com/maps?q=35.703297,139.579697) | [地図](https://www.google.com/maps?q=35.70319738,139.58044341) |
| 67m | iidabashi | コパン | コパン | [地図](https://www.google.com/maps?q=35.703335,139.735703) | [地図](https://www.google.com/maps?q=35.70316837,139.73641847) |
| 67m | roppongi | アンティコカフェ アルアビス | アンティコカフェアルアビス 六本木ヒルズ店 | [地図](https://www.google.com/maps?q=35.660206,139.729202) | [地図](https://www.google.com/maps?q=35.65991706,139.72985734) |
| 67m | tachikawa | ジョナサン 立川北口店 | ジョナサン 立川北口店 | [地図](https://www.google.com/maps?q=35.700329,139.412354) | [地図](https://www.google.com/maps?q=35.70089054,139.41208791) |
| 65m | akihabara | デニーズ 秋葉原中央口店 | デニーズ秋葉原中央口店 | [地図](https://www.google.com/maps?q=35.697304,139.773041) | [地図](https://www.google.com/maps?q=35.697272,139.7737545) |
| 65m | tokyo | Tokyo City i CAFE by PRONTO | Tokyo City i CAFE by PRONTO | [地図](https://www.google.com/maps?q=35.679085,139.764679) | [地図](https://www.google.com/maps?q=35.6796597,139.7645276) |
| 65m | tokyo | ザ・カフェ by アマン | ザカフェbyアマン | [地図](https://www.google.com/maps?q=35.685574,139.764664) | [地図](https://www.google.com/maps?q=35.68551804,139.76538366) |
| 65m | shinjuku | タリーズコーヒー 新宿エルタワー店 | タリーズコーヒー新宿エルタワー店 | [地図](https://www.google.com/maps?q=35.692799,139.697296) | [地図](https://www.google.com/maps?q=35.6922177,139.6972802) |
| 65m | shinjuku | プロント 新宿マインズタワー店 | プロント新宿マインズタワー店 | [地図](https://www.google.com/maps?q=35.686947,139.699448) | [地図](https://www.google.com/maps?q=35.6865545,139.6989192) |
| 64m | akasaka | スターバックス コーヒー 東京ガーデンテラス紀尾井町店 | スターバックスコーヒー 東京ガーデンテラス紀尾井町店 | [地図](https://www.google.com/maps?q=35.67992,139.737183) | [地図](https://www.google.com/maps?q=35.68026186,139.73775523) |
| 64m | gotanda | タリーズコーヒー 五反田JPビルディング店 | タリーズコーヒー五反田JPビルディング店 | [地図](https://www.google.com/maps?q=35.623024,139.722321) | [地図](https://www.google.com/maps?q=35.6225234,139.7219722) |
| 64m | tachikawa | スターバックス コーヒー 立川伊勢丹店 | スターバックスコーヒー立川伊勢丹店 | [地図](https://www.google.com/maps?q=35.699078,139.413345) | [地図](https://www.google.com/maps?q=35.6995179,139.4128958) |
| 64m | tachikawa | ANDERSEN 伊勢丹立川店 | ANDERSEN 伊勢丹立川店 | [地図](https://www.google.com/maps?q=35.699078,139.413345) | [地図](https://www.google.com/maps?q=35.69958776,139.41300736) |
| 64m | tokyo | スターバックス コーヒー 東京ミッドタウン八重洲店 | スターバックスコーヒー東京ミッドタウン八重洲店 | [地図](https://www.google.com/maps?q=35.679695,139.769165) | [地図](https://www.google.com/maps?q=35.6791182,139.7691134) |
| 64m | shinjuku | ドトールコーヒーショップ 新宿京王モール店 | ドトールコーヒーショップ 新宿京王モール店 | [地図](https://www.google.com/maps?q=35.68858,139.699432) | [地図](https://www.google.com/maps?q=35.68885171,139.69881102) |
| 63m | shimbashi | タリーズコーヒー 汐留住友ビル店 | タリーズコーヒー 汐留住友ビル店 | [地図](https://www.google.com/maps?q=35.662498,139.760895) | [地図](https://www.google.com/maps?q=35.66231154,139.76023985) |
| 61m | nakano | 喫茶室ルノアール ナカノサウステラ店 | 喫茶室ルノアールナカノサウステラ店 | [地図](https://www.google.com/maps?q=35.704613,139.66687) | [地図](https://www.google.com/maps?q=35.7051515,139.6667407) |
| 61m | shimbashi | エクセルシオール カフェ 東京汐留ビルディング店 | エクセルシオール　カフェ　東京汐留ビルディング店 | [地図](https://www.google.com/maps?q=35.662498,139.760895) | [地図](https://www.google.com/maps?q=35.663032254062,139.76076523122) |
| 61m | ueno | スターバックス コーヒー 上野恩賜公園店 | スターバックスコーヒー上野恩賜公園店 | [地図](https://www.google.com/maps?q=35.716244,139.7733) | [地図](https://www.google.com/maps?q=35.7161534,139.7739676) |
| 60m | gotanda | エクセルシオール カフェ 五反田TOC店 | エクセルシオールカフェ五反田TOC店 | [地図](https://www.google.com/maps?q=35.621418,139.719604) | [地図](https://www.google.com/maps?q=35.62190399,139.71932062) |
| 60m | shinagawa | スターバックス コーヒー 品川インターシティ店 | スターバックスコーヒー品川インターシティ店 | [地図](https://www.google.com/maps?q=35.626335,139.742004) | [地図](https://www.google.com/maps?q=35.6268734,139.7419509) |
| 60m | shinjuku | タリーズコーヒー 新宿住友ビル店 | タリーズコーヒー新宿住友ビル店 | [地図](https://www.google.com/maps?q=35.692017,139.692459) | [地図](https://www.google.com/maps?q=35.6914872,139.6925917) |
| 59m | osaki | タリーズコーヒー 大崎センタービル店 | タリーズコーヒー 大崎センタービル店 | [地図](https://www.google.com/maps?q=35.621742,139.728729) | [地図](https://www.google.com/maps?q=35.62129866,139.72837511) |
| 59m | roppongi | スターバックス コーヒー 六本木7丁目店 | スターバックスコーヒー六本木7丁目店 | [地図](https://www.google.com/maps?q=35.663563,139.731369) | [地図](https://www.google.com/maps?q=35.6640495,139.7311089) |
| 59m | tokyo | 上島珈琲店 COREDO日本橋店 | 上島珈琲店COREDO日本橋店 | [地図](https://www.google.com/maps?q=35.682968,139.774231) | [地図](https://www.google.com/maps?q=35.6825624,139.7746463) |
| 59m | shinjuku | ガスト 新宿西口エルタワー店 | ガスト 新宿西口エルタワー店 | [地図](https://www.google.com/maps?q=35.692799,139.697296) | [地図](https://www.google.com/maps?q=35.69228227,139.69742213) |
| 58m | osaki | amsu tea house TOKYO | amsu tea house TOKYO | [地図](https://www.google.com/maps?q=35.622047,139.730103) | [地図](https://www.google.com/maps?q=35.62171257,139.7305993) |
| 57m | akasaka | ガーデンラウンジ | ガーデンラウンジ | [地図](https://www.google.com/maps?q=35.680435,139.734283) | [地図](https://www.google.com/maps?q=35.68091158,139.73404245) |
| 57m | hamamatsucho | タリーズコーヒー 芝公園店 | タリーズコーヒー 芝公園店 | [地図](https://www.google.com/maps?q=35.655499,139.75235) | [地図](https://www.google.com/maps?q=35.65600656,139.75223008) |
| 57m | hamamatsucho | エクセルシオール カフェ バリスタ 東京汐留ビルディング店 | エクセルシオールカフェ バリスタ東京汐留ビルディング店 | [地図](https://www.google.com/maps?q=35.662498,139.760895) | [地図](https://www.google.com/maps?q=35.66293932,139.76121207) |
| 57m | tokyo | スターバックス コーヒー KITTE丸の内店 | スターバックスコーヒーKITTE丸の内店 | [地図](https://www.google.com/maps?q=35.679085,139.764679) | [地図](https://www.google.com/maps?q=35.6795681,139.7648998) |
| 55m | akihabara | ドトールコーヒーショップ 神田和泉町店 | ドトールコーヒーショップ神田和泉町店 | [地図](https://www.google.com/maps?q=35.699192,139.77597) | [地図](https://www.google.com/maps?q=35.6996384,139.7762405) |
| 55m | tokyo | ドトールコーヒーショップ 大手町ファーストスクエア店 | ドトールコーヒーショップ　大手町ファーストスクエア店 | [地図](https://www.google.com/maps?q=35.685574,139.764664) | [地図](https://www.google.com/maps?q=35.68593123,139.76424974) |
| 55m | shinjuku | エクセルシオール カフェ 新宿損保ジャパンビル店 | エクセルシオールカフェ新宿損保ジャパンビル店 | [地図](https://www.google.com/maps?q=35.69286,139.695755) | [地図](https://www.google.com/maps?q=35.69309583,139.69629268) |
| 55m | shinjuku | サンマルクカフェ ルミネエスト新宿店 | サンマルクカフェ ルミネエスト新宿店 | [地図](https://www.google.com/maps?q=35.691784,139.700775) | [地図](https://www.google.com/maps?q=35.69138739,139.70114377) |
| 55m | shinjuku | ナナズグリーンティー ルミネエスト新宿店 | ナナズグリーンティー ルミネエスト新宿店 | [地図](https://www.google.com/maps?q=35.691784,139.700775) | [地図](https://www.google.com/maps?q=35.69138739,139.70114377) |
| 54m | iidabashi | 奏庵 | 奏庵 | [地図](https://www.google.com/maps?q=35.701088,139.737854) | [地図](https://www.google.com/maps?q=35.70127671,139.73840736) |
| 54m | tachikawa | 猿田彦珈琲 立川高島屋S.C.店 | 猿田彦珈琲 立川高島屋S.C.店 | [地図](https://www.google.com/maps?q=35.700424,139.4133) | [地図](https://www.google.com/maps?q=35.70087943,139.41349624) |
| 54m | tachikawa | トゥ・ザ・ハーブズ ルミネ立川店 | トゥザハーブズルミネ 立川店 | [地図](https://www.google.com/maps?q=35.698551,139.413223) | [地図](https://www.google.com/maps?q=35.69839054,139.41378791) |
| 53m | ebisu | 京橋千疋屋 アトレ恵比寿店 | 京橋千疋屋 アトレ恵比寿店 | [地図](https://www.google.com/maps?q=35.647175,139.709305) | [地図](https://www.google.com/maps?q=35.64697871,139.70983926) |
| 53m | roppongi | マクドナルド 六本木駅店 | マクドナルド 六本木駅店 | [地図](https://www.google.com/maps?q=35.662449,139.731354) | [地図](https://www.google.com/maps?q=35.66259395,139.73191256) |
| 53m | roppongi | カフェテリア カレ | カフェテリアカレ | [地図](https://www.google.com/maps?q=35.664024,139.726776) | [地図](https://www.google.com/maps?q=35.66448562,139.7266459) |
| 53m | shibuya | スターバックス コーヒー 渋谷マークシティ店 | スターバックスコーヒー渋谷マークシティ店 | [地図](https://www.google.com/maps?q=35.658092,139.698685) | [地図](https://www.google.com/maps?q=35.6584355,139.6990841) |
| 53m | tachikawa | サイゼリヤ 立川北口店 | サイゼリヤ立川北口店 | [地図](https://www.google.com/maps?q=35.69865,139.412354) | [地図](https://www.google.com/maps?q=35.6990901,139.4121236) |
| 53m | tamachi | カフェ フルール | カフェ・フルール | [地図](https://www.google.com/maps?q=35.646198,139.751663) | [地図](https://www.google.com/maps?q=35.64663527,139.75142482) |
| 53m | yurakucho | マクドナルド 銀座二丁目ビル店 | マクドナルド銀座二丁目ビル店 | [地図](https://www.google.com/maps?q=35.67281,139.768509) | [地図](https://www.google.com/maps?q=35.672428910954,139.76814923677) |
| 53m | shinjuku | タリーズコーヒー SELECT ニュウマン新宿エキナカ店 | タリーズコーヒー-SELECT-ニュウマン新宿エキナカ店 | [地図](https://www.google.com/maps?q=35.68911,139.701599) | [地図](https://www.google.com/maps?q=35.6886849,139.7013328) |
| 52m | akasaka | ドトールコーヒーショップ 赤坂青山通り店 | ドトールコーヒーショップ 赤坂青山通り店 | [地図](https://www.google.com/maps?q=35.67593,139.733521) | [地図](https://www.google.com/maps?q=35.67627083,139.73391779) |
| 52m | kichijoji | スターバックス コーヒー 吉祥寺東急店 | スターバックスコーヒー吉祥寺東急店 | [地図](https://www.google.com/maps?q=35.704521,139.57782) | [地図](https://www.google.com/maps?q=35.7049908,139.5778647) |
| 52m | nakano | スターバックス コーヒー 中野セントラルパーク店 | スターバックスコーヒー中野セントラルパーク店 | [地図](https://www.google.com/maps?q=35.70734,139.661957) | [地図](https://www.google.com/maps?q=35.7069234,139.661691) |
| 52m | roppongi | 喫茶室ルノアール 六本木ラピロス店 | 喫茶室ルノアール六本木ラピロス店 | [地図](https://www.google.com/maps?q=35.662449,139.731354) | [地図](https://www.google.com/maps?q=35.6625302,139.73192) |
| 51m | akasaka | ジャローナ | ジャローナ | [地図](https://www.google.com/maps?q=35.672611,139.738983) | [地図](https://www.google.com/maps?q=35.67295444,139.73860279) |
| 51m | hamamatsucho | 甘酒・雑貨かふぇ こめどりーみんぐ | 甘酒・雑貨かふぇ こめどりーみんぐ | [地図](https://www.google.com/maps?q=35.657593,139.752365) | [地図](https://www.google.com/maps?q=35.65714239,139.75229337) |
| 51m | ochanomizu | 喫茶プペ | 喫茶プペ | [地図](https://www.google.com/maps?q=35.69215,139.761703) | [地図](https://www.google.com/maps?q=35.69221436,139.76225838) |
| 51m | tachikawa | タリーズコーヒー グランデュオ立川店 | タリーズコーヒーグランデュオ立川店 | [地図](https://www.google.com/maps?q=35.697296,139.414185) | [地図](https://www.google.com/maps?q=35.6974682,139.4147096) |
| 51m | yurakucho | Q CAFE by Royal Garden Cafe | Q CAFE by Royal Garden Cafe | [地図](https://www.google.com/maps?q=35.674088,139.759552) | [地図](https://www.google.com/maps?q=35.6736991,139.7592588) |
| 51m | yurakucho | スターバックス コーヒー 東京ミッドタウン日比谷店 | スターバックスコーヒー東京ミッドタウン日比谷店 | [地図](https://www.google.com/maps?q=35.674088,139.759552) | [地図](https://www.google.com/maps?q=35.6736991,139.7592588) |
| 50m | hamamatsucho | マクドナルド 大門店 | マクドナルド大門店 | [地図](https://www.google.com/maps?q=35.656261,139.753845) | [地図](https://www.google.com/maps?q=35.6567091,139.7538821) |
| 50m | osaki | エクセルシオール カフェ 大崎ニューシティ店 | エクセルシオールカフェ大崎ニューシティ店 | [地図](https://www.google.com/maps?q=35.620804,139.729477) | [地図](https://www.google.com/maps?q=35.6203655,139.7293689) |
| 50m | tamachi | 純喫茶もくもく | 純喫茶もくもく | [地図](https://www.google.com/maps?q=35.647507,139.745895) | [地図](https://www.google.com/maps?q=35.64776547,139.74544428) |
| 50m | ueno | スターバックス コーヒー JR上野駅 入谷改札前店 | スターバックスコーヒー JR上野駅入谷改札前店 | [地図](https://www.google.com/maps?q=35.713696,139.776917) | [地図](https://www.google.com/maps?q=35.71327601,139.77672896) |
| 50m | ueno | スターバックス コーヒー エキュート上野 公園口店 | スターバックスコーヒー エキュート上野公園口店 | [地図](https://www.google.com/maps?q=35.713696,139.776917) | [地図](https://www.google.com/maps?q=35.71327601,139.77672896) |
| 50m | ueno | スターバックス コーヒー アトレ上野店 | スターバックスコーヒー アトレ上野店 | [地図](https://www.google.com/maps?q=35.713696,139.776917) | [地図](https://www.google.com/maps?q=35.71327601,139.77672896) |
| 50m | ueno | 麻布茶房 アトレ上野店 | 麻布茶房アトレ 上野店 | [地図](https://www.google.com/maps?q=35.713696,139.776917) | [地図](https://www.google.com/maps?q=35.71327601,139.77672896) |
| 50m | yurakucho | 林屋新兵衛 日比谷店 | 林屋新兵衛 日比谷店 | [地図](https://www.google.com/maps?q=35.674088,139.759552) | [地図](https://www.google.com/maps?q=35.6736634,139.7593673) |
| 50m | shinjuku | common cafe 新宿東口店 | common cafe 新宿東口店 | [地図](https://www.google.com/maps?q=35.695652,139.701401) | [地図](https://www.google.com/maps?q=35.6960769,139.70122) |

## 目視で判断 (150m以上)

| 差 | エリア | 店舗 | Yahoo側の名前 | 現在 | POI |
|---|---|---|---|---|---|
| 861m | tachikawa | RITUEL CAFE GREEN SPRINGS 立川店 | RITUEL CAFE GREEN SPRINGS 立川店 | [地図](https://www.google.com/maps?q=35.707447,139.404404) | [地図](https://www.google.com/maps?q=35.70286194,139.41209014) |
| 773m | tachikawa | アジアンビストロ Dai 立川グリーンスプリングス店 | アジアンビストロDai 立川グリーンスプリングス店 | [地図](https://www.google.com/maps?q=35.707447,139.404404) | [地図](https://www.google.com/maps?q=35.70355349,139.41149868) |
| 677m | akasaka | JAIME | JAIME | [地図](https://www.google.com/maps?q=35.674438,139.735504) | [地図](https://www.google.com/maps?q=35.66860228,139.7333709) |
| 483m | yurakucho | サイゼリヤ 銀座インズ店 | サイゼリヤ 銀座インズ店 | [地図](https://www.google.com/maps?q=35.673634,139.770294) | [地図](https://www.google.com/maps?q=35.67537962,139.76539714) |
| 472m | shinjuku | 喫茶室ルノアール 新宿南口ルミネ前店 | 喫茶室ルノアール新宿南口ルミネ前店 | [地図](https://www.google.com/maps?q=35.688835,139.70372) | [地図](https://www.google.com/maps?q=35.6888848,139.6984886) |
| 467m | iidabashi | あかぎカフェ | あかぎカフェ | [地図](https://www.google.com/maps?q=35.704987,139.735977) | [地図](https://www.google.com/maps?q=35.70190973,139.73246403) |
| 410m | kanda | Lovers | Lovers | [地図](https://www.google.com/maps?q=35.693611,139.770981) | [地図](https://www.google.com/maps?q=35.68992543,139.77072701) |
| 335m | shinagawa | ザ・シティ・ベーカリー 品川 | ザ・シティ・ベーカリー品川 | [地図](https://www.google.com/maps?q=35.628937,139.740784) | [地図](https://www.google.com/maps?q=35.62834795,139.74442371) |
| 326m | iidabashi | スターバックス コーヒー 飯田橋メトロピア店 | スターバックスコーヒー飯田橋メトロピア店 | [地図](https://www.google.com/maps?q=35.699635,139.741928) | [地図](https://www.google.com/maps?q=35.7020567,139.7439673) |
| 318m | ikebukuro | スターバックス コーヒー エチカ池袋店 | スターバックスコーヒーエチカ池袋店 | [地図](https://www.google.com/maps?q=35.7295,139.71) | [地図](https://www.google.com/maps?q=35.7316108,139.7076277) |
| 298m | shinagawa | スターバックス コーヒー JR東海 品川駅ラチ内店 | スターバックスコーヒーJR東海品川駅ラチ内店 | [地図](https://www.google.com/maps?q=35.629002,139.737823) | [地図](https://www.google.com/maps?q=35.6305368,139.7405287) |
| 293m | shinjuku | カフェ・ベローチェ 新宿サブナード店 | カフェ・ベローチェ新宿サブナード店 | [地図](https://www.google.com/maps?q=35.695393,139.701294) | [地図](https://www.google.com/maps?q=35.6932178,139.7031269) |
| 270m | yurakucho | マクドナルド 銀座インズ店 | マクドナルド 銀座インズ店 | [地図](https://www.google.com/maps?q=35.673634,139.770294) | [地図](https://www.google.com/maps?q=35.67519951,139.76801175) |
| 266m | ikebukuro | PRONTO 池袋東口店 | PRONTO 池袋東口店 | [地図](https://www.google.com/maps?q=35.730766,139.714996) | [地図](https://www.google.com/maps?q=35.72932508,139.71264961) |
| 266m | shinjuku | スターバックス コーヒー 新宿南口店 | スターバックスコーヒー新宿南口店 | [地図](https://www.google.com/maps?q=35.685535,139.698746) | [地図](https://www.google.com/maps?q=35.6871433,139.6965638) |
| 253m | iidabashi | プロント 飯田橋店 | プロント 飯田橋店 | [地図](https://www.google.com/maps?q=35.700958,139.745972) | [地図](https://www.google.com/maps?q=35.70242948,139.74382958) |
| 250m | iidabashi | 果実園リーベル 飯田橋店 | 果実園リーベル 飯田橋店 | [地図](https://www.google.com/maps?q=35.700886,139.746704) | [地図](https://www.google.com/maps?q=35.70043226,139.74399069) |
| 245m | ikebukuro | シアトルズベストコーヒー 池袋サンシャイン60店 | シアトルズベストコーヒー 池袋サンシャイン60店 | [地図](https://www.google.com/maps?q=35.727703,139.720245) | [地図](https://www.google.com/maps?q=35.72940012,139.71850827) |
| 244m | shinjuku | スターバックス コーヒー 新宿サザンテラス店 | スターバックスコーヒー新宿サザンテラス店 | [地図](https://www.google.com/maps?q=35.685749,139.700729) | [地図](https://www.google.com/maps?q=35.6879155,139.7002884) |
| 237m | shinjuku | HAND BAKES ルミネ新宿店 | HAND BAKES ルミネ新宿店 | [地図](https://www.google.com/maps?q=35.691799,139.700943) | [地図](https://www.google.com/maps?q=35.6897431,139.70023559) |
| 236m | akihabara | スターバックス コーヒー 秋葉原駅前店 | スターバックスコーヒー 秋葉原駅前店 | [地図](https://www.google.com/maps?q=35.698406,139.770889) | [地図](https://www.google.com/maps?q=35.69777493,139.77337964) |
| 221m | akihabara | スターバックス コーヒー JR東日本ホテルメッツプレミア秋葉原店 | スターバックスコーヒーJR東日本ホテルメッツプレミア秋葉原店 | [地図](https://www.google.com/maps?q=35.697899,139.770203) | [地図](https://www.google.com/maps?q=35.6977858,139.7726462) |
| 212m | iidabashi | スターバックス コーヒー 市ヶ谷駅前店 | スターバックスコーヒー 市ヶ谷駅前店 | [地図](https://www.google.com/maps?q=35.689255,139.732758) | [地図](https://www.google.com/maps?q=35.69043317,139.73459935) |
| 200m | shinjuku | オリジナルパンケーキハウス 新宿店 | オリジナルパンケーキハウス 新宿店 | [地図](https://www.google.com/maps?q=35.693012,139.700073) | [地図](https://www.google.com/maps?q=35.69140727,139.7010638) |
| 199m | shinjuku | スターバックス コーヒー 新宿サブナード店 | スターバックスコーヒー新宿サブナード店 | [地図](https://www.google.com/maps?q=35.695393,139.701294) | [地図](https://www.google.com/maps?q=35.6936205,139.7009743) |
| 199m | shinjuku | ドトールコーヒーショップ 新宿サブナード店 | ドトールコーヒーショップ新宿サブナード店 | [地図](https://www.google.com/maps?q=35.695393,139.701294) | [地図](https://www.google.com/maps?q=35.6936177,139.7010437) |
| 186m | shinagawa | スターバックス コーヒー 高輪ゲートウェイ駅店 | スターバックスコーヒー 高輪ゲートウェイ駅店 | [地図](https://www.google.com/maps?q=35.631676,139.740341) | [地図](https://www.google.com/maps?q=35.63332851,139.74000149) |
| 181m | ikebukuro | スターバックス コーヒー 池袋サンシャインシティ アルパ1階店 | スターバックスコーヒー池袋サンシャインシティアルパ1階店 | [地図](https://www.google.com/maps?q=35.727776,139.720123) | [地図](https://www.google.com/maps?q=35.7291086,139.7189741) |
| 176m | ebisu | スターバックス コーヒー 恵比寿ガーデンプレイスタワー１Ｆ店 | スターバックスコーヒー恵比寿ガーデンプレイスタワー1F店 | [地図](https://www.google.com/maps?q=35.643627,139.712708) | [地図](https://www.google.com/maps?q=35.6421682,139.7134557) |
| 176m | ebisu | カフェ・ド・クリエ グラン 恵比寿ガーデンプレイス店 | カフェ・ド・クリエグラン恵比寿ガーデンプレイス店 | [地図](https://www.google.com/maps?q=35.643627,139.712708) | [地図](https://www.google.com/maps?q=35.6421682,139.7134502) |
| 172m | tokyo | イノダコーヒ 東京大丸支店 | イノダコーヒ東京大丸支店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.6817207,139.769055) |
| 164m | roppongi | DEAN & DELUCA カフェ 六本木 | DEAN&DELUCAカフェ六本木 | [地図](https://www.google.com/maps?q=35.666023,139.732208) | [地図](https://www.google.com/maps?q=35.6656243,139.7304644) |
| 163m | tokyo | タリーズコーヒー大丸東京店 | タリーズコーヒー大丸東京店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.6816707,139.7689662) |
| 162m | ikebukuro | ヴィ・ド・フランス 池袋店 | ヴィ・ド・フランス 池袋店 | [地図](https://www.google.com/maps?q=35.729939,139.71051) | [地図](https://www.google.com/maps?q=35.73120012,139.70962216) |
| 162m | roppongi | Le Pain Quotidien 東京ミッドタウン店 | Le Pain Quotidien 東京ミッドタウン店 | [地図](https://www.google.com/maps?q=35.666023,139.732208) | [地図](https://www.google.com/maps?q=35.66554372,139.73051718) |
| 162m | tamachi | ドトールコーヒーショップ 東京都済生会中央病院店 | ドトールコーヒーショップ東京都済生会中央病院店 | [地図](https://www.google.com/maps?q=35.653156,139.742737) | [地図](https://www.google.com/maps?q=35.6540397,139.7441608) |
| 160m | tachikawa | 和カフェ yusoshi chano-ma 立川 | 和カフェyusoshi chano-ma 立川 | [地図](https://www.google.com/maps?q=35.698551,139.413223) | [地図](https://www.google.com/maps?q=35.697294,139.4140959) |
| 159m | shimbashi | エクセルシオール カフェ ウィング新橋店 | エクセルシオールカフェウィング新橋店 | [地図](https://www.google.com/maps?q=35.666859,139.757095) | [地図](https://www.google.com/maps?q=35.6664332,139.7587758) |
| 157m | tamachi | タリーズコーヒー 三田国際ビル店 | タリーズコーヒー三田国際ビル店 | [地図](https://www.google.com/maps?q=35.653156,139.742737) | [地図](https://www.google.com/maps?q=35.6526427,139.7443525) |
| 153m | ebisu | エクセルシオール カフェ 恵比寿ガーデンプレイス店 | エクセルシオール　カフェ　恵比寿ガーデンプレイス店 | [地図](https://www.google.com/maps?q=35.643627,139.712708) | [地図](https://www.google.com/maps?q=35.64237929,139.71341963) |
| 153m | tokyo | スターバックス コーヒー グランスタ八重洲店 | スターバックスコーヒーグランスタ八重洲店 | [地図](https://www.google.com/maps?q=35.681252,139.767242) | [地図](https://www.google.com/maps?q=35.6800625,139.7680996) |
| 152m | iidabashi | タリーズコーヒー 飯田橋ガーデンエアタワー店 | タリーズコーヒー飯田橋ガーデンエアタワー店 | [地図](https://www.google.com/maps?q=35.700706,139.74884) | [地図](https://www.google.com/maps?q=35.7004626,139.7504919) |
| 152m | ikebukuro | 喫茶室ルノアール 池袋東口店 | 喫茶室ルノアール池袋東口店 | [地図](https://www.google.com/maps?q=35.731373,139.715302) | [地図](https://www.google.com/maps?q=35.7320693,139.7138466) |
| 150m | hamamatsucho | ル・パン・コティディアン 芝公園店 | ル・パン・コティディアン 芝公園店 | [地図](https://www.google.com/maps?q=35.65889,139.748795) | [地図](https://www.google.com/maps?q=35.6581178,139.750154) |
