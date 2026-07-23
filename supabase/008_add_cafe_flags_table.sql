-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでこのテーブルも含まれます）

-- ユーザーが追加した店舗が「存在しない／場所が違う」と報告された回数を記録する。
-- 一定数の異なる人から報告されたら、地図から自動的に非表示にする。
create table if not exists cafe_flags (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text,
  created_at timestamptz not null default now()
);

create index if not exists cafe_flags_cafe_id_idx
  on cafe_flags (cafe_id);

alter table cafe_flags enable row level security;

create policy "Anyone can read cafe_flags"
  on cafe_flags for select
  using (true);

create policy "Anyone can insert cafe_flags"
  on cafe_flags for insert
  with check (true);

alter publication supabase_realtime add table cafe_flags;
