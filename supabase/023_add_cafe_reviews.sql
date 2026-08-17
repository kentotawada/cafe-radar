-- 口コミと写真。
--
-- これまで集めていたのは「電源席が何席か」「今混んでいるか」のような、
-- 選択肢で答えられることだけだった。行った人が書きたいことはそれだけでは
-- なく、「奥のソファ席が落ち着く」「昼は行列」のような文章と、店内の写真が
-- いちばん伝わる。
--
-- 文章はすぐ公開する。写真は管理画面で見てから公開する。
-- このサイトは広告を載せている公開サイトで、著作権・他のお客さんの写り込み・
-- 店の撮影禁止といった問題を後から追いかけるのは現実的でないため。
create table if not exists cafe_reviews (
  id uuid primary key default gen_random_uuid(),
  cafe_id text not null,
  reporter_id text not null,
  body text,
  -- storage の cafe-photos バケット内のパス
  photo_path text,
  -- 写真を公開してよいか。管理画面で立てる
  photo_approved boolean not null default false,
  -- 管理者が伏せた投稿。消さずに残すのは、同じ人の繰り返しを見るため
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  -- 文章も写真も無い投稿は作らせない
  constraint cafe_reviews_has_content check (
    (body is not null and btrim(body) <> '') or photo_path is not null
  )
);

create index if not exists cafe_reviews_cafe_id_idx
  on cafe_reviews (cafe_id, created_at desc);

alter table cafe_reviews enable row level security;

-- 伏せられていない投稿は誰でも読める。写真を出すかどうかは photo_approved を見て
-- 画面側が決める
drop policy if exists "Anyone can read cafe_reviews" on cafe_reviews;
create policy "Anyone can read cafe_reviews"
  on cafe_reviews for select
  using (hidden = false);

-- 投稿は誰でもできるが、自分で「公開済み」にはできない
drop policy if exists "Anyone can insert cafe_reviews" on cafe_reviews;
create policy "Anyone can insert cafe_reviews"
  on cafe_reviews for insert
  with check (photo_approved = false and hidden = false);

drop policy if exists "Admins can read all cafe_reviews" on cafe_reviews;
create policy "Admins can read all cafe_reviews"
  on cafe_reviews for select
  using (is_admin());

drop policy if exists "Admins can update cafe_reviews" on cafe_reviews;
create policy "Admins can update cafe_reviews"
  on cafe_reviews for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "Admins can delete cafe_reviews" on cafe_reviews;
create policy "Admins can delete cafe_reviews"
  on cafe_reviews for delete
  using (is_admin());

-- 通報。読む人が「これはおかしい」と言えるようにする。
-- 同じ人が何度も押しても1回として数える
create table if not exists cafe_review_reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references cafe_reviews (id) on delete cascade,
  reporter_id text not null,
  created_at timestamptz not null default now(),
  unique (review_id, reporter_id)
);

alter table cafe_review_reports enable row level security;

drop policy if exists "Anyone can insert cafe_review_reports" on cafe_review_reports;
create policy "Anyone can insert cafe_review_reports"
  on cafe_review_reports for insert
  with check (true);

drop policy if exists "Admins can read cafe_review_reports" on cafe_review_reports;
create policy "Admins can read cafe_review_reports"
  on cafe_review_reports for select
  using (is_admin());

-- 写真の置き場。
--
-- 3MBまで、画像だけ。画面側でも縮めてから送るが、そこを通さずに直接
-- 送られても大きなものや画像以外は入らないようにしておく
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cafe-photos',
  'cafe-photos',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 3145728,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Anyone can read cafe photos" on storage.objects;
create policy "Anyone can read cafe photos"
  on storage.objects for select
  using (bucket_id = 'cafe-photos');

drop policy if exists "Anyone can upload cafe photos" on storage.objects;
create policy "Anyone can upload cafe photos"
  on storage.objects for insert
  with check (bucket_id = 'cafe-photos');

drop policy if exists "Admins can delete cafe photos" on storage.objects;
create policy "Admins can delete cafe photos"
  on storage.objects for delete
  using (bucket_id = 'cafe-photos' and is_admin());
