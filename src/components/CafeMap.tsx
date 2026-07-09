"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { cafes } from "@/data/cafes";
import { supabase } from "@/lib/supabaseClient";
import { PIN_COLORS } from "@/lib/pinColors";
import type { CafeStats, NoiseLevel, Report } from "@/lib/types";

const SHINJUKU_CENTER: [number, number] = [35.6905, 139.7005];
const STALE_MINUTES = 30;

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

function computeStats(reports: Report[]): CafeStats | null {
  if (reports.length === 0) return null;

  const noiseCounts: Record<NoiseLevel, number> = {
    quiet: 0,
    normal: 0,
    loud: 0,
  };
  let availableCount = 0;
  let latestNote: string | null = null;

  for (const report of reports) {
    noiseCounts[report.noise_level] += 1;
    if (report.outlet_available) availableCount += 1;
    if (latestNote === null && report.note) latestNote = report.note;
  }

  return {
    totalReports: reports.length,
    availableCount,
    noiseCounts,
    latestNote,
    latestAt: reports[0].created_at,
  };
}

function majorityNoise(noiseCounts: Record<NoiseLevel, number>): NoiseLevel {
  return (Object.keys(noiseCounts) as NoiseLevel[]).reduce((a, b) =>
    noiseCounts[b] > noiseCounts[a] ? b : a
  );
}

function iconForStats(stats: CafeStats | null) {
  if (!stats) return ICONS.unknown;
  const availableRatio = stats.availableCount / stats.totalReports;
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

export default function CafeMap() {
  const [reportsByCafe, setReportsByCafe] = useState<Record<string, Report[]>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorByCafe, setErrorByCafe] = useState<Record<string, string>>({});
  const [noteByCafe, setNoteByCafe] = useState<Record<string, string>>({});
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

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
      outlet_available: outletAvailable,
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
    } else {
      setNoteByCafe((prev) => ({ ...prev, [cafeId]: "" }));
    }
  };

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
      {userPosition && (
        <Marker position={userPosition} icon={USER_LOCATION_ICON}>
          <Popup>現在地</Popup>
        </Marker>
      )}
      {cafes.map((cafe) => {
        const cafeReports = reportsByCafe[cafe.id] ?? [];
        const stats = computeStats(cafeReports);
        const latestReport = cafeReports[0];
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={iconForStats(stats)}
          >
            <Popup minWidth={230}>
              <div className="flex flex-col gap-2">
                <div className="font-bold">{cafe.name}</div>
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
                    電源: 直近{stats.totalReports}件中{stats.availableCount}
                    件が空きあり / 騒音: 静か{stats.noiseCounts.quiet} 普通
                    {stats.noiseCounts.normal} うるさい{stats.noiseCounts.loud}
                    {stats.latestNote && (
                      <div className="text-gray-500 mt-1">
                        メモ: {stats.latestNote}
                      </div>
                    )}
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
                          latestReport?.noise_level ?? "normal"
                        )
                      }
                      className="px-2 py-1 text-xs rounded bg-green-100 hover:bg-green-200 disabled:opacity-50"
                    >
                      空きあり
                    </button>
                    <button
                      disabled={submitting === cafe.id}
                      onClick={() =>
                        submitReport(
                          cafe.id,
                          false,
                          latestReport?.noise_level ?? "normal"
                        )
                      }
                      className="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 disabled:opacity-50"
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
                            latestReport?.outlet_available ?? true,
                            level
                          )
                        }
                        className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        {NOISE_LABEL[level]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-1">
                    メモ（任意・例: 奥の窓側の席）
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
                    placeholder="次に報告するときに一緒に送信されます"
                    className="w-full text-xs border rounded px-2 py-1"
                  />
                </div>

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
