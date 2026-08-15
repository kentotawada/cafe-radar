"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  APIProvider,
  APILoadingStatus,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiLoadingStatus,
  type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import { getCafeUsageStyle } from "@/lib/cafeUsageStyle";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { PIN_COLORS } from "@/lib/pinColors";

// Googleマップに乗り換えるかを、実物で見比べて決めるための比較ページ。
// 本体(/)は Leaflet + CARTO/MapTiler のまま一切触っていない。
//
// 判断したいのは「背景に店名やビルが描かれていると、実際に店へ
// たどり着きやすくなるか」。五反田を歩いて出た論点なので、
// 同じ場所を両方の地図で開いて比べる。
//
// 混雑度の色分けやクラスタリングはまだ入れていない。まず地図そのものの
// 見え方と速度を確かめる段階で、そこで見送るなら作り込む意味がない。

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
// AdvancedMarker は Map ID が無いと描画されない。自前のIDを作るまでは
// Googleが用意しているデモ用IDで動く(スタイルの調整はできない)
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

const GOTANDA: google.maps.LatLngLiteral = { lat: 35.6257, lng: 139.7233 };
// 一度に描くピンの上限。表示範囲で絞ったうえで、それでも多い時は打ち切る
const MAX_PINS = 200;

function CafePin({ cafe, onClick }: { cafe: Cafe; onClick: () => void }) {
  const html = useMemo(
    () =>
      cupPinSvgMarkup(
        PIN_COLORS.unknown,
        getCafeUsageStyle(cafe),
        hasOutlet(cafe, new Set()),
        42
      ),
    [cafe]
  );
  return (
    <AdvancedMarker
      position={{ lat: cafe.lat, lng: cafe.lng }}
      onClick={onClick}
      title={cafe.name}
    >
      <div
        style={{ width: 42, height: 42 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </AdvancedMarker>
  );
}

function GoogleMapView() {
  const [bounds, setBounds] = useState<google.maps.LatLngBoundsLiteral | null>(null);
  const [selected, setSelected] = useState<Cafe | null>(null);

  const handleCameraChanged = useCallback((e: MapCameraChangedEvent) => {
    setBounds(e.detail.bounds);
  }, []);

  const visible = useMemo(() => {
    if (!bounds) return [];
    const list = seedCafes.filter(
      (c) =>
        c.lat >= bounds.south &&
        c.lat <= bounds.north &&
        c.lng >= bounds.west &&
        c.lng <= bounds.east
    );
    return list.slice(0, MAX_PINS);
  }, [bounds]);

  return (
    <div className="relative flex-1">
      <Map
        mapId={MAP_ID}
        defaultCenter={GOTANDA}
        defaultZoom={16}
        gestureHandling="greedy"
        disableDefaultUI={false}
        // 地図に元から描かれているGoogleの店をタップすると、Google自身の
        // 吹き出しが出る。自分のピンの吹き出しと2種類が混ざって
        // 分かりにくいので止める
        clickableIcons={false}
        onCameraChanged={handleCameraChanged}
        style={{ width: "100%", height: "100%" }}
      >
        {visible.map((cafe) => (
          <CafePin key={cafe.id} cafe={cafe} onClick={() => setSelected(cafe)} />
        ))}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            pixelOffset={[0, -38]}
          >
            <div className="text-gray-900 max-w-[240px]">
              <div className="font-bold text-sm">{selected.name}</div>
              {selected.address && (
                <div className="text-[11px] text-gray-500 mt-0.5">{selected.address}</div>
              )}
              {selected.outletInfo && (
                <div className="text-[11px] mt-1.5 bg-blue-50 rounded px-1.5 py-1 text-blue-900">
                  🔌 {selected.outletInfo}
                </div>
              )}
              {selected.wifiInfo && (
                <div className="text-[11px] mt-1 text-gray-600">📶 {selected.wifiInfo}</div>
              )}
              <Link
                href={`/cafe/${selected.id}`}
                className="inline-block mt-2 text-[11px] text-blue-600 underline"
              >
                店舗の詳細
              </Link>
            </div>
          </InfoWindow>
        )}
      </Map>
      <div className="absolute left-2 bottom-2 bg-white/90 rounded shadow px-2 py-1 text-[11px] text-gray-700">
        表示中 {visible.length}軒{visible.length >= MAX_PINS ? "(上限)" : ""}
      </div>
    </div>
  );
}

// 地図の読み込みに失敗したとき、そのまま <Map> を描くとライブラリが
// 未初期化のAPIに触り続け、getRootNode のエラーが延々と出てタブごと
// 落ちる(実際に起きた)。読み込みが終わるまでは地図を組み立てない。
//
// 失敗したときは、原因を切り分けるための情報も出しておく。設定を
// 手探りで触るより、画面に出ているものを見たほうが早い。
function MapGate() {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED) {
    return (
      <div className="flex-1 p-6 text-sm text-gray-800">
        <p className="font-bold text-red-700 mb-3">Googleマップを読み込めませんでした</p>
        <p className="mb-4">
          ブラウザのコンソールに Google が出しているエラー名(
          <code>InvalidKeyMapError</code> など)が原因です。
        </p>
        <dl className="text-xs bg-gray-100 rounded p-3 leading-relaxed">
          <dt className="font-semibold">使用中のキー(先頭12文字)</dt>
          <dd className="mb-2 font-mono">
            {GOOGLE_MAPS_API_KEY ? `${GOOGLE_MAPS_API_KEY.slice(0, 12)}…` : "未設定"}
          </dd>
          <dt className="font-semibold">キーの長さ</dt>
          <dd className="mb-2">{GOOGLE_MAPS_API_KEY?.length ?? 0} 文字(正しくは39)</dd>
          <dt className="font-semibold">Map ID</dt>
          <dd className="mb-2 font-mono">{MAP_ID}</dd>
          <dt className="font-semibold">このページのURL</dt>
          <dd className="font-mono break-all">
            {typeof window !== "undefined" ? window.location.origin : ""}
          </dd>
        </dl>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          通常の地図に戻る
        </Link>
      </div>
    );
  }

  if (status !== APILoadingStatus.LOADED) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
        地図を読み込んでいます…
      </div>
    );
  }

  return <GoogleMapView />;
}

export default function MapGooglePage() {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-6 text-sm text-gray-700">
        <p className="font-semibold mb-2">Googleマップのキーが未設定です</p>
        <p>
          環境変数 <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> を設定してください。
        </p>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          通常の地図に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b px-3 py-2 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold">Googleマップ版(比較用)</h1>
          <p className="text-[11px] text-gray-500">
            本体は変更していません。見え方と速度の比較用です
          </p>
        </div>
        <Link
          href="/"
          className="text-xs text-blue-600 border border-blue-300 rounded-full px-3 py-1 whitespace-nowrap"
        >
          今の地図と比べる
        </Link>
      </header>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="ja" region="JP">
        <MapGate />
      </APIProvider>
    </div>
  );
}
