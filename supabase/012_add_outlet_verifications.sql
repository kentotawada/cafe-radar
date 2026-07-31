-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
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

-- 承認(追加)・取り消し(削除)は管理者(Supabase Authでログインした人)だけ
create policy "Authenticated users can insert outlet_verifications"
  on outlet_verifications for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can delete outlet_verifications"
  on outlet_verifications for delete
  using (auth.role() = 'authenticated');

alter publication supabase_realtime add table outlet_verifications;
