"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { cafes } from "@/data/cafes";
import { supabase } from "@/lib/supabaseClient";
import { PIN_COLORS } from "@/lib/pinColors";
import { getReporterId } from "@/lib/reporterId";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import type { CafeStats, NoiseLevel, Report } from "@/lib/types";

const SHINJUKU_CENTER: [number, number] = [35.6905, 139.7005];
const STALE_MINUTES = 30;

type NoiseFilter = "any" | "quietOnly" | "excludeLoud";
type AvailabilityFilter = "any" | "available";

function createIcon(color: string, size = 18) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const ICONS = {
  unknown: createIcon(PIN_COLORS.unknown),
  quiet: createIcon(PIN_COLORS.quiet),
  normal: createIcon(PIN_COLORS.normal),
  loud: createIcon(PIN_COLORS.loud),
  full: createIcon(PIN_COLORS.full),
};

const USER_LOCATION_ICON = createIcon("#3b82f6", 16);

const NOISE_LABEL: Record<NoiseLevel, string> = {
  quiet: "静か",
  normal: "普通",
  loud: "うるさい",
};

// 同じ人が何度もボタンを押しても、集計にはその人の最新の1票だけを使う
function dedupeByReporter(reports: Report[]): Report[] {
  const seen = new Set<string>();
  const result: Report[] = [];
  for (const report of reports) {
    const key = report.reporter_id ?? report.id;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(report);
    }
  }
  return result;
}

function computeStats(reports: Report[]): CafeStats | null {
  const deduped = dedupeByReporter(reports);
  if (deduped.length === 0) return null;

  const noiseCounts: Record<NoiseLevel, number> = {
    quiet: 0,
    normal: 0,
    loud: 0,
  };
  let availableCount = 0;
  let seatingAvailableCount = 0;
  let latestNote: string | null = null;

  for (const report of deduped) {
    noiseCounts[report.noise_level] += 1;
    if (report.outlet_available) availableCount += 1;
    if (report.seating_available) seatingAvailableCount += 1;
    if (latestNote === null && report.note) latestNote = report.note;
  }

  return {
    totalReporters: deduped.length,
    availableCount,
    seatingAvailableCount,
    noiseCounts,
    latestNote,
    latestAt: deduped[0].created_at,
  };
}

function majorityNoise(noiseCounts: Record<NoiseLevel, number>): NoiseLevel {
  return (Object.keys(noiseCounts) as NoiseLevel[]).reduce((a, b) =>
    noiseCounts[b] > noiseCounts[a] ? b : a
  );
}

function iconForStats(stats: CafeStats | null) {
  if (!stats) return ICONS.unknown;
  const availableRatio = stats.availableCount / stats.totalReporters;
  if (availableRatio < 0.5) return ICONS.full;
  return ICONS[majorityNoise(stats.noiseCounts)];
}

function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function searchUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${address}`
  )}`;
}

function RecenterOnLocate({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);
  return null;
}

function selectedClass(isSelected: boolean) {
  return isSelected ? "ring-2 ring-offset-1 ring-black" : "";
}

export default function CafeMap() {
  const [reportsByCafe, setReportsByCafe] = useState<Record<string, Report[]>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorByCafe, setErrorByCafe] = useState<Record<string, string>>({});
  const [noteByCafe, setNoteByCafe] = useState<Record<string, string>>({});
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [reporterId] = useState<string>(() => getReporterId());
  const [favorites, setFavorites] = useState<Set<string>>(() => getFavorites());
  const [outletFilter, setOutletFilter] = useState<AvailabilityFilter>("any");
  const [seatingFilter, setSeatingFilter] = useState<AvailabilityFilter>("any");
  const [noiseFilter, setNoiseFilter] = useState<NoiseFilter>("any");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {
        // 取得できなくても地図はデフォルト位置のまま表示する
      }
    );
  }, []);

  useEffect(() => {
    let isMounted = true;
    const client = supabase;

    function groupByCafe(reports: Report[]) {
      const grouped: Record<string, Report[]> = {};
      for (const report of reports) {
        (grouped[report.cafe_id] ??= []).push(report);
      }
      return grouped;
    }

    async function loadInitialReports() {
      if (!client) return;
      const since = new Date(Date.now() - STALE_MINUTES * 60000).toISOString();
      const { data, error } = await client
        .from("reports")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      if (isMounted) setReportsByCafe(groupByCafe((data as Report[]) ?? []));
    }

    loadInitialReports();

    if (!client) {
      return () => {
        isMounted = false;
      };
    }

    const channel = client
      .channel("reports-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          const report = payload.new as Report;
          setReportsByCafe((prev) => ({
            ...prev,
            [report.cafe_id]: [report, ...(prev[report.cafe_id] ?? [])],
          }));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  const submitReport = async (
    cafeId: string,
    outletAvailable: boolean,
    seatingAvailable: boolean,
    noiseLevel: NoiseLevel
  ) => {
    if (!supabase) {
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "Supabase未設定のため保存できません",
      }));
      return;
    }
    setSubmitting(cafeId);
    setErrorByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    const note = noteByCafe[cafeId]?.trim() || null;
    const { error } = await supabase.from("reports").insert({
      cafe_id: cafeId,
      reporter_id: reporterId,
      outlet_available: outletAvailable,
      seating_available: seatingAvailable,
      noise_level: noiseLevel,
      note,
    });
    setSubmitting(null);
    if (error) {
      console.error(error);
      setErrorByCafe((prev) => ({
        ...prev,
        [cafeId]: "報告の送信に失敗しました",
      }));
    }
  };

  const handleToggleFavorite = (cafeId: string) => {
    setFavorites(toggleFavorite(cafeId));
  };

  const statsByCafe: Record<string, CafeStats | null> = {};
  const myReportByCafe: Record<string, Report | undefined> = {};
  for (const cafe of cafes) {
    const raw = reportsByCafe[cafe.id] ?? [];
    statsByCafe[cafe.id] = computeStats(raw);
    myReportByCafe[cafe.id] = raw.find((r) => r.reporter_id === reporterId);
  }

  const isFiltering =
    outletFilter !== "any" ||
    seatingFilter !== "any" ||
    noiseFilter !== "any" ||
    favoritesOnly;

  const visibleCafes = cafes.filter((cafe) => {
    if (favoritesOnly && !favorites.has(cafe.id)) return false;
    const stats = statsByCafe[cafe.id];
    if (!isFiltering) return true;
    if (
      outletFilter !== "any" ||
      seatingFilter !== "any" ||
      noiseFilter !== "any"
    ) {
      if (!stats) return false;
    }
    if (
      outletFilter === "available" &&
      stats &&
      stats.availableCount / stats.totalReporters < 0.5
    ) {
      return false;
    }
    if (
      seatingFilter === "available" &&
      stats &&
      stats.seatingAvailableCount / stats.totalReporters < 0.5
    ) {
      return false;
    }
    if (noiseFilter !== "any" && stats) {
      const majority = majorityNoise(stats.noiseCounts);
      if (noiseFilter === "quietOnly" && majority !== "quiet") return false;
      if (noiseFilter === "excludeLoud" && majority === "loud") return false;
    }
    return true;
  });

  return (
    <MapContainer
      center={userPosition ?? SHINJUKU_CENTER}
      zoom={16}
      style={{ position: "absolute", inset: 0 }}
    >
      <RecenterOnLocate position={userPosition} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <div className="leaflet-top leaflet-right" style={{ zIndex: 1000 }}>
        <div className="leaflet-control bg-white rounded shadow p-2 m-2 flex flex-col gap-1 text-xs w-44">
          <label className="flex items-center justify-between gap-1">
            電源席
            <select
              value={outletFilter}
              onChange={(e) =>
                setOutletFilter(e.target.value as AvailabilityFilter)
              }
              className="border rounded text-xs"
            >
              <option value="any">すべて</option>
              <option value="available">空きありのみ</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-1">
            一般席
            <select
              value={seatingFilter}
              onChange={(e) =>
                setSeatingFilter(e.target.value as AvailabilityFilter)
              }
              className="border rounded text-xs"
            >
              <option value="any">すべて</option>
              <option value="available">空きありのみ</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-1">
            静かさ
            <select
              value={noiseFilter}
              onChange={(e) => setNoiseFilter(e.target.value as NoiseFilter)}
              className="border rounded text-xs"
            >
              <option value="any">こだわらない</option>
              <option value="quietOnly">静かな店のみ</option>
              <option value="excludeLoud">うるさい店を除く</option>
            </select>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
            />
            お気に入りのみ
          </label>
        </div>
      </div>

      {userPosition && (
        <Marker position={userPosition} icon={USER_LOCATION_ICON}>
          <Popup>現在地</Popup>
        </Marker>
      )}
      {visibleCafes.map((cafe) => {
        const stats = statsByCafe[cafe.id];
        const myReport = myReportByCafe[cafe.id];
        const isFavorite = favorites.has(cafe.id);
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={iconForStats(stats)}
          >
            <Popup minWidth={230}>
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold">{cafe.name}</div>
                  <button
                    onClick={() => handleToggleFavorite(cafe.id)}
                    className="text-lg leading-none"
                    aria-label="お気に入り"
                    title="お気に入り"
                  >
                    {isFavorite ? "★" : "☆"}
                  </button>
                </div>
                <div className="text-xs text-gray-500">{cafe.address}</div>

                <div className="flex gap-2 text-xs">
                  <a
                    href={directionsUrl(cafe.lat, cafe.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    経路を見る
                  </a>
                  <a
                    href={searchUrl(cafe.name, cafe.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    写真・口コミ(Googleマップ)
                  </a>
                </div>

                {stats ? (
                  <div className="text-sm">
                    電源: 直近{stats.totalReporters}人中{stats.availableCount}
                    人が空きあり
                    <br />
                    一般席: 直近{stats.totalReporters}人中
                    {stats.seatingAvailableCount}人が空きあり
                    <br />
                    騒音: 静か{stats.noiseCounts.quiet} 普通
                    {stats.noiseCounts.normal} うるさい{stats.noiseCounts.loud}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    まだ報告がありません
                  </div>
                )}

                <div className="border-t pt-2">
                  <div className="text-xs font-semibold mb-1">電源席</div>
                  <div className="flex gap-1">
                    <button
                      disabled={submitting === cafe.id}
                      onClick={() =>
                        submitReport(
                          cafe.id,
                          true,
                          myReport?.seating_available ?? true,
                          myReport?.noise_level ?? "normal"
                        )
                      }
                      className={`px-2 py-1 text-xs rounded bg-green-100 hover:bg-green-200 disabled:opacity-50 ${selectedClass(
                        myReport?.outlet_available === true
                      )}`}
                    >
                      空きあり
                    </button>
                    <button
                      disabled={submitting === cafe.id}
                      onClick={() =>
                        submitReport(
                          cafe.id,
                          false,
                          myReport?.seating_available ?? true,
                          myReport?.noise_level ?? "normal"
                        )
                      }
                      className={`px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 disabled:opacity-50 ${selectedClass(
                        myReport?.outlet_available === false
                      )}`}
                    >
                      満席
                    </button>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-gray-500 mb-1">
                      電源席はどこですか？（任意）
                    </div>
                    <input
                      type="text"
                      maxLength={60}
                      value={noteByCafe[cafe.id] ?? ""}
                      onChange={(e) =>
                        setNoteByCafe((prev) => ({
                          ...prev,
                          [cafe.id]: e.target.value,
                        }))
                      }
                      placeholder="例: レジ横の窓側の席"
                      className="w-full text-xs border rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1">一般席</div>
                  <div className="flex gap-1">
                    <button
                      disabled={submitting === cafe.id}
                      onClick={() =>
                        submitReport(
                          cafe.id,
                          myReport?.outlet_available ?? true,
                          true,
                          myReport?.noise_level ?? "normal"
                        )
                      }
                      className={`px-2 py-1 text-xs rounded bg-green-100 hover:bg-green-200 disabled:opacity-50 ${selectedClass(
                        myReport?.seating_available === true
                      )}`}
                    >
                      空きあり
                    </button>
                    <button
                      disabled={submitting === cafe.id}
                      onClick={() =>
                        submitReport(
                          cafe.id,
                          myReport?.outlet_available ?? true,
                          false,
                          myReport?.noise_level ?? "normal"
                        )
                      }
                      className={`px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 disabled:opacity-50 ${selectedClass(
                        myReport?.seating_available === false
                      )}`}
                    >
                      満席
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1">騒がしさ</div>
                  <div className="flex gap-1">
                    {(Object.keys(NOISE_LABEL) as NoiseLevel[]).map((level) => (
                      <button
                        key={level}
                        disabled={submitting === cafe.id}
                        onClick={() =>
                          submitReport(
                            cafe.id,
                            myReport?.outlet_available ?? true,
                            myReport?.seating_available ?? true,
                            level
                          )
                        }
                        className={`px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 ${selectedClass(
                          myReport?.noise_level === level
                        )}`}
                      >
                        {NOISE_LABEL[level]}
                      </button>
                    ))}
                  </div>
                </div>

                {myReport && (
                  <div className="text-xs text-gray-400">
                    ✓ あなたの回答が反映されています
                  </div>
                )}

                {errorByCafe[cafe.id] && (
                  <div className="text-xs text-red-500">
                    {errorByCafe[cafe.id]}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
