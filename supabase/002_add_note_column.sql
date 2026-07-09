-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでnoteカラムも含まれます）

alter table reports add column if not exists note text;
