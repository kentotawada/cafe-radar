-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- 「お店全体の座席数」とは別に「電源席の数」も入力できるようにするため、
-- cafe_facts に outlet_seat_count カラムを追加し、
-- note/seat_count/outlet_seat_countのいずれかがあればOKという制約に更新する。

alter table cafe_facts add column if not exists outlet_seat_count integer;

alter table cafe_facts drop constraint if exists cafe_facts_has_content;
alter table cafe_facts add constraint cafe_facts_has_content check (
  note is not null or seat_count is not null or outlet_seat_count is not null
);
