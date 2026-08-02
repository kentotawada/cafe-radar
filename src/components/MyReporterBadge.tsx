"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";
import { subscribeReportSubmitted } from "@/lib/reportEvents";
import { levelForReportCount } from "@/lib/reporterLevel";

// 報告した回数に応じて、称号・レベルが上がっていく表示。実店舗クーポン
// のような運営コストのかかる報酬の代わりに、匿名のままコード側だけで
// 完結するモチベーション施策として追加した。報告するたびにreportEvents
// 経由で数え直す
export default function MyReporterBadge() {
  const [count, setCount] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const reporterId = getReporterId();

    async function fetchCount() {
      const { count: c, error } = await supabase!
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("reporter_id", reporterId);
      if (!error) setCount(c ?? 0);
    }

    fetchCount();
    const unsubscribe = subscribeReportSubmitted(fetchCount);
    return unsubscribe;
  }, []);

  if (count === null) return null;

  const level = levelForReportCount(count);

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600 border border-gray-300 rounded-full px-2.5 py-0.5 sm:py-1 hover:bg-gray-50 shrink-0"
      >
        <span aria-hidden>{level.emoji}</span>
        <span className="hidden sm:inline">Lv.{level.level} {level.title}</span>
        <span className="sm:hidden">Lv.{level.level}</span>
      </button>

      {showDetail &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4"
            onClick={() => setShowDetail(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-xs overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-2 px-5 pt-6 pb-5">
                <div className="text-4xl" aria-hidden>
                  {level.emoji}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  Lv.{level.level} {level.title}
                </div>
                <div className="text-xs text-gray-500">
                  これまでの報告数: {count}件
                </div>
                {level.nextAt !== null ? (
                  <div className="w-full mt-2">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((count - level.minCount) /
                                (level.nextAt - level.minCount)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 text-center">
                      次のレベルまであと{level.nextAt - count}件
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-600 mt-1">
                    最高レベルに到達しています！
                  </div>
                )}
                <p className="text-[11px] text-gray-400 text-center mt-1">
                  混雑度や電源席の状況を報告するたびに、称号が上がっていきます
                </p>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="w-full px-4 py-3 font-semibold text-sm text-gray-700 cursor-pointer border-t"
              >
                閉じる
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
