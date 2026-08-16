"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";
import { subscribeReportSubmitted } from "@/lib/reportEvents";
import { levelForReportCount, type ReporterLevel } from "@/lib/reporterLevel";

// 自分がこれまでに送った報告の数と、そこから決まるレベル。
//
// 報告は誰かの役に立つが、送った本人には何も返ってこない。実店舗のクーポンは
// 運営に費用と交渉が要るので、匿名のままコード側だけで完結する称号を返す。
// 仕組み自体は Leaflet 版のヘッダー(MyReporterBadge)で先に作ってあり、
// ここはそれを Googleマップ版からも使えるように切り出したもの。
export type ReporterProgress = {
  count: number | null;
  level: ReporterLevel | null;
  /** 次のレベルまであと何件か。最高位なら null */
  remaining: number | null;
};

export function useReporterProgress(): ReporterProgress {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    // 最初の1回と、送信のたびに数え直す。押した直後に増えていないと、
    // 送れたのか分からない
    const count = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      const { count: c, error } = await supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("reporter_id", getReporterId());
      if (alive && !error) setCount(c ?? 0);
    };

    count();
    const unsubscribe = subscribeReportSubmitted(() => {
      count();
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  if (count === null) return { count: null, level: null, remaining: null };
  const level = levelForReportCount(count);
  return {
    count,
    level,
    remaining: level.nextAt == null ? null : Math.max(0, level.nextAt - count),
  };
}
