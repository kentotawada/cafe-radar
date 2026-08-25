-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
--
-- 管理画面の「対応が必要な店舗」に、実在を確認しても消せない店が残っていた。
--
-- これまで「確認済み」は「登録した人以外からの報告(reports / cafe_facts)が
-- あるか」だけで判定していた。誰も報告していない店は、実在していても
-- ずっと一覧に残り、押せるボタンが「削除する」しか無かった。
-- 実在するのに消すか、放置するかの二択になっていた。
--
-- 管理者が自分で確認したことを記録できるようにする。

alter table cafes add column if not exists confirmed_at timestamptz;

comment on column cafes.confirmed_at is
  '管理者が実在を確認した日時。入っていれば「対応が必要な店舗」に出さない';

-- 更新できるのは管理者だけ。
-- cafes には「誰でも insert できる」ポリシーしか無かったので、
-- update のポリシーをここで足す(既にあれば作り直す)
drop policy if exists "Admins can update cafes" on cafes;
create policy "Admins can update cafes"
  on cafes for update
  using (is_admin())
  with check (is_admin());
