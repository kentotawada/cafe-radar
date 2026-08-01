"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import type { CafeFact, CafeFlag, InfoCorrection, Inquiry, Report } from "@/lib/types";

const FLAG_HIDE_THRESHOLD = 3;

type Row = {
  cafe: Cafe;
  flagCount: number;
  isConfirmed: boolean;
  isHidden: boolean;
};

type OutletReportRow = {
  cafe: Cafe;
  notes: string[];
};

type InfoCorrectionRow = {
  correction: InfoCorrection;
  cafeName: string;
};

function formatDateTime(iso: string | undefined): string {
  if (!iso) return "不明";
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsSubmitting(false);
    if (error) {
      setError("ログインに失敗しました。メールアドレスとパスワードを確認してください");
    }
    // 成功時はonAuthStateChangeがsessionを更新し、自動的にダッシュボードへ切り替わる
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md p-6 w-full max-w-sm flex flex-col gap-3"
      >
        <h1 className="text-lg font-bold">管理者ログイン</h1>
        <p className="text-xs text-gray-600">
          このページは管理者のみアクセスできます。Supabaseで作成したアカウントでログインしてください。
        </p>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-700">メールアドレス</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1.5 text-base text-gray-900 bg-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-gray-700">パスワード</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1.5 text-base text-gray-900 bg-white"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 bg-blue-600 text-white rounded px-3 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "ログイン中…" : "ログイン"}
        </button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(() =>
    supabase ? undefined : null
  );
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyCafeId, setBusyCafeId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [outletReports, setOutletReports] = useState<OutletReportRow[] | null>(null);
  const [busyOutletCafeId, setBusyOutletCafeId] = useState<string | null>(null);
  const [infoCorrections, setInfoCorrections] = useState<InfoCorrectionRow[] | null>(
    null
  );
  const [busyCorrectionId, setBusyCorrectionId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [busyInquiryId, setBusyInquiryId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // 行の取得だけを行い、state更新は呼び出し側（effectまたはボタン操作）に任せる
  const fetchRows = async (): Promise<Row[] | null> => {
    if (!supabase) return null;

    const [cafesRes, flagsRes, reportsRes, factsRes] = await Promise.all([
      supabase.from("cafes").select("*"),
      supabase.from("cafe_flags").select("*"),
      supabase.from("reports").select("*"),
      supabase.from("cafe_facts").select("*"),
    ]);

    if (cafesRes.error) {
      console.error(cafesRes.error);
      return null;
    }

    const cafes = (cafesRes.data as Cafe[]) ?? [];
    const flags = (flagsRes.data as CafeFlag[]) ?? [];
    const reports = (reportsRes.data as Report[]) ?? [];
    const facts = (factsRes.data as CafeFact[]) ?? [];

    return cafes.map((cafe) => {
      const cafeFlags = flags.filter((f) => f.cafe_id === cafe.id);
      const flagCount = new Set(
        cafeFlags.map((f) => f.reporter_id ?? f.id)
      ).size;
      const addedBy = cafe.reporter_id;
      const isConfirmed =
        reports.some(
          (r) => r.cafe_id === cafe.id && r.reporter_id !== addedBy
        ) ||
        facts.some((f) => f.cafe_id === cafe.id && f.reporter_id !== addedBy);
      return {
        cafe,
        flagCount,
        isConfirmed,
        isHidden: flagCount >= FLAG_HIDE_THRESHOLD,
      };
    });
  };

  const loadRows = async () => {
    setLoadError(null);
    const computed = await fetchRows();
    if (computed === null) {
      setLoadError("店舗一覧の取得に失敗しました");
      return;
    }
    setRows(computed);
  };

  // 電源情報が未確認のお店に「電源席はどこですか？」の報告(メモ)がある
  // 一覧を取得する。編集部調べ(静的な全エリアのカフェ)とユーザー追加店舗の
  // 両方が対象。既に承認済み、または元から電源ありと判定できるお店は除く
  const fetchOutletReports = async (): Promise<OutletReportRow[] | null> => {
    if (!supabase) return null;

    const [dynamicCafesRes, factsRes, verificationsRes] = await Promise.all([
      supabase.from("cafes").select("*"),
      supabase.from("cafe_facts").select("*"),
      supabase.from("outlet_verifications").select("cafe_id"),
    ]);

    if (dynamicCafesRes.error || factsRes.error || verificationsRes.error) {
      console.error(
        dynamicCafesRes.error ?? factsRes.error ?? verificationsRes.error
      );
      return null;
    }

    const allCafes: Cafe[] = [
      ...seedCafes,
      ...((dynamicCafesRes.data as Cafe[] | null) ?? []),
    ];
    const facts = (factsRes.data as CafeFact[]) ?? [];
    const verifiedIds = new Set(
      ((verificationsRes.data as { cafe_id: string }[] | null) ?? []).map(
        (row) => row.cafe_id
      )
    );

    const cafesById = new Map(allCafes.map((cafe) => [cafe.id, cafe]));
    const notesByCafe = new Map<string, string[]>();
    for (const fact of facts) {
      if (!fact.note) continue;
      const cafe = cafesById.get(fact.cafe_id);
      if (!cafe || hasOutlet(cafe, verifiedIds)) continue;
      const list = notesByCafe.get(fact.cafe_id) ?? [];
      if (!list.includes(fact.note)) list.push(fact.note);
      notesByCafe.set(fact.cafe_id, list);
    }

    return [...notesByCafe.entries()]
      .map(([cafeId, notes]) => {
        const cafe = cafesById.get(cafeId);
        return cafe ? { cafe, notes } : null;
      })
      .filter((row): row is OutletReportRow => row !== null);
  };

  const loadOutletReports = async () => {
    const computed = await fetchOutletReports();
    if (computed !== null) setOutletReports(computed);
  };

  const approveOutlet = async (cafeId: string) => {
    if (!supabase) return;
    setBusyOutletCafeId(cafeId);
    setActionError(null);
    const { error } = await supabase
      .from("outlet_verifications")
      .insert({ cafe_id: cafeId });
    setBusyOutletCafeId(null);
    if (error) {
      console.error(error);
      setActionError("承認に失敗しました");
      return;
    }
    loadOutletReports();
  };

  // 店舗情報(喫煙・電源・Wi-Fi等)が実際と違うという指摘報告の一覧
  const fetchInfoCorrections = async (): Promise<InfoCorrectionRow[] | null> => {
    if (!supabase) return null;

    const [correctionsRes, dynamicCafesRes] = await Promise.all([
      supabase.from("info_corrections").select("*").order("created_at", { ascending: false }),
      supabase.from("cafes").select("*"),
    ]);

    if (correctionsRes.error || dynamicCafesRes.error) {
      console.error(correctionsRes.error ?? dynamicCafesRes.error);
      return null;
    }

    const allCafes: Cafe[] = [
      ...seedCafes,
      ...((dynamicCafesRes.data as Cafe[] | null) ?? []),
    ];
    const cafesById = new Map(allCafes.map((cafe) => [cafe.id, cafe]));

    return ((correctionsRes.data as InfoCorrection[] | null) ?? []).map(
      (correction) => ({
        correction,
        cafeName: cafesById.get(correction.cafe_id)?.name ?? "(店舗不明)",
      })
    );
  };

  const loadInfoCorrections = async () => {
    const computed = await fetchInfoCorrections();
    if (computed !== null) setInfoCorrections(computed);
  };

  const resolveInfoCorrection = async (id: string) => {
    if (!supabase) return;
    setBusyCorrectionId(id);
    setActionError(null);
    const { error } = await supabase.from("info_corrections").delete().eq("id", id);
    setBusyCorrectionId(null);
    if (error) {
      console.error(error);
      setActionError("対応済みへの更新に失敗しました");
      return;
    }
    loadInfoCorrections();
  };

  // 店舗に紐づかない、アプリ全体へのお問い合わせ一覧
  const fetchInquiries = async (): Promise<Inquiry[] | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return null;
    }
    return (data as Inquiry[]) ?? [];
  };

  const loadInquiries = async () => {
    const computed = await fetchInquiries();
    if (computed !== null) setInquiries(computed);
  };

  const resolveInquiry = async (id: string) => {
    if (!supabase) return;
    setBusyInquiryId(id);
    setActionError(null);
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    setBusyInquiryId(null);
    if (error) {
      console.error(error);
      setActionError("対応済みへの更新に失敗しました");
      return;
    }
    loadInquiries();
  };

  useEffect(() => {
    if (!session) return;
    fetchRows().then((computed) => {
      if (computed === null) {
        setLoadError("店舗一覧の取得に失敗しました");
      } else {
        setRows(computed);
      }
    });
    fetchOutletReports().then((computed) => {
      if (computed !== null) setOutletReports(computed);
    });
    fetchInfoCorrections().then((computed) => {
      if (computed !== null) setInfoCorrections(computed);
    });
    fetchInquiries().then((computed) => {
      if (computed !== null) setInquiries(computed);
    });
  }, [session]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setRows(null);
  };

  const deleteCafe = async (cafeId: string) => {
    if (!supabase) return;
    if (
      !window.confirm(
        "この店舗と、それに紐づく報告・メモ・通報をすべて削除します。元に戻せません。よろしいですか？"
      )
    ) {
      return;
    }
    setBusyCafeId(cafeId);
    setActionError(null);
    await supabase.from("reports").delete().eq("cafe_id", cafeId);
    await supabase.from("cafe_facts").delete().eq("cafe_id", cafeId);
    await supabase.from("cafe_flags").delete().eq("cafe_id", cafeId);
    const { error } = await supabase.from("cafes").delete().eq("id", cafeId);
    setBusyCafeId(null);
    if (error) {
      console.error(error);
      setActionError("削除に失敗しました");
      return;
    }
    loadRows();
  };

  const clearFlags = async (cafeId: string) => {
    if (!supabase) return;
    setBusyCafeId(cafeId);
    setActionError(null);
    const { error } = await supabase
      .from("cafe_flags")
      .delete()
      .eq("cafe_id", cafeId);
    setBusyCafeId(null);
    if (error) {
      console.error(error);
      setActionError("報告のクリアに失敗しました");
      return;
    }
    loadRows();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-sm text-red-600">
          Supabase未設定のため、このページは使用できません。
        </p>
      </div>
    );
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-500">読み込み中…</p>
      </div>
    );
  }

  if (!session) {
    return <LoginForm />;
  }

  const needsAction =
    rows?.filter((r) => (!r.isConfirmed || r.flagCount > 0) && !r.isHidden) ??
    [];
  const hidden = rows?.filter((r) => r.isHidden) ?? [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-gray-900">
            管理ページ：ユーザー追加店舗
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-600 underline"
          >
            ログアウト
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-6">
          「お店を追加」機能でユーザーが登録した店舗のうち、対応が必要なものを一覧表示します。
        </p>

        {loadError && (
          <p className="text-sm text-red-600 mb-4">{loadError}</p>
        )}
        {actionError && (
          <p className="text-sm text-red-600 mb-4">{actionError}</p>
        )}
        {rows === null && !loadError && (
          <p className="text-sm text-gray-500">読み込み中…</p>
        )}

        {outletReports !== null && (
          <section className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">
              電源情報の報告（{outletReports.length}件）
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              電源情報が未確認のお店に「電源席はどこですか？」の報告があったものです。承認すると、地図のピンにも電源プラグのマークが表示されるようになります。
            </p>
            {outletReports.length === 0 ? (
              <p className="text-sm text-gray-500">承認待ちの報告はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {outletReports.map(({ cafe, notes }) => (
                  <li
                    key={cafe.id}
                    className="bg-white border border-blue-200 rounded-lg shadow-sm p-3 flex flex-col gap-1"
                  >
                    <div className="font-medium text-gray-900">{cafe.name}</div>
                    <div className="text-xs text-gray-600">
                      {cafe.address ?? "住所未登録"}
                    </div>
                    <ul className="text-xs text-gray-700 list-disc list-inside">
                      {notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                    <div className="mt-1">
                      <button
                        disabled={busyOutletCafeId === cafe.id}
                        onClick={() => approveOutlet(cafe.id)}
                        className="text-xs bg-blue-50 text-blue-800 border border-blue-300 rounded px-2 py-1 hover:bg-blue-100 disabled:opacity-50"
                      >
                        🔌 電源ありとして承認
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {infoCorrections !== null && (
          <section className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">
              店舗情報の間違いの報告（{infoCorrections.length}件）
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              喫煙・電源・Wi-Fi等の編集部調べ情報が実際と違うという指摘です。内容を確認し、該当する店舗データを修正したら「対応済みにする」を押してください。
            </p>
            {infoCorrections.length === 0 ? (
              <p className="text-sm text-gray-500">報告はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {infoCorrections.map(({ correction, cafeName }) => (
                  <li
                    key={correction.id}
                    className="bg-white border border-amber-200 rounded-lg shadow-sm p-3 flex flex-col gap-1"
                  >
                    <div className="font-medium text-gray-900">{cafeName}</div>
                    <div className="text-xs text-gray-400">
                      ID: {correction.cafe_id}　／　{formatDateTime(correction.created_at)}
                    </div>
                    <div className="text-sm text-gray-700">{correction.message}</div>
                    <div className="mt-1">
                      <button
                        disabled={busyCorrectionId === correction.id}
                        onClick={() => resolveInfoCorrection(correction.id)}
                        className="text-xs bg-green-50 text-green-800 border border-green-300 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50"
                      >
                        対応済みにする
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {inquiries !== null && (
          <section className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">
              お問い合わせ（{inquiries.length}件）
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              店舗に紐づかない、アプリ全体へのお問い合わせです。
            </p>
            {inquiries.length === 0 ? (
              <p className="text-sm text-gray-500">お問い合わせはありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {inquiries.map((inquiry) => (
                  <li
                    key={inquiry.id}
                    className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDateTime(inquiry.created_at)}</span>
                      {inquiry.category && (
                        <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 font-semibold">
                          {inquiry.category === "listing"
                            ? "店舗掲載について"
                            : inquiry.category === "media"
                            ? "データ利用・取材について"
                            : "一般的なご意見"}
                        </span>
                      )}
                    </div>
                    {inquiry.store_name && (
                      <div className="text-xs font-semibold text-gray-800">
                        🏪 {inquiry.store_name}
                      </div>
                    )}
                    {(inquiry.name || inquiry.email) && (
                      <div className="text-xs text-gray-600">
                        {inquiry.name && <span>{inquiry.name}</span>}
                        {inquiry.name && inquiry.email && <span> ・ </span>}
                        {inquiry.email && (
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-blue-600 underline"
                          >
                            {inquiry.email}
                          </a>
                        )}
                      </div>
                    )}
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {inquiry.message}
                    </div>
                    <div className="mt-1">
                      <button
                        disabled={busyInquiryId === inquiry.id}
                        onClick={() => resolveInquiry(inquiry.id)}
                        className="text-xs bg-green-50 text-green-800 border border-green-300 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50"
                      >
                        対応済みにする
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {rows !== null && (
          <>
            <section className="mb-8">
              <h2 className="font-semibold text-gray-900 mb-2">
                対応が必要な店舗（{needsAction.length}件）
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                まだ他の人に確認されていない店舗、または「存在しない・場所が違う」と報告された店舗です。実在を確認できたら「問題なし」を、実在しない・間違っていると判断したら「削除」を選んでください。
              </p>
              {needsAction.length === 0 ? (
                <p className="text-sm text-gray-500">
                  対応が必要な店舗はありません
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {needsAction.map(({ cafe, flagCount, isConfirmed }) => (
                    <li
                      key={cafe.id}
                      className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">
                          {cafe.name}
                        </span>
                        {!isConfirmed && (
                          <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
                            未確認
                          </span>
                        )}
                        {flagCount > 0 && (
                          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                            報告 {flagCount}件
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {cafe.address ?? "住所未登録"}
                      </div>
                      <div className="text-xs text-gray-400">
                        追加日時: {formatDateTime(cafe.created_at)}　／　ID:{" "}
                        {cafe.id}
                      </div>
                      <div className="flex gap-2 mt-1">
                        {flagCount > 0 && (
                          <button
                            disabled={busyCafeId === cafe.id}
                            onClick={() => clearFlags(cafe.id)}
                            className="text-xs bg-green-50 text-green-800 border border-green-300 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50"
                          >
                            問題なし（報告をクリア）
                          </button>
                        )}
                        <button
                          disabled={busyCafeId === cafe.id}
                          onClick={() => deleteCafe(cafe.id)}
                          className="text-xs bg-red-50 text-red-700 border border-red-300 rounded px-2 py-1 hover:bg-red-100 disabled:opacity-50"
                        >
                          削除する
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="font-semibold text-gray-900 mb-2">
                自動非表示になった店舗（{hidden.length}件）
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                異なる{FLAG_HIDE_THRESHOLD}
                人以上から「存在しない・場所が違う」と報告されたため、既に地図から自動的に非表示になっている店舗です。
              </p>
              {hidden.length === 0 ? (
                <p className="text-sm text-gray-500">該当する店舗はありません</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {hidden.map(({ cafe, flagCount }) => (
                    <li
                      key={cafe.id}
                      className="bg-white border border-red-200 rounded-lg shadow-sm p-3 flex flex-col gap-1"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">
                          {cafe.name}
                        </span>
                        <span className="text-xs bg-red-50 text-red-700 border border-red-300 px-1.5 py-0.5 rounded">
                          非表示中（報告 {flagCount}件）
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {cafe.address ?? "住所未登録"}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <button
                          disabled={busyCafeId === cafe.id}
                          onClick={() => clearFlags(cafe.id)}
                          className="text-xs bg-green-50 text-green-800 border border-green-300 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50"
                        >
                          報告をクリアして表示を復活
                        </button>
                        <button
                          disabled={busyCafeId === cafe.id}
                          onClick={() => deleteCafe(cafe.id)}
                          className="text-xs bg-red-50 text-red-700 border border-red-300 rounded px-2 py-1 hover:bg-red-100 disabled:opacity-50"
                        >
                          完全に削除する
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
