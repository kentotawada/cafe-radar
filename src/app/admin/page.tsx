"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { seedCafes, type Cafe } from "@/lib/seedCafes";
import { hasOutlet } from "@/lib/cafeAmenities";
import type {
  AdCreative,
  Advertiser,
  AdvertiserType,
  CafeFact,
  CafeFlag,
  CafeReview,
  InfoCorrection,
  Inquiry,
  Report,
} from "@/lib/types";
import { PHOTO_BUCKET, photoUrl } from "@/lib/useCafeReviews";

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

// 口コミ1件と、それに付いた通報の数。写真は承認するまで公開されない
type ReviewRow = {
  review: CafeReview;
  cafeName: string;
  reportCount: number;
};

type InfoCorrectionRow = {
  correction: InfoCorrection;
  cafeName: string;
};

type PendingCreativeRow = {
  creative: AdCreative;
  advertiserName: string;
};

const ADVERTISER_TYPE_LABEL: Record<AdvertiserType, string> = {
  cafe_owner: "カフェオーナー",
  business: "企業(バナー出稿)",
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

function InviteAdvertiserForm({
  accessToken,
  onInvited,
}: {
  accessToken: string;
  onInvited: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<AdvertiserType>("cafe_owner");
  const [cafeId, setCafeId] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/admin/advertisers/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          type,
          cafeId: cafeId || null,
          contactEmail,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "招待に失敗しました");
        return;
      }
      setSuccessMessage(`${contactEmail} 宛に招待メールを送信しました`);
      setName("");
      setCafeId("");
      setContactEmail("");
      onInvited();
    } catch {
      setError("通信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 flex flex-col gap-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700">広告主名</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700">種別</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AdvertiserType)}
            className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white"
          >
            <option value="cafe_owner">カフェオーナー</option>
            <option value="business">企業(バナー出稿)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700">紐づく店舗ID(任意)</span>
          <input
            type="text"
            value={cafeId}
            onChange={(e) => setCafeId(e.target.value)}
            placeholder="カフェオーナーの場合のみ"
            className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="text-gray-700">連絡先メールアドレス</span>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white"
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {successMessage && <p className="text-xs text-green-700">{successMessage}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start text-xs bg-blue-600 text-white rounded px-3 py-1.5 font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "送信中…" : "広告主を追加(招待メール送信)"}
      </button>
    </form>
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
  const [reviews, setReviews] = useState<ReviewRow[] | null>(null);
  const [busyReviewId, setBusyReviewId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [busyInquiryId, setBusyInquiryId] = useState<string | null>(null);
  const [advertisers, setAdvertisers] = useState<Advertiser[] | null>(null);
  const [pendingCreatives, setPendingCreatives] = useState<PendingCreativeRow[] | null>(
    null
  );
  const [busyCreativeId, setBusyCreativeId] = useState<string | null>(null);

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

  // 口コミと写真。写真は承認するまで表示されないので、ここで見て決める
  const fetchReviews = async (): Promise<ReviewRow[] | null> => {
    if (!supabase) return null;
    const [reviewsRes, reportsRes, dynamicCafesRes] = await Promise.all([
      supabase.from("cafe_reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("cafe_review_reports").select("review_id"),
      supabase.from("cafes").select("*"),
    ]);
    if (reviewsRes.error || dynamicCafesRes.error) {
      console.error(reviewsRes.error ?? dynamicCafesRes.error);
      return null;
    }
    const allCafes: Cafe[] = [
      ...seedCafes,
      ...((dynamicCafesRes.data as Cafe[] | null) ?? []),
    ];
    const cafesById = new Map(allCafes.map((cafe) => [cafe.id, cafe]));
    const reportCounts = new Map<string, number>();
    for (const r of ((reportsRes.data as { review_id: string }[] | null) ?? [])) {
      reportCounts.set(r.review_id, (reportCounts.get(r.review_id) ?? 0) + 1);
    }
    const rows = ((reviewsRes.data as CafeReview[] | null) ?? []).map((review) => ({
      review,
      cafeName: cafesById.get(review.cafe_id)?.name ?? "(店舗不明)",
      reportCount: reportCounts.get(review.id) ?? 0,
    }));
    // 手を動かす必要があるものを上に。未承認の写真 → 通報あり → その他
    const urgency = (row: ReviewRow) =>
      row.review.photo_path && !row.review.photo_approved ? 0 : row.reportCount > 0 ? 1 : 2;
    return rows.sort((a, b) => urgency(a) - urgency(b));
  };

  const loadReviews = async () => {
    const computed = await fetchReviews();
    if (computed !== null) setReviews(computed);
  };

  const approveReviewPhoto = async (id: string) => {
    if (!supabase) return;
    setBusyReviewId(id);
    setActionError(null);
    const { error } = await supabase
      .from("cafe_reviews")
      .update({ photo_approved: true })
      .eq("id", id);
    setBusyReviewId(null);
    if (error) {
      console.error(error);
      setActionError("写真の公開に失敗しました");
      return;
    }
    loadReviews();
  };

  const setReviewHidden = async (id: string, hidden: boolean) => {
    if (!supabase) return;
    setBusyReviewId(id);
    setActionError(null);
    const { error } = await supabase.from("cafe_reviews").update({ hidden }).eq("id", id);
    setBusyReviewId(null);
    if (error) {
      console.error(error);
      setActionError(hidden ? "非表示にできませんでした" : "再表示できませんでした");
      return;
    }
    loadReviews();
  };

  // 投稿ごと消す。写真も置き場から消す。
  // 先に写真を消すのは、行だけ消えて写真が残ると誰も辿れなくなるため
  const deleteReview = async (row: ReviewRow) => {
    if (!supabase) return;
    if (!window.confirm("この投稿を完全に削除します。元に戻せません。よろしいですか？")) return;
    setBusyReviewId(row.review.id);
    setActionError(null);
    if (row.review.photo_path) {
      const { error: storageError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .remove([row.review.photo_path]);
      if (storageError) console.error(storageError);
    }
    const { error } = await supabase.from("cafe_reviews").delete().eq("id", row.review.id);
    setBusyReviewId(null);
    if (error) {
      console.error(error);
      setActionError("削除に失敗しました");
      return;
    }
    loadReviews();
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

  // 広告主一覧(招待済み・登録済み全て)
  const fetchAdvertisers = async (): Promise<Advertiser[] | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("advertisers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return null;
    }
    return (data as Advertiser[]) ?? [];
  };

  const loadAdvertisers = async () => {
    const computed = await fetchAdvertisers();
    if (computed !== null) setAdvertisers(computed);
  };

  // 審査待ち(status='pending')の掲載クリエイティブ一覧
  const fetchPendingCreatives = async (): Promise<PendingCreativeRow[] | null> => {
    if (!supabase) return null;
    const [creativesRes, advertisersRes] = await Promise.all([
      supabase
        .from("ad_creatives")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase.from("advertisers").select("*"),
    ]);
    if (creativesRes.error || advertisersRes.error) {
      console.error(creativesRes.error ?? advertisersRes.error);
      return null;
    }
    const advertisersById = new Map(
      ((advertisersRes.data as Advertiser[] | null) ?? []).map((a) => [a.id, a])
    );
    return ((creativesRes.data as AdCreative[] | null) ?? []).map((creative) => ({
      creative,
      advertiserName:
        advertisersById.get(creative.advertiser_id)?.name ?? "(広告主不明)",
    }));
  };

  const loadPendingCreatives = async () => {
    const computed = await fetchPendingCreatives();
    if (computed !== null) setPendingCreatives(computed);
  };

  const reviewCreative = async (id: string, status: "approved" | "rejected") => {
    if (!supabase) return;
    setBusyCreativeId(id);
    setActionError(null);
    const { error } = await supabase
      .from("ad_creatives")
      .update({ status })
      .eq("id", id);
    setBusyCreativeId(null);
    if (error) {
      console.error(error);
      setActionError("審査結果の更新に失敗しました");
      return;
    }
    loadPendingCreatives();
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
    fetchReviews().then((computed) => {
      if (computed !== null) setReviews(computed);
    });
    fetchInfoCorrections().then((computed) => {
      if (computed !== null) setInfoCorrections(computed);
    });
    fetchInquiries().then((computed) => {
      if (computed !== null) setInquiries(computed);
    });
    fetchAdvertisers().then((computed) => {
      if (computed !== null) setAdvertisers(computed);
    });
    fetchPendingCreatives().then((computed) => {
      if (computed !== null) setPendingCreatives(computed);
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

        {reviews !== null && (
          <section className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">
              口コミ・写真（{reviews.length}件）
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              文章はすぐ公開されます。写真は「写真を公開する」を押すまで、店舗ページには出ません。
              手を動かす必要があるもの（未公開の写真・通報されたもの）を上に並べています。
            </p>
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">まだ投稿はありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {reviews.map((row) => {
                  const url = row.review.photo_path ? photoUrl(row.review.photo_path) : null;
                  const waiting = !!row.review.photo_path && !row.review.photo_approved;
                  return (
                    <li
                      key={row.review.id}
                      className={`bg-white border rounded-lg shadow-sm p-3 flex flex-col gap-2 ${
                        waiting || row.reportCount > 0
                          ? "border-amber-400"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                        <span>{formatDateTime(row.review.created_at)}</span>
                        <span className="font-semibold text-gray-700">{row.cafeName}</span>
                        {waiting && (
                          <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 font-semibold">
                            写真が未公開
                          </span>
                        )}
                        {row.reportCount > 0 && (
                          <span className="bg-red-100 text-red-800 rounded-full px-2 py-0.5 font-semibold">
                            通報 {row.reportCount}件
                          </span>
                        )}
                        {row.review.hidden && (
                          <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 font-semibold">
                            非表示中
                          </span>
                        )}
                      </div>

                      {row.review.body && (
                        <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                          {row.review.body}
                        </div>
                      )}

                      {url && (
                        <Image
                          src={url}
                          alt="投稿された写真"
                          width={480}
                          height={360}
                          unoptimized
                          className="w-full max-w-xs h-auto rounded border border-gray-300"
                        />
                      )}

                      <div className="flex flex-wrap gap-2">
                        {waiting && (
                          <button
                            disabled={busyReviewId === row.review.id}
                            onClick={() => approveReviewPhoto(row.review.id)}
                            className="text-xs bg-green-50 text-green-800 border border-green-300 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50"
                          >
                            写真を公開する
                          </button>
                        )}
                        <button
                          disabled={busyReviewId === row.review.id}
                          onClick={() => setReviewHidden(row.review.id, !row.review.hidden)}
                          className="text-xs bg-gray-50 text-gray-800 border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {row.review.hidden ? "再表示する" : "非表示にする"}
                        </button>
                        <button
                          disabled={busyReviewId === row.review.id}
                          onClick={() => deleteReview(row)}
                          className="text-xs bg-red-50 text-red-800 border border-red-300 rounded px-2 py-1 hover:bg-red-100 disabled:opacity-50"
                        >
                          完全に削除
                        </button>
                      </div>
                    </li>
                  );
                })}
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

        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">広告主管理</h2>
          <p className="text-xs text-gray-600 mb-3">
            広告主を追加すると、入力したメールアドレス宛に招待メールが送られます。広告主はそのリンクからパスワードを設定し、
            <span className="whitespace-nowrap">/advertiser</span>
            で自分の広告の掲載状況確認・差し替えができます。
          </p>
          <div className="mb-3">
            <InviteAdvertiserForm
              accessToken={session.access_token}
              onInvited={loadAdvertisers}
            />
          </div>
          {advertisers === null ? (
            <p className="text-sm text-gray-500">読み込み中…</p>
          ) : advertisers.length === 0 ? (
            <p className="text-sm text-gray-500">登録済みの広告主はいません</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {advertisers.map((advertiser) => (
                <li
                  key={advertiser.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">
                      {advertiser.name}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 border border-gray-300 px-1.5 py-0.5 rounded">
                      {ADVERTISER_TYPE_LABEL[advertiser.type]}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
                      {advertiser.status === "invited"
                        ? "招待中"
                        : advertiser.status === "active"
                        ? "有効"
                        : "停止中"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {advertiser.contact_email}
                    {advertiser.cafe_id && `　／　店舗ID: ${advertiser.cafe_id}`}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {pendingCreatives !== null && (
          <section className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">
              広告クリエイティブ審査（{pendingCreatives.length}件）
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              広告主が投稿した掲載クリエイティブです。内容を確認し、問題なければ「承認」してください。承認するとサイト上にAdSenseの代わりに表示されます。
            </p>
            {pendingCreatives.length === 0 ? (
              <p className="text-sm text-gray-500">審査待ちのクリエイティブはありません</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {pendingCreatives.map(({ creative, advertiserName }) => (
                  <li
                    key={creative.id}
                    className="bg-white border border-purple-200 rounded-lg shadow-sm p-3 flex flex-col gap-2"
                  >
                    <div className="font-medium text-gray-900">{advertiserName}</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={creative.image_url}
                      alt={creative.alt_text}
                      className="max-h-40 w-auto border border-gray-200 rounded"
                    />
                    <div className="text-xs text-gray-600">
                      リンク先:{" "}
                      <a
                        href={creative.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {creative.link_url}
                      </a>
                    </div>
                    <div className="text-xs text-gray-600">代替テキスト: {creative.alt_text}</div>
                    <div className="flex gap-2 mt-1">
                      <button
                        disabled={busyCreativeId === creative.id}
                        onClick={() => reviewCreative(creative.id, "approved")}
                        className="text-xs bg-green-50 text-green-800 border border-green-300 rounded px-2 py-1 hover:bg-green-100 disabled:opacity-50"
                      >
                        承認する
                      </button>
                      <button
                        disabled={busyCreativeId === creative.id}
                        onClick={() => reviewCreative(creative.id, "rejected")}
                        className="text-xs bg-red-50 text-red-700 border border-red-300 rounded px-2 py-1 hover:bg-red-100 disabled:opacity-50"
                      >
                        却下する
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
