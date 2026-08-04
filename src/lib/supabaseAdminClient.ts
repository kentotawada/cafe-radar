import { createClient } from "@supabase/supabase-js";

// service role keyを使うサーバー専用クライアント。RLSを無視できるため、
// クライアントコンポーネントから絶対にimportしないこと(API Route内でのみ使う)。
// SUPABASE_SERVICE_ROLE_KEYはNEXT_PUBLIC_接頭辞を付けていないため、
// 誤ってクライアントバンドルに含めてもundefinedになるだけで値は漏れない
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
