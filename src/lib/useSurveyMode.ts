"use client";

import { useCallback, useMemo, useState } from "react";
import type { Cafe } from "@/lib/seedCafes";
import { SURVEYED } from "@/data/surveyed";

// 現地調査モード。
//
// 電源の数と席数は、チェーンの公式サイトにもグルメサイトにも載っていない。
// 規約の関係で他所から持ってくることもできない。つまり現地に立った人が
// 入れるしかない項目で、その入力を歩きながらやるための仕組み。
//
// 保存先はこの端末の localStorage。サイトには即時反映されない。
// 書き出した文章を送ってもらって、こちらでデータに入れる。
// Supabase に直接書く形にしなかったのは、出所と日付を人が確認してから
// 載せる今のやり方を崩さないため。

const KEY = "cafe-radar-survey-v1";

/** 喫煙の4択。あり/なしでは「分煙」「喫煙室」の違いが伝わらなかった */
export type SmokeKind = "nosmoke" | "separated" | "booth" | "seat";
export const SMOKE_OPTIONS: { value: SmokeKind; label: string; say: string }[] = [
  { value: "nosmoke", label: "全席禁煙", say: "全席禁煙" },
  { value: "separated", label: "分煙", say: "分煙(禁煙席と喫煙席がある)" },
  { value: "booth", label: "喫煙ブース", say: "全席禁煙で、喫煙ブース・喫煙室あり" },
  { value: "seat", label: "席で吸える", say: "席で吸える(全席喫煙可)" },
];

export type SurveyEntry = {
  outlet?: "yes" | "no";
  wifi?: "yes" | "no";
  webMeeting?: "yes" | "no";
  /** 旧データの "yes"/"no" も読めるようにしておく */
  smoking?: SmokeKind | "yes" | "no";
  seats?: number;
  /** 営業時間・定休日はSNSや公式で調べたものを書く。出所も本文に */
  hours?: string;
  closed?: string;
  /** 店の前で取った現在地。ピンがずれている店を直すのに使う */
  pos?: { lat: number; lng: number; acc: number };
};

export type TriField = "outlet" | "wifi" | "webMeeting";
export type TextField = "hours" | "closed";

export const TRI_FIELDS: {
  key: TriField;
  emoji: string;
  label: string;
  filled: (cafe: Cafe) => boolean;
  say: (v: "yes" | "no") => string;
}[] = [
  {
    key: "outlet",
    emoji: "🔌",
    label: "電源",
    filled: (c) => Boolean(c.outletInfo),
    say: (v) => (v === "yes" ? "電源あり" : "電源なし"),
  },
  {
    key: "wifi",
    emoji: "📶",
    label: "Wi-Fi",
    filled: (c) => Boolean(c.wifiInfo),
    say: (v) => (v === "yes" ? "Wi-Fiあり" : "Wi-Fiなし"),
  },
  {
    key: "webMeeting",
    emoji: "🎧",
    label: "WEB会議",
    filled: (c) => Boolean(c.webMeetingInfo),
    say: (v) => (v === "yes" ? "WEB会議・通話ができる" : "WEB会議・通話は禁止"),
  },
];

export const TEXT_FIELDS: { key: TextField; emoji: string; label: string; filled: (cafe: Cafe) => boolean; hint: string }[] = [
  {
    key: "hours",
    emoji: "⏰",
    label: "営業時間",
    filled: (c) => Boolean(c.hoursInfo),
    hint: "例: 平日9:00〜20:00 土日10:00〜18:00（公式Instagram 2026-08）",
  },
  {
    key: "closed",
    emoji: "📅",
    label: "定休日",
    filled: (c) => Boolean(c.closedDaysInfo),
    hint: "例: 日曜・祝日（公式サイト 2026-08）",
  },
];

export const seatsFilled = (c: Cafe) => Boolean(c.seatCountInfo);
export const smokingFilled = (c: Cafe) => Boolean(c.smokingInfo);

function smokeSay(v: SurveyEntry["smoking"]): string {
  if (v === "yes") return "全席禁煙";
  if (v === "no") return "喫煙できる席または喫煙室あり";
  return SMOKE_OPTIONS.find((o) => o.value === v)?.say ?? "";
}

function read(): Record<string, SurveyEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, SurveyEntry>) : {};
  } catch {
    return {};
  }
}

function persist(next: Record<string, SurveyEntry>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 容量切れなど。入力を止めるほどのことではないので黙って続ける
  }
}

/** 「情報が違う」でユーザーから届いた報告。管理画面で消すまで残る＝未処理 */
export type Correction = {
  id: string;
  cafe_id: string;
  message: string;
  created_at: string;
};

export type SurveyApi = {
  /** 調査モードに入っているか */
  on: boolean;
  setOn: (v: boolean) => void;
  entries: Record<string, SurveyEntry>;
  /** 入力済みの店舗数 */
  count: number;
  /** あり/なし を順に切り替える。3回目で取り消し */
  cycle: (cafeId: string, field: TriField) => void;
  setSmoking: (cafeId: string, v: SmokeKind | null) => void;
  /** 席数を入れる。null で取り消し */
  setSeats: (cafeId: string, seats: number | null) => void;
  setText: (cafeId: string, field: TextField, v: string) => void;
  setPos: (cafeId: string, pos: SurveyEntry["pos"] | null) => void;
  /**
   * 送れる文章にする。店名が要るので店の一覧を渡す。
   * corrections には未処理の「情報が違う」報告を渡す。歩いた記録と一緒に
   * 送れるようにして、報告を見落とさないようにする
   */
  exportText: (cafes: Cafe[], corrections?: Correction[], note?: string | null) => string;
  clear: () => void;
};

// URL に ?survey=1 が付いている間だけ入る。
//
// 最初は「一度入ったらこの端末で覚える」にしていたが、それだと
// cafe-radar.com を普通に開いたときにも調査の欄が出てしまう。
// 人にサイトを見せる場面で邪魔になるので、URL に付いている時だけにした。
//
// この関数を呼ぶ GoogleMapPane は ssr:false で読み込まれるため、
// 最初の描画から window を見てよい（サーバー側では動かない）
function initialOn(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("survey") === "1";
}

export function useSurveyMode(): SurveyApi {
  const [on, setOnState] = useState(initialOn);
  const [entries, setEntries] = useState<Record<string, SurveyEntry>>(read);

  // 1店ぶんを書き換える共通処理。空になった店は丸ごと消す
  const update = useCallback((cafeId: string, fn: (e: SurveyEntry) => void) => {
    setEntries((prev) => {
      const entry: SurveyEntry = { ...prev[cafeId] };
      fn(entry);
      const next = { ...prev };
      if (Object.keys(entry).length === 0) delete next[cafeId];
      else next[cafeId] = entry;
      persist(next);
      return next;
    });
  }, []);

  // ✕ で抜けたときは URL からも外す。付いたままだと、再読み込みで戻ってくる
  const setOn = useCallback((v: boolean) => {
    setOnState(v);
    const url = new URL(window.location.href);
    if (v) url.searchParams.set("survey", "1");
    else url.searchParams.delete("survey");
    window.history.replaceState(null, "", url.toString());
  }, []);

  const cycle = useCallback<SurveyApi["cycle"]>(
    (cafeId, field) =>
      update(cafeId, (e) => {
        const cur = e[field];
        if (cur === undefined) e[field] = "yes";
        else if (cur === "yes") e[field] = "no";
        else delete e[field];
      }),
    [update]
  );

  const setSmoking = useCallback<SurveyApi["setSmoking"]>(
    (cafeId, v) =>
      update(cafeId, (e) => {
        if (v === null) delete e.smoking;
        else e.smoking = v;
      }),
    [update]
  );

  const setSeats = useCallback<SurveyApi["setSeats"]>(
    (cafeId, seats) =>
      update(cafeId, (e) => {
        if (seats === null) delete e.seats;
        else e.seats = seats;
      }),
    [update]
  );

  const setText = useCallback<SurveyApi["setText"]>(
    (cafeId, field, v) =>
      update(cafeId, (e) => {
        const t = v.trim();
        if (t) e[field] = t;
        else delete e[field];
      }),
    [update]
  );

  const setPos = useCallback<SurveyApi["setPos"]>(
    (cafeId, pos) =>
      update(cafeId, (e) => {
        if (pos) e.pos = pos;
        else delete e.pos;
      }),
    [update]
  );

  const exportText = useCallback<SurveyApi["exportText"]>(
    (cafes, corrections, note) => {
      const byId = new Map(cafes.map((c) => [c.id, c]));
      const today = new Date().toISOString().slice(0, 10);
      const lines: string[] = [`現地確認 ${today}`, ""];
      let n = 0;
      for (const [cafeId, entry] of Object.entries(entries)) {
        const cafe = byId.get(cafeId);
        if (!cafe) continue;
        // 既に編集部調べが入っている項目は印を付ける。現地の方が正しいが、
        // 黙って差し替えると出所と日付の記録が消えるので、目で見てから直す
        const mark = (filled: boolean) => (filled ? "  ※既存の記載あり" : "");
        const said: string[] = [];
        for (const f of TRI_FIELDS) {
          const v = entry[f.key];
          if (v) said.push(`  ${f.label}：${f.say(v)}${mark(f.filled(cafe))}`);
        }
        if (entry.smoking) said.push(`  喫煙：${smokeSay(entry.smoking)}${mark(smokingFilled(cafe))}`);
        if (entry.seats !== undefined) said.push(`  席数：${entry.seats}席${mark(seatsFilled(cafe))}`);
        for (const f of TEXT_FIELDS) {
          const v = entry[f.key];
          if (v) said.push(`  ${f.label}：${v}${mark(f.filled(cafe))}`);
        }
        if (entry.pos) {
          said.push(`  位置：${entry.pos.lat},${entry.pos.lng}（現在地で取得、誤差±${Math.round(entry.pos.acc)}m）`);
        }
        if (said.length === 0) continue;
        n++;
        // 店名だけだと同名の店で取り違える。idを添えて、どの行かを一意にする
        lines.push(`${cafe.name}  [${cafe.id}]`, ...said, "");
      }
      if (n > 0) lines.push(`上記 ${n} 軒。すべて現地で確認。`);
      else lines.push("現地入力はありません。");

      // 未処理の「情報が違う」報告。歩いた記録と一緒に送れば見落とさない
      if (note) {
        lines.push("", `【未処理の報告】${note}`);
      } else if (corrections && corrections.length > 0) {
        lines.push("", `【未処理の「情報が違う」報告 ${corrections.length}件】`);
        for (const c of corrections) {
          const cafe = byId.get(c.cafe_id);
          lines.push(
            `  ${c.created_at.slice(0, 10)}  ${cafe ? cafe.name : "(データに無い店)"}  [${c.cafe_id}]  ${c.message.replace(/\s+/g, " ")}`
          );
        }
      } else if (corrections) {
        lines.push("", "【未処理の報告】なし");
      }

      if (n === 0 && !corrections?.length && !note) return "まだ何も入力されていません。";
      return lines.join("\n");
    },
    [entries]
  );

  const clear = useCallback(() => {
    setEntries({});
    persist({});
  }, []);

  const count = useMemo(() => Object.keys(entries).length, [entries]);

  return { on, setOn, entries, count, cycle, setSmoking, setSeats, setText, setPos, exportText, clear };
}

/**
 * 現地で見るものが残っているか。
 * 一度調査した店と、5項目そろっている店は用がない。
 * 調査モードのときだけ、これが false の店を地図から外す。
 * 営業時間・定休日はネットで調べる項目なので、ここでは数えない
 */
export function needsSurvey(cafe: Cafe): boolean {
  if (SURVEYED[cafe.id]) return false;
  return TRI_FIELDS.some((f) => !f.filled(cafe)) || !smokingFilled(cafe) || !seatsFilled(cafe);
}
