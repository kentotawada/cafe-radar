"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { LangProvider, useLang, type TranslationKey } from "@/lib/i18n";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// 地図が出るまでの数秒間、ここが真っ白だと画面の大半が何も描かれない。すると
// 残った小さな文字が「一番大きく描かれた要素」として選ばれ、LCP がその時刻に
// なる。読み込み中の表示を置くと、待つ人に中身が伝わるうえ数字も素直に改善する
function MapSkeleton() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-2 px-6 text-center"
      style={{ backgroundColor: "#e8eaed" }}
    >
      <p className="text-sm font-semibold text-gray-800">地図を読み込んでいます</p>
      <p className="text-xs text-gray-700 leading-relaxed max-w-xs">
        東京23エリアのカフェを、電源・Wi-Fi・喫煙可否・席数から探せます。空き状況は利用者の報告で更新されます。
      </p>
    </div>
  );
}

const GoogleMapPane = dynamic(() => import("@/components/GoogleMapPane"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

// 最初の1フレームが描かれるまで、地図の読み込みを始めない。
// ハイドレーションと同時に始めると、それがメインスレッドを掴んだままになり、
// ヘッダーすら描かれない時間が続く
function useAfterFirstPaint(): boolean {
  const [painted, setPainted] = useState(false);
  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setPainted(true));
    });
    // requestAnimationFrame は画面が見えていない間は発火しない。裏のタブで
    // 開かれたまま前面に来ないと、地図がいつまでも読み込まれない。
    // 保険として、描画を待たずに一定時間で先へ進める
    const timer = window.setTimeout(() => setPainted(true), 1000);
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
      window.clearTimeout(timer);
    };
  }, []);
  return painted;
}

// ピンの形の見本。色は「まだ報告が無い」の色に固定し、形の違いだけが目に入るようにする
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
      <div className="p-6 text-sm text-gray-800">
        <p className="font-semibold mb-2">{t("gmap.keyMissing")}</p>
        <p>
          環境変数 <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> を設定してください。
        </p>
      </div>
    );
  }

  return (
    // h-screen(100vh)だとスマホのブラウザのバーのぶんだけ画面から溢れ、下の
    // リストが折り返しの外に出る。実際「スライドしないとリストに気づかない」
    // 状態になっていた。dvh は今見えている高さを指す
    <div className="flex flex-col h-[100dvh]">
      {/* ヘッダーは1行だけ。地図を1pxでも広く見せる。
          プライバシーポリシー等の導線は地図上の「i」にまとめた */}
      <header className="shrink-0 border-b px-3 py-1.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-[15px] font-bold text-gray-900 leading-tight">
            {t("gmap.title")}
          </h1>
          <p className="text-[10px] text-gray-600 leading-tight">{t("gmap.subtitle")}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            className="text-[12px] text-gray-800 border border-gray-300 rounded-full px-2.5 py-1"
          >
            {t("app.langToggle")}
          </button>
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className="text-[12px] text-gray-800 border border-gray-300 rounded-full px-2.5 py-1"
          >
            {t("legend.toggle")} {legendOpen ? "▲" : "▼"}
          </button>
        </div>
      </header>
      {legendOpen && (
        <div className="shrink-0 px-3 py-2 border-b bg-gray-50 space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {PIN_LEGEND.map((item) => (
              <span
                key={item.key}
                className="flex items-center gap-1 text-[11px] text-gray-800"
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow"
                  style={{ backgroundColor: PIN_COLORS[item.key] }}
                />
                {t(`legend.status.${item.key}` as TranslationKey)}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-800">
            <span className="text-gray-600">{t("gmap.shapeLabel")}</span>
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
