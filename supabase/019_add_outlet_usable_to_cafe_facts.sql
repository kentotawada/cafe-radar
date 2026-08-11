-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
--
-- r/Tokyo の投稿に寄せられた指摘がきっかけの追加。
-- 「根岸のガストは電源に全部テープが貼られている」という報告があったが、
-- アプリ側にそれを記録する手段が無かった。
--
-- 既存の outlet_occupancy は「電源席がどれくらい埋まっているか」であって、
-- 「電源そのものが使えるか」ではない。編集部調べのoutletInfoも各店舗の
-- 公表情報なので、塞がれた・故障しているといった現地の状態は拾えない。
--
-- web_meeting_ok と同じ形(booleanの多数決)で持たせる。
-- true = 使えた / false = あるはずだが使えなかった / null = 報告なし

alter table cafe_facts add column if not exists outlet_usable boolean;

-- cafe_facts には「中身が空の行を作らせない」check制約があり、内容の列を
-- 増やすたびに条件へ足す必要がある(011・014でも同じことをしている)。
-- これを忘れると、outlet_usableだけを入れた行が
-- 「violates check constraint "cafe_facts_has_content"」で弾かれる
alter table cafe_facts drop constraint if exists cafe_facts_has_content;
alter table cafe_facts add constraint cafe_facts_has_content check (
  note is not null
  or seat_count is not null
  or outlet_seat_count is not null
  or wifi_speed is not null
  or web_meeting_ok is not null
  or outlet_usable is not null
);
