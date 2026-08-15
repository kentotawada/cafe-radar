"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { LangProvider, useLang, type TranslationKey } from "@/lib/i18n";

// Googleマップ版。現地で見比べた結果「Googleのほうが店にたどり着きやすい」
// という判断になったため、本体を移行する前段として実用レベルまで作る。
//
// このページは比較用ではなく「新しい本体」として育てている。機能を1つずつ
// 移し、揃った時点で / を差し替えて Leaflet 版を削除する。

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// 地図が出るまでの数秒間、ここが真っ白だと、画面の大半が何も描かれない。
// すると PageSpeed は残った小さな文字を「一番大きく描かれた要素」として
// 選び、LCP がその文字の描画時刻になる。/ で実際にそうなっていた。
//
// 読み込み中の表示を置くと、待っている人に状況と中身が伝わるうえ、
// 画面に実際の文字が早く出るぶん LCP も素直に改善する
function MapSkeleton() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-2 px-6 text-center"
      // 地図の下地に近い色。白のままだと切り替わった瞬間にちらつく
      style={{ backgroundColor: "#e8eaed" }}
    >
      <p className="text-sm font-semibold text-gray-700">地図を読み込んでいます</p>
      <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
        新宿・渋谷など東京23エリアのカフェを、コンセント(電源)・Wi-Fi・喫煙可否・座席数から探せます。混雑状況は利用者の投稿でリアルタイムに更新されます。
      </p>
    </div>
  );
}

// 地図本体は gzip で 155KB ぶんの塊(Googleマップのライブラリと1,989軒の
// データ)を持つ。最初のHTMLに混ぜると、そのぶん描き始めが遅れる
const GoogleMapPane = dynamic(() => import("@/components/GoogleMapPane"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// 最初の1フレームが実際に描かれるまで待つ。
//
// 分割しただけでは足りなかった。Lighthouse で測ると、DOM は 100〜570ms で
// 用意できているのに、画面に何も出ない時間が 1.2〜2.6秒続いていた(3回とも)。
// ハイドレーションと同時に地図の読み込みと初期化が始まり、それがメイン
// スレッドを掴んだまま離さないので、ブラウザが描画に入れない。
//
// requestAnimationFrame を2回重ねると「1フレーム描き終えた後」になる。
// そこで初めて地図を読みに行けば、ヘッダーと読み込み中の表示が先に出る。
function useAfterFirstPaint(): boolean {
  const [painted, setPainted] = useState(false);
  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setPainted(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, []);
  return painted;
}

// ピンの形の見本。色は「まだ報告が無い」の色に固定して、形の違いだけが
// 目に入るようにする
const SHAPE_LEGEND = [
  { style: "chain", outlet: false, key: "gmap.shapeChain" },
  { style: "coworking", outlet: false, key: "gmap.shapeCoworking" },
  { style: "independent", outlet: false, key: "gmap.shapeIndependent" },
  { style: "night", outlet: false, key: "gmap.shapeNight" },
  { style: "chain", outlet: true, key: "gmap.shapeOutlet" },
] as const;

function MapGoogleContent() {
  const [legendOpen, setLegendOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const painted = useAfterFirstPaint();

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-6 text-sm text-gray-700">
        <p className="font-semibold mb-2">{t("gmap.keyMissing")}</p>
        <p>
          環境変数 <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> を設定してください。
        </p>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          {t("gmap.backToLeaflet")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b px-3 py-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-base font-bold">{t("gmap.title")}</h1>
          <p className="text-[11px] text-gray-500">{t("gmap.subtitle")}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            className="text-xs text-gray-600 border border-gray-300 rounded-full px-3 py-1 whitespace-nowrap"
          >
            {t("app.langToggle")}
          </button>
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className="text-xs text-gray-600 border border-gray-300 rounded-full px-3 py-1 whitespace-nowrap"
          >
            {t("legend.toggle")} {legendOpen ? "▲" : "▼"}
          </button>
          <Link
            href="/"
            className="text-xs text-blue-600 border border-blue-300 rounded-full px-3 py-1 whitespace-nowrap"
          >
            {t("gmap.backToLeaflet")}
          </Link>
        </div>
      </header>
      {/* Leaflet版のヘッダーにあった導線。移行後に消えると、
          問い合わせ先も規約も辿れなくなる */}
      <nav className="px-3 py-1 flex flex-wrap gap-x-3 gap-y-0.5 border-b text-[11px] text-gray-500">
        <Link href="/favorites" className="underline">
          {t("gmap.navFavorites")}
        </Link>
        <Link href="/privacy" className="underline">
          {t("privacy.link")}
        </Link>
        <Link href="/contact" className="underline">
          {t("gmap.navContact")}
        </Link>
        <Link href="/business" className="underline">
          {t("gmap.navBusiness")}
        </Link>
      </nav>
      {/* ピンの説明。色と形の意味が分からないと、地図がただの点の集まりになる。
          地図に重ねると絞り込みや追加ボタンを覆うので、ヘッダー側に出す */}
      {legendOpen && (
        <div className="px-3 py-2 border-b bg-gray-50 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {PIN_LEGEND.map((item) => (
              <span
                key={item.key}
                className="flex items-center gap-1 text-[11px] text-gray-600"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow"
                  style={{ backgroundColor: PIN_COLORS[item.key] }}
                />
                {t(`legend.status.${item.key}` as TranslationKey)}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
            <span>{t("gmap.shapeLabel")}</span>
            {SHAPE_LEGEND.map(({ style, outlet, key }) => (
              <span key={`${style}-${outlet}`} className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, style, outlet, 16),
                  }}
                />
                {t(key)}
              </span>
            ))}
          </div>
        </div>
      )}
      {painted ? <GoogleMapPane /> : <MapSkeleton />}
    </div>
  );
}

export default function MapGooglePage() {
  return (
    <LangProvider>
      <MapGoogleContent />
    </LangProvider>
  );
}
