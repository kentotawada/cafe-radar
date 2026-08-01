"use client";

import { useState, type FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";

type Status = "idle" | "submitting" | "done" | "error";

// 店舗オーナー・法人からの掲載相談フォーム。/contactの一般お問い合わせと
// 同じinquiriesテーブルに書き込む(category="listing"固定、store_nameだけ
// このフォーム専用の列)。管理画面から他の問い合わせと同じ一覧で確認できる
export default function BusinessInquiryForm() {
  const [storeName, setStoreName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit =
    storeName.trim().length > 0 &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length > 0 &&
    status !== "submitting";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !supabase) return;
    setStatus("submitting");
    const { error } = await supabase.from("inquiries").insert({
      reporter_id: getReporterId(),
      store_name: storeName.trim(),
      name: name.trim(),
      email: email.trim(),
      category: "listing",
      message: message.trim(),
    });
    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  if (!isSupabaseConfigured) {
    return (
      <p className="text-sm text-gray-500 border border-gray-200 rounded-lg p-4 bg-gray-50">
        現在フォームは準備中です。恐れ入りますが、しばらくしてから再度お試しください。
      </p>
    );
  }

  if (status === "done") {
    return (
      <div className="text-sm text-green-700 border border-green-200 rounded-lg p-5 bg-green-50 flex flex-col gap-1">
        <div className="font-semibold">✓ 送信が完了しました</div>
        <p>
          お問い合わせありがとうございます。内容を確認のうえ、担当より2〜3営業日以内にご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        店舗名 <span className="text-red-500">*</span>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          maxLength={100}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          placeholder="カフェレーダー珈琲店"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        ご担当者名 <span className="text-red-500">*</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          placeholder="山田 太郎"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        メールアドレス <span className="text-red-500">*</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={200}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        ご相談内容 <span className="text-red-500">*</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={2000}
          rows={6}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none"
          placeholder="掲載を検討している店舗の状況、聞きたいことなど自由にご記入ください"
        />
      </label>

      {status === "error" && (
        <p className="text-xs text-red-600">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {status === "submitting" ? "送信中…" : "無料で相談してみる"}
      </button>
    </form>
  );
}
