-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- /contact ページ(店舗掲載・データ利用/取材のお問い合わせ)を、既存の
-- inquiries テーブル(アプリ全体へのお問い合わせ)と共通化するため、
-- 送信者名・メールアドレス・お問い合わせ種別の列を追加する。
-- 既存行はどれもNULLのままでよい(アプリ内の簡易お問い合わせフォーム由来のため)。

alter table inquiries add column if not exists name text;
alter table inquiries add column if not exists email text;
alter table inquiries add column if not exists category text;
