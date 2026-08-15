"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  APIProvider,
  APILoadingStatus,
  // JavaScript の Map と名前がぶつかるので別名にする
  Map as GMap,
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow,
  useApiLoadingStatus,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import { getCafeUsageStyle } from "@/lib/cafeUsageStyle";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { MapBounds } from "@/lib/mapBounds";
import {
  useLiveReports,
  statusColorForStats,
  OCCUPANCY_LABEL,
  OCCUPANCY_EMOJI,
  OCCUPANCY_SHORT,
  OCCUPANCY_ORDER,
} from "@/lib/useLiveReports";
import { pickMajority } from "@/lib/cafeStats";
import {
  EMPTY_FILTERS,
  FILTER_LABELS,
  countActive,
  passesFilters,
  type CafeFilters,
} from "@/lib/cafeFilters";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { areas } from "@/data/areas";
import { nearestStationWalkMinutes } from "@/lib/lookupCafe";
import {
  useCafeFacts,
  summarise,
  WIFI_SPEED_LABEL,
  WIFI_SPEED_ORDER,
} from "@/lib/useCafeFacts";
import { isNonSmoking } from "@/lib/cafeStats";
import type { CafeStats } from "@/lib/types";

// Googleマップ版。現地で見比べた結果「Googleのほうが店にたどり着きやすい」
// という判断になったため、本体を移行する前段として実用レベルまで作る。
//
// このページは比較用ではなく「新しい本体」として育てている。機能を1つずつ
// 移し、揃った時点で / を差し替えて Leaflet 版を削除する。
// 二重に作らないことと、途中で止めても壊れないことを優先している。

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
function pinHtml(cafe: Cafe, statusColor: string) {
  const style = getCafeUsageStyle(cafe);
  const outlet = hasOutlet(cafe, new Set());
  const key = `${statusColor}|${style}|${outlet}`;
  let html = pinHtmlCache.get(key);
  if (!html) {
    html = cupPinSvgMarkup(statusColor, style, outlet, PIN_SIZE);
    pinHtmlCache.set(key, html);
  }
  return html;
}

// カップの絵は42pxの箱の中で、先端(店を指す点)が上から21pxの位置にある。
// 電源プラグが付く場合はプラグの先まで伸びて33px。Leaflet では
// iconAnchor でこの点を指定していた。
//
// Google のマーカーは既定で要素の「下端中央」を座標に合わせるため、
// そのままだと先端が座標より上を指す。ズーム17で約25m、ズーム16なら約50m。
// 五反田で「道を挟んで隣のビル」に見えたのはこれ。
//
// 最初 CSS の transform でずらしたが、それでは見た目が動くだけで
// ライブラリが持っている位置は元のまま。クラスタリングやタップ判定が
// ずれた位置を使い続ける。anchorPoint で正しく指定する
function pinAnchorPoint(cafe: Cafe): [string, string] {
  const anchorY = hasOutlet(cafe, new Set()) ? 33 : 21;
  return ["50%", `${(anchorY / PIN_SIZE) * 100}%`];
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
  stats,
  onSelect,
  register,
}: {
  cafe: Cafe;
  stats: CafeStats | null;
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
      anchorPoint={pinAnchorPoint(cafe)}
    >
      <div
        style={{ width: PIN_SIZE, height: PIN_SIZE }}
        dangerouslySetInnerHTML={{ __html: pinHtml(cafe, statusColorForStats(stats)) }}
      />
    </AdvancedMarker>
  );
}

// AdvancedMarker と MarkerClusterer をつなぐ。クラスタリングは
// Leaflet 版と同じ理由で要る。都心では表示範囲だけでも数百件が同時に出て、
// ピンが重なって地図が読めなくなる
function CafeMarkers({
  cafes,
  statsByCafe,
  onSelect,
}: {
  cafes: Cafe[];
  statsByCafe: Record<string, CafeStats>;
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
          stats={statsByCafe[cafe.id] ?? null}
          onSelect={onSelect}
          register={register}
        />
      ))}
    </>
  );
}

function UserLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null;
  // 現在地は点の中心が位置。既定の「下端中央」だと半径ぶん北にずれる
  return (
    <AdvancedMarker
      position={{ lat: position[0], lng: position[1] }}
      title="現在地"
      anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
    >
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
  const [filters, setFilters] = useState<CafeFilters>(EMPTY_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set<string>() : getFavorites()
  );
  const [listOpen, setListOpen] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  // 「地図はGoogleでいいが、載っている情報はカフェレーダーのもの」。
  // 直近30分の混雑報告を取り、ピンの色と店舗情報に反映する
  const { statsByCafe, submitting, error: reportError, submitOccupancy } =
    useLiveReports();
  const {
    factsByCafe,
    submitting: factSubmitting,
    error: factError,
    submitFact,
  } = useCafeFacts();

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
      return passesFilters(c, filters, statsByCafe[c.id] ?? null, favorites);
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
  }, [bounds, filters, statsByCafe, favorites]);
  const capped = visible.length >= MAX_MARKERS;

  // 縦リスト用。地図の中心に近い順に並べる。地図とリストで順番が
  // 食い違うと、どれを見ているのか分からなくなる
  const listed = useMemo(() => {
    if (!bounds) return [];
    const [cLat, cLng] = bounds.getCenter();
    return [...visible]
      .sort(
        (a, b) =>
          (a.lat - cLat) ** 2 + (a.lng - cLng) ** 2 -
          ((b.lat - cLat) ** 2 + (b.lng - cLng) ** 2)
      )
      .slice(0, 60);
  }, [visible, bounds]);

  const focusCafe = useCallback(
    (cafe: Cafe) => {
      setSelected(cafe);
      map?.panTo({ lat: cafe.lat, lng: cafe.lng });
    },
    [map]
  );

  const handleToggleFavorite = useCallback((cafeId: string) => {
    setFavorites(toggleFavorite(cafeId));
  }, []);

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
        zoomControl={true}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        onIdle={handleIdle}
        style={{ width: "100%", height: "100%" }}
      >
        <CafeMarkers cafes={visible} statsByCafe={statsByCafe} onSelect={setSelected} />
        <UserLocationMarker position={userPosition} />
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            pixelOffset={[0, -38]}
          >
            {/* 狭い画面で読まれるので、文章は削って要点だけ並べる。
                住所や長い説明は詳細ページにある。ここで答えるのは
                「座れるか」「電源はあるか」の2つに絞る */}
            <div className="text-gray-900 w-[240px] max-h-[60vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-1">
                <div className="font-bold text-sm leading-snug">{selected.name}</div>
                <button
                  onClick={() => handleToggleFavorite(selected.id)}
                  aria-label="お気に入り"
                  className="text-lg leading-none text-yellow-500 shrink-0"
                >
                  {favorites.has(selected.id) ? "★" : "☆"}
                </button>
              </div>

              {(() => {
                const stats = statsByCafe[selected.id];
                const level = stats
                  ? pickMajority(stats.seatingOccupancyCounts)
                  : null;
                return (
                  <div className="mt-1.5 text-[12px] font-semibold">
                    {level ? (
                      <>
                        {OCCUPANCY_EMOJI[level]} {OCCUPANCY_LABEL[level]}
                        <span className="font-normal text-gray-500">
                          {" "}
                          {stats.totalReporters}人
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 font-normal">報告なし</span>
                    )}
                  </div>
                );
              })()}

              <div className="flex gap-1 mt-1.5">
                {OCCUPANCY_ORDER.map((level) => (
                  <button
                    key={level}
                    disabled={submitting === selected.id}
                    onClick={() => submitOccupancy(selected.id, level)}
                    title={OCCUPANCY_LABEL[level]}
                    className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 font-semibold text-gray-700 disabled:opacity-50"
                  >
                    {OCCUPANCY_EMOJI[level]}
                    <br />
                    {OCCUPANCY_SHORT[level]}
                  </button>
                ))}
              </div>
              {reportError && (
                <div className="text-[10px] text-red-600 mt-1">送信できませんでした</div>
              )}

              {(() => {
                const f = summarise(factsByCafe[selected.id] ?? []);
                return (
                  <>
                    {/* 公表情報では電源ありでも、現地で塞がれていることがある。
                        ネット調べの記載より先に出す */}
                    {f.outletUnusable && (
                      <div className="text-[11px] mt-2 rounded bg-red-50 border border-red-200 px-1.5 py-1 text-red-900 font-semibold">
                        ⚡ 電源が使えなかったとの報告
                      </div>
                    )}
                    {selected.outletInfo && (
                      <div className="text-[11px] mt-2 text-gray-700 leading-snug">
                        🔌 {selected.outletInfo}
                      </div>
                    )}
                    {/* 報告で分かったことは「報告」と分かる形で出す。
                        ネット調べと混ぜると、どこまで確かなのか分からなくなる */}
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-600 mt-1">
                      {f.outletSeatCount != null && (
                        <span>🔌 電源席{f.outletSeatCount}席</span>
                      )}
                      {f.wifiSpeed && <span>📶 {WIFI_SPEED_LABEL[f.wifiSpeed]}</span>}
                      {f.webMeetingOk != null && (
                        <span>🎧 通話{f.webMeetingOk ? "OK" : "NG"}</span>
                      )}
                      {f.reporters > 0 && (
                        <span className="text-gray-400">報告{f.reporters}件</span>
                      )}
                    </div>
                    {f.notes.length > 0 && (
                      <div className="text-[11px] text-gray-600 mt-1 leading-snug">
                        ・{f.notes[0]}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-x-2 text-[11px] text-gray-500 mt-1">
                      {selected.wifiInfo && <span>📶 Wi-Fi</span>}
                      {selected.seatCountInfo && <span>🪑 {selected.seatCountInfo}</span>}
                      {selected.smokingInfo && (
                        <span>{isNonSmoking(selected) ? "🚭 禁煙" : "🚬 喫煙可"}</span>
                      )}
                      {selected.hoursInfo && <span>⏰ {selected.hoursInfo}</span>}
                    </div>
                    {selected.webMeetingInfo && (
                      <div className="text-[11px] text-gray-600 mt-1 leading-snug">
                        🎧 {selected.webMeetingInfo}
                      </div>
                    )}

                    {/* 細かい報告は普段は畳んでおく。開くのは、その店に
                        実際にいて答えられる人だけでいい */}
                    <details className="mt-2">
                      <summary className="text-[11px] text-blue-600 cursor-pointer">
                        もっと報告する
                      </summary>
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        <div>
                          <div className="text-[10px] text-gray-500">Wi-Fiの速度</div>
                          <div className="flex gap-1 mt-0.5">
                            {WIFI_SPEED_ORDER.map((sp) => (
                              <button
                                key={sp}
                                disabled={factSubmitting === selected.id}
                                onClick={() => submitFact(selected.id, { wifi_speed: sp })}
                                className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 disabled:opacity-50"
                              >
                                {WIFI_SPEED_LABEL[sp]}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500">通話・WEB会議</div>
                          <div className="flex gap-1 mt-0.5">
                            <button
                              disabled={factSubmitting === selected.id}
                              onClick={() =>
                                submitFact(selected.id, { web_meeting_ok: true })
                              }
                              className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 disabled:opacity-50"
                            >
                              できそう
                            </button>
                            <button
                              disabled={factSubmitting === selected.id}
                              onClick={() =>
                                submitFact(selected.id, { web_meeting_ok: false })
                              }
                              className="flex-1 text-[10px] rounded border border-gray-300 bg-white py-1 disabled:opacity-50"
                            >
                              厳しい
                            </button>
                          </div>
                        </div>
                        <button
                          disabled={factSubmitting === selected.id}
                          onClick={() => submitFact(selected.id, { outlet_usable: false })}
                          className="text-[10px] rounded border border-red-300 bg-white py-1 text-red-800 disabled:opacity-50"
                        >
                          ⚡ 電源が使えなかった
                        </button>
                        {factError && (
                          <div className="text-[10px] text-red-600">
                            送信できませんでした({factError})
                          </div>
                        )}
                      </div>
                    </details>
                  </>
                );
              })()}

              <div className="flex gap-3 mt-2 text-[11px]">
                <Link href={`/cafe/${selected.id}`} className="text-blue-600 underline">
                  詳細
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selected.address ? `${selected.name} ${selected.address}` : selected.name
                  )}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-blue-600 underline"
                >
                  経路
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GMap>

      {/* 絞り込み。開いていない間は1行しか占めないようにして、
          地図を隠さないようにする */}
      <div className="absolute left-2 top-2 flex flex-col gap-1 items-start max-w-[calc(100%-1rem)]">
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className={`rounded-full shadow px-3 py-1 text-[11px] font-semibold border ${
              countActive(filters) > 0
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            絞り込み{countActive(filters) > 0 ? ` ${countActive(filters)}` : ""}{" "}
            {filterOpen ? "▲" : "▼"}
          </button>
          <div className="bg-white/95 rounded shadow px-2 py-1 text-[11px] text-gray-700 whitespace-nowrap">
            {visible.length}軒{capped ? "(上限)" : ""}
          </div>
        </div>

        {/* 駅で探す。全23エリアぶん。中身は駅の一覧なので「エリア」ではなく
            「駅」と書く(Redditで区で絞れると誤解された) */}
        <select
          value=""
          onChange={(e) => {
            const area = areas.find((a) => a.id === e.target.value);
            if (!area || !map) return;
            map.panTo({ lat: area.lat, lng: area.lng });
            map.setZoom(16);
          }}
          className="rounded-full shadow px-2 py-1 text-[11px] bg-white text-gray-700 border border-gray-300 max-w-[150px]"
        >
          <option value="">駅で探す</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name.replace("駅", "")}
            </option>
          ))}
        </select>

        {filterOpen && (
          <div className="bg-white/97 rounded-lg shadow-lg border border-gray-200 p-2 flex flex-wrap gap-1 max-w-[300px]">
            {FILTER_LABELS.map(({ key, label, note }) => (
              <button
                key={key}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={`rounded-full px-2 py-1 text-[11px] font-semibold border ${
                  filters[key]
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {label}
                {note && (
                  <span
                    className={`ml-1 text-[9px] font-normal ${
                      filters[key] ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {note}
                  </span>
                )}
              </button>
            ))}
            {countActive(filters) > 0 && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="rounded-full px-2 py-1 text-[11px] text-gray-500 underline"
              >
                すべて解除
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={locate}
        aria-label="現在地"
        className="absolute right-3 bottom-6 bg-white rounded-full shadow-lg border border-gray-300 w-11 h-11 flex items-center justify-center text-lg"
      >
        ◎
      </button>

      {/* 縦リスト。地図だけだと「この範囲に何軒あるか」が掴めない。
          中心に近い順に並べ、タップで地図がその店へ動く */}
      <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setListOpen((v) => !v)}
          className="w-full px-3 py-2 flex items-center justify-between text-[12px] font-semibold text-gray-800"
        >
          <span>
            この範囲の{visible.length}軒
            {countActive(filters) > 0 && (
              <span className="font-normal text-gray-500">（絞り込み中）</span>
            )}
          </span>
          <span className="text-gray-400">{listOpen ? "▼" : "▲"}</span>
        </button>
        {listOpen && (
          <ul className="max-h-[45vh] overflow-y-auto border-t border-gray-100">
            {listed.map((cafe) => {
              const stats = statsByCafe[cafe.id] ?? null;
              const level = stats
                ? pickMajority(stats.seatingOccupancyCounts)
                : null;
              return (
                <li key={cafe.id}>
                  <button
                    onClick={() => focusCafe(cafe)}
                    className={`w-full text-left px-3 py-2 border-b border-gray-100 ${
                      selected?.id === cafe.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-gray-900 truncate">
                          {favorites.has(cafe.id) && "★ "}
                          {cafe.name}
                        </div>
                        <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-500 mt-0.5">
                          {level && (
                            <span>
                              {OCCUPANCY_EMOJI[level]} {OCCUPANCY_LABEL[level]}
                            </span>
                          )}
                          {hasOutlet(cafe) && <span>🔌 電源</span>}
                          {cafe.wifiInfo && <span>📶 Wi-Fi</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-700 bg-blue-50 rounded-full px-1.5 py-0.5 shrink-0">
                        🚶 {nearestStationWalkMinutes(cafe.lat, cafe.lng)}分
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
            {listed.length === 0 && (
              <li className="px-3 py-4 text-[12px] text-gray-500">
                この範囲に該当するお店がありません
              </li>
            )}
          </ul>
        )}
      </div>
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
      {/* Leaflet版のヘッダーにあった導線。移行後に消えると、
          問い合わせ先も規約も辿れなくなる */}
      <nav className="px-3 py-1 flex flex-wrap gap-x-3 gap-y-0.5 border-b text-[11px] text-gray-500">
        <Link href="/favorites" className="underline">
          お気に入り
        </Link>
        <Link href="/privacy" className="underline">
          プライバシーポリシー
        </Link>
        <Link href="/contact" className="underline">
          お問い合わせ
        </Link>
        <Link href="/business" className="underline">
          店舗掲載・法人の方
        </Link>
      </nav>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="ja" region="JP">
        <MapGate />
      </APIProvider>
    </div>
  );
}
