-- Supabaseのプロジェクトを作成後、SQL Editorでこの内容を実行してください。

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text,
  outlet_available boolean not null,
  seating_available boolean not null default true,
  noise_level text not null check (noise_level in ('quiet', 'normal', 'loud')),
  note text,
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
