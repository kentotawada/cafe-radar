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

/** 店名と住所で場所を探して place ID を得る。見つからなければ null */
async function findPlaceId(cafe: {
  name: string;
  address?: string | null;
  lat: number;
  lng: number;
}): Promise<string | null> {
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
    return null;
  }
  const json = (await res.json()) as { places?: { id?: string }[] };
  const id = json.places?.[0]?.id ?? null;
  if (!id) lastError = "searchText: 一致する場所が見つからなかった";
  return id;
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

  // 覚えている place ID を先に見る
  let placeId: string | null = null;
  let known = false;
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from("cafe_places")
      .select("place_id")
      .eq("cafe_id", cafeId)
      .maybeSingle();
    if (data) {
      known = true;
      placeId = (data as { place_id: string | null }).place_id;
    }
  }

  if (!known) {
    placeId = await findPlaceId(cafe);
    // 見つからなかった場合も行を作る。作らないと、開かれるたびに
    // 探しにいって料金だけかかる
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      await supabaseAdmin
        .from("cafe_places")
        .upsert({ cafe_id: cafeId, place_id: placeId }, { onConflict: "cafe_id" });
    }
  }

  if (!placeId) return answer(null, "Google 側でこの店の場所を特定できなかった");

  const hours = await fetchHours(placeId);
  return answer(hours, hours ? "ok" : "営業時間を取得できなかった");
}
