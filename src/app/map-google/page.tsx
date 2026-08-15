"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  APIProvider,
  APILoadingStatus,
  // JavaScript の Map と名前がぶつかるので別名にする
  Map as GMap,
  AdvancedMarker,
  InfoWindow,
  useApiLoadingStatus,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import { hasWifi } from "@/lib/cafeStats";
import { getCafeUsageStyle } from "@/lib/cafeUsageStyle";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { PIN_COLORS } from "@/lib/pinColors";
import { MapBounds } from "@/lib/mapBounds";

// Googleマップ版。現地で見比べた結果「Googleのほうが店にたどり着きやすい」
// という判断になったため、本体を移行する前段として実用レベルまで作る。
//
// 本体(/)はまだ Leaflet のまま。絞り込み・混雑報告・カード列は移していない。
// ここで確かめたいのは、日常的に使えるかどうか。

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

const GOTANDA: google.maps.LatLngLiteral = { lat: 35.6257, lng: 139.7233 };
// 一度に作るピンの上限。引いた表示では1,000件を超えることがあり、
// クラスタでまとめても、その数のDOMを作る負荷自体がスマホに効く
const MAX_MARKERS = 400;
const PIN_SIZE = 42;

// ピンのSVGは (利用スタイル × 電源の有無) の組み合わせでしか変わらない。
// 毎回組み立てると、パンのたびに数百回の文字列生成が走る
const pinHtmlCache = new Map<string, string>();
function pinHtml(cafe: Cafe) {
  const style = getCafeUsageStyle(cafe);
  const outlet = hasOutlet(cafe, new Set());
  const key = `${style}|${outlet}`;
  let html = pinHtmlCache.get(key);
  if (!html) {
    html = cupPinSvgMarkup(PIN_COLORS.unknown, style, outlet, PIN_SIZE);
    pinHtmlCache.set(key, html);
  }
  return html;
}

// ピン1個ぶん。ref に渡す関数を useCallback で固定するために、
// あえてコンポーネントを分けている。
//
// 親のJSXに ref={(m) => register(m, cafe.id)} と直接書くと、描画のたびに
// 新しい関数になる。React は ref の関数が変わると null で呼び直してから
// 付け直すので、そこで state を更新していると
// 「更新 → 再描画 → refが変わる → 付け直し → 更新」で止まらなくなる。
// スマホが落ちていた原因はこれだった
function ClusteredCafeMarker({
  cafe,
  onSelect,
  register,
}: {
  cafe: Cafe;
  onSelect: (cafe: Cafe) => void;
  register: (id: string, marker: Marker | null) => void;
}) {
  const ref = useCallback(
    (marker: Marker | null) => register(cafe.id, marker),
    [cafe.id, register]
  );
  return (
    <AdvancedMarker
      position={{ lat: cafe.lat, lng: cafe.lng }}
      ref={ref}
      onClick={() => onSelect(cafe)}
      title={cafe.name}
    >
      <div
        style={{ width: PIN_SIZE, height: PIN_SIZE }}
        dangerouslySetInnerHTML={{ __html: pinHtml(cafe) }}
      />
    </AdvancedMarker>
  );
}

// AdvancedMarker と MarkerClusterer をつなぐ。クラスタリングは
// Leaflet 版と同じ理由で要る。都心では表示範囲だけでも数百件が同時に出て、
// ピンが重なって地図が読めなくなる
function CafeMarkers({
  cafes,
  onSelect,
}: {
  cafes: Cafe[];
  onSelect: (cafe: Cafe) => void;
}) {
  const map = useMap();
  // 集めたマーカーは ref に持つ。state にすると ref が付くたびに再描画が
  // 走り、上記のループに戻る
  const markersRef = useRef<Record<string, Marker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  const register = useCallback((id: string, marker: Marker | null) => {
    if (marker) markersRef.current[id] = marker;
    else delete markersRef.current[id];
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) clusterer.current = new MarkerClusterer({ map });
    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [map]);

  // 表示対象が変わった時だけクラスタを組み直す。ref の付け外しは
  // このeffectより前に終わっているので、markersRef は埋まっている
  useEffect(() => {
    const c = clusterer.current;
    if (!c) return;
    c.clearMarkers(true);
    c.addMarkers(Object.values(markersRef.current));
  }, [cafes, map]);

  return (
    <>
      {cafes.map((cafe) => (
        <ClusteredCafeMarker
          key={cafe.id}
          cafe={cafe}
          onSelect={onSelect}
          register={register}
        />
      ))}
    </>
  );
}

function UserLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null;
  return (
    <AdvancedMarker position={{ lat: position[0], lng: position[1] }} title="現在地">
      <div className="cf-user-dot">
        <span className="cf-user-pulse-ring" />
      </div>
    </AdvancedMarker>
  );
}

function GoogleMapView() {
  const map = useMap();
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [selected, setSelected] = useState<Cafe | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [onlyOutlet, setOnlyOutlet] = useState(false);
  const [onlyWifi, setOnlyWifi] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // 指を動かしている間ずっと発火する onCameraChanged を使っていたら、
  // スマホでタブごと落ちた。1フレームごとに 1,989軒の絞り込みと
  // 数百個のピンの再描画、クラスタの全再構築が走っていたため。
  //
  // Leaflet 版が moveend / zoomend を使っていたのと同じ理由で、
  // 操作が終わって地図が落ち着いた時(idle)だけ更新する
  const handleIdle = useCallback(() => {
    if (!map) return;
    const b = map.getBounds();
    if (!b) return;
    const next = MapBounds.fromGoogle(b);
    setBounds((prev) => (prev?.equals(next) ? prev : next));
  }, [map]);

  const visible = useMemo(() => {
    if (!bounds) return [];
    const padded = bounds.pad(0.15);
    const inView = seedCafes.filter((c) => {
      if (!padded.contains([c.lat, c.lng])) return false;
      if (onlyOutlet && !hasOutlet(c, new Set())) return false;
      if (onlyWifi && !hasWifi(c)) return false;
      return true;
    });
    if (inView.length <= MAX_MARKERS) return inView;
    // 引いた表示だと1,000件を超える。クラスタでまとめても、その数の
    // React要素とDOMノードを作る負荷は残るので、中心に近い順で打ち切る
    const [cLat, cLng] = bounds.getCenter();
    return [...inView]
      .sort(
        (a, b) =>
          (a.lat - cLat) ** 2 + (a.lng - cLng) ** 2 -
          ((b.lat - cLat) ** 2 + (b.lng - cLng) ** 2)
      )
      .slice(0, MAX_MARKERS);
  }, [bounds, onlyOutlet, onlyWifi]);
  const capped = visible.length >= MAX_MARKERS;

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(p);
        map?.panTo({ lat: p[0], lng: p[1] });
        map?.setZoom(17);
        // 歩いている間も追従させる。Leaflet 版と同じ理由
        if (watchIdRef.current === null) {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (w) => setUserPosition([w.coords.latitude, w.coords.longitude]),
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
          );
        }
      },
      () => {},
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [map]);

  useEffect(
    () => () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    },
    []
  );

  return (
    <div className="relative flex-1">
      <GMap
        mapId={MAP_ID}
        defaultCenter={GOTANDA}
        defaultZoom={16}
        gestureHandling="greedy"
        clickableIcons={false}
        onIdle={handleIdle}
        style={{ width: "100%", height: "100%" }}
      >
        <CafeMarkers cafes={visible} onSelect={setSelected} />
        <UserLocationMarker position={userPosition} />
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            pixelOffset={[0, -38]}
          >
            <div className="text-gray-900 max-w-[250px]">
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
              {selected.seatCountInfo && (
                <div className="text-[11px] mt-1 text-gray-600">🪑 {selected.seatCountInfo}</div>
              )}
              <div className="flex gap-2 mt-2">
                <Link href={`/cafe/${selected.id}`} className="text-[11px] text-blue-600 underline">
                  詳細
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selected.address ? `${selected.name} ${selected.address}` : selected.name
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[11px] text-blue-600 underline"
                >
                  経路
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GMap>

      <div className="absolute left-2 top-2 flex flex-col gap-1 items-start">
        <div className="bg-white/95 rounded shadow px-2 py-1 text-[11px] text-gray-700">
          表示中 {visible.length}軒{capped ? "(上限)" : ""}
        </div>
        <button
          onClick={() => setOnlyOutlet((v) => !v)}
          className={`rounded-full shadow px-3 py-1 text-[11px] font-semibold border ${
            onlyOutlet ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          🔌 電源あり
        </button>
        <button
          onClick={() => setOnlyWifi((v) => !v)}
          className={`rounded-full shadow px-3 py-1 text-[11px] font-semibold border ${
            onlyWifi ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          📶 Wi-Fiあり
        </button>
      </div>

      <button
        onClick={locate}
        aria-label="現在地"
        className="absolute right-3 bottom-6 bg-white rounded-full shadow-lg border border-gray-300 w-11 h-11 flex items-center justify-center text-lg"
      >
        ◎
      </button>
    </div>
  );
}

// 地図の読み込みに失敗したとき、そのまま <Map> を描くとライブラリが
// 未初期化のAPIに触り続け、getRootNode のエラーが延々と出てタブごと
// 落ちる(実際に起きた)。読み込みが終わるまでは地図を組み立てない。
function MapGate() {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED) {
    return (
      <div className="flex-1 p-6 text-sm text-gray-800">
        <p className="font-bold text-red-700 mb-3">Googleマップを読み込めませんでした</p>
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
          <h1 className="text-base font-bold">Googleマップ版</h1>
          <p className="text-[11px] text-gray-500">
            本体は変更していません。絞り込みと混雑報告はまだ未移植です
          </p>
        </div>
        <Link
          href="/"
          className="text-xs text-blue-600 border border-blue-300 rounded-full px-3 py-1 whitespace-nowrap"
        >
          今の地図
        </Link>
      </header>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="ja" region="JP">
        <MapGate />
      </APIProvider>
    </div>
  );
}
