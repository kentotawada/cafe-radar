-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでこれらのカラムも含まれます）

alter table reports add column if not exists outlet_occupancy text
  check (outlet_occupancy in ('empty', 'moderate', 'full'))
  not null default 'empty';

alter table reports add column if not exists seating_occupancy text
  check (seating_occupancy in ('empty', 'moderate', 'full'))
  not null default 'empty';
