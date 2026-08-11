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
