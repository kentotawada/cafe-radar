-- Supabaseのプロジェクトを作成後、SQL Editorでこの内容を実行してください。

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text,
  outlet_occupancy text not null default 'empty'
    check (outlet_occupancy in ('empty', 'moderate', 'full')),
  seating_occupancy text not null default 'empty'
    check (seating_occupancy in ('empty', 'moderate', 'full')),
  noise_level text not null check (noise_level in ('quiet', 'normal', 'loud')),
  created_at timestamptz not null default now()
);

create index if not exists reports_cafe_id_created_at_idx
  on reports (cafe_id, created_at desc);

-- 匿名ユーザーでも読み書きできるようにする（MVPの間はシンプルに）
alter table reports enable row level security;

create policy "Anyone can read reports"
  on reports for select
  using (true);

create policy "Anyone can insert reports"
  on reports for insert
  with check (true);

-- リアルタイム更新（INSERTをフロントに即時反映）を有効化
alter publication supabase_realtime add table reports;

-- 電源席の場所やだいたいの座席数など、時間が経っても変わらない情報。
-- reports（30分だけ有効な混雑度の報告）とは違い、ずっと残す。
create table if not exists cafe_facts (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text,
  note text,
  seat_count integer,
  created_at timestamptz not null default now(),
  constraint cafe_facts_has_content check (note is not null or seat_count is not null)
);

create index if not exists cafe_facts_cafe_id_idx
  on cafe_facts (cafe_id, created_at desc);

alter table cafe_facts enable row level security;

create policy "Anyone can read cafe_facts"
  on cafe_facts for select
  using (true);

create policy "Anyone can insert cafe_facts"
  on cafe_facts for insert
  with check (true);

alter publication supabase_realtime add table cafe_facts;

-- ユーザーが「お店を追加」機能で登録した店舗
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

-- ユーザーが追加した店舗が「存在しない／場所が違う」と報告された回数を記録する
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

-- 管理ページからの削除は、Supabase Authでログインした人だけができるようにする。
-- このアプリには他にログイン機能がないため、事実上「ログインできる=あなただけ」になる。
create policy "Authenticated users can delete cafes"
  on cafes for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete cafe_flags"
  on cafe_flags for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete reports"
  on reports for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete cafe_facts"
  on cafe_facts for delete
  using (auth.role() = 'authenticated');
