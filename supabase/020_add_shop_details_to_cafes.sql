-- 「お店を追加」で、店名と住所のほかに設備も入れられるようにする。
--
-- これまでは name / address / lat / lng だけだったので、利用者が追加した店は
-- 電源もWi-Fiも分からないまま地図に載っていた。編集部調べの店と同じ項目を
-- 持てるようにして、追加した人がその場で分かることを書けるようにする。
--
-- 列名は Cafe 型の outletInfo などと対応させる(snake_case ↔ camelCase)。
alter table cafes add column if not exists outlet_info text;
alter table cafes add column if not exists wifi_info text;
alter table cafes add column if not exists smoking_info text;
alter table cafes add column if not exists seat_count_info text;
alter table cafes add column if not exists hours_info text;

-- 公式サイト。メニューや写真を見たいときに、店の一次情報へ直接行けるようにする。
-- 編集部調べの店にも同じ項目を用意するが、確認できた店だけ入れる。
alter table cafes add column if not exists website text;
