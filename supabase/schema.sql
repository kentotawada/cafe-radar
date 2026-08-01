-- Supabaseのプロジェクトを作成後、SQL Editorでこの内容を実行してください。

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text,
  outlet_occupancy text not null default 'empty'
    check (outlet_occupancy in ('empty', 'sparse', 'moderate', 'full')),
  seating_occupancy text not null default 'empty'
    check (seating_occupancy in ('empty', 'sparse', 'moderate', 'full')),
  noise_level text not null check (noise_level in ('quiet', 'normal', 'noisy', 'loud')),
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
  outlet_seat_count integer,
  -- Wi-Fiの速度・WEB会議可否は編集部調べのデータが無いため、
  -- みんなの投稿で少しずつ集めていく新項目
  wifi_speed text check (wifi_speed in ('fast', 'standard', 'restricted', 'none')),
  web_meeting_ok boolean,
  created_at timestamptz not null default now(),
  constraint cafe_facts_has_content check (
    note is not null
    or seat_count is not null
    or outlet_seat_count is not null
    or wifi_speed is not null
    or web_meeting_ok is not null
  )
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

-- 「電源情報が未確認のお店」にユーザーから電源席の報告があった時、
-- 管理者が内容を確認して承認したら、そのお店のピンにも電源プラグの
-- マークが付くようにするための承認テーブル。
create table if not exists outlet_verifications (
  cafe_id text primary key,
  created_at timestamptz not null default now()
);

alter table outlet_verifications enable row level security;

create policy "Anyone can read outlet_verifications"
  on outlet_verifications for select
  using (true);

create policy "Authenticated users can insert outlet_verifications"
  on outlet_verifications for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete outlet_verifications"
  on outlet_verifications for delete
  using (auth.role() = 'authenticated');

alter publication supabase_realtime add table outlet_verifications;

-- (1) 店舗情報(喫煙・電源・Wi-Fi等)が実際と違う場合の指摘報告
-- (2) 店舗に紐づかない、アプリ全体へのお問い合わせ
create table if not exists info_corrections (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists info_corrections_cafe_id_idx
  on info_corrections (cafe_id, created_at desc);

alter table info_corrections enable row level security;

create policy "Authenticated users can read info_corrections"
  on info_corrections for select
  using (auth.role() = 'authenticated');

create policy "Anyone can insert info_corrections"
  on info_corrections for insert
  with check (true);

create policy "Authenticated users can delete info_corrections"
  on info_corrections for delete
  using (auth.role() = 'authenticated');

alter publication supabase_realtime add table info_corrections;

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  reporter_id text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table inquiries enable row level security;

create policy "Authenticated users can read inquiries"
  on inquiries for select
  using (auth.role() = 'authenticated');

create policy "Anyone can insert inquiries"
  on inquiries for insert
  with check (true);

create policy "Authenticated users can delete inquiries"
  on inquiries for delete
  using (auth.role() = 'authenticated');

alter publication supabase_realtime add table inquiries;
