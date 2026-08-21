"use client";

import { useCallback, useMemo, useState } from "react";
import type { Cafe } from "@/lib/seedCafes";

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
const FLAG = "cafe-radar-survey-on";

export type SurveyField = "outlet" | "wifi" | "smoking" | "seats" | "webMeeting";
/** あり/なし の3項目は "yes" | "no"、席数は席数の数字 */
export type SurveyValue = "yes" | "no" | number;
export type SurveyEntry = Partial<Record<SurveyField, SurveyValue>>;

export const SURVEY_FIELDS: {
  key: SurveyField;
  emoji: string;
  label: string;
  /** 編集部調べで既に埋まっているか。埋まっていれば聞く必要がない */
  filled: (cafe: Cafe) => boolean;
  /** 書き出す文章 */
  say: (v: SurveyValue) => string;
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
    key: "smoking",
    emoji: "🚬",
    label: "喫煙",
    filled: (c) => Boolean(c.smokingInfo),
    say: (v) => (v === "yes" ? "全席禁煙" : "喫煙できる席または喫煙室あり"),
  },
  {
    key: "seats",
    emoji: "🪑",
    label: "席数",
    filled: (c) => Boolean(c.seatCountInfo),
    say: (v) => `${v}席`,
  },
  {
    key: "webMeeting",
    emoji: "🎧",
    label: "WEB会議",
    filled: (c) => Boolean(c.webMeetingInfo),
    say: (v) => (v === "yes" ? "WEB会議・通話ができる" : "WEB会議・通話は禁止"),
  },
];

const LABEL: Record<SurveyField, string> = {
  outlet: "電源",
  wifi: "Wi-Fi",
  smoking: "喫煙",
  seats: "席数",
  webMeeting: "WEB会議",
};

function read(): Record<string, SurveyEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, SurveyEntry>) : {};
  } catch {
    return {};
  }
}

export type SurveyApi = {
  /** 調査モードに入っているか */
  on: boolean;
  setOn: (v: boolean) => void;
  entries: Record<string, SurveyEntry>;
  /** 入力済みの店舗数 */
  count: number;
  /** あり/なし を順に切り替える。3回目で取り消し */
  cycle: (cafeId: string, field: Exclude<SurveyField, "seats">) => void;
  /** 席数を入れる。null で取り消し */
  setSeats: (cafeId: string, seats: number | null) => void;
  /** 送れる文章にする。店名が要るので店の一覧を渡す */
  exportText: (cafes: Cafe[]) => string;
  clear: () => void;
};

// URL に ?survey=1 が付いていたら入る。一度入ればこの端末では覚える。
// ?survey=0 で抜ける。
// この関数を呼ぶ GoogleMapPane は ssr:false で読み込まれるため、
// 最初の描画から localStorage を見てよい（サーバー側では動かない）
function initialOn(): boolean {
  if (typeof window === "undefined") return false;
  const param = new URLSearchParams(window.location.search).get("survey");
  if (param === "1") window.localStorage.setItem(FLAG, "1");
  else if (param === "0") window.localStorage.removeItem(FLAG);
  return window.localStorage.getItem(FLAG) === "1";
}

export function useSurveyMode(): SurveyApi {
  const [on, setOnState] = useState(initialOn);
  const [entries, setEntries] = useState<Record<string, SurveyEntry>>(read);

  const save = useCallback((next: Record<string, SurveyEntry>) => {
    setEntries(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // 容量切れなど。入力を止めるほどのことではないので黙って続ける
    }
  }, []);

  const setOn = useCallback((v: boolean) => {
    setOnState(v);
    if (v) window.localStorage.setItem(FLAG, "1");
    else window.localStorage.removeItem(FLAG);
  }, []);

  const cycle = useCallback<SurveyApi["cycle"]>(
    (cafeId, field) => {
      setEntries((prev) => {
        const cur = prev[cafeId]?.[field];
        const nextVal = cur === undefined ? "yes" : cur === "yes" ? "no" : undefined;
        const entry: SurveyEntry = { ...prev[cafeId] };
        if (nextVal === undefined) delete entry[field];
        else entry[field] = nextVal;
        const next = { ...prev };
        if (Object.keys(entry).length === 0) delete next[cafeId];
        else next[cafeId] = entry;
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          // 同上
        }
        return next;
      });
    },
    []
  );

  const setSeats = useCallback<SurveyApi["setSeats"]>((cafeId, seats) => {
    setEntries((prev) => {
      const entry: SurveyEntry = { ...prev[cafeId] };
      if (seats === null) delete entry.seats;
      else entry.seats = seats;
      const next = { ...prev };
      if (Object.keys(entry).length === 0) delete next[cafeId];
      else next[cafeId] = entry;
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // 同上
      }
      return next;
    });
  }, []);

  const exportText = useCallback<SurveyApi["exportText"]>(
    (cafes) => {
      const byId = new Map(cafes.map((c) => [c.id, c]));
      const today = new Date().toISOString().slice(0, 10);
      const lines: string[] = [`現地確認 ${today}`, ""];
      let n = 0;
      for (const [cafeId, entry] of Object.entries(entries)) {
        const cafe = byId.get(cafeId);
        if (!cafe) continue;
        const said = SURVEY_FIELDS.filter((f) => entry[f.key] !== undefined).map((f) => {
          // 既に編集部調べが入っている項目は印を付ける。現地の方が正しいが、
          // 黙って差し替えると出所と日付の記録が消えるので、目で見てから直す
          const mark = f.filled(cafe) ? "  ※既存の記載あり" : "";
          return `  ${LABEL[f.key]}：${f.say(entry[f.key]!)}${mark}`;
        });
        if (said.length === 0) continue;
        n++;
        lines.push(cafe.name, ...said, "");
      }
      if (n === 0) return "まだ何も入力されていません。";
      lines.push(`上記 ${n} 軒。すべて現地で確認。`);
      return lines.join("\n");
    },
    [entries]
  );

  const clear = useCallback(() => save({}), [save]);

  const count = useMemo(() => Object.keys(entries).length, [entries]);

  return { on, setOn, entries, count, cycle, setSeats, exportText, clear };
}
