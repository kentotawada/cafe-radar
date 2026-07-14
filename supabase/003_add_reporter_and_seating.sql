-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでこれらのカラムも含まれます）

alter table reports add column if not exists reporter_id text;
alter table reports add column if not exists seating_available boolean not null default true;
