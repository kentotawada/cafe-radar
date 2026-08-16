"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";
import type { Cafe } from "@/lib/seedCafes";
import type { CafeFlag } from "@/lib/types";

// 利用者が「お店を追加」で登録した店舗。編集部調べの seedCafes とは別に
// Supabase の cafes テーブルへ入り、地図に重ねて出る。
//
// CafeMap.tsx の中にしか無かったので、Googleマップ版からも同じ扱いに
// できるよう切り出した。判定が2か所に散ると、片方の地図にだけ出る店
// という分かりにくい状態になる。

// 別々の人からこの件数の「無い/違う」報告が付いたら地図から下ろす。
// 1人の勘違いや悪意で消えないように、人数で見る
export const FLAG_HIDE_THRESHOLD = 3;

// DBの列は snake_case、画面で使う Cafe 型は camelCase。読むときに揃える。
// これをやらないと、利用者が入れた電源やWi-Fiの情報が地図に出てこない
type CafeRow = {
  id: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  reporter_id?: string | null;
  created_at?: string;
  website?: string | null;
  outlet_info?: string | null;
  wifi_info?: string | null;
  smoking_info?: string | null;
  seat_count_info?: string | null;
  hours_info?: string | null;
};

function toCafe(row: CafeRow): Cafe {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    reporter_id: row.reporter_id,
    created_at: row.created_at,
    website: row.website ?? null,
    outletInfo: row.outlet_info ?? null,
    wifiInfo: row.wifi_info ?? null,
    smokingInfo: row.smoking_info ?? null,
    seatCountInfo: row.seat_count_info ?? null,
    hoursInfo: row.hours_info ?? null,
  };
}

export type UserCafesApi = {
  /** 通報が閾値に達したものを除いた、表示してよいユーザー追加店舗 */
  cafes: Cafe[];
  /** ユーザー追加店舗のid。編集部調べの店と見分けるのに使う */
  userCafeIds: Set<string>;
  flaggedByMe: Set<string>;
  submitting: boolean;
  error: string | null;
  addCafe: (input: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    website?: string;
    // 追加した人がその場で分かることを書ける。空なら列に入れない
    outletInfo?: string;
    wifiInfo?: string;
    smokingInfo?: string;
  }) => Promise<boolean>;
  flagCafe: (cafeId: string) => Promise<void>;
};

export function useUserCafes(): UserCafesApi {
  const [rows, setRows] = useState<Cafe[]>([]);
  const [flagsByCafe, setFlagsByCafe] = useState<Record<string, CafeFlag[]>>({});
  const [flaggedByMe, setFlaggedByMe] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reporterId] = useState<string>(() => getReporterId());

  useEffect(() => {
    let alive = true;
    const client = supabase;
    if (!client) return;

    (async () => {
      const [{ data: cafeRows }, { data: flagRows }] = await Promise.all([
        client.from("cafes").select("*").order("created_at", { ascending: false }),
        client.from("cafe_flags").select("*"),
      ]);
      if (!alive) return;
      setRows(((cafeRows as CafeRow[]) ?? []).map(toCafe));
      const grouped: Record<string, CafeFlag[]> = {};
      for (const f of (flagRows as CafeFlag[]) ?? []) (grouped[f.cafe_id] ??= []).push(f);
      setFlagsByCafe(grouped);
      setFlaggedByMe(
        new Set(
          ((flagRows as CafeFlag[]) ?? [])
            .filter((f) => f.reporter_id === reporterId)
            .map((f) => f.cafe_id)
        )
      );
    })();

    // 追加した店がその場で他の人の画面にも出る。報告アプリなので、
    // 反映が遅いと「送れていないのでは」と思われる
    const channel = client
      .channel("cafes-realtime-google")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "cafes" },
        (payload) => setRows((prev) => [toCafe(payload.new as CafeRow), ...prev])
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "cafes" },
        (payload) => {
          const id = (payload.old as { id: string }).id;
          setRows((prev) => prev.filter((c) => c.id !== id));
        }
      )
      .subscribe();

    return () => {
      alive = false;
      client.removeChannel(channel);
    };
  }, [reporterId]);

  const cafes = useMemo(
    () =>
      rows.filter((c) => {
        const flags = flagsByCafe[c.id] ?? [];
        // 同じ人が何度押しても1件。人数で数える
        return new Set(flags.map((f) => f.reporter_id ?? f.id)).size < FLAG_HIDE_THRESHOLD;
      }),
    [rows, flagsByCafe]
  );

  const userCafeIds = useMemo(() => new Set(rows.map((c) => c.id)), [rows]);

  const addCafe = useCallback(
    async (input: {
      name: string;
      address: string;
      lat: number;
      lng: number;
      website?: string;
      outletInfo?: string;
      wifiInfo?: string;
      smokingInfo?: string;
    }) => {
      if (!supabase) {
        setError("保存先が未設定です");
        return false;
      }
      setSubmitting(true);
      setError(null);
      const { error: err } = await supabase.from("cafes").insert({
        name: input.name,
        address: input.address || null,
        lat: input.lat,
        lng: input.lng,
        website: input.website || null,
        outlet_info: input.outletInfo || null,
        wifi_info: input.wifiInfo || null,
        smoking_info: input.smokingInfo || null,
        reporter_id: reporterId,
      });
      setSubmitting(false);
      if (err) {
        setError(err.message);
        return false;
      }
      return true;
    },
    [reporterId]
  );

  const flagCafe = useCallback(
    async (cafeId: string) => {
      if (!supabase || flaggedByMe.has(cafeId)) return;
      setFlaggedByMe((prev) => new Set(prev).add(cafeId));
      const { error: err } = await supabase
        .from("cafe_flags")
        .insert({ cafe_id: cafeId, reporter_id: reporterId });
      if (err) return;
      setFlagsByCafe((prev) => ({
        ...prev,
        [cafeId]: [
          ...(prev[cafeId] ?? []),
          {
            id: `local-${cafeId}`,
            cafe_id: cafeId,
            reporter_id: reporterId,
            created_at: new Date().toISOString(),
          },
        ],
      }));
    },
    [flaggedByMe, reporterId]
  );

  return { cafes, userCafeIds, flaggedByMe, submitting, error, addCafe, flagCafe };
}
