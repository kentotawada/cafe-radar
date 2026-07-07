"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { cafes } from "@/data/cafes";
import { supabase } from "@/lib/supabaseClient";
import type { CafeStatus, NoiseLevel, Report } from "@/lib/types";

const SHINJUKU_CENTER: [number, number] = [35.6905, 139.7005];
const STALE_MINUTES = 30;

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

const ICONS = {
  unknown: createIcon("#9ca3af"),
  good: createIcon("#22c55e"),
  loud: createIcon("#f59e0b"),
  full: createIcon("#ef4444"),
};

const NOISE_LABEL: Record<NoiseLevel, string> = {
  quiet: "静か",
  normal: "普通",
  loud: "うるさい",
};

function statusFromReport(report: Report | undefined): CafeStatus | null {
  if (!report) return null;
  const ageMinutes = (Date.now() - new Date(report.created_at).getTime()) / 60000;
  return {
    outlet_available: report.outlet_available,
    noise_level: report.noise_level,
    created_at: report.created_at,
    isStale: ageMinutes > STALE_MINUTES,
  };
}

function iconForStatus(status: CafeStatus | null) {
  if (!status || status.isStale) return ICONS.unknown;
  if (!status.outlet_available) return ICONS.full;
  if (status.noise_level === "loud") return ICONS.loud;
  return ICONS.good;
}

export default function CafeMap() {
  const [latestByCafe, setLatestByCafe] = useState<Record<string, Report>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorByCafe, setErrorByCafe] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    const client = supabase;

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

      const latest: Record<string, Report> = {};
      for (const report of (data as Report[]) ?? []) {
        if (!latest[report.cafe_id]) {
          latest[report.cafe_id] = report;
        }
      }
      if (isMounted) setLatestByCafe(latest);
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
          setLatestByCafe((prev) => ({ ...prev, [report.cafe_id]: report }));
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
    const { error } = await supabase.from("reports").insert({
      cafe_id: cafeId,
      outlet_available: outletAvailable,
      noise_level: noiseLevel,
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

  return (
    <MapContainer
      center={SHINJUKU_CENTER}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cafes.map((cafe) => {
        const status = statusFromReport(latestByCafe[cafe.id]);
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lng]}
            icon={iconForStatus(status)}
          >
            <Popup minWidth={220}>
              <div className="flex flex-col gap-2">
                <div className="font-bold">{cafe.name}</div>
                <div className="text-xs text-gray-500">{cafe.address}</div>

                {status ? (
                  status.isStale ? (
                    <div className="text-sm text-gray-400">
                      30分以上前の情報です
                    </div>
                  ) : (
                    <div className="text-sm">
                      電源: {status.outlet_available ? "空きあり" : "満席"} /
                      騒音: {NOISE_LABEL[status.noise_level]}
                    </div>
                  )
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
                          latestByCafe[cafe.id]?.noise_level ?? "normal"
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
                          latestByCafe[cafe.id]?.noise_level ?? "normal"
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
                            latestByCafe[cafe.id]?.outlet_available ?? true,
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
