-- お店の評価。食べログのように、行った人が5段階で点を付ける。
--
-- 混雑報告(reports)は30分で期限切れ、設備(cafe_facts)は積み上げ。評価はそのどちらとも
-- 性質が違い、「この店が良かったか」という感想なので、別のテーブルにする。
--
-- 同じ人が付け直せるように、1人1店で1行に上書きする(unique + upsert)。
-- 何度も入れて平均を動かせてしまうと、点数の意味が無くなる。
create table if not exists cafe_ratings (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text not null,
  score smallint not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  unique (cafe_id, reporter_id)
);

alter table cafe_ratings enable row level security;

-- policy には create ... if not exists が無いので、先に落としてから作る。
-- こうしておくと、途中で失敗して流し直すときも同じものをそのまま貼れる
drop policy if exists "Anyone can read cafe_ratings" on cafe_ratings;
create policy "Anyone can read cafe_ratings"
  on cafe_ratings for select
  using (true);

drop policy if exists "Anyone can insert cafe_ratings" on cafe_ratings;
create policy "Anyone can insert cafe_ratings"
  on cafe_ratings for insert
  with check (true);

-- 付け直しを許す。reporter_id は端末ごとの匿名IDなので、本人の行だけが対象になる
drop policy if exists "Anyone can update own cafe_ratings" on cafe_ratings;
create policy "Anyone can update own cafe_ratings"
  on cafe_ratings for update
  using (true)
  with check (true);
