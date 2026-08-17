-- Google の place ID を覚えておくための表。
--
-- 営業時間は Google の Places API から取る。取るには、その店が Google の
-- どの場所なのかを表す place ID が要る。店名と住所で探す問い合わせは
-- 1回ごとに料金がかかるので、一度分かった place ID は取っておいて使い回す。
--
-- Google の規約では、取ってきた内容(営業時間など)を保存しておくことは
-- 認められていない。place ID だけは例外として、ずっと持っていてよい。
-- だからこの表に入れるのは place ID だけで、営業時間は入れない。
create table if not exists cafe_places (
  cafe_id text primary key,
  -- 探したが見つからなかった店は null。何度も探しにいかないよう行は作る
  place_id text,
  resolved_at timestamptz not null default now()
);

alter table cafe_places enable row level security;

-- 方針を明示するためにRLSは入れておく。読み書きするのはサーバー側だけで、
-- サーバーは service role key を使うためポリシーの対象外になる。
-- 公開用のポリシーは作らない = ブラウザからは触れない
