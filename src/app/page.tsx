"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";

const CafeMap = dynamic(() => import("@/components/CafeMap"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col flex-1 h-screen">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-bold">ノマドカフェレーダー</h1>
        <p className="text-xs text-gray-500">
          電源席とうるささを、その場にいる人同士でリアルタイムに共有
        </p>
        {!isSupabaseConfigured && (
          <p className="text-xs text-yellow-600 mt-1">
            Supabase未接続のため、報告は保存されません（.env.localを設定してください）
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
          {PIN_LEGEND.map((item) => (
            <span key={item.key} className="flex items-center gap-1 text-xs text-gray-600">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow"
                style={{ backgroundColor: PIN_COLORS[item.key] }}
              />
              {item.label}
            </span>
          ))}
          <Link
            href="/privacy"
            className="text-xs text-gray-400 underline ml-auto"
          >
            プライバシーポリシー
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
          <span>ピンの中のマーク:</span>
          <span className="flex items-center gap-1">無地 = チェーン店</span>
          <span className="flex items-center gap-1">💻 = コワーキング併設</span>
          <span className="flex items-center gap-1">🫘 = 個人経営・おしゃれ</span>
          <span className="flex items-center gap-1">🌙 = 24時間・深夜営業</span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-4 h-4 shrink-0"
              dangerouslySetInnerHTML={{
                __html: cupPinSvgMarkup(PIN_COLORS.quiet, "independent", true, 16),
              }}
            />
            = 電源席あり確認済み
          </span>
          <span className="flex items-center gap-1">
            <span
              className="inline-block w-4 h-4 shrink-0"
              dangerouslySetInnerHTML={{
                __html: cupPinSvgMarkup(PIN_COLORS.quiet, "independent", false, 16),
              }}
            />
            = 電源情報未確認
          </span>
        </div>
      </header>
      <div className="flex-1 relative">
        <CafeMap />
      </div>
    </div>
  );
}
