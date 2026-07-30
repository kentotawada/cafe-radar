-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- 混雑度・騒がしさをそれぞれ3択から4択にするため、CHECK制約に
-- 新しい選択肢(sparse=やや空いている、noisy=ややうるさい)を追加する。
-- 制約名を決め打ちせず、reports テーブルの該当カラムに付いている
-- 既存のCHECK制約を動的に探して削除してから、新しい制約を追加する。

do $$
declare
  con record;
begin
  for con in
    select conname
    from pg_constraint
    where conrelid = 'reports'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%outlet_occupancy%'
  loop
    execute format('alter table reports drop constraint %I', con.conname);
  end loop;

  for con in
    select conname
    from pg_constraint
    where conrelid = 'reports'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%seating_occupancy%'
  loop
    execute format('alter table reports drop constraint %I', con.conname);
  end loop;

  for con in
    select conname
    from pg_constraint
    where conrelid = 'reports'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%noise_level%'
  loop
    execute format('alter table reports drop constraint %I', con.conname);
  end loop;
end $$;

alter table reports add constraint reports_outlet_occupancy_check
  check (outlet_occupancy in ('empty', 'sparse', 'moderate', 'full'));

alter table reports add constraint reports_seating_occupancy_check
  check (seating_occupancy in ('empty', 'sparse', 'moderate', 'full'));

alter table reports add constraint reports_noise_level_check
  check (noise_level in ('quiet', 'normal', 'noisy', 'loud'));
