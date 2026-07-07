"use client";

import dynamic from "next/dynamic";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

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
      </header>
      <div className="flex-1">
        <CafeMap />
      </div>
    </div>
  );
}
