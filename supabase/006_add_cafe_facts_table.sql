-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでこのテーブルも含まれます）

-- 電源席の場所やだいたいの座席数など、「時間が経っても変わらない情報」を
-- reports（30分で消える混雑度の報告）とは別に、ずっと残る場所に保存する。
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

-- reportsのnoteカラムはcafe_factsに置き換わったため、もう使わない
alter table reports drop column if exists note;
