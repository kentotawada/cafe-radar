"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";

const CafeMap = dynamic(() => import("@/components/CafeMap"), { ssr: false });

export default function Home() {
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="flex flex-col flex-1 h-screen">
      <header className="border-b px-3 py-1.5 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold">カフェレーダー</h1>
            <p className="hidden sm:block text-xs md:text-sm text-gray-500">
              カフェの混雑度・電源・Wi-Fiをリアルタイムでチェック
            </p>
          </div>
          <button
            onClick={() => setShowLegend((prev) => !prev)}
            className="shrink-0 text-xs md:text-sm text-gray-600 border border-gray-300 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 hover:bg-gray-50"
          >

            ピンの説明 {showLegend ? "▲" : "▼"}
          </button>
        </div>
        {!isSupabaseConfigured && (
          <p className="text-xs md:text-sm text-yellow-600 mt-1">
            Supabase未接続のため、報告は保存されません（.env.localを設定してください）
          </p>
        )}
        {showLegend && (
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {PIN_LEGEND.map((item) => (
                <span
                  key={item.key}
                  className="flex items-center gap-1 text-xs md:text-sm text-gray-600"
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow"
                    style={{ backgroundColor: PIN_COLORS[item.key] }}
                  />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-gray-500">
              <span>ピンの中のマーク:</span>
              <span className="flex items-center gap-1">無地 = チェーン店</span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "coworking", false, 16),
                  }}
                />
                = コワーキング併設
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "independent", false, 16),
                  }}
                />
                = 個人経営・おしゃれ
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "night", false, 16),
                  }}
                />
                = 24時間・深夜営業
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "chain", true, 16),
                  }}
                />
                = 電源席あり確認済み
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "chain", false, 16),
                  }}
                />
                = 電源情報未確認
              </span>
            </div>
            <Link
              href="/privacy"
              className="sm:hidden block text-xs text-gray-400 underline"
            >
              プライバシーポリシー
            </Link>
          </div>
        )}
        <div className="hidden sm:block mt-1">
          <Link href="/privacy" className="text-xs md:text-sm text-gray-400 underline">
            プライバシーポリシー
          </Link>
        </div>
      </header>
      <div className="flex-1 relative">
        <CafeMap legendOpen={showLegend} />
      </div>
    </div>
  );
}
