-- 既存のSupabaseプロジェクトのSQL Editorでこれを実行してください。
-- （新規にプロジェクトを作る場合はschema.sqlだけでこれらのポリシーも含まれます）

-- このアプリは通常利用（報告・追加）はログイン不要の匿名利用のままにしつつ、
-- 「削除」だけはSupabase Authでログインした人だけができるようにする。
-- このアプリには他にログイン機能がないため、事実上「ログインできる=あなただけ」になる。
create policy "Authenticated users can delete cafes"
  on cafes for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete cafe_flags"
  on cafe_flags for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete reports"
  on reports for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete cafe_facts"
  on cafe_facts for delete
  using (auth.role() = 'authenticated');
