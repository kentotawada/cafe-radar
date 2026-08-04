"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { AdCreative, AdCreativeStatus, Advertiser, AdvertiserType } from "@/lib/types";

const ADVERTISER_TYPE_LABEL: Record<AdvertiserType, string> = {
  cafe_owner: "カフェオーナー",
  business: "企業(バナー出稿)",
};

const CREATIVE_STATUS_LABEL: Record<AdCreativeStatus, string> = {
  pending: "審査中",
  approved: "掲載中",
  rejected: "却下",
};

const CREATIVE_STATUS_STYLE: Record<AdCreativeStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-green-50 text-green-800 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);
    if (error) {
      setError("ログインに失敗しました。招待メールからパスワードを設定済みか確認してください");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-900 border border-gray-300 rounded-lg shadow-md p-6 w-full max-w-sm flex flex-col gap-3"
      >
        <h1 className="text-lg font-bold">広告主ログイン</h1>
        <p className="text-xs text-gray-600">
          運営から届いた招待メールでパスワードを設定した後、ここからログインしてください。
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

function UploadCreativeForm({
  advertiserId,
  userId,
  onUploaded,
}: {
  advertiserId: string;
  userId: string;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !file) return;
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("ad-creatives")
      .upload(path, file);
    if (uploadError) {
      setIsSubmitting(false);
      setError("画像のアップロードに失敗しました");
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from("ad-creatives")
      .getPublicUrl(path);

    const { error: insertError } = await supabase.from("ad_creatives").insert({
      advertiser_id: advertiserId,
      status: "pending",
      image_url: publicUrlData.publicUrl,
      link_url: linkUrl,
      alt_text: altText,
    });
    setIsSubmitting(false);
    if (insertError) {
      setError("投稿に失敗しました");
      return;
    }
    setSuccessMessage("投稿しました。運営の審査後に掲載されます");
    setFile(null);
    setLinkUrl("");
    setAltText("");
    onUploaded();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 flex flex-col gap-2"
    >
      <label className="flex flex-col gap-1 text-xs">
        <span className="text-gray-700">広告画像</span>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-gray-900"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs">
        <span className="text-gray-700">リンク先URL</span>
        <input
          type="url"
          required
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://"
          className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs">
        <span className="text-gray-700">代替テキスト(画像が表示できない時の説明文)</span>
        <input
          type="text"
          required
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="border border-gray-400 rounded px-2 py-1.5 text-sm text-gray-900 bg-white"
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {successMessage && <p className="text-xs text-green-700">{successMessage}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start text-xs bg-blue-600 text-white rounded px-3 py-1.5 font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "送信中…" : "新しい広告を投稿する(審査待ちになります)"}
      </button>
    </form>
  );
}

export default function AdvertiserPage() {
  const [session, setSession] = useState<Session | null | undefined>(() =>
    supabase ? undefined : null
  );
  const [advertiser, setAdvertiser] = useState<Advertiser | null | undefined>(undefined);
  const [creatives, setCreatives] = useState<AdCreative[] | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) =>
      setSession(newSession)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchAdvertiser = async (userId: string): Promise<Advertiser | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("advertisers")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.error(error);
      return null;
    }
    return (data as Advertiser | null) ?? null;
  };

  const fetchCreatives = async (advertiserId: string): Promise<AdCreative[] | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("ad_creatives")
      .select("*")
      .eq("advertiser_id", advertiserId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return null;
    }
    return (data as AdCreative[]) ?? [];
  };

  const loadCreatives = async (advertiserId: string) => {
    const computed = await fetchCreatives(advertiserId);
    if (computed !== null) setCreatives(computed);
  };

  useEffect(() => {
    if (!session) return;
    fetchAdvertiser(session.user.id).then((result) => setAdvertiser(result));
  }, [session]);

  useEffect(() => {
    if (!advertiser) return;
    fetchCreatives(advertiser.id).then((result) => {
      if (result !== null) setCreatives(result);
    });
  }, [advertiser]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-sm text-red-600">Supabase未設定のため、このページは使用できません。</p>
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

  if (advertiser === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-500">読み込み中…</p>
      </div>
    );
  }

  if (advertiser === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 max-w-sm text-center flex flex-col gap-3">
          <p className="text-sm text-gray-700">
            このアカウントに紐づく広告主情報が見つかりませんでした。運営にお問い合わせください。
          </p>
          <button onClick={handleLogout} className="text-xs text-gray-600 underline">
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  const liveCreative = creatives?.find((c) => c.status === "approved") ?? null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-gray-900">広告主ダッシュボード</h1>
          <button onClick={handleLogout} className="text-xs text-gray-600 underline">
            ログアウト
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-6">
          {advertiser.name}様（{ADVERTISER_TYPE_LABEL[advertiser.type]}
          {advertiser.cafe_id && `・店舗ID: ${advertiser.cafe_id}`}）
        </p>

        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">現在の掲載状況</h2>
          {liveCreative ? (
            <div className="bg-white border border-green-200 rounded-lg shadow-sm p-3 flex flex-col gap-2">
              <p className="text-xs text-green-800">
                以下の広告が掲載中です。サイト上の広告枠にはこの画像が表示されます。
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={liveCreative.image_url}
                alt={liveCreative.alt_text}
                className="max-h-40 w-auto border border-gray-200 rounded"
              />
              <div className="text-xs text-gray-600">
                リンク先: {liveCreative.link_url}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              現在掲載中の広告はありません。下のフォームから広告を投稿してください。
            </p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">広告を投稿・差し替え</h2>
          <p className="text-xs text-gray-600 mb-3">
            新しく投稿すると、運営の審査後に掲載されます。既存の広告を差し替えたい場合も、新しい広告として投稿してください。
          </p>
          <UploadCreativeForm
            advertiserId={advertiser.id}
            userId={session.user.id}
            onUploaded={() => loadCreatives(advertiser.id)}
          />
        </section>

        <section>
          <h2 className="font-semibold text-gray-900 mb-2">投稿履歴</h2>
          {creatives === null ? (
            <p className="text-sm text-gray-500">読み込み中…</p>
          ) : creatives.length === 0 ? (
            <p className="text-sm text-gray-500">まだ投稿がありません</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {creatives.map((creative) => (
                <li
                  key={creative.id}
                  className="bg-white border border-gray-300 rounded-lg shadow-sm p-3 flex items-center gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={creative.image_url}
                    alt={creative.alt_text}
                    className="h-12 w-auto border border-gray-200 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs border px-1.5 py-0.5 rounded ${CREATIVE_STATUS_STYLE[creative.status]}`}
                    >
                      {CREATIVE_STATUS_LABEL[creative.status]}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDateTime(creative.created_at)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
