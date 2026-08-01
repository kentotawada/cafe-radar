"use client";

import { useState, type FormEvent } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";
import type { InquiryCategory } from "@/lib/types";

const CATEGORY_OPTIONS: { value: InquiryCategory; label: string }[] = [
  { value: "general", label: "一般的なご意見" },
  { value: "listing", label: "店舗掲載について" },
  { value: "media", label: "データ利用・取材について" },
];

type Status = "idle" | "submitting" | "done" | "error";

// 店舗オーナー・企業からの掲載/データ利用/取材依頼と、一般のご意見を
// 受け付けるフォーム。アプリ内の簡易お問い合わせ(InquiryButton)と同じ
// inquiriesテーブルに書き込むため、管理画面から同じ一覧で確認できる
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<InquiryCategory>("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const canSubmit = message.trim().length > 0 && status !== "submitting";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !supabase) return;
    setStatus("submitting");
    const { error } = await supabase.from("inquiries").insert({
      reporter_id: getReporterId(),
      name: name.trim() || null,
      email: email.trim() || null,
      category,
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
      <p className="text-sm text-green-700 border border-green-200 rounded-lg p-4 bg-green-50">
        お問い合わせありがとうございます。内容を確認のうえ、必要に応じてご連絡いたします。
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        お名前
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          placeholder="山田 太郎"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        メールアドレス
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={200}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
          placeholder="you@example.com"
        />
      </label>

      <fieldset className="flex flex-col gap-1.5 text-sm text-gray-700">
        <legend className="mb-0.5">お問い合わせ種別</legend>
        {CATEGORY_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value={opt.value}
              checked={category === opt.value}
              onChange={() => setCategory(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        本文
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={6}
          required
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 resize-none"
          placeholder="お問い合わせ内容をご記入ください"
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
        {status === "submitting" ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}
