-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
--
-- 元は 014 という番号だったが、014_add_contact_fields_to_inquiries.sql と
-- 番号が重複していたため、こちらが未適用のまま見落とされていた。
-- (症状: Wi-Fi速度・WEB会議の投稿が
--  「column "wifi_speed" does not exist」で失敗する)
-- 番号は今後も重複させないこと。
--
-- 「Wi-Fiの速度」「WEB会議・通話をしても問題ないか」は編集部調べのデータが
-- 無いため、みんなの投稿で少しずつ集めていく新項目として cafe_facts に追加する。
-- note/seat_count/outlet_seat_count/wifi_speed/web_meeting_okの
-- いずれかがあればOKという制約に更新する。

alter table cafe_facts add column if not exists wifi_speed text
  check (wifi_speed in ('fast', 'standard', 'restricted', 'none'));
alter table cafe_facts add column if not exists web_meeting_ok boolean;

alter table cafe_facts drop constraint if exists cafe_facts_has_content;
alter table cafe_facts add constraint cafe_facts_has_content check (
  note is not null
  or seat_count is not null
  or outlet_seat_count is not null
  or wifi_speed is not null
  or web_meeting_ok is not null
);
