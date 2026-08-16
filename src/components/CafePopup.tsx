"use client";

import { useState } from "react";
import Link from "next/link";
import { FROM_MAP_KEY } from "@/lib/mapNavigation";
import type { Cafe } from "@/lib/seedCafes";
import type { CafeStats, OccupancyLevel, WifiSpeed } from "@/lib/types";
import { hasOutlet } from "@/lib/cafeAmenities";
import { isNonSmoking } from "@/lib/cafeStats";
import { pickMajority } from "@/lib/cafeStats";
import { useLang } from "@/lib/i18n";
import {
  OCCUPANCY_LABEL,
  OCCUPANCY_LABEL_EN,
  OCCUPANCY_SHORT,
  OCCUPANCY_SHORT_EN,
  OCCUPANCY_EMOJI,
  OCCUPANCY_ORDER,
} from "@/lib/useLiveReports";
import {
  summarise,
  WIFI_SPEED_LABEL,
  WIFI_SPEED_LABEL_EN,
  WIFI_SPEED_ORDER,
} from "@/lib/useCafeFacts";
import { nearestStationWalkMinutes } from "@/lib/lookupCafe";
import AdBanner from "@/components/AdBanner";
import BookmarkIcon from "@/components/BookmarkIcon";
import { distanceMeters, formatDistance } from "@/lib/geoDistance";
import type { CafeFact } from "@/lib/types";

// 店舗情報。ピンに付く吹き出しの中身。
//
// 一度シート(画面下から出る形)にしたが、「ピンに吹き出しが付くほうがよい」と
// いう希望に戻した。ただし前に困った点は残さない:
//   ・高さに上限を付け、中だけをスクロールさせる。吹き出しは中身が増えると
//     上へ伸びるので、報告欄を開いた瞬間に店名ごと画面の外へ出ていた。
//   ・店名は上に貼り付けて、中をスクロールしても消えないようにする。
//   ・Google 既定のヘッダー(閉じるボタンの帯)を切って、上の空白をなくす。
//
// 中身は3つに分けている。混ざっていると何を信じてよいか分からなくなる。
//   いまの様子 … 30分以内の報告(すぐ古くなる)
//   設備      … 調べて分かっている事実(変わらない)
//   行った人のメモ … 利用者が書いた文章
// 報告の入力欄はいちばん下に畳んでおく。読みに来た人の邪魔をしない。

type Props = {
  cafe: Cafe;
  stats: CafeStats | null;
  facts: CafeFact[];
  isUserAdded: boolean;
  /** 現在地。分かっているときだけ距離を出す */
  userPosition: [number, number] | null;
  isFavorite: boolean;
  isFlagged: boolean;
  reportSubmitting: boolean;
  factSubmitting: boolean;
  reportError: string | null;
  factError: string | null;
  onClose: () => void;
  onToggleFavorite: () => void;
  onReportOccupancy: (level: OccupancyLevel) => void;
  onSubmitFact: (patch: Partial<CafeFact>) => void;
  onFlag: () => void;
  onSubmitCorrection: (message: string) => Promise<boolean>;
};

// ひとかたまりを枠で囲む。区切り線だけだと、どこからどこまでが
// ひとまとまりなのか分かりにくいと言われた
function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mt-1.5 first:mt-0 rounded-lg border border-gray-200 bg-white px-2 py-1.5">
      {title && (
        <h3 className="text-[9px] font-bold text-gray-500 tracking-wide mb-1">{title}</h3>
      )}
      {children}
    </section>
  );
}

export default function CafePopup(props: Props) {
  const { cafe, stats, facts } = props;
  const { lang, t } = useLang();
  const occLabel = lang === "en" ? OCCUPANCY_LABEL_EN : OCCUPANCY_LABEL;
  const occShort = lang === "en" ? OCCUPANCY_SHORT_EN : OCCUPANCY_SHORT;
  const wifiLabel = lang === "en" ? WIFI_SPEED_LABEL_EN : WIFI_SPEED_LABEL;
  const [reportOpen, setReportOpen] = useState(false);
  const [fix, setFix] = useState("");
  const [fixSent, setFixSent] = useState(false);
  const [fixError, setFixError] = useState(false);
  const [seats, setSeats] = useState("");
  const [outletSeats, setOutletSeats] = useState("");
  const [note, setNote] = useState("");

  const f = summarise(facts);
  const level = stats ? pickMajority(stats.seatingOccupancyCounts) : null;
  const walk = nearestStationWalkMinutes(cafe.lat, cafe.lng);
  // 直線距離。実際に歩く距離より短く出るので「約」を付けて出す
  const here =
    props.userPosition == null
      ? null
      : formatDistance(distanceMeters(props.userPosition, [cafe.lat, cafe.lng]));

  // 設備は短い札を並べる。文章のままだと読む気にならないと言われたので、
  // 「電源」「Wi-Fi」のように単語で出し、詳しい説明は開いた人だけが見る
  const chips: { text: string; tone: string }[] = [];
  const TONE = {
    outlet: "bg-amber-100 text-amber-900",
    wifi: "bg-sky-100 text-sky-900",
    smoke: "bg-emerald-100 text-emerald-900",
    call: "bg-violet-100 text-violet-900",
  };
  if (hasOutlet(cafe)) chips.push({ text: `🔌 ${t("gmap.outlet")}`, tone: TONE.outlet });
  if (cafe.wifiInfo) chips.push({ text: `📶 ${t("gmap.wifi")}`, tone: TONE.wifi });
  if (cafe.smokingInfo)
    chips.push({
      text: isNonSmoking(cafe) ? `🚭 ${t("gmap.isNonSmoking")}` : "🚬 OK",
      tone: TONE.smoke,
    });
  if (f.outletSeatCount != null)
    chips.push({ text: `🔌 ${f.outletSeatCount}${t("gmap.seats")}`, tone: TONE.outlet });
  if (f.wifiSpeed) chips.push({ text: `📶 ${wifiLabel[f.wifiSpeed]}`, tone: TONE.wifi });
  if (f.webMeetingOk != null)
    chips.push({
      text: f.webMeetingOk ? `🎧 ${t("gmap.callable")}` : `🎧 ${t("gmap.notCallable")}`,
      tone: TONE.call,
    });

  const mapsQuery = encodeURIComponent(
    cafe.address ? `${cafe.name} ${cafe.address}` : cafe.name
  );

  const submitCount = (raw: string, field: "seat_count" | "outlet_seat_count") => {
    const n = Number(raw.trim());
    if (!raw.trim() || !Number.isInteger(n) || n <= 0) return;
    props.onSubmitFact({ [field]: n });
    if (field === "seat_count") setSeats("");
    else setOutletSeats("");
  };

  return (
    // 吹き出しの中身。高さの上限はここで決める。上限が無いと、報告欄を開いた
    // 瞬間に吹き出しが上へ伸びて店名が画面の外へ出る
    <div className="w-[212px] max-h-[34vh] flex flex-col text-gray-900 text-[11px]">
      {/* 店名は上に貼り付ける。中をスクロールしても、どの店を見ているかが消えない */}
      <div className="shrink-0 pb-2 border-b border-gray-200">
        <div className="flex items-start gap-1.5">
          <div className="min-w-0 flex-1">
            <h2 className="text-[12px] font-bold text-gray-900 leading-snug truncate">
              {cafe.name}
            </h2>
            <p className="text-[10px] text-gray-600 mt-0.5 truncate">
              {lang === "en" ? `🚶 ${walk} min` : `🚶 駅から${walk}分`}
              {here != null && (
                <span className="ml-1.5 text-blue-800 font-semibold">
                  {lang === "en" ? `📍 ${here}` : `📍 現在地から約${here}`}
                </span>
              )}
              {props.isUserAdded && (
                <span className="ml-2 text-amber-700">{t("gmap.userAdded")}</span>
              )}
            </p>
          </div>
          <button
            onClick={props.onClose}
            aria-label={t("gmap.close")}
            className="shrink-0 text-[14px] leading-none w-6 h-6 flex items-center justify-center text-gray-500"
          >
            ✕
          </button>
        </div>
        {/* 保存は絵文字だけだと、押したのか押していないのか分からないと言われた。
            枠と文字で状態を出し、押した後は色ごと変える */}
        <button
          onClick={props.onToggleFavorite}
          aria-pressed={props.isFavorite}
          className={`mt-1 w-full rounded border py-1 text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap ${
            props.isFavorite
              ? "bg-blue-50 border-blue-600 text-blue-800"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          <BookmarkIcon filled={props.isFavorite} size={12} />
          {props.isFavorite ? t("gmap.saved") : t("gmap.save")}
        </button>
      </div>

      <div className="overflow-y-auto overscroll-contain pt-1.5">
        {/* いまの様子。30分で消える情報なので、いちばん上に置く */}
        <Section title={t("gmap.nowLabel")}>
          <div className="text-[12px] font-bold text-gray-900">
            {level ? (
              <>
                {OCCUPANCY_EMOJI[level]} {occLabel[level]}
                <span className="ml-1.5 text-[12px] font-normal text-gray-600">
                  {stats!.totalReporters}
                  {t("gmap.reportedBy")}
                </span>
              </>
            ) : (
              <span className="text-[13px] font-normal text-gray-500">
                {t("gmap.noReports")}
              </span>
            )}
          </div>
          <div className="flex gap-1 mt-1.5">
            {OCCUPANCY_ORDER.map((lv) => (
              <button
                key={lv}
                disabled={props.reportSubmitting}
                onClick={() => props.onReportOccupancy(lv)}
                className="flex-1 min-w-0 rounded border border-gray-300 bg-white py-1 text-[10px] font-semibold text-gray-800 disabled:opacity-50 whitespace-nowrap"
              >
                {OCCUPANCY_EMOJI[lv]}
                <br />
                {occShort[lv]}
              </button>
            ))}
          </div>
          {props.reportError && (
            <p className="text-[11px] text-red-700 mt-1">{t("gmap.sendFailed")}</p>
          )}
        </Section>

        {/* 設備。調べて分かっている事実。ここは時間で変わらない */}
        <Section title={t("gmap.facilityLabel")}>
          {f.outletUnusable && (
            <p className="text-[12px] font-bold text-red-800 bg-red-50 border border-red-200 rounded px-2 py-1 mb-1.5">
              ⚡ {t("gmap.outletUnusable")}
            </p>
          )}
          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <span
                  key={c.text}
                  className={`text-[10px] font-semibold rounded-full px-1.5 py-0.5 whitespace-nowrap ${c.tone}`}
                >
                  {c.text}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-gray-500">{t("gmap.noFacility")}</p>
          )}
          <dl className="mt-1 text-[10px] text-gray-700 leading-snug">
            {cafe.outletInfo && <dd>🔌 {cafe.outletInfo}</dd>}
            {cafe.seatCountInfo && <dd>🪑 {cafe.seatCountInfo}</dd>}
            {cafe.hoursInfo && (
              <dd>
                ⏰ {cafe.hoursInfo}
                {cafe.closedDaysInfo ? ` / ${cafe.closedDaysInfo}` : ""}
              </dd>
            )}
          </dl>
        </Section>

        {/* 行った人のメモ。利用者が書いた文章はここだけに集める */}
        {f.notes.length > 0 && (
          <Section title={t("gmap.visitorNote")}>
            <ul className="text-[10px] text-gray-800 leading-snug list-disc pl-3.5">
              {f.notes.slice(0, 3).map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* 行き先・メニューへの入口。文字は短く、押した先が想像できる言葉にする */}
        <Section>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex-1 min-w-0 text-center rounded-md bg-blue-600 text-white text-[10px] font-bold py-1.5 whitespace-nowrap"
            >
              {t("gmap.route")}
            </a>
            {cafe.website ? (
              <a
                href={cafe.website}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[10px] font-bold py-1.5 whitespace-nowrap"
              >
                {t("gmap.official")}
              </a>
            ) : (
              // 公式サイトのURLが確認できていない店では、勝手にURLを作らない。
              // Googleマップの店ページにメニューと写真、公式サイトへのリンクが
              // まとまっているので、そこへ送る
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[10px] font-bold py-1.5 whitespace-nowrap"
              >
                {t("gmap.menu")}
              </a>
            )}
            {!props.isUserAdded && (
              <Link
                href={`/cafe/${cafe.id}`}
                onClick={() => {
                  // 詳細から戻るときに、見ていた地図へ帰れるようにする目印
                  try {
                    window.sessionStorage.setItem(FROM_MAP_KEY, "1");
                  } catch {
                    // 使えない設定なら、戻り先の判定は referrer に任せる
                  }
                }}
                className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[10px] font-bold py-1.5 whitespace-nowrap"
              >
                {t("gmap.detail")}
              </Link>
            )}
          </div>
        </Section>

        {/* 報告の入力。読みに来ただけの人には要らないので畳んでおく */}
        <Section>
          <button
            onClick={() => setReportOpen((v) => !v)}
            className="w-full text-left text-[11px] font-bold text-blue-700"
          >
            {reportOpen ? "▲" : "▼"} {t("gmap.openReport")}
          </button>
          {reportOpen && (
            <div className="mt-2 flex flex-col gap-2.5">
              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">{t("gmap.wifiSpeedLabel")}</p>
                <div className="flex gap-1.5">
                  {WIFI_SPEED_ORDER.map((sp: WifiSpeed) => (
                    <button
                      key={sp}
                      disabled={props.factSubmitting}
                      onClick={() => props.onSubmitFact({ wifi_speed: sp })}
                      className="flex-1 min-w-0 rounded border border-gray-300 py-1 text-[10px] text-gray-800 disabled:opacity-50 whitespace-nowrap"
                    >
                      {wifiLabel[sp]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-600 mb-0.5">{t("gmap.callLabel")}</p>
                <div className="flex gap-1.5">
                  <button
                    disabled={props.factSubmitting}
                    onClick={() => props.onSubmitFact({ web_meeting_ok: true })}
                    className="flex-1 min-w-0 rounded border border-gray-300 py-1 text-[10px] text-gray-800 disabled:opacity-50 whitespace-nowrap"
                  >
                    {t("gmap.callYes")}
                  </button>
                  <button
                    disabled={props.factSubmitting}
                    onClick={() => props.onSubmitFact({ web_meeting_ok: false })}
                    className="flex-1 min-w-0 rounded border border-gray-300 py-1 text-[10px] text-gray-800 disabled:opacity-50 whitespace-nowrap"
                  >
                    {t("gmap.callNo")}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-600">
                  {t("gmap.seatCountLabel")}
                  <span className="flex gap-1 mt-1">
                    <input
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      inputMode="numeric"
                      className="w-full min-w-0 border border-gray-300 rounded px-1.5 py-1 text-[12px] text-gray-900"
                    />
                    <button
                      disabled={props.factSubmitting}
                      onClick={() => submitCount(seats, "seat_count")}
                      className="shrink-0 rounded border border-gray-300 px-2 text-[10px] text-gray-800 disabled:opacity-50"
                    >
                      {t("gmap.send")}
                    </button>
                  </span>
                </label>
                <label className="text-[10px] text-gray-600">
                  {t("gmap.outletSeatCountLabel")}
                  <span className="flex gap-1 mt-1">
                    <input
                      value={outletSeats}
                      onChange={(e) => setOutletSeats(e.target.value)}
                      inputMode="numeric"
                      className="w-full min-w-0 border border-gray-300 rounded px-1.5 py-1 text-[12px] text-gray-900"
                    />
                    <button
                      disabled={props.factSubmitting}
                      onClick={() => submitCount(outletSeats, "outlet_seat_count")}
                      className="shrink-0 rounded border border-gray-300 px-2 text-[10px] text-gray-800 disabled:opacity-50"
                    >
                      {t("gmap.send")}
                    </button>
                  </span>
                </label>
              </div>

              <label className="text-[10px] text-gray-600">
                {t("gmap.noteLabel")}
                <span className="flex gap-1 mt-1">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("gmap.notePlaceholder")}
                    className="w-full min-w-0 border border-gray-300 rounded px-1.5 py-1 text-[12px] text-gray-900"
                  />
                  <button
                    disabled={props.factSubmitting || note.trim() === ""}
                    onClick={() => {
                      props.onSubmitFact({ note: note.trim() });
                      setNote("");
                    }}
                    className="shrink-0 rounded border border-gray-300 px-2 text-[10px] text-gray-800 disabled:opacity-50"
                  >
                    {t("gmap.send")}
                  </button>
                </span>
              </label>

              <button
                disabled={props.factSubmitting}
                onClick={() => props.onSubmitFact({ outlet_usable: false })}
                className="rounded-lg border border-red-300 py-1.5 text-[12px] text-red-800 disabled:opacity-50"
              >
                ⚡ {t("gmap.outletDead")}
              </button>

              {/* 載っている情報が違うときの報告。五反田では閉店や席なしが続いた */}
              <label className="text-[10px] text-gray-600">
                {t("gmap.wrongInfo")}
                {fixSent ? (
                  <span className="block mt-1 text-[12px] text-gray-700">
                    {t("gmap.thanks")}
                  </span>
                ) : (
                  <span className="flex gap-1 mt-1">
                    <input
                      value={fix}
                      onChange={(e) => setFix(e.target.value)}
                      placeholder={t("gmap.wrongInfoPlaceholder")}
                      className="w-full min-w-0 border border-gray-300 rounded px-1.5 py-1 text-[12px] text-gray-900"
                    />
                    <button
                      disabled={fix.trim() === ""}
                      onClick={async () => {
                        const ok = await props.onSubmitCorrection(fix.trim());
                        if (ok) {
                          setFix("");
                          setFixSent(true);
                        } else setFixError(true);
                      }}
                      className="shrink-0 rounded border border-gray-300 px-2 text-[10px] text-gray-800 disabled:opacity-50"
                    >
                      {t("gmap.send")}
                    </button>
                  </span>
                )}
              </label>

              {props.isUserAdded && (
                <button
                  onClick={props.onFlag}
                  disabled={props.isFlagged}
                  className="text-[12px] text-gray-600 underline disabled:no-underline disabled:text-gray-400"
                >
                  {props.isFlagged ? t("gmap.flagged") : t("gmap.flag")}
                </button>
              )}

              {(props.factError || fixError) && (
                <p className="text-[11px] text-red-700">{t("gmap.sendFailed")}</p>
              )}
            </div>
          )}
        </Section>

        <div className="pt-2">
          <AdBanner slot="cafe-popup" minHeight={56} />
        </div>
      </div>
    </div>
  );
}
