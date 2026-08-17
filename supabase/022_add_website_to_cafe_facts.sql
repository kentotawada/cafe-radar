-- お店の公式サイトを、利用者にも教えてもらえるようにする。
--
-- 編集部調べのデータには、公式サイトが確実に分かるチェーン18社ぶんしか
-- 入っていない(推測でURLを書かない方針のため)。個人店は行った人が
-- レシートや店内の掲示で知っていることが多いので、そこから集める。
alter table cafe_facts add column if not exists website text;

-- cafe_facts には「中身が空の行を作らせない」check制約がある。
-- 内容の列を増やしたら、この条件にも足さないと新しい報告が弾かれる。
-- (019 で outlet_usable を足したときに、これを忘れて実際に弾かれた)
alter table cafe_facts drop constraint if exists cafe_facts_has_content;
alter table cafe_facts add constraint cafe_facts_has_content check (
  note is not null
  or seat_count is not null
  or outlet_seat_count is not null
  or wifi_speed is not null
  or web_meeting_ok is not null
  or outlet_usable is not null
  or website is not null
);
