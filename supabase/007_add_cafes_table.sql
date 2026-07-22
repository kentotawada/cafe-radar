-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでこのテーブルも含まれます）

-- ユーザーが「お店を追加」機能で登録した店舗。最初から入っている15店舗
-- （src/data/cafes.ts）とは別に、こちらはユーザー投稿分だけを保存する。
create table if not exists cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  reporter_id text,
  created_at timestamptz not null default now()
);

alter table cafes enable row level security;

create policy "Anyone can read cafes"
  on cafes for select
  using (true);

create policy "Anyone can insert cafes"
  on cafes for insert
  with check (true);

alter publication supabase_realtime add table cafes;
