-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- 広告主(直販広告の出稿者)アカウントと、掲載クリエイティブを管理するテーブル。
-- 016で追加した is_admin() を使って権限を分離する。

-- 広告主。カフェオーナー(自店舗の掲載促進)・第三者企業(バナー出稿)の
-- どちらにも対応できるよう type で区別する(MVPの実装フローはどちらか一方でよい)。
create table if not exists advertisers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  name text not null,
  type text not null check (type in ('cafe_owner', 'business')),
  -- 静的データのカフェも含めるため、cafesテーブルへの外部キーにはせず
  -- reports.cafe_id等と同じ text の店舗識別子として扱う(type='cafe_owner'の時だけ使う)
  cafe_id text,
  contact_email text not null,
  status text not null default 'invited' check (status in ('invited', 'active', 'suspended')),
  created_at timestamptz not null default now()
);

alter table advertisers enable row level security;

create policy "Admins can read advertisers"
  on advertisers for select
  using (is_admin());

create policy "Advertisers can read own row"
  on advertisers for select
  using (auth.uid() = user_id);

create policy "Admins can insert advertisers"
  on advertisers for insert
  with check (is_admin());

create policy "Admins can update advertisers"
  on advertisers for update
  using (is_admin());

create policy "Admins can delete advertisers"
  on advertisers for delete
  using (is_admin());

-- 掲載クリエイティブ。差し替えは新規行のpending投稿として扱い、
-- 表示側は「status='approved'かつ期間内のものの中で最新1件」を選ぶ。
create table if not exists ad_creatives (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references advertisers (id) on delete cascade,
  slot text not null default 'banner' check (slot in ('banner')),
  image_url text not null,
  link_url text not null,
  alt_text text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ad_creatives_advertiser_id_idx
  on ad_creatives (advertiser_id, created_at desc);

-- 配信ロジック(承認済み・期間内・最新)が使う検索を高速化
create index if not exists ad_creatives_active_lookup_idx
  on ad_creatives (slot, status, updated_at desc);

alter table ad_creatives enable row level security;

-- 掲載中の広告はサイト訪問者全員が読める必要がある(AdBannerからの配信用)
create policy "Anyone can read approved ad_creatives"
  on ad_creatives for select
  using (status = 'approved');

create policy "Advertisers can read own ad_creatives"
  on ad_creatives for select
  using (
    advertiser_id in (select id from advertisers where user_id = auth.uid())
  );

create policy "Admins can read all ad_creatives"
  on ad_creatives for select
  using (is_admin());

create policy "Advertisers can insert own ad_creatives"
  on ad_creatives for insert
  with check (
    status = 'pending'
    and advertiser_id in (select id from advertisers where user_id = auth.uid())
  );

-- 承認・却下(statusの変更)は管理者だけ
create policy "Admins can update ad_creatives"
  on ad_creatives for update
  using (is_admin());

create policy "Admins can delete ad_creatives"
  on ad_creatives for delete
  using (is_admin());

-- moddatetime拡張(updated_atの自動更新に使用)
create extension if not exists moddatetime schema extensions;

create trigger ad_creatives_set_updated_at
  before update on ad_creatives
  for each row
  execute function extensions.moddatetime(updated_at);

-- クリエイティブ画像のアップロード先。読み取りは公開、書き込みは
-- 自分のuser_idフォルダ配下(advertiser/{user_id}/...)だけに制限する。
insert into storage.buckets (id, name, public)
values ('ad-creatives', 'ad-creatives', true)
on conflict (id) do nothing;

create policy "Anyone can view ad-creatives files"
  on storage.objects for select
  using (bucket_id = 'ad-creatives');

create policy "Advertisers can upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'ad-creatives'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Advertisers can update own folder"
  on storage.objects for update
  using (
    bucket_id = 'ad-creatives'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
