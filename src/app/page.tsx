"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { PIN_COLORS, PIN_LEGEND } from "@/lib/pinColors";
import { cupPinSvgMarkup } from "@/lib/cupPinIcon";
import { LangProvider, useLang, type TranslationKey } from "@/lib/i18n";

const CafeMap = dynamic(() => import("@/components/CafeMap"), { ssr: false });

function HomeContent() {
  const [showLegend, setShowLegend] = useState(false);
  const { lang, setLang, t } = useLang();

  return (
    <div className="flex flex-col flex-1 h-screen">
      <header className="border-b px-3 py-1.5 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg md:text-2xl font-bold">{t("app.title")}</h1>
            <p className="hidden sm:block text-xs md:text-sm text-gray-500">
              {t("app.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/favorites"
              className="text-xs md:text-sm text-gray-600 border border-gray-300 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 hover:bg-gray-50"
            >
              {t("favorites.navLink")}
            </Link>
            <button
              onClick={() => setLang(lang === "ja" ? "en" : "ja")}
              className="text-xs md:text-sm text-gray-600 border border-gray-300 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 hover:bg-gray-50"
            >
              {t("app.langToggle")}
            </button>
            <button
              onClick={() => setShowLegend((prev) => !prev)}
              className="text-xs md:text-sm text-gray-600 border border-gray-300 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 hover:bg-gray-50"
            >
              {t("legend.toggle")} {showLegend ? "▲" : "▼"}
            </button>
          </div>
        </div>
        {!isSupabaseConfigured && (
          <p className="text-xs md:text-sm text-yellow-600 mt-1">
            {t("app.supabaseWarning")}
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
                  {t(`legend.status.${item.key}` as TranslationKey)}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-gray-500">
              <span>{t("legend.markLabel")}</span>
              <span className="flex items-center gap-1">{t("legend.chain")}</span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "coworking", false, 16),
                  }}
                />
                {t("legend.coworking")}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "independent", false, 16),
                  }}
                />
                {t("legend.independent")}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "night", false, 16),
                  }}
                />
                {t("legend.night")}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "chain", true, 16),
                  }}
                />
                {t("legend.outletVerified")}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-block w-4 h-4 shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: cupPinSvgMarkup(PIN_COLORS.unknown, "chain", false, 16),
                  }}
                />
                {t("legend.outletUnknown")}
              </span>
            </div>
            <div className="sm:hidden flex gap-3">
              <Link href="/privacy" className="block text-xs text-gray-400 underline">
                {t("privacy.link")}
              </Link>
              <Link href="/contact" className="block text-xs text-gray-400 underline">
                お問い合わせ
              </Link>
            </div>
          </div>
        )}
        <div className="hidden sm:flex gap-3 mt-1">
          <Link href="/privacy" className="text-xs md:text-sm text-gray-400 underline">
            {t("privacy.link")}
          </Link>
          <Link href="/contact" className="text-xs md:text-sm text-gray-400 underline">
            お問い合わせ
          </Link>
        </div>
      </header>
      <div className="flex-1 relative">
        <CafeMap legendOpen={showLegend} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <LangProvider>
      <HomeContent />
    </LangProvider>
  );
}
