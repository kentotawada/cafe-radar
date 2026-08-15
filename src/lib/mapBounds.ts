export type LatLngTuple = [number, number];

// 地図の表示範囲。Leaflet の L.LatLngBounds を置き換えるために作った。
//
// 絞り込みのコードは searchBounds.pad(0.15).contains([lat, lng]) という形で
// 書かれていて、地図ライブラリとは本来無関係な判定にすぎない。同じ形の型を
// 用意しておけば、Googleマップへの移行でその部分を書き換えずに済む。
//
// pad の意味は Leaflet と同じにしてある(縦横それぞれの幅に対する比率で
// 四方に広げる)。ここがずれると、地図に出るピンの数が静かに変わる。
export class MapBounds {
  // コンストラクタ引数でのプロパティ宣言(readonly south: number など)は
  // TypeScript独自の構文で、型を落とすだけの実行環境では動かない。
  // 検証スクリプトから直接読めるように、素の書き方にしてある
  readonly south: number;
  readonly west: number;
  readonly north: number;
  readonly east: number;

  constructor(south: number, west: number, north: number, east: number) {
    this.south = south;
    this.west = west;
    this.north = north;
    this.east = east;
  }

  static fromLiteral(b: {
    south: number;
    west: number;
    north: number;
    east: number;
  }): MapBounds {
    return new MapBounds(b.south, b.west, b.north, b.east);
  }

  static fromGoogle(b: google.maps.LatLngBounds): MapBounds {
    const sw = b.getSouthWest();
    const ne = b.getNorthEast();
    return new MapBounds(sw.lat(), sw.lng(), ne.lat(), ne.lng());
  }

  equals(other: MapBounds | null | undefined): boolean {
    if (!other) return false;
    return (
      this.south === other.south &&
      this.west === other.west &&
      this.north === other.north &&
      this.east === other.east
    );
  }

  pad(ratio: number): MapBounds {
    const latBuffer = Math.abs(this.north - this.south) * ratio;
    const lngBuffer = Math.abs(this.east - this.west) * ratio;
    return new MapBounds(
      this.south - latBuffer,
      this.west - lngBuffer,
      this.north + latBuffer,
      this.east + lngBuffer
    );
  }

  contains([lat, lng]: LatLngTuple): boolean {
    return (
      lat >= this.south && lat <= this.north && lng >= this.west && lng <= this.east
    );
  }

  getCenter(): LatLngTuple {
    return [(this.south + this.north) / 2, (this.west + this.east) / 2];
  }
}
