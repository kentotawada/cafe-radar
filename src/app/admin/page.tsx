"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { Cafe } from "@/data/cafes";
import type { CafeFact, CafeFlag, Report } from "@/lib/types";

const FLAG_HIDE_THRESHOLD = 3;

type Row = {
  cafe: Cafe;
  flagCount: number;
  isConfirmed: boolean;
  isHidden: boolean;
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError("Supabase未設定のため読み込めません");
        return;
      }

      const [cafesRes, flagsRes, reportsRes, factsRes] = await Promise.all([
        supabase.from("cafes").select("*"),
        supabase.from("cafe_flags").select("*"),
        supabase.from("reports").select("*"),
        supabase.from("cafe_facts").select("*"),
      ]);

      if (cafesRes.error) {
        setError("店舗一覧の取得に失敗しました");
        console.error(cafesRes.error);
        return;
      }

      const cafes = (cafesRes.data as Cafe[]) ?? [];
      const flags = (flagsRes.data as CafeFlag[]) ?? [];
      const reports = (reportsRes.data as Report[]) ?? [];
      const facts = (factsRes.data as CafeFact[]) ?? [];

      const computed: Row[] = cafes.map((cafe) => {
        const cafeFlags = flags.filter((f) => f.cafe_id === cafe.id);
        const flagCount = new Set(
          cafeFlags.map((f) => f.reporter_id ?? f.id)
        ).size;
        const addedBy = cafe.reporter_id;
        const isConfirmed =
          reports.some(
            (r) => r.cafe_id === cafe.id && r.reporter_id !== addedBy
          ) ||
          facts.some(
            (f) => f.cafe_id === cafe.id && f.reporter_id !== addedBy
          );
        return {
          cafe,
          flagCount,
          isConfirmed,
          isHidden: flagCount >= FLAG_HIDE_THRESHOLD,
        };
      });

      setRows(computed);
    }

    load();
  }, []);

  const unconfirmed = rows?.filter((r) => !r.isConfirmed && !r.isHidden) ?? [];
  const flagged = rows?.filter((r) => r.flagCount > 0) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-gray-800">
      <h1 className="text-lg font-bold mb-1">管理ページ：ユーザー追加店舗</h1>
      <p className="text-xs text-gray-500 mb-6">
        「お店を追加」機能でユーザーが登録した店舗のうち、まだ確認が取れていないもの・報告があったものを一覧表示します（このページはリンクを知っている人だけがアクセスできます。認証はかかっていないため、URLを不用意に共有しないでください）。
      </p>

      {!isSupabaseConfigured && (
        <p className="text-xs text-yellow-600 mb-4">
          Supabase未接続のため、データを取得できません。
        </p>
      )}
      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
      {rows === null && !error && (
        <p className="text-xs text-gray-400">読み込み中…</p>
      )}

      {rows !== null && (
        <>
          <section className="mb-8">
            <h2 className="font-semibold mb-2">
              未確認の店舗（{unconfirmed.length}件）
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              追加した本人以外による報告・メモがまだない店舗です。実在しない可能性があります。
            </p>
            {unconfirmed.length === 0 ? (
              <p className="text-xs text-gray-400">該当する店舗はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {unconfirmed.map(({ cafe }) => (
                  <li
                    key={cafe.id}
                    className="border rounded p-2 flex flex-col gap-0.5"
                  >
                    <div className="font-medium">{cafe.name}</div>
                    <div className="text-xs text-gray-500">
                      {cafe.address ?? "住所未登録"}
                    </div>
                    <div className="text-xs text-gray-400">
                      追加日時:{" "}
                      {cafe.created_at ? formatDateTime(cafe.created_at) : "不明"}
                      　／　ID: {cafe.id}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-semibold mb-2">
              報告があった店舗（{flagged.length}件）
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              「存在しない・場所が違う」と報告された店舗です。異なる{FLAG_HIDE_THRESHOLD}
              人以上から報告されると、自動的に地図から非表示になります。
            </p>
            {flagged.length === 0 ? (
              <p className="text-xs text-gray-400">該当する店舗はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {flagged
                  .sort((a, b) => b.flagCount - a.flagCount)
                  .map(({ cafe, flagCount, isHidden }) => (
                    <li
                      key={cafe.id}
                      className="border rounded p-2 flex flex-col gap-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cafe.name}</span>
                        {isHidden && (
                          <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            現在非表示中
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {cafe.address ?? "住所未登録"}
                      </div>
                      <div className="text-xs text-gray-400">
                        報告数: {flagCount}件 ／ ID: {cafe.id}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </section>

          <p className="text-xs text-gray-400 mt-8">
            店舗を削除したり、間違って報告された店舗の報告履歴を消したい場合は、Supabaseのダッシュボード
            → Table Editor →
            「cafes」または「cafe_flags」テーブルから該当の行を直接削除してください（このページからは削除できません）。
          </p>
        </>
      )}
    </div>
  );
}
