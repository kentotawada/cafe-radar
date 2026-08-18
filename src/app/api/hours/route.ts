import { NextRequest, NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdminClient";
import { lookupCafeById } from "@/lib/lookupCafe";

// 営業時間・定休日を Google の Places API から取ってくる。
//
// なぜサーバー側でやるか:
//   鍵をブラウザに置くと誰でも使えてしまい、料金がこちらに来る。
//
// なぜ保存しないか:
//   Google の規約で、取ってきた内容を溜めておくことは認められていない。
//   例外は place ID だけなので、それだけ cafe_places に置いて使い回す
//   (店名と住所から場所を探す問い合わせも1回ごとに料金がかかるため)。
//
// 鍵が無いときは 200 で空を返す。営業時間が出ないだけで、ページは壊れない。

const KEY = process.env.GOOGLE_PLACES_API_KEY;

type HoursResponse = {
  /** 「月曜日: 7時00分～22時00分」のような7行。定休日は「定休日」と入る */
  weekdayDescriptions: string[];
  /** Google マップのその店のページ。規約で出典への導線が要る */
  googleMapsUri: string | null;
};

// 直前の問い合わせで何が起きたか。?debug=1 のときだけ返す
let lastError: string | null = null;

type FindResult =
  /** 問い合わせは通った。id が null なら「その場所は無い」ということ */
  | { ok: true; id: string | null }
  /** 問い合わせ自体が失敗した。この結果は覚えてはいけない */
  | { ok: false; id: null };

/** 店名と住所で場所を探して place ID を得る */
async function findPlaceId(cafe: {
  name: string;
  address?: string | null;
  lat: number;
  lng: number;
}): Promise<FindResult> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY as string,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({
      textQuery: cafe.address ? `${cafe.name} ${cafe.address}` : cafe.name,
      languageCode: "ja",
      regionCode: "JP",
      maxResultCount: 1,
      // 同じ名前のチェーンが全国にあるので、その座標のまわりに絞る
      locationBias: {
        circle: {
          center: { latitude: cafe.lat, longitude: cafe.lng },
          radius: 200,
        },
      },
    }),
  });
  if (!res.ok) {
    lastError = `searchText ${res.status}: ${(await res.text()).slice(0, 300)}`;
    return { ok: false, id: null };
  }
  const json = (await res.json()) as { places?: { id?: string }[] };
  const id = json.places?.[0]?.id ?? null;
  if (!id) lastError = "searchText: 一致する場所が見つからなかった";
  return { ok: true, id };
}

async function fetchHours(placeId: string): Promise<HoursResponse | null> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=ja`,
    {
      headers: {
        "X-Goog-Api-Key": KEY as string,
        "X-Goog-FieldMask": "regularOpeningHours.weekdayDescriptions,googleMapsUri",
      },
    }
  );
  if (!res.ok) {
    lastError = `placeDetails ${res.status}: ${(await res.text()).slice(0, 300)}`;
    return null;
  }
  const json = (await res.json()) as {
    regularOpeningHours?: { weekdayDescriptions?: string[] };
    googleMapsUri?: string;
  };
  const lines = json.regularOpeningHours?.weekdayDescriptions ?? [];
  if (lines.length === 0) {
    lastError = "placeDetails: この場所に営業時間が登録されていない";
    return null;
  }
  return { weekdayDescriptions: lines, googleMapsUri: json.googleMapsUri ?? null };
}

export async function GET(request: NextRequest) {
  const cafeId = request.nextUrl.searchParams.get("cafeId");
  // ?debug=1 を付けると、どこで止まったかを返す。設定を直すときに、
  // 「出ない」以外の手がかりが無いと調べようがないため
  const debug = request.nextUrl.searchParams.get("debug") === "1";
  const answer = (hours: HoursResponse | null, where: string) =>
    NextResponse.json(debug ? { hours, where, detail: lastError } : { hours });

  lastError = null;
  if (!cafeId) {
    return NextResponse.json({ error: "cafeId が必要です" }, { status: 400 });
  }
  // 鍵が無い環境(手元など)では、何も出さずに終わる
  if (!KEY) return answer(null, "GOOGLE_PLACES_API_KEY が設定されていない");

  const cafe = await lookupCafeById(cafeId);
  if (!cafe) return answer(null, "その cafeId の店が見つからない");

  // ?refresh=1 で、覚えている結果を無視してもう一度探す
  const refresh = request.nextUrl.searchParams.get("refresh") === "1";

  // 覚えている place ID を先に見る
  let placeId: string | null = null;
  let known = false;
  let rememberedAt: string | null = null;
  if (isSupabaseAdminConfigured && supabaseAdmin && !refresh) {
    const { data } = await supabaseAdmin
      .from("cafe_places")
      .select("place_id, resolved_at")
      .eq("cafe_id", cafeId)
      .maybeSingle();
    if (data) {
      const row = data as { place_id: string | null; resolved_at: string };
      placeId = row.place_id;
      rememberedAt = row.resolved_at;
      // 「見つからなかった」という記憶は、ずっと持ち続けない。
      // 店が新しく登録されることもあるし、こちらの設定ミスで見つからな
      // かっただけのこともある。1週間で忘れて、もう一度探す
      const week = 7 * 24 * 60 * 60 * 1000;
      const stale = Date.now() - new Date(row.resolved_at).getTime() > week;
      known = placeId != null || !stale;
    }
  }

  if (!known) {
    const found = await findPlaceId(cafe);
    placeId = found.id;
    // 覚えるのは「問い合わせが通ったとき」だけ。通らなかった結果を覚えると、
    // 鍵の設定ミスのような直せる原因まで覚え込んでしまい、直したあとも
    // ずっと出ないままになる
    if (found.ok && isSupabaseAdminConfigured && supabaseAdmin) {
      await supabaseAdmin.from("cafe_places").upsert(
        { cafe_id: cafeId, place_id: placeId, resolved_at: new Date().toISOString() },
        { onConflict: "cafe_id" }
      );
    }
  } else if (placeId == null) {
    return answer(
      null,
      `以前「見つからない」と分かった店(${rememberedAt ?? "時期不明"})。` +
        "&refresh=1 を付けるともう一度探す"
    );
  }

  if (!placeId) return answer(null, "Google 側でこの店の場所を特定できなかった");

  const hours = await fetchHours(placeId);
  return answer(hours, hours ? "ok" : "営業時間を取得できなかった");
}
