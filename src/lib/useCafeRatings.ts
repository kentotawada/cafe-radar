"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";

// お店の評価。行った人が5段階で点を付ける。
//
// 混雑報告(reports)は30分で消え、設備(cafe_facts)は積み上げ。評価はそのどちらとも
// 性質が違い、「この店が良かったか」という感想なので別に持つ。
//
// 1人1店で1行にして、付け直しは上書きにする。何度も入れて平均を動かせると
// 点数の意味が無くなる。

export type RatingSummary = {
  /** 平均。まだ誰も付けていなければ null */
  average: number | null;
  count: number;
  /** 自分が付けた点。付けていなければ null */
  mine: number | null;
};

export type CafeRatingsApi = {
  ratingFor: (cafeId: string) => RatingSummary;
  submitting: string | null;
  rate: (cafeId: string, score: number) => Promise<void>;
};

type Row = { cafe_id: string; reporter_id: string; score: number };

export function useCafeRatings(): CafeRatingsApi {
  const [rows, setRows] = useState<Row[]>([]);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [reporterId] = useState<string>(() => getReporterId());

  useEffect(() => {
    let alive = true;
    const client = supabase;
    if (!client) return;
    (async () => {
      const { data, error } = await client
        .from("cafe_ratings")
        .select("cafe_id, reporter_id, score");
      if (!alive || error) return;
      setRows((data as Row[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const ratingFor = useCallback(
    (cafeId: string): RatingSummary => {
      const mineRow = rows.find(
        (r) => r.cafe_id === cafeId && r.reporter_id === reporterId
      );
      const all = rows.filter((r) => r.cafe_id === cafeId);
      if (all.length === 0) return { average: null, count: 0, mine: mineRow?.score ?? null };
      const sum = all.reduce((acc, r) => acc + r.score, 0);
      return {
        average: sum / all.length,
        count: all.length,
        mine: mineRow?.score ?? null,
      };
    },
    [rows, reporterId]
  );

  const rate = useCallback(
    async (cafeId: string, score: number) => {
      if (!supabase) return;
      setSubmitting(cafeId);
      // 付け直しは上書き。(cafe_id, reporter_id) に一意制約を置いてある
      const { error } = await supabase
        .from("cafe_ratings")
        .upsert(
          { cafe_id: cafeId, reporter_id: reporterId, score },
          { onConflict: "cafe_id,reporter_id" }
        );
      setSubmitting(null);
      if (error) return;
      // 送った直後に自分の点を反映させる。取り直しを待つと押した手応えが無い
      setRows((prev) => {
        const rest = prev.filter(
          (r) => !(r.cafe_id === cafeId && r.reporter_id === reporterId)
        );
        return [...rest, { cafe_id: cafeId, reporter_id: reporterId, score }];
      });
    },
    [reporterId]
  );

  return { ratingFor, submitting, rate };
}
