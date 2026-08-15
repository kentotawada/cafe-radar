"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// 編集部調べでは電源が未確認でも、利用者の報告を管理者が承認した店は
// 「電源あり」として扱う。その承認済みリスト。
//
// これが無いと、承認したはずの店のピンにプラグが付かず、「電源あり」の
// 絞り込みにも掛からない。承認する意味が無くなってしまう。
// CafeMap.tsx の中にしか無かったので切り出した。
export function useVerifiedOutlets(): Set<string> {
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let alive = true;

    (async () => {
      const { data, error } = await client
        .from("outlet_verifications")
        .select("cafe_id");
      if (error || !alive) return;
      setIds(
        new Set((data as { cafe_id: string }[] | null)?.map((r) => r.cafe_id) ?? [])
      );
    })();

    const channel = client
      .channel("outlet-verifications-google")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "outlet_verifications" },
        (payload) => {
          const row = payload.new as { cafe_id: string };
          setIds((prev) => new Set(prev).add(row.cafe_id));
        }
      )
      .subscribe();

    return () => {
      alive = false;
      client.removeChannel(channel);
    };
  }, []);

  return ids;
}
