"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LangProvider, useLang } from "@/lib/i18n";
import { areas } from "@/data/areas";

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
      <AreaLinks />
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

function MapContent() {
  const { t } = useLang();
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
    // 見出しの帯は置かない。アプリ名を出しても探すのには役立たず、そのぶん
    // 地図が狭くなる。画面のいちばん上に来るのは店名の検索欄。
    // 言語切替とピンの説明は地図上の「i」にまとめた。
    //
    // h-screen(100vh)だとスマホのブラウザのバーのぶん画面から溢れ、下の
    // リストが折り返しの外に出る。dvh は今見えている高さを指す
    <div className="cf-map-page flex flex-col h-[100dvh]">
      {painted ? <GoogleMapPane /> : <MapSkeleton />}
    </div>
  );
}

// エリアページへのリンク。読み込み中の表示の中に置く。
//
// 見た目のためだけではない。Search Console で見ると、用意した約2,000枚の
// うち検索結果に載っているのは219枚で、残り1,797枚は「検出 - インデックス
// 未登録」= URLは知られているが、まだ見に来られていない状態だった。
//
// 原因のひとつがここ。地図は読み込んだ後に描かれるので、最初に返している
// HTMLにはリンクが1本も無く、サイトで一番強いこのページがどこへも
// つながっていなかった。エリアページ側は担当する店を全部リンクしていて
// 問題がないので、入口だけを開ける。
//
// 置き場所がここなのには理由がある。地図(GoogleMapPane)は ssr:false で
// 読み込むので、中に置いたものは最初のHTMLに入らない。読み込み中の表示は
// このファイルの中にあるので、最初のHTMLに入る。
//
// 地図が出たあとは、同じリンクが検索欄のすぐ下に並ぶ。どちらの状態でも
// 同じ行き先が並んでいるので、見せているものと読ませているものは一致する。
function AreaLinks() {
  return (
    <nav
      aria-label="エリアから探す"
      className="max-w-xs text-[11px] leading-relaxed text-center"
    >
      <span className="text-gray-600">エリアから探す：</span>
      {areas.map((a) => (
        <Link
          key={a.id}
          href={`/area/${a.id}`}
          className="inline-block text-blue-700 underline mx-1"
        >
          {a.name.replace("駅", "")}
        </Link>
      ))}
    </nav>
  );
}

export default function HomePage() {
  return (
    <LangProvider>
      <MapContent />
    </LangProvider>
  );
}
