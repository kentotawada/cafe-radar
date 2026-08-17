"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getReporterId } from "@/lib/reporterId";
import { emitReportSubmitted } from "@/lib/reportEvents";
import type { CafeReview } from "@/lib/types";

export const PHOTO_BUCKET = "cafe-photos";

/** 1辺の最大。これ以上大きくても画面では見えないうえ、通信量だけ増える */
const MAX_EDGE = 1280;
/** 送る前の大きさの上限。画面側で縮めるのでまず超えないが、保険 */
const MAX_BYTES = 3 * 1024 * 1024;

export function photoUrl(path: string): string | null {
  if (!supabase) return null;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * 写真を送れる大きさに縮める。
 *
 * 今のスマホの写真はそのままだと1枚3〜8MBある。表示に必要な大きさまで
 * 縮めてから送る。
 *
 * canvas に描き直すので、元の写真に付いている撮影情報(Exif)は落ちる。
 * そこには撮影場所の緯度経度が入っていることがあり、そのまま公開すると
 * 投稿した人の行動が残ってしまう。落ちるのは都合がよい。
 */
async function shrink(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas を用意できませんでした");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8)
  );
  if (!blob) throw new Error("画像を変換できませんでした");
  return blob;
}

export type CafeReviewsApi = {
  reviews: CafeReview[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  /** 自分が送った投稿。送った直後に「ありがとうございます」を出すのに使う */
  myIds: Set<string>;
  reportedIds: Set<string>;
  submit: (input: { body: string; photo: File | null }) => Promise<boolean>;
  report: (reviewId: string) => Promise<void>;
};

export function useCafeReviews(cafeId: string): CafeReviewsApi {
  const [reviews, setReviews] = useState<CafeReview[]>([]);
  // Supabase が設定されていなければ読みに行かないので、最初から読み込み中にしない
  const [loading, setLoading] = useState(() => supabase != null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myIds, setMyIds] = useState<Set<string>>(new Set());
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    const client = supabase;
    if (!client) return;
    (async () => {
      const { data, error: err } = await client
        .from("cafe_reviews")
        .select("*")
        .eq("cafe_id", cafeId)
        .order("created_at", { ascending: false });
      if (!alive) return;
      setLoading(false);
      if (err) return;
      setReviews((data as CafeReview[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, [cafeId]);

  const submit = useCallback(
    async ({ body, photo }: { body: string; photo: File | null }) => {
      const client = supabase;
      if (!client) return false;
      const text = body.trim();
      if (text === "" && !photo) return false;

      setSubmitting(true);
      setError(null);
      const reporterId = getReporterId();

      let photoPath: string | null = null;
      if (photo) {
        try {
          const blob = await shrink(photo);
          if (blob.size > MAX_BYTES) throw new Error("写真が大きすぎます");
          photoPath = `${cafeId}/${crypto.randomUUID()}.jpg`;
          const { error: upErr } = await client.storage
            .from(PHOTO_BUCKET)
            .upload(photoPath, blob, { contentType: "image/jpeg" });
          if (upErr) throw upErr;
        } catch (e) {
          setSubmitting(false);
          setError(e instanceof Error ? e.message : "写真を送れませんでした");
          return false;
        }
      }

      const row = {
        cafe_id: cafeId,
        reporter_id: reporterId,
        body: text === "" ? null : text,
        photo_path: photoPath,
      };
      const { data, error: err } = await client
        .from("cafe_reviews")
        .insert(row)
        .select()
        .single();
      setSubmitting(false);
      if (err || !data) {
        setError(err?.message ?? "送れませんでした");
        return false;
      }
      const saved = data as CafeReview;
      setReviews((prev) => [saved, ...prev]);
      setMyIds((prev) => new Set(prev).add(saved.id));
      emitReportSubmitted();
      return true;
    },
    [cafeId]
  );

  const report = useCallback(async (reviewId: string) => {
    const client = supabase;
    if (!client) return;
    // 同じ人が二度押しても1件。既にあるという返りは失敗として扱わない
    await client
      .from("cafe_review_reports")
      .insert({ review_id: reviewId, reporter_id: getReporterId() });
    setReportedIds((prev) => new Set(prev).add(reviewId));
  }, []);

  return { reviews, loading, submitting, error, myIds, reportedIds, submit, report };
}
