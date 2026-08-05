-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
--
-- 招待された広告主がパスワードを設定できるようにするための追加。
-- inviteUserByEmailで作られたアカウントはパスワード未設定の状態で、
-- 招待リンクの一時セッションが切れると二度とログインできなくなっていた。
--
-- パスワード自体はSupabase Auth側(auth.updateUser)で設定するが、
-- 「設定が済んだかどうか」はadvertisers.statusで持つ。
-- 017では更新がis_admin()限定なので、広告主本人が自分の行を
-- invited -> active にできない。RLSは列単位の制限ができず、
-- updateを許すとname/type/cafe_idまで書き換えられてしまうため、
-- 016のis_admin()と同じsecurity definer関数として公開する。
-- この関数は「呼び出し本人の、invited状態の行のstatusだけ」を書き換える。

create or replace function public.activate_own_advertiser()
returns void
language sql
security definer
set search_path = public
as $$
  update advertisers
  set status = 'active'
  where user_id = auth.uid()
    and status = 'invited';
$$;

-- 匿名ユーザーには不要(ログイン済みの広告主本人しか使わない)
revoke all on function public.activate_own_advertiser() from public, anon;
grant execute on function public.activate_own_advertiser() to authenticated;
