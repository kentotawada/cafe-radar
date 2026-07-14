-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- outlet_occupancy/seating_occupancyに置き換わったため、
-- 使われなくなった古いNOT NULLカラムを削除します（このままだと保存時にエラーになります）。

alter table reports drop column if exists outlet_available;
alter table reports drop column if exists seating_available;
