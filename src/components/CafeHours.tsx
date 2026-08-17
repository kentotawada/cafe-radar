"use client";

import { useEffect, useState } from "react";

// 営業時間と定休日。Google の Places API から取って出す。
//
// 編集部調べの hoursInfo / closedDaysInfo は、確認できた店にしか入っていない
// (推測で書かない方針のため)。ほとんどの店で「未確認」のままなので、
// 公表されている営業時間はここから補う。
//
// 取ってきた内容は溜めずに、開かれるたびに取り直す。Google の規約で
// 保存が認められていないため。鍵が無ければ何も出ない。

type Hours = {
  weekdayDescriptions: string[];
  googleMapsUri: string | null;
};

export default function CafeHours({ cafeId }: { cafeId: string }) {
  const [hours, setHours] = useState<Hours | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/hours?cafeId=${encodeURIComponent(cafeId)}`);
        const json = (await res.json()) as { hours: Hours | null };
        if (!alive) return;
        setHours(json.hours);
      } catch {
        // 取れなければ何も出さない。ここで落として他を巻き込まない
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [cafeId]);

  if (loading || !hours) return null;

  // 今日の行を太字にする。weekdayDescriptions は月曜始まりで並ぶ
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    // Google から来た情報は、こちらで集めた情報と見分けが付くように
    // 枠で囲って分ける(規約で求められている)
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 flex items-center justify-between gap-2">
        <span>⏰ 営業時間・定休日</span>
        <span className="font-normal text-gray-500">Google マップ調べ</span>
      </div>
      <ul className="px-3 py-2 text-sm">
        {hours.weekdayDescriptions.map((line, i) => (
          <li
            key={line}
            className={i === todayIndex ? "font-bold text-gray-900" : "text-gray-700"}
          >
            {line}
          </li>
        ))}
      </ul>
      {hours.googleMapsUri && (
        <div className="px-3 pb-2">
          <a
            href={hours.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 underline"
          >
            Google マップで見る
          </a>
        </div>
      )}
    </div>
  );
}
