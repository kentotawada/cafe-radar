"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { computeStats, pickMajority } from "@/lib/cafeStats";
import { PIN_COLORS } from "@/lib/pinColors";
import { getReporterId } from "@/lib/reporterId";
import type { CafeStats, OccupancyLevel, Report } from "@/lib/types";

// 直近30分の混雑報告を取り、店舗ごとに集計する。
//
// CafeMap.tsx の中にしか無かった処理を切り出した。Googleマップ版でも
// 同じ情報を出すために要る。「地図はGoogleでいいが、載っている情報は
// カフェレーダーのもの」というのがこのアプリの立ち位置なので、
// 地図を差し替えてもここは共通で使える形にしておく。
export const STALE_MINUTES = 30;

// 「空いている / 混んでいる」だと人によって基準が違い、同じ店でも
// 報告がばらつく。座れるかどうかは事実なので、その形で聞く。
// 探している側が知りたいのも「入って座れるか」であって、混雑の印象ではない。
//
// 値(empty/sparse/moderate/full)はDBの定義そのままなので、
// 表示の言葉を変えるだけでデータの移行は要らない。
export const OCCUPANCY_LABEL: Record<OccupancyLevel, string> = {
  empty: "すぐ座れる",
  sparse: "探せば座れる",
  moderate: "ほぼ埋まっている",
  full: "満席・待ちあり",
};

export const OCCUPANCY_EMOJI: Record<OccupancyLevel, string> = {
  empty: "🟢",
  sparse: "🟡",
  moderate: "🟠",
  full: "🔴",
};

export const OCCUPANCY_ORDER: OccupancyLevel[] = [
  "empty",
  "sparse",
  "moderate",
  "full",
];

export function statusColorForStats(stats: CafeStats | null): string {
  if (!stats) return PIN_COLORS.unknown;
  if (pickMajority(stats.outletOccupancyCounts) === "full") return PIN_COLORS.full;
  return PIN_COLORS[pickMajority(stats.noiseCounts)];
}

export type LiveReports = {
  statsByCafe: Record<string, CafeStats>;
  reporterId: string;
  submitting: string | null;
  error: string | null;
  /** 空いている/混んでいる だけを1タップで送る */
  submitOccupancy: (cafeId: string, level: OccupancyLevel) => Promise<void>;
};

export function useLiveReports(): LiveReports {
  const [reportsByCafe, setReportsByCafe] = useState<Record<string, Report[]>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reporterId] = useState<string>(() => getReporterId());

  useEffect(() => {
    let alive = true;
    const client = supabase;
    if (!client) return;

    const group = (rows: Report[]) => {
      const out: Record<string, Report[]> = {};
      for (const r of rows) (out[r.cafe_id] ??= []).push(r);
      return out;
    };

    const load = async () => {
      const since = new Date(Date.now() - STALE_MINUTES * 60000).toISOString();
      const { data, error: err } = await client
        .from("reports")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (err || !alive) return;
      setReportsByCafe(group((data as Report[]) ?? []));
    };

    load();
    // 30分で報告は期限切れになる。開きっぱなしでも古い情報が残らないよう
    // 定期的に取り直す
    const timer = window.setInterval(load, 60_000);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  const statsByCafe: Record<string, CafeStats> = {};
  for (const [cafeId, reports] of Object.entries(reportsByCafe)) {
    const s = computeStats(reports);
    if (s) statsByCafe[cafeId] = s;
  }

  const submitOccupancy = useCallback(
    async (cafeId: string, level: OccupancyLevel) => {
      if (!supabase) return;
      setSubmitting(cafeId);
      setError(null);
      const row = {
        cafe_id: cafeId,
        reporter_id: reporterId,
        outlet_occupancy: level,
        seating_occupancy: level,
        noise_level: "normal" as const,
      };
      const { error: err } = await supabase.from("reports").insert(row);
      setSubmitting(null);
      if (err) {
        setError(err.message);
        return;
      }
      // 送信直後に自分の報告を反映させる。取り直しを待つと
      // 押した手応えが無い
      setReportsByCafe((prev) => ({
        ...prev,
        [cafeId]: [
          { ...row, id: `local-${Date.now()}`, created_at: new Date().toISOString() } as Report,
          ...(prev[cafeId] ?? []),
        ],
      }));
    },
    [reporterId]
  );

  return { statsByCafe, reporterId, submitting, error, submitOccupancy };
}
