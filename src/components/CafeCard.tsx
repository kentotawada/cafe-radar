"use client";

import { useState } from "react";
import Link from "next/link";
import { FROM_MAP_KEY } from "@/lib/mapNavigation";
import type { Cafe } from "@/lib/seedCafes";
import type { CafeStats, OccupancyLevel, WifiSpeed } from "@/lib/types";
import { hasOutlet } from "@/lib/cafeAmenities";
import { isNonSmoking, pickMajority } from "@/lib/cafeStats";
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
import BookmarkIcon from "@/components/BookmarkIcon";
import StarRating from "@/components/StarRating";
import { distanceMeters, formatDistance } from "@/lib/geoDistance";
import type { CafeFact } from "@/lib/types";

// 店舗情報。横スライドのカードの中身。
//
// 「見る」と「教える」を1か所にまとめてある。以前は設備の行に「教える」を置き、
// 押すと下の「報告する」まで飛んで同じ入力欄が出る、という二段構えだった。
// 同じことをする場所が2つあり、しかも飛ばされるので分かりにくい。
// 今は設備の行そのものを押すと、その行の入力欄がその場で開く。
//
// 中身は3つに分けている。混ざっていると何を信じてよいか分からなくなる。
//   いまの様子 … 30分以内の報告(すぐ古くなる)
//   設備      … 調べて分かっている事実と、現地でしか分からない4つ
//   行った人のメモ … 利用者が書いた文章

type Props = {
  cafe: Cafe;
  stats: CafeStats | null;
  facts: CafeFact[];
  isUserAdded: boolean;
  /** 現在地。分かっているときだけ距離を出す */
  userPosition: [number, number] | null;
  /** 評価の平均・件数と、自分が付けた点 */
  rating: { average: number | null; count: number; mine: number | null };
  ratingSubmitting: boolean;
  onRate: (score: number) => void;
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
        <h3 className="text-[10px] font-bold text-gray-500 tracking-wide mb-1">{title}</h3>
      )}
      {children}
    </section>
  );
}

// 現地でしか分からない4つ。値が無くても行は消さない。消すと「情報が無い」
// ことにすら気づけず、埋める気も起きない
type FactKey = "outletSeats" | "note" | "wifi" | "call";

export default function CafeCard(props: Props) {
  const { cafe, stats, facts } = props;
  const { lang, t } = useLang();
  const occLabel = lang === "en" ? OCCUPANCY_LABEL_EN : OCCUPANCY_LABEL;
  const occShort = lang === "en" ? OCCUPANCY_SHORT_EN : OCCUPANCY_SHORT;
  const wifiLabel = lang === "en" ? WIFI_SPEED_LABEL_EN : WIFI_SPEED_LABEL;

  // どの行の入力欄を開いているか。1つずつしか開かないので高さが暴れない
  const [openKey, setOpenKey] = useState<FactKey | null>(null);
  const [seats, setSeats] = useState("");
  const [note, setNote] = useState("");
  const [fix, setFix] = useState("");
  const [fixSent, setFixSent] = useState(false);
  const [fixError, setFixError] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const f = summarise(facts);
  const level = stats ? pickMajority(stats.seatingOccupancyCounts) : null;
  const walk = nearestStationWalkMinutes(cafe.lat, cafe.lng);
  // 名前の長さに合わせて字を落とし、1行に収める。切ると支店名が消えて
  // 「どの五反田店か」が分からなくなる
  const nameSize =
    cafe.name.length <= 14 ? 14 : cafe.name.length <= 19 ? 13 : cafe.name.length <= 25 ? 12 : 11;

  // 現在地からの直線距離と、そこから出した徒歩の分数。
  // 直線距離は実際に歩く道のりより短く出るので、分数も目安として扱う
  // (分速80mは不動産の表示に合わせた慣習値)
  const hereMeters =
    props.userPosition == null
      ? null
      : distanceMeters(props.userPosition, [cafe.lat, cafe.lng]);
  const hereWalk = hereMeters == null ? null : Math.max(1, Math.ceil(hereMeters / 80));

  // 設備の札。色は意味に紐づける(電源=琥珀 / Wi-Fi=青 / 禁煙=緑 / 通話=紫)
  const TONE = {
    outlet: "bg-amber-100 text-amber-900",
    wifi: "bg-sky-100 text-sky-900",
    smoke: "bg-emerald-100 text-emerald-900",
  };
  const chips: { text: string; tone: string }[] = [];
  if (hasOutlet(cafe)) chips.push({ text: `🔌 ${t("gmap.outlet")}`, tone: TONE.outlet });
  if (cafe.wifiInfo) chips.push({ text: `📶 ${t("gmap.wifi")}`, tone: TONE.wifi });
  if (cafe.smokingInfo)
    chips.push({
      text: isNonSmoking(cafe) ? `🚭 ${t("gmap.isNonSmoking")}` : "🚬 OK",
      tone: TONE.smoke,
    });

  const mapsQuery = encodeURIComponent(
    cafe.address ? `${cafe.name} ${cafe.address}` : cafe.name
  );

  const toggle = (key: FactKey) => setOpenKey((prev) => (prev === key ? null : key));

  const submitSeats = () => {
    const n = Number(seats.trim());
    if (!seats.trim() || !Number.isInteger(n) || n <= 0) return;
    props.onSubmitFact({ outlet_seat_count: n });
    setSeats("");
    setOpenKey(null);
  };

  // 行1つぶん。値があれば太字で出し、無ければ「教える」を出す。
  // どちらを押しても、その場で入力欄が開く
  const factRow = (
    key: FactKey,
    icon: string,
    label: string,
    value: string | null,
    editor: React.ReactNode
  ) => (
    <div key={key} className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggle(key)}
        className="w-full flex items-baseline gap-1 py-1 text-[11px] text-left"
      >
        <span className="shrink-0 text-gray-500 whitespace-nowrap">
          {icon} {label}
        </span>
        <span className="ml-auto min-w-0 text-right">
          {value ? (
            <span className="font-bold text-gray-900">{value}</span>
          ) : (
            <span className="rounded-full bg-blue-600 text-white font-bold px-2 py-[2px] whitespace-nowrap">
              {t("gmap.unknownFill")}
            </span>
          )}
        </span>
        <span className="shrink-0 text-gray-400 text-[10px]">
          {openKey === key ? "▲" : "▼"}
        </span>
      </button>
      {openKey === key && <div className="pb-1.5">{editor}</div>}
    </div>
  );

  const pill =
    "flex-1 min-w-0 rounded border border-gray-300 py-1 text-[11px] text-gray-800 disabled:opacity-50 whitespace-nowrap";

  return (
    // 横カードの中身。カードの幅いっぱいを使い、高さだけ上限をかけて
    // 中をスクロールさせる
    <div className="w-full max-h-[30vh] flex flex-col text-gray-900 text-[12px]">
      {/* 店名は上に貼り付ける。中をスクロールしても、どの店を見ているかが消えない */}
      <div className="shrink-0 pb-1.5 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <div className="min-w-0 flex-1">
            <h2
              className="font-bold text-gray-900 leading-snug whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontSize: nameSize }}
            >
              {cafe.name}
            </h2>
            {/* 現在地からの距離を先頭に。歩いて探しているときに
                いちばん先に知りたいのはここ */}
            <p className="flex items-center gap-1.5 text-[11px] mt-0.5 whitespace-nowrap">
              {hereMeters != null ? (
                <span className="text-blue-800 font-bold">
                  📍 {formatDistance(hereMeters)}
                  <span className="font-normal text-gray-700">
                    {lang === "en"
                      ? ` (${hereWalk} min ${t("gmap.walkMin")})`
                      : `（${t("gmap.walkMin")}${hereWalk}分）`}
                  </span>
                </span>
              ) : (
                <span className="text-gray-600">
                  {lang === "en" ? `🚶 ${walk} min` : `🚶 駅から${walk}分`}
                </span>
              )}
              <StarRating value={props.rating.average} size={12} />
              <span className="text-gray-600">
                {props.rating.count > 0
                  ? `${props.rating.average!.toFixed(1)} (${props.rating.count})`
                  : "–"}
              </span>
              {props.isUserAdded && (
                <span className="text-amber-700">{t("gmap.userAdded")}</span>
              )}
            </p>
          </div>
          <button
            onClick={props.onToggleFavorite}
            aria-pressed={props.isFavorite}
            aria-label={props.isFavorite ? t("gmap.saved") : t("gmap.save")}
            className="shrink-0 w-8 h-8 flex items-center justify-center"
          >
            <BookmarkIcon filled={props.isFavorite} size={18} />
          </button>
        </div>
        {/* 設備の札。ここは一目で分かる要約だけ */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {chips.map((c) => (
              <span
                key={c.text}
                className={`text-[11px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap ${c.tone}`}
              >
                {c.text}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-y-auto overscroll-contain pt-1.5">
        {/* いまの様子。30分で消える情報なので、いちばん上に置く */}
        <Section title={t("gmap.nowLabel")}>
          <div className="text-[12px] font-bold text-gray-900">
            {level ? (
              <>
                {OCCUPANCY_EMOJI[level]} {occLabel[level]}
                <span className="ml-1.5 text-[11px] font-normal text-gray-600">
                  {stats!.totalReporters}
                  {t("gmap.reportedBy")}
                </span>
              </>
            ) : (
              <span className="text-[12px] font-normal text-gray-500">
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
        </Section>

        {/* 自分の評価 */}
        <Section title={t("gmap.rateLabel")}>
          <div className="flex items-center gap-2">
            <StarRating
              value={props.rating.mine}
              size={20}
              disabled={props.ratingSubmitting}
              onRate={props.onRate}
            />
            {props.rating.mine != null && (
              <span className="text-[10px] text-gray-600">{t("gmap.rated")}</span>
            )}
          </div>
        </Section>

        {/* 現地でしか分からない4つ。見るのと教えるのを同じ行でやる。
            以前は「教える」で下の報告欄へ飛ばしていたが、同じ入力が
            2か所にあって分かりにくかった */}
        <Section title={t("gmap.facilityLabel")}>
          {f.outletUnusable && (
            <p className="text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 rounded px-2 py-1 mb-1">
              ⚡ {t("gmap.outletUnusable")}
            </p>
          )}

          {factRow(
            "outletSeats",
            "🔌",
            t("gmap.outletSeatCountLabel"),
            f.outletSeatCount != null ? `${f.outletSeatCount}${t("gmap.seats")}` : null,
            <span className="flex gap-1">
              <input
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                inputMode="numeric"
                placeholder="例 8"
                className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 text-gray-900"
              />
              <button
                disabled={props.factSubmitting}
                onClick={submitSeats}
                className="shrink-0 rounded border border-gray-300 px-2 text-[11px] text-gray-800 disabled:opacity-50"
              >
                {t("gmap.send")}
              </button>
            </span>
          )}

          {factRow(
            "note",
            "📍",
            t("gmap.noteLabel"),
            f.notes[0] ?? null,
            <span className="flex gap-1">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("gmap.notePlaceholder")}
                className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 text-gray-900"
              />
              <button
                disabled={props.factSubmitting || note.trim() === ""}
                onClick={() => {
                  props.onSubmitFact({ note: note.trim() });
                  setNote("");
                  setOpenKey(null);
                }}
                className="shrink-0 rounded border border-gray-300 px-2 text-[11px] text-gray-800 disabled:opacity-50"
              >
                {t("gmap.send")}
              </button>
            </span>
          )}

          {factRow(
            "wifi",
            "📶",
            t("gmap.wifiSpeedLabel"),
            f.wifiSpeed ? wifiLabel[f.wifiSpeed] : null,
            <span className="flex gap-1">
              {WIFI_SPEED_ORDER.map((sp: WifiSpeed) => (
                <button
                  key={sp}
                  disabled={props.factSubmitting}
                  onClick={() => {
                    props.onSubmitFact({ wifi_speed: sp });
                    setOpenKey(null);
                  }}
                  className={pill}
                >
                  {wifiLabel[sp]}
                </button>
              ))}
            </span>
          )}

          {factRow(
            "call",
            "🎧",
            t("gmap.callLabel"),
            f.webMeetingOk == null
              ? null
              : f.webMeetingOk
                ? t("gmap.callYes")
                : t("gmap.callNo"),
            <span className="flex gap-1">
              <button
                disabled={props.factSubmitting}
                onClick={() => {
                  props.onSubmitFact({ web_meeting_ok: true });
                  setOpenKey(null);
                }}
                className={pill}
              >
                {t("gmap.callYes")}
              </button>
              <button
                disabled={props.factSubmitting}
                onClick={() => {
                  props.onSubmitFact({ web_meeting_ok: false });
                  setOpenKey(null);
                }}
                className={pill}
              >
                {t("gmap.callNo")}
              </button>
            </span>
          )}

          <dl className="mt-1 text-[11px] text-gray-700 leading-snug">
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

        {/* 行った人のメモ */}
        {f.notes.length > 1 && (
          <Section title={t("gmap.visitorNote")}>
            <ul className="text-[11px] text-gray-800 leading-snug list-disc pl-3.5">
              {f.notes.slice(1, 3).map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* 行き先・メニューへの入口 */}
        <Section>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex-1 min-w-0 text-center rounded-md bg-blue-600 text-white text-[11px] font-bold py-1.5 whitespace-nowrap"
            >
              {t("gmap.route")}
            </a>
            {cafe.website ? (
              <a
                href={cafe.website}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[11px] font-bold py-1.5 whitespace-nowrap"
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
                className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[11px] font-bold py-1.5 whitespace-nowrap"
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
                className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[11px] font-bold py-1.5 whitespace-nowrap"
              >
                {t("gmap.detail")}
              </Link>
            )}
          </div>
        </Section>

        {/* めったに使わない報告。畳んでおく */}
        <Section>
          <button
            onClick={() => setMoreOpen((v) => !v)}
            className="w-full text-left text-[11px] font-bold text-blue-700"
          >
            {moreOpen ? "▲" : "▼"} {t("gmap.wrongInfo")}
          </button>
          {moreOpen && (
            <div className="mt-1.5 flex flex-col gap-1.5">
              <button
                disabled={props.factSubmitting}
                onClick={() => props.onSubmitFact({ outlet_usable: false })}
                className="rounded-lg border border-red-300 py-1.5 text-[11px] text-red-800 disabled:opacity-50"
              >
                ⚡ {t("gmap.outletDead")}
              </button>
              {fixSent ? (
                <span className="text-[11px] text-gray-700">{t("gmap.thanks")}</span>
              ) : (
                <span className="flex gap-1">
                  <input
                    value={fix}
                    onChange={(e) => setFix(e.target.value)}
                    placeholder={t("gmap.wrongInfoPlaceholder")}
                    className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 text-gray-900"
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
                    className="shrink-0 rounded border border-gray-300 px-2 text-[11px] text-gray-800 disabled:opacity-50"
                  >
                    {t("gmap.send")}
                  </button>
                </span>
              )}
              {props.isUserAdded && (
                <button
                  onClick={props.onFlag}
                  disabled={props.isFlagged}
                  className="text-[11px] text-gray-600 underline disabled:no-underline disabled:text-gray-400"
                >
                  {props.isFlagged ? t("gmap.flagged") : t("gmap.flag")}
                </button>
              )}
              {(props.factError || fixError || props.reportError) && (
                <p className="text-[11px] text-red-700">{t("gmap.sendFailed")}</p>
              )}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
