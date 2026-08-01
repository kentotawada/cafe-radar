-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- /business ページ(店舗オーナー・法人向けの掲載案内)からのお問い合わせで、
-- 「担当者名」とは別に「店舗名」も記録できるようにする。既存行はNULLのままでよい。

alter table inquiries add column if not exists store_name text;
