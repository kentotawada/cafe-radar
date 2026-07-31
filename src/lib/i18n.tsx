"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "ja" | "en";

// 軽量版の英語対応。まずは画面上の文言(UIのラベル・ボタンなど)だけを
// 対象にする。カフェの店名・住所・営業時間などの実データや、ユーザーが
// 投稿した混雑度レポート・自由記述のコメントは翻訳対象外(実店舗名の
// 翻訳は逆に検索しづらくなるため)。
const dictionary = {
  ja: {
    "app.title": "カフェレーダー",
    "app.subtitle": "カフェの混雑度・電源・Wi-Fiをリアルタイムでチェック",
    "app.langToggle": "English",
    "app.supabaseWarning":
      "Supabase未接続のため、報告は保存されません（.env.localを設定してください）",
    "legend.toggle": "ピンの説明",
    "legend.markLabel": "ピンの中のマーク:",
    "legend.status.quiet": "空きあり・静か",
    "legend.status.normal": "空きあり・普通",
    "legend.status.noisy": "空きあり・ややうるさい",
    "legend.status.loud": "空きあり・うるさい",
    "legend.status.full": "満席",
    "legend.status.unknown": "レポート待ち",
    "legend.chain": "無地 = チェーン店",
    "legend.coworking": "= コワーキング併設",
    "legend.independent": "= 個人経営・おしゃれ",
    "legend.night": "= 24時間・深夜営業",
    "legend.outletVerified": "= 電源席あり確認済み",
    "legend.outletUnknown": "= 電源情報未確認",
    "privacy.link": "プライバシーポリシー",

    "filter.toggle": "絞り込み",
    "filter.reset": "解除",
    "filter.area": "エリア検索",
    "filter.areaPlaceholder": "選択してください",
    "filter.outlet": "電源席",
    "filter.seating": "一般席",
    "filter.noise": "静かさ",
    "filter.smoking": "喫煙",
    "filter.wifi": "Wi-Fi",
    "filter.any": "すべて",
    "filter.availableOnly": "空きありのみ",
    "filter.wifiAvailableOnly": "Wi-Fiありのみ",
    "filter.noiseAny": "こだわらない",
    "filter.quietOnly": "静かな店のみ",
    "filter.excludeLoud": "うるさい店を除く",
    "filter.smokingAny": "こだわらない",
    "filter.nonSmokingOnly": "禁煙のみ",
    "filter.smokingOk": "喫煙可でもよい",
    "filter.favoritesOnly": "お気に入りのお店のみ",
    "filter.scrollHint": "▼ スクロールで他の項目も見られます",

    "list.count": "件のお店",
    "list.areaAll": "エリア: すべて",
    "list.sortRecommended": "おすすめ順",
    "list.sortDistance": "現在地から近い順",
    "list.sortDistanceUnavailable": "(現在地未取得)",
    "list.sortSeats": "席数が多い順",
    "list.sortOccupancy": "空いている順",
    "list.sortNoise": "静かな順",
    "list.noAddress": "住所未登録",

    "addCafe.button": "＋ お店を追加",
    "addCafe.tapHint": "地図をタップしてお店の場所を選んでください",
    "addCafe.title": "この場所にお店を追加",
    "addCafe.nameLabel": "店名（必須）",
    "addCafe.namePlaceholder": "例: ○○珈琲店 △△店",
    "addCafe.addressLabel": "住所（任意）",
    "addCafe.addressPlaceholder": "わかれば入力（経路案内の精度が上がります）",
    "addCafe.verifyOnGoogleMaps": "登録前にGoogleマップで実在確認する",
    "addCafe.submit": "この場所に登録する",
    "addCafe.cancel": "キャンセル",

    "inquiry.button": "お問い合わせ",
    "inquiry.title": "お問い合わせ",
    "inquiry.description":
      "ご意見・ご要望・不具合報告など、店舗に関係のない内容はこちらからどうぞ。",
    "inquiry.placeholder": "内容を入力してください",
    "inquiry.submitting": "送信中…",
    "inquiry.submit": "送信する",
    "inquiry.done": "送信しました。ありがとうございます。",
    "inquiry.error": "送信に失敗しました",
    "inquiry.close": "× 閉じる",

    "attribution.button": "i",
    "attribution.title": "このサイトについて",
    "attribution.close": "× 閉じる",
  },
  en: {
    "app.title": "Cafe Radar",
    "app.subtitle": "Real-time cafe crowding, outlets, and Wi-Fi info",
    "app.langToggle": "日本語",
    "app.supabaseWarning":
      "Supabase is not connected, so reports won't be saved (set up .env.local)",
    "legend.toggle": "Pin guide",
    "legend.markLabel": "Icon inside the pin:",
    "legend.status.quiet": "Available, quiet",
    "legend.status.normal": "Available, normal",
    "legend.status.noisy": "Available, a bit noisy",
    "legend.status.loud": "Available, noisy",
    "legend.status.full": "Full",
    "legend.status.unknown": "No reports yet",
    "legend.chain": "Plain = chain cafe",
    "legend.coworking": "= has coworking space",
    "legend.independent": "= independent / stylish",
    "legend.night": "= open 24h / late night",
    "legend.outletVerified": "= outlet seats confirmed",
    "legend.outletUnknown": "= outlet info unconfirmed",
    "privacy.link": "Privacy Policy",

    "filter.toggle": "Filters",
    "filter.reset": "Reset",
    "filter.area": "Area",
    "filter.areaPlaceholder": "Select an area",
    "filter.outlet": "Outlets",
    "filter.seating": "Seating",
    "filter.noise": "Quietness",
    "filter.smoking": "Smoking",
    "filter.wifi": "Wi-Fi",
    "filter.any": "Any",
    "filter.availableOnly": "Available only",
    "filter.wifiAvailableOnly": "Wi-Fi available only",
    "filter.noiseAny": "No preference",
    "filter.quietOnly": "Quiet places only",
    "filter.excludeLoud": "Exclude loud places",
    "filter.smokingAny": "No preference",
    "filter.nonSmokingOnly": "Non-smoking only",
    "filter.smokingOk": "Smoking OK",
    "filter.favoritesOnly": "Favorites only",
    "filter.scrollHint": "▼ Scroll for more filters",

    "list.count": " cafes",
    "list.areaAll": "Area: All",
    "list.sortRecommended": "Recommended",
    "list.sortDistance": "Nearest to me",
    "list.sortDistanceUnavailable": "(location unavailable)",
    "list.sortSeats": "Most seats",
    "list.sortOccupancy": "Least crowded",
    "list.sortNoise": "Quietest",
    "list.noAddress": "No address on file",

    "addCafe.button": "+ Add a cafe",
    "addCafe.tapHint": "Tap the map to choose the cafe's location",
    "addCafe.title": "Add a cafe at this location",
    "addCafe.nameLabel": "Name (required)",
    "addCafe.namePlaceholder": "e.g. Cafe Example - Shibuya",
    "addCafe.addressLabel": "Address (optional)",
    "addCafe.addressPlaceholder": "If known (improves directions accuracy)",
    "addCafe.verifyOnGoogleMaps": "Verify it exists on Google Maps before adding",
    "addCafe.submit": "Add at this location",
    "addCafe.cancel": "Cancel",

    "inquiry.button": "Contact",
    "inquiry.title": "Contact us",
    "inquiry.description":
      "For feedback, requests, or bug reports not tied to a specific cafe.",
    "inquiry.placeholder": "Enter your message",
    "inquiry.submitting": "Sending…",
    "inquiry.submit": "Send",
    "inquiry.done": "Sent. Thank you!",
    "inquiry.error": "Failed to send",
    "inquiry.close": "× Close",

    "attribution.button": "i",
    "attribution.title": "About this site",
    "attribution.close": "× Close",
  },
} as const;

export type TranslationKey = keyof (typeof dictionary)["ja"];

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LangContext = createContext<LangContextValue>({
  lang: "ja",
  setLang: () => {},
  t: (key) => dictionary.ja[key],
});

// ページ読み込みのたびに日本語に戻る(永続化なし)。サーバー側では
// window/localStorageが使えないため、永続化しようとすると初回表示時に
// サーバーとクライアントの表示内容が食い違うハイドレーションの問題が
// 起きやすい。軽量版としてはシンプルさを優先し、切り替えは毎回セッション
// 内のみ有効とする
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ja");

  const t = (key: TranslationKey) => dictionary[lang][key] ?? dictionary.ja[key];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
