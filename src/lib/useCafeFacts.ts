"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { dedupeByReporter, pickMajorityFromList } from "@/lib/cafeStats";
import { getReporterId } from "@/lib/reporterId";
import { emitReportSubmitted } from "@/lib/reportEvents";
import type { CafeFact, WifiSpeed } from "@/lib/types";

// cafe_facts は「時間が経っても変わらない情報」。混雑報告(reports)と違って
// 期限が無く、積み上がっていく。公表情報からは取れないものばかりで、
// このアプリが持っている一番の資産にあたる。
//
// 表示と投稿の両方をここにまとめる。CafeMap.tsx にしか無かったので、
// Googleマップ版から使えるように切り出した。

export const WIFI_SPEED_LABEL: Record<WifiSpeed, string> = {
  fast: "速い",
  standard: "普通",
  restricted: "制限あり",
  none: "つながらない",
};

export const WIFI_SPEED_LABEL_EN: Record<WifiSpeed, string> = {
  fast: "Fast",
  standard: "OK",
  restricted: "Limited",
  none: "Not working",
};

export const WIFI_SPEED_ORDER: WifiSpeed[] = [
  "fast",
  "standard",
  "restricted",
  "none",
];

export type CafeFactSummary = {
  /** 何人が電源席の数を報告したか。中央値を出す */
  outletSeatCount: number | null;
  seatCount: number | null;
  wifiSpeed: WifiSpeed | null;
  webMeetingOk: boolean | null;
  /** 「電源があるはずなのに使えなかった」が多数派 */
  outletUnusable: boolean;
  /** みんなが書いた電源席の場所 */
  notes: string[];
  /** 教えてもらった公式サイト。いちばん新しいものを採る */
  website: string | null;
  reporters: number;
};

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export function summarise(facts: CafeFact[]): CafeFactSummary {
  // 同じ人が何度も送った分は1回として数える。そうしないと1人の意見が
  // 多数派になってしまう
  const rows = dedupeByReporter(facts);
  const usable = rows
    .filter((f) => f.outlet_usable != null)
    .map((f) => (f.outlet_usable ? "ok" : "ng"));
  return {
    outletSeatCount: median(
      rows.map((f) => f.outlet_seat_count).filter((n): n is number => n != null)
    ),
    seatCount: median(
      rows.map((f) => f.seat_count).filter((n): n is number => n != null)
    ),
    wifiSpeed: pickMajorityFromList(
      rows.map((f) => f.wifi_speed).filter((v): v is WifiSpeed => v != null)
    ),
    webMeetingOk: (() => {
      const votes = rows
        .filter((f) => f.web_meeting_ok != null)
        .map((f) => (f.web_meeting_ok ? "ok" : "ng"));
      const majority = pickMajorityFromList(votes);
      return majority === null ? null : majority === "ok";
    })(),
    outletUnusable: pickMajorityFromList(usable) === "ng",
    notes: rows.map((f) => f.note).filter((n): n is string => !!n && n.trim() !== ""),
    // URLは多数決になじまない(正しいものは1つ)。新しい報告を採る
    website: rows.map((f) => f.website).find((w): w is string => !!w && w.trim() !== "") ?? null,
    reporters: rows.length,
  };
}

export type CafeFactsApi = {
  factsByCafe: Record<string, CafeFact[]>;
  submitting: string | null;
  error: string | null;
  submitFact: (cafeId: string, patch: Partial<CafeFact>) => Promise<void>;
};

export function useCafeFacts(): CafeFactsApi {
  const [factsByCafe, setFactsByCafe] = useState<Record<string, CafeFact[]>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reporterId] = useState<string>(() => getReporterId());

  useEffect(() => {
    let alive = true;
    const client = supabase;
    if (!client) return;
    (async () => {
      const { data, error: err } = await client
        .from("cafe_facts")
        .select("*")
        .order("created_at", { ascending: false });
      if (err || !alive) return;
      const grouped: Record<string, CafeFact[]> = {};
      for (const f of (data as CafeFact[]) ?? []) (grouped[f.cafe_id] ??= []).push(f);
      setFactsByCafe(grouped);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const submitFact = useCallback(
    async (cafeId: string, patch: Partial<CafeFact>) => {
      if (!supabase) return;
      setSubmitting(cafeId);
      setError(null);
      const row = { cafe_id: cafeId, reporter_id: reporterId, ...patch };
      const { error: err } = await supabase.from("cafe_facts").insert(row);
      setSubmitting(null);
      if (err) {
        // cafe_facts には「中身が空の行を作らせない」check制約がある。
        // 内容の列を増やした時にその条件へ足し忘れると、ここで弾かれる
        setError(err.message);
        return;
      }
      // 送れた数が増えたことをレベル表示へ伝える
      emitReportSubmitted();
      setFactsByCafe((prev) => ({
        ...prev,
        [cafeId]: [
          { ...row, id: `local-${Date.now()}`, created_at: new Date().toISOString() } as CafeFact,
          ...(prev[cafeId] ?? []),
        ],
      }));
    },
    [reporterId]
  );

  return { factsByCafe, submitting, error, submitFact };
}
