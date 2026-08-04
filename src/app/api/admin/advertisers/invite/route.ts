import { NextRequest, NextResponse } from "next/server";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabaseAdminClient";
import type { AdvertiserType } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type InviteRequestBody = {
  name?: string;
  type?: AdvertiserType;
  cafeId?: string | null;
  contactEmail?: string;
};

// 管理画面の「広告主を追加」から呼ばれる。管理者本人であることを
// アクセストークンで確認した上で、service role keyでのみ可能な
// 招待メール送信(inviteUserByEmail)とadvertisers行の作成を行う
export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "サーバー側のSupabase設定(SUPABASE_SERVICE_ROLE_KEY)が未設定です" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!accessToken) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  const isAdmin = userData?.user?.app_metadata?.is_admin === true;
  if (userError || !isAdmin) {
    return NextResponse.json({ error: "管理者権限がありません" }, { status: 403 });
  }

  const body: InviteRequestBody = await request.json();
  const name = body.name?.trim();
  const type = body.type;
  const contactEmail = body.contactEmail?.trim();
  const cafeId = body.cafeId?.trim() || null;

  if (!name || !contactEmail || (type !== "cafe_owner" && type !== "business")) {
    return NextResponse.json({ error: "入力内容を確認してください" }, { status: 400 });
  }

  const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    contactEmail,
    { redirectTo: `${SITE_URL}/advertiser` }
  );
  if (inviteError || !inviteData?.user) {
    return NextResponse.json(
      { error: inviteError?.message ?? "招待メールの送信に失敗しました" },
      { status: 500 }
    );
  }

  const { error: insertError } = await supabaseAdmin.from("advertisers").insert({
    user_id: inviteData.user.id,
    name,
    type,
    cafe_id: cafeId,
    contact_email: contactEmail,
    status: "invited",
  });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
