"use client";

import { useState } from "react";
import type { Cafe } from "@/lib/seedCafes";
import {
  SMOKE_OPTIONS,
  TRI_FIELDS,
  TEXT_FIELDS,
  seatsFilled,
  smokingFilled,
  type SurveyApi,
  type TextField,
} from "@/lib/useSurveyMode";

// 選んだ店のカードの中に出す入力欄。
// 全項目を出し、編集部調べが既にある項目は「済」の薄い表示にする。
// 記載済みでも現地と違えば押して直せる。

const chip = (state: "none" | "yes" | "no" | "known") =>
  `rounded-md border px-2.5 py-1.5 text-[12px] font-bold ${
    state === "yes"
      ? "border-emerald-600 bg-emerald-100 text-emerald-900"
      : state === "no"
        ? "border-rose-500 bg-rose-100 text-rose-900"
        : state === "known"
          ? "border-gray-200 bg-gray-50 text-gray-500"
          : "border-gray-300 bg-white text-gray-800"
  }`;

export function SurveyPanel({ cafe, survey }: { cafe: Cafe; survey: SurveyApi }) {
  const entry = survey.entries[cafe.id] ?? {};
  const blank =
    TRI_FIELDS.filter((f) => !f.filled(cafe)).length +
    (smokingFilled(cafe) ? 0 : 1) +
    (seatsFilled(cafe) ? 0 : 1);

  return (
    <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2" onClick={(e) => e.stopPropagation()}>
      <p className="text-[11px] font-bold text-amber-900 mb-1">
        現地調査 — {blank > 0 ? `空き${blank}項目` : "5項目とも記載あり"}
        <span className="font-normal">（「済」は記載済み。違えば押して直す。🎧 ●できる ✕禁止）</span>
      </p>

      <div className="flex flex-wrap gap-1.5">
        {TRI_FIELDS.map((f) => {
          const v = entry[f.key];
          const known = f.filled(cafe);
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => survey.cycle(cafe.id, f.key)}
              className={chip(v ?? (known ? "known" : "none"))}
            >
              {v === "yes" ? "●" : v === "no" ? "✕" : known ? "済" : "□"} {f.emoji}
              {f.label}
            </button>
          );
        })}
        <SmokeButton
          value={entry.smoking}
          known={smokingFilled(cafe)}
          onSet={(v) => survey.setSmoking(cafe.id, v)}
        />
        <SeatButton
          seats={typeof entry.seats === "number" ? entry.seats : null}
          known={seatsFilled(cafe)}
          onSet={(v) => survey.setSeats(cafe.id, v)}
        />
      </div>

      {/* 営業時間・定休日は現地では分からないことが多い。SNSや公式で調べたものを書く */}
      <div className="mt-2 flex flex-col gap-1">
        {TEXT_FIELDS.map((f) => (
          <TextRow
            key={f.key}
            emoji={f.emoji}
            label={f.label}
            hint={f.hint}
            known={f.filled(cafe)}
            value={entry[f.key] ?? ""}
            onSet={(v) => survey.setText(cafe.id, f.key as TextField, v)}
          />
        ))}
      </div>

      <PosButton pos={entry.pos} onSet={(p) => survey.setPos(cafe.id, p)} />
    </div>
  );
}

function SmokeButton({
  value,
  known,
  onSet,
}: {
  value: SurveyApi["entries"][string]["smoking"];
  known: boolean;
  onSet: (v: (typeof SMOKE_OPTIONS)[number]["value"] | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const picked = SMOKE_OPTIONS.find((o) => o.value === value);
  // 旧データ(yes/no)は一度押し直してもらう
  const label = picked ? picked.label : value === "yes" ? "全席禁煙" : value === "no" ? "喫煙あり" : "喫煙";

  if (open) {
    return (
      <span className="flex flex-wrap gap-1">
        {SMOKE_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              onSet(o.value);
              setOpen(false);
            }}
            className={`rounded-md border px-2 py-1.5 text-[12px] font-bold ${
              value === o.value
                ? "border-emerald-600 bg-emerald-100 text-emerald-900"
                : "border-gray-400 bg-white text-gray-900"
            }`}
          >
            🚬{o.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            onSet(null);
            setOpen(false);
          }}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-[12px] text-gray-600"
        >
          取り消し
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={() => setOpen(true)} className={chip(value ? "yes" : known ? "known" : "none")}>
      {value ? "●" : known ? "済" : "□"} 🚬{label}
    </button>
  );
}

function SeatButton({
  seats,
  known,
  onSet,
}: {
  seats: number | null;
  /** 編集部調べで既に席数が入っている */
  known: boolean;
  onSet: (v: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  if (editing) {
    return (
      <span className="flex items-center gap-1">
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
      onClick={() => {
        setDraft(seats === null ? "" : String(seats));
        setEditing(true);
      }}
      className={chip(seats !== null ? "yes" : known ? "known" : "none")}
    >
      {seats !== null ? `● 🪑${seats}席` : known ? "済 🪑席数" : "□ 🪑席数"}
    </button>
  );
}

function TextRow({
  emoji,
  label,
  hint,
  known,
  value,
  onSet,
}: {
  emoji: string;
  label: string;
  hint: string;
  known: boolean;
  value: string;
  onSet: (v: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <label className="flex items-center gap-1.5 text-[12px]">
      <span className={`shrink-0 w-[72px] font-bold ${known && !value ? "text-gray-500" : "text-gray-900"}`}>
        {known && !value ? "済" : value ? "●" : "□"} {emoji}
        {label}
      </span>
      {/* 打つたびに保存する。欄から離れたときだけだと、スマホでキーボードを
          閉じただけでは保存されないことがある */}
      <input
        value={draft}
        placeholder={hint}
        onChange={(e) => {
          setDraft(e.target.value);
          onSet(e.target.value);
        }}
        className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-[12px] text-gray-900 placeholder:text-gray-400"
      />
    </label>
  );
}

// 店の前で押すと、現在地をその店の位置として記録する。
// 区画の真ん中にピンがある店が多く、入口が分からなかった。
// 座標を手で貼る手間を無くす
function PosButton({
  pos,
  onSet,
}: {
  pos: { lat: number; lng: number; acc: number } | undefined;
  onSet: (p: { lat: number; lng: number; acc: number } | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const take = () => {
    if (!navigator.geolocation) {
      setErr("この端末では位置が取れません");
      return;
    }
    setBusy(true);
    setErr(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        onSet({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy });
        setBusy(false);
      },
      () => {
        setErr("位置が取れませんでした。空の見える場所でもう一度");
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={take}
        disabled={busy}
        className={`rounded-md border px-2.5 py-1.5 text-[12px] font-bold ${
          pos ? "border-emerald-600 bg-emerald-100 text-emerald-900" : "border-gray-300 bg-white text-gray-800"
        } disabled:opacity-50`}
      >
        {busy ? "取得中…" : pos ? `● 📍位置を記録済み（±${Math.round(pos.acc)}m）` : "□ 📍現在地をこの店の位置にする"}
      </button>
      {pos && (
        <button type="button" onClick={() => onSet(null)} className="text-[11px] text-gray-600 underline">
          取り消し
        </button>
      )}
      {err && <span className="text-[11px] text-rose-700">{err}</span>}
      {pos && pos.acc > 30 && (
        <span className="text-[11px] text-amber-800">誤差が大きめです。店の入口でもう一度押すと精度が上がります</span>
      )}
    </div>
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
            <p className="mb-2 text-[13px] font-bold text-gray-900">この文章をそのまま送ってください</p>
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
