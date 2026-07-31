-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- (1) 店舗情報(喫煙・電源・Wi-Fi等)が実際と違う場合の指摘報告
-- (2) 店舗に紐づかない、アプリ全体へのお問い合わせ
-- の2つを管理者が確認できるようにする。

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

-- 一覧は管理者だけが見られるようにする(投稿内容に個人の指摘が含まれるため)
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
