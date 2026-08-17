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
// 作りを「読むところ」と「書くところ」の2つに割っている。
//
// 前は設備の行ごとに「教える ▼」が付いていて、押すとその行の入力欄が開いた。
// 読むための表示と書くための操作が同じ行に混ざり、どこまでが「みんなが
// 教えてくれたこと」で、どこからが「自分が入力する所」なのか分からなかった。
//
// 今は上半分が読むだけの表(食べログの店舗情報と同じ形。項目名と値を左右に
// 並べ、値が無ければ「まだありません」と書く)。書くのは下の「情報を送る」
// を開いたときだけ。境目が1本の線になるので迷わない。

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

// 読むところの1行。項目名と値を左右に並べる。値が無い行も消さない。
// 消すと「情報が無い」ことにすら気づけず、埋める気も起きない
function InfoRow({
  label,
  value,
  empty,
}: {
  label: string;
  value: string | null;
  empty: string;
}) {
  return (
    <div className="flex items-baseline gap-2 py-1 border-b border-gray-100 last:border-b-0">
      <dt className="shrink-0 w-[104px] text-[11px] text-gray-500">{label}</dt>
      <dd className={`min-w-0 text-[12px] ${value ? "font-bold text-gray-900" : "text-gray-400"}`}>
        {value ?? empty}
      </dd>
    </div>
  );
}

function Block({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="mt-2 first:mt-0">
      {title && (
        <h3 className="text-[11px] font-bold text-gray-700 mb-1 pl-0.5 border-l-[3px] border-blue-600">
          <span className="pl-1.5">{title}</span>
        </h3>
      )}
      <div className="rounded-lg border border-gray-200 bg-white px-2 py-1">{children}</div>
    </section>
  );
}

export default function CafeCard(props: Props) {
  const { cafe, stats, facts } = props;
  const { lang, t } = useLang();
  const occLabel = lang === "en" ? OCCUPANCY_LABEL_EN : OCCUPANCY_LABEL;
  const occShort = lang === "en" ? OCCUPANCY_SHORT_EN : OCCUPANCY_SHORT;
  const wifiLabel = lang === "en" ? WIFI_SPEED_LABEL_EN : WIFI_SPEED_LABEL;

  // 書くところは畳んでおく。読みに来ただけの人の邪魔をしない
  const [sendOpen, setSendOpen] = useState(false);
  const [seats, setSeats] = useState("");
  const [note, setNote] = useState("");
  const [site, setSite] = useState("");
  const [fix, setFix] = useState("");
  const [fixSent, setFixSent] = useState(false);
  const [fixError, setFixError] = useState(false);

  const f = summarise(facts);
  const level = stats ? pickMajority(stats.seatingOccupancyCounts) : null;
  const walk = nearestStationWalkMinutes(cafe.lat, cafe.lng);
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

  // 公式サイト。編集部調べで入れているのはチェーンだけなので、無ければ
  // 行った人が教えてくれたものを使う
  const website = cafe.website ?? f.website ?? null;

  const mapsQuery = encodeURIComponent(
    cafe.address ? `${cafe.name} ${cafe.address}` : cafe.name
  );

  const submitSeats = () => {
    const n = Number(seats.trim());
    if (!seats.trim() || !Number.isInteger(n) || n <= 0) return;
    props.onSubmitFact({ outlet_seat_count: n });
    setSeats("");
  };

  const pill =
    "flex-1 min-w-0 rounded border border-gray-300 bg-white py-1.5 text-[11px] text-gray-800 disabled:opacity-50 whitespace-nowrap";
  const fieldLabel = "block text-[11px] font-bold text-gray-700 mb-1";

  return (
    <div className="w-full max-h-[22vh] flex flex-col text-gray-900">
      {/* 見出し。店名と、評価・距離。食べログと同じで、まず点数と距離が目に入る */}
      <div className="shrink-0 pb-1.5 border-b-2 border-gray-200">
        <div className="flex items-center gap-1.5">
          <h2
            className="min-w-0 flex-1 font-bold text-gray-900 leading-snug whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontSize: nameSize }}
          >
            {cafe.name}
          </h2>
          <button
            onClick={props.onToggleFavorite}
            aria-pressed={props.isFavorite}
            aria-label={props.isFavorite ? t("gmap.saved") : t("gmap.save")}
            className="shrink-0 w-8 h-8 flex items-center justify-center"
          >
            <BookmarkIcon filled={props.isFavorite} size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
          <span className="flex items-center gap-1">
            <span className="text-[15px] font-bold text-amber-700 leading-none">
              {props.rating.count > 0 ? props.rating.average!.toFixed(1) : "–"}
            </span>
            <StarRating value={props.rating.average} size={12} />
            <span className="text-[10px] text-gray-500">
              {props.rating.count}
              {t("gmap.ratingCount")}
            </span>
          </span>
          {hereMeters != null ? (
            <span className="text-[11px] text-blue-800 font-bold">
              📍 {formatDistance(hereMeters)}
              <span className="font-normal text-gray-700">
                {lang === "en"
                  ? ` (${hereWalk} min)`
                  : `（${t("gmap.walkMin")}${hereWalk}分）`}
              </span>
            </span>
          ) : (
            <span className="text-[11px] text-gray-600">
              {lang === "en" ? `🚶 ${walk} min` : `🚶 駅から${walk}分`}
            </span>
          )}
          {props.isUserAdded && (
            <span className="text-[10px] text-amber-700">{t("gmap.userAdded")}</span>
          )}
        </div>
      </div>

      <div className="overflow-y-auto overscroll-contain pt-1.5">
        {/* ここから下は読むだけ。値だけを並べ、押す所は置かない */}
        <Block title={t("gmap.nowLabel")}>
          <p className="text-[13px] font-bold text-gray-900 py-0.5">
            {level ? (
              <>
                {OCCUPANCY_EMOJI[level]} {occLabel[level]}
                <span className="ml-1.5 text-[11px] font-normal text-gray-600">
                  {stats!.totalReporters}
                  {t("gmap.reportedBy")}
                </span>
              </>
            ) : (
              <span className="text-[12px] font-normal text-gray-400">
                {t("gmap.noReports")}
              </span>
            )}
          </p>
        </Block>

        <Block title={t("gmap.reported")}>
          <dl>
            <InfoRow
              label={t("gmap.outletSeatCountLabel")}
              value={f.outletSeatCount != null ? `${f.outletSeatCount}${t("gmap.seats")}` : null}
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.noteLabel")}
              value={f.notes[0] ?? cafe.outletInfo ?? null}
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.wifiSpeedLabel")}
              value={
                f.wifiSpeed
                  ? wifiLabel[f.wifiSpeed]
                  : cafe.wifiInfo
                    ? t("gmap.hasWifi")
                    : null
              }
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.callLabel")}
              value={
                f.webMeetingOk == null
                  ? null
                  : f.webMeetingOk
                    ? t("gmap.callYes")
                    : t("gmap.callNo")
              }
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.smokingLabel")}
              value={
                cafe.smokingInfo
                  ? isNonSmoking(cafe)
                    ? t("gmap.isNonSmoking")
                    : "喫煙可"
                  : null
              }
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.seatLabel")}
              value={cafe.seatCountInfo ?? null}
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.hours")}
              value={
                cafe.hoursInfo
                  ? `${cafe.hoursInfo}${cafe.closedDaysInfo ? ` / ${cafe.closedDaysInfo}` : ""}`
                  : null
              }
              empty={t("gmap.notYet")}
            />
            <InfoRow
              label={t("gmap.official")}
              value={website}
              empty={t("gmap.notYet")}
            />
          </dl>
          {f.outletUnusable && (
            <p className="text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 rounded px-2 py-1 mt-1">
              ⚡ {t("gmap.outletUnusable")}
            </p>
          )}
          {hasOutlet(cafe) && (
            <p className="text-[10px] text-gray-500 mt-1">🔌 {t("gmap.outlet")}</p>
          )}
        </Block>

        {/* 行き先・メニューへの入口 */}
        <div className="flex flex-wrap gap-2 mt-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 min-w-0 text-center rounded-md bg-blue-600 text-white text-[11px] font-bold py-1.5 whitespace-nowrap"
          >
            {t("gmap.route")}
          </a>
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noreferrer noopener"
              className="flex-1 min-w-0 text-center rounded-md border border-gray-300 text-gray-800 text-[11px] font-bold py-1.5 whitespace-nowrap"
            >
              {t("gmap.official")}
            </a>
          ) : (
            // 公式サイトのURLが確認できていない店では、勝手にURLを作らない。
            // Googleマップの店ページにメニューと写真がまとまっているのでそこへ送る
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

        {/* ここから下が書くところ。太い線で読むところと切り分ける */}
        <div className="mt-3 border-t-2 border-dashed border-gray-300 pt-2">
          <button
            onClick={() => setSendOpen((v) => !v)}
            className={`w-full rounded-lg py-2 text-[13px] font-bold ${
              sendOpen
                ? "bg-gray-100 text-gray-800 border border-gray-300"
                : "bg-blue-600 text-white"
            }`}
          >
            {sendOpen ? `▲ ${t("gmap.close")}` : `＋ ${t("gmap.sendInfo")}`}
          </button>

          {sendOpen && (
            <div className="mt-2 flex flex-col gap-2.5 rounded-lg bg-gray-50 border border-gray-200 p-2">
              <div>
                <span className={fieldLabel}>{t("gmap.nowLabel")}</span>
                <div className="flex gap-1">
                  {OCCUPANCY_ORDER.map((lv) => (
                    <button
                      key={lv}
                      disabled={props.reportSubmitting}
                      onClick={() => props.onReportOccupancy(lv)}
                      className={pill}
                    >
                      {OCCUPANCY_EMOJI[lv]}
                      <br />
                      {occShort[lv]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={fieldLabel}>{t("gmap.rateLabel")}</span>
                <StarRating
                  value={props.rating.mine}
                  size={22}
                  disabled={props.ratingSubmitting}
                  onRate={props.onRate}
                />
              </div>

              <div>
                <span className={fieldLabel}>{t("gmap.outletSeatCountLabel")}</span>
                <span className="flex gap-1">
                  <input
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    inputMode="numeric"
                    placeholder="例 8"
                    className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
                  />
                  <button
                    disabled={props.factSubmitting}
                    onClick={submitSeats}
                    className="shrink-0 rounded border border-gray-300 bg-white px-3 text-[11px] text-gray-800 disabled:opacity-50"
                  >
                    {t("gmap.send")}
                  </button>
                </span>
              </div>

              <div>
                <span className={fieldLabel}>{t("gmap.noteLabel")}</span>
                <span className="flex gap-1">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t("gmap.notePlaceholder")}
                    className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
                  />
                  <button
                    disabled={props.factSubmitting || note.trim() === ""}
                    onClick={() => {
                      props.onSubmitFact({ note: note.trim() });
                      setNote("");
                    }}
                    className="shrink-0 rounded border border-gray-300 bg-white px-3 text-[11px] text-gray-800 disabled:opacity-50"
                  >
                    {t("gmap.send")}
                  </button>
                </span>
              </div>

              <div>
                <span className={fieldLabel}>{t("gmap.wifiSpeedLabel")}</span>
                <div className="flex gap-1">
                  {WIFI_SPEED_ORDER.map((sp: WifiSpeed) => (
                    <button
                      key={sp}
                      disabled={props.factSubmitting}
                      onClick={() => props.onSubmitFact({ wifi_speed: sp })}
                      className={pill}
                    >
                      {wifiLabel[sp]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={fieldLabel}>{t("gmap.callLabel")}</span>
                <div className="flex gap-1">
                  <button
                    disabled={props.factSubmitting}
                    onClick={() => props.onSubmitFact({ web_meeting_ok: true })}
                    className={pill}
                  >
                    {t("gmap.callYes")}
                  </button>
                  <button
                    disabled={props.factSubmitting}
                    onClick={() => props.onSubmitFact({ web_meeting_ok: false })}
                    className={pill}
                  >
                    {t("gmap.callNo")}
                  </button>
                </div>
              </div>

              {/* 公式サイト。編集部調べで入っているのはチェーンだけなので、
                  個人店は行った人に教えてもらう。レシートや店内の掲示で
                  分かることが多い。既に分かっている店では聞かない */}
              {!website && (
                <div>
                  <span className={fieldLabel}>{t("gmap.official")}</span>
                  <span className="flex gap-1">
                    <input
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      inputMode="url"
                      placeholder="https://"
                      className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
                    />
                    <button
                      disabled={props.factSubmitting || !/^https?:\/\/\S+$/.test(site.trim())}
                      onClick={() => {
                        props.onSubmitFact({ website: site.trim() });
                        setSite("");
                      }}
                      className="shrink-0 rounded border border-gray-300 bg-white px-3 text-[11px] text-gray-800 disabled:opacity-50"
                    >
                      {t("gmap.send")}
                    </button>
                  </span>
                </div>
              )}

              <div>
                <span className={fieldLabel}>{t("gmap.wrongInfo")}</span>
                {fixSent ? (
                  <span className="text-[11px] text-gray-700">{t("gmap.thanks")}</span>
                ) : (
                  <span className="flex gap-1">
                    <input
                      value={fix}
                      onChange={(e) => setFix(e.target.value)}
                      placeholder={t("gmap.wrongInfoPlaceholder")}
                      className="w-full min-w-0 border border-gray-300 rounded px-2 py-1 bg-white text-gray-900"
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
                      className="shrink-0 rounded border border-gray-300 bg-white px-3 text-[11px] text-gray-800 disabled:opacity-50"
                    >
                      {t("gmap.send")}
                    </button>
                  </span>
                )}
              </div>

              <button
                disabled={props.factSubmitting}
                onClick={() => props.onSubmitFact({ outlet_usable: false })}
                className="rounded-lg border border-red-300 bg-white py-1.5 text-[11px] text-red-800 disabled:opacity-50"
              >
                ⚡ {t("gmap.outletDead")}
              </button>

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
        </div>
      </div>
    </div>
  );
}
