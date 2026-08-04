-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
--
-- 広告主(2種類目のログイン可能ユーザー)を追加する前に、既存の
-- 「auth.role() = 'authenticated'」= 管理者判定を廃止する。これまでは
-- ログインできるのが管理者1人だけだったので安全だったが、広告主も
-- ログインできるようになると、そのままでは広告主が他店舗データの削除等
-- 管理者と同じ権限を持ってしまう。app_metadata.is_admin フラグで判定する
-- is_admin() 関数に置き換える。

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  );
$$;

-- 既存の管理者アカウントに is_admin フラグを付与する。
-- xxxxx@example.com を実際の管理者ログインメールアドレスに書き換えてから実行してください。
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
where email = 'xxxxx@example.com';

-- cafes / cafe_flags / reports / cafe_facts (009で追加した削除ポリシー)
drop policy if exists "Authenticated users can delete cafes" on cafes;
create policy "Authenticated users can delete cafes"
  on cafes for delete
  using (is_admin());

drop policy if exists "Authenticated users can delete cafe_flags" on cafe_flags;
create policy "Authenticated users can delete cafe_flags"
  on cafe_flags for delete
  using (is_admin());

drop policy if exists "Authenticated users can delete reports" on reports;
create policy "Authenticated users can delete reports"
  on reports for delete
  using (is_admin());

drop policy if exists "Authenticated users can delete cafe_facts" on cafe_facts;
create policy "Authenticated users can delete cafe_facts"
  on cafe_facts for delete
  using (is_admin());

-- outlet_verifications (012)
drop policy if exists "Authenticated users can insert outlet_verifications" on outlet_verifications;
create policy "Authenticated users can insert outlet_verifications"
  on outlet_verifications for insert
  with check (is_admin());

drop policy if exists "Authenticated users can delete outlet_verifications" on outlet_verifications;
create policy "Authenticated users can delete outlet_verifications"
  on outlet_verifications for delete
  using (is_admin());

-- info_corrections / inquiries (013)
drop policy if exists "Authenticated users can read info_corrections" on info_corrections;
create policy "Authenticated users can read info_corrections"
  on info_corrections for select
  using (is_admin());

drop policy if exists "Authenticated users can delete info_corrections" on info_corrections;
create policy "Authenticated users can delete info_corrections"
  on info_corrections for delete
  using (is_admin());

drop policy if exists "Authenticated users can read inquiries" on inquiries;
create policy "Authenticated users can read inquiries"
  on inquiries for select
  using (is_admin());

drop policy if exists "Authenticated users can delete inquiries" on inquiries;
create policy "Authenticated users can delete inquiries"
  on inquiries for delete
  using (is_admin());
