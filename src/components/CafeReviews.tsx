"use client";

import { useState } from "react";
import Image from "next/image";
import { useCafeReviews, photoUrl } from "@/lib/useCafeReviews";

// 口コミと写真。
//
// 詳細ページ(/cafe/[id])に置く。地図のカードは高さが限られていて写真を
// 見るには狭いので、読むのも書くのもこの1か所にまとめる。

const MAX_BODY = 500;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  const day = Math.floor(hour / 24);
  if (day < 31) return `${day}日前`;
  return new Date(iso).toLocaleDateString("ja-JP");
}

export default function CafeReviews({ cafeId }: { cafeId: string }) {
  const {
    reviews,
    loading,
    submitting,
    error,
    myIds,
    reportedIds,
    submit,
    report,
  } = useCafeReviews(cafeId);

  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);

  const pickPhoto = (file: File | null) => {
    setPhoto(file);
    // 前に選んだぶんの見本を片付けてから作り直す
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const canSend = !submitting && (body.trim() !== "" || photo != null);

  const send = async () => {
    if (!canSend) return;
    const ok = await submit({ body, photo });
    if (!ok) return;
    setBody("");
    pickPhoto(null);
    setDone(true);
    setOpen(false);
  };

  // 写真は管理画面で確認してから公開する。自分が送ったものは
  // 「確認待ち」と分かるように出す(送れたのか不安にさせないため)
  const shown = reviews.filter((r) => !r.hidden);

  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        💬 みんなの口コミ・写真
        <span className="text-sm font-normal text-gray-500">{shown.length}件</span>
      </h2>

      {done && (
        <p className="text-sm bg-green-50 border border-green-200 text-green-800 rounded-lg px-3 py-2">
          ありがとうございます。投稿しました。
          <br />
          <span className="text-green-700">
            写真は内容を確認してから表示されます（少しお時間をいただきます）。
          </span>
        </p>
      )}

      {/* 書く側 */}
      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setDone(false);
          }}
          className="rounded-lg bg-blue-600 text-white font-bold py-2.5 text-sm"
        >
          ＋ 口コミ・写真を投稿する
        </button>
      ) : (
        <div className="flex flex-col gap-2 border border-blue-200 bg-blue-50 rounded-lg p-3">
          <label className="text-sm font-bold text-gray-800" htmlFor="review-body">
            この店の様子（自由に書けます）
          </label>
          <textarea
            id="review-body"
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY))}
            rows={4}
            placeholder="例: 奥のソファ席にコンセントがあって落ち着けました。平日の昼は少し混みます。"
            className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-gray-900"
          />
          <div className="text-right text-xs text-gray-500">
            {body.length} / {MAX_BODY}
          </div>

          <label className="text-sm font-bold text-gray-800" htmlFor="review-photo">
            写真（任意・1枚）
          </label>
          <input
            id="review-photo"
            type="file"
            accept="image/*"
            onChange={(e) => pickPhoto(e.target.files?.[0] ?? null)}
            className="text-sm text-gray-800"
          />
          {preview && (
            // 選んだ写真の見本。まだ送っていないので、端末の中の画像を直接出す。
            // next/image は端末内の一時的なURLを扱えないため、ここは img を使う
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="選んだ写真"
              className="w-full max-h-56 object-contain rounded border border-gray-300 bg-white"
            />
          )}

          <p className="text-xs text-gray-600 leading-relaxed">
            ほかのお客さんの顔が写っているもの、他のサイトから持ってきたもの、
            店内が撮影禁止のものは投稿しないでください。
            <br />
            写真の撮影場所などの記録は、送るときに自動で取り除いています。
          </p>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={send}
              disabled={!canSend}
              className="flex-1 rounded-lg bg-blue-600 text-white font-bold py-2 text-sm disabled:opacity-50"
            >
              {submitting ? "送信中…" : "投稿する"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                pickPhoto(null);
              }}
              className="rounded-lg border border-gray-300 bg-white text-gray-700 px-4 py-2 text-sm"
            >
              やめる
            </button>
          </div>
        </div>
      )}

      {/* 読む側 */}
      {loading ? (
        <p className="text-sm text-gray-500">読み込んでいます…</p>
      ) : shown.length === 0 ? (
        <p className="text-sm text-gray-500">
          まだ口コミがありません。最初の一人になってみませんか。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((r) => {
            const url = r.photo_path ? photoUrl(r.photo_path) : null;
            const mine = myIds.has(r.id);
            return (
              <li
                key={r.id}
                className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{timeAgo(r.created_at)}</span>
                  {mine && (
                    <span className="text-blue-700 font-bold">あなたの投稿</span>
                  )}
                </div>

                {r.body && (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {r.body}
                  </p>
                )}

                {r.photo_path &&
                  (r.photo_approved && url ? (
                    <Image
                      src={url}
                      alt="お店の写真"
                      width={640}
                      height={480}
                      unoptimized
                      className="w-full h-auto rounded border border-gray-200"
                    />
                  ) : (
                    <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1.5">
                      📷 写真は確認中です
                    </p>
                  ))}

                {!mine && (
                  <div className="text-right">
                    {reportedIds.has(r.id) ? (
                      <span className="text-xs text-gray-500">通報しました</span>
                    ) : (
                      <button
                        onClick={() => report(r.id)}
                        className="text-xs text-gray-500 underline"
                      >
                        通報する
                      </button>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
