"use client";

import { useEffect, useState } from "react";

// 営業時間・定休日。Google の Places API から取ったものを /api/hours 経由で受け取る。
//
// 編集部調べの hoursInfo が入っているのはごく一部で、ほとんどの店は
// 「まだ情報がありません」のままだった。公表されている営業時間は
// 報告を待たずに埋められるので、ここから補う。
//
// 取ってきた内容は溜めない(Google の規約で保存が認められていない)。
// ただし、同じ店を見るたびに毎回問い合わせると料金がかさむので、
// 開いている間だけ覚えておく。ページを離れれば消える

export type CafeHours = {
  /** 「月曜日: 7時00分～22時00分」のような7行 */
  weekdayDescriptions: string[];
  googleMapsUri: string | null;
};

// このページを開いている間だけの覚え書き。読み込み直すと消える
const sessionMemo = new Map<string, CafeHours | null>();

/** その週で「定休日」と書かれている曜日を取り出す */
export function closedDaysOf(hours: CafeHours): string | null {
  const closed = hours.weekdayDescriptions
    .filter((line) => line.includes("定休日") || /:\s*Closed/i.test(line))
    .map((line) => line.split(":")[0].trim().replace(/曜日$/, ""));
  if (closed.length === 0) return null;
  if (closed.length === 7) return "終日休業";
  return `${closed.join("・")}曜定休`;
}

/** 今日の行。「月曜日: 7時00分～22時00分」の後ろだけ返す */
export function todayHoursOf(hours: CafeHours): string | null {
  const i = (new Date().getDay() + 6) % 7;
  const line = hours.weekdayDescriptions[i];
  if (!line) return null;
  const at = line.indexOf(":");
  return at < 0 ? line : line.slice(at + 1).trim();
}

/**
 * @param cafeId 店のID
 * @param active 取りに行ってよいか。横カード列では、選ばれている1枚だけ true。
 *               全部のカードで取りに行くと、送るたびに何件も問い合わせてしまう
 */
export function useCafeHours(cafeId: string, active: boolean): CafeHours | null {
  const [hours, setHours] = useState<CafeHours | null>(
    () => sessionMemo.get(cafeId) ?? null
  );

  useEffect(() => {
    if (!active) return;
    let alive = true;
    (async () => {
      // 覚えていればそれを使う。await を挟むのは、effect の中で
      // そのまま setState すると描画が連鎖するため
      const memo = sessionMemo.get(cafeId);
      if (memo !== undefined) {
        if (alive) setHours(memo);
        return;
      }
      try {
        const res = await fetch(`/api/hours?cafeId=${encodeURIComponent(cafeId)}`);
        const json = (await res.json()) as { hours: CafeHours | null };
        sessionMemo.set(cafeId, json.hours);
        if (alive) setHours(json.hours);
      } catch {
        // 取れなければ何も出さない。ここで落として他を巻き込まない
      }
    })();
    return () => {
      alive = false;
    };
  }, [cafeId, active]);

  return hours;
}
