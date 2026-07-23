"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";

const CafeMap = dynamic(() => import("@/components/CafeMap"), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col flex-1 h-screen">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-bold">新宿カフェレーダー</h1>
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
      </header>
      <div className="flex-1 relative">
        <CafeMap />
      </div>
    </div>
  );
}
