"use client";

import { useState } from "react";
import type { Cafe } from "@/lib/seedCafes";
import { SURVEY_FIELDS, type SurveyApi } from "@/lib/useSurveyMode";

// 選んだ店のカードの中に出す入力欄。
// 編集部調べで空いている項目だけを出すので、押すべきものがそのまま分かる。

export function SurveyPanel({ cafe, survey }: { cafe: Cafe; survey: SurveyApi }) {
  const entry = survey.entries[cafe.id] ?? {};
  const missing = SURVEY_FIELDS.filter((f) => !f.filled(cafe));

  if (missing.length === 0) {
    return (
      <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900">
        ✅ この店は4項目そろっています
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
      <p className="text-[11px] font-bold text-amber-900 mb-1.5">
        現地調査 — 空いている{missing.length}項目
      </p>
      <div className="flex flex-wrap gap-1.5">
        {missing.map((f) =>
          f.key === "seats" ? (
            <SeatButton
              key={f.key}
              seats={typeof entry.seats === "number" ? entry.seats : null}
              onSet={(v) => survey.setSeats(cafe.id, v)}
            />
          ) : (
            <button
              key={f.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                survey.cycle(cafe.id, f.key as "outlet" | "wifi" | "smoking");
              }}
              className={`rounded-md border px-2.5 py-1.5 text-[12px] font-bold ${
                entry[f.key] === "yes"
                  ? "border-emerald-600 bg-emerald-100 text-emerald-900"
                  : entry[f.key] === "no"
                    ? "border-rose-500 bg-rose-100 text-rose-900"
                    : "border-gray-300 bg-white text-gray-800"
              }`}
            >
              {entry[f.key] === "yes" ? "●" : entry[f.key] === "no" ? "✕" : "□"} {f.emoji}
              {f.label}
            </button>
          )
        )}
      </div>
      <p className="text-[10px] text-amber-900 mt-1.5">
        🚬は ●が全席禁煙、✕が喫煙できる場所あり。分からなければ押さずに置いてください。
      </p>
    </div>
  );
}

function SeatButton({
  seats,
  onSet,
}: {
  seats: number | null;
  onSet: (v: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (editing) {
    return (
      <span className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={draft}
          inputMode="numeric"
          placeholder="席数"
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSet(draft ? Number(draft) : null);
              setEditing(false);
            }
          }}
          className="w-16 rounded-md border border-gray-400 px-2 py-1.5 text-[12px] text-gray-900"
        />
        <button
          type="button"
          onClick={() => {
            onSet(draft ? Number(draft) : null);
            setEditing(false);
          }}
          className="rounded-md bg-gray-900 px-2.5 py-1.5 text-[12px] font-bold text-white"
        >
          入れる
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setDraft(seats === null ? "" : String(seats));
        setEditing(true);
      }}
      className={`rounded-md border px-2.5 py-1.5 text-[12px] font-bold ${
        seats === null
          ? "border-gray-300 bg-white text-gray-800"
          : "border-emerald-600 bg-emerald-100 text-emerald-900"
      }`}
    >
      {seats === null ? "□ 🪑席数" : `● 🪑${seats}席`}
    </button>
  );
}

// 画面の隅に出す、件数と書き出しのバー
export function SurveyBar({ survey, cafes }: { survey: SurveyApi; cafes: Cafe[] }) {
  const [text, setText] = useState<string | null>(null);

  return (
    <>
      {/* 置き場所は呼び出し側の縦並び（お店を追加などが入っている列）に任せる */}
      <div className="flex items-center gap-1.5 rounded-full bg-gray-900/90 px-3 py-1.5 text-[12px] text-white shadow-lg">
        <span className="font-bold">調査 {survey.count}軒</span>
        <button
          type="button"
          onClick={() => setText(survey.exportText(cafes))}
          className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-gray-900"
        >
          書き出す
        </button>
        <button
          type="button"
          onClick={() => survey.setOn(false)}
          className="px-1 text-[11px] text-gray-300"
          aria-label="調査モードを終わる"
        >
          ✕
        </button>
      </div>

      {text !== null && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 sm:items-center sm:justify-center">
          <div className="w-full rounded-t-2xl bg-white p-4 sm:max-w-md sm:rounded-2xl">
            <p className="mb-2 text-[13px] font-bold text-gray-900">
              この文章をそのまま送ってください
            </p>
            <textarea
              readOnly
              value={text}
              onFocus={(e) => e.currentTarget.select()}
              className="h-56 w-full rounded-lg border border-gray-300 p-2 font-mono text-[12px] text-gray-900"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(text);
                }}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-[13px] font-bold text-white"
              >
                コピー
              </button>
              <button
                type="button"
                onClick={() => setText(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-[13px] text-gray-800"
              >
                閉じる
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("入力した内容を全部消します。よろしいですか？")) {
                  survey.clear();
                  setText(null);
                }
              }}
              className="mt-3 w-full text-[11px] text-gray-500 underline"
            >
              送ったあと、入力をぜんぶ消す
            </button>
          </div>
        </div>
      )}
    </>
  );
}
