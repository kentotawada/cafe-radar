# LINE 自動応答 bot (LINE Messaging API + Gemini)

LINE で送られたテキストを Gemini に渡し、その答えを返信する。

最終確認 2026-09-16。署名の検証・即時 200・後追いでの返信まで、
ローカルの本番ビルドに実際に POST して確認済み(下の「確認済みのこと」参照)。

## ファイル

| ファイル | 役割 |
| --- | --- |
| `src/app/api/webhook/route.ts` | LINE からの POST を受ける。署名の検証 → 即 200 → `after()` で返信 |
| `src/lib/lineClient.ts` | 署名の照合、`replyMessage` での返信、5000字の上限処理 |
| `src/lib/geminiReply.ts` | Gemini への問い合わせ。失敗時は `null` を返す |

依存: `@line/bot-sdk` (11.x)、`@google/genai` (2.x)。

## 環境変数

`.env.local`(手元)と Vercel の Environment Variables に、同じものを入れる。

| 変数 | 必須 | 取得場所 |
| --- | --- | --- |
| `LINE_CHANNEL_ACCESS_TOKEN` | ○ | LINE Developers > 該当チャネル > Messaging API設定 > チャネルアクセストークン(長期) |
| `LINE_CHANNEL_SECRET` | ○ | 同チャネル > チャネル基本設定 > チャネルシークレット |
| `GEMINI_API_KEY` | ○ | Google AI Studio > Get API key |
| `GEMINI_MODEL` | | 既定 `gemini-flash-latest` |
| `GEMINI_SYSTEM_INSTRUCTION` | | 既定は「LINE向けに簡潔・Markdownなし」 |

3つの必須が欠けていると `/api/webhook` は 503 を返す。サイトの他のページは影響を受けない。

## 手順

### 1. LINE のチャネルを作る

1. [LINE Developers](https://developers.line.biz/console/) でプロバイダーを作る(既にあればそれを使う)
2. 「新規チャネル作成」→ **Messaging API**
3. 「Messaging API設定」でチャネルアクセストークン(長期)を発行する
4. 同じ画面で **応答メッセージ**を「オフ」、**あいさつメッセージ**は好みで。
   応答メッセージがオンのままだと、LINE の定型文と bot の返信が二重に届く
5. **Webhookの利用**を「オン」にする

### 2. Vercel にデプロイする

```bash
# 初回だけ
npm i -g vercel
vercel link

# 環境変数を入れる(3つとも。production / preview の両方に入れる)
vercel env add LINE_CHANNEL_ACCESS_TOKEN production
vercel env add LINE_CHANNEL_SECRET production
vercel env add GEMINI_API_KEY production

vercel --prod
```

GitHub 連携でデプロイしている場合は、環境変数は
Vercel のダッシュボード > Settings > Environment Variables から入れて、
ブランチを push すればよい。**環境変数を足したあとは再デプロイが必要**
(既存のデプロイには反映されない)。

### 3. Webhook URL を登録する

LINE Developers の「Messaging API設定」> Webhook URL に、

```
https://<デプロイ先のドメイン>/api/webhook
```

を入れて「検証」を押す。**成功**が出れば署名の照合まで通っている。

検証は `events` が空の配列で来るので、返信は発生しない。

### 4. 動かす

チャネルの QR コードから友だち追加して、何か送る。数秒で返ってくる。

## 手元で試す

`next dev` は localhost なので、LINE からは届かない。トンネルを使う。

```bash
npm run dev
# 別のターミナルで
npx untun@latest tunnel http://localhost:3000
```

出てきた https の URL + `/api/webhook` を Webhook URL に入れる。
LINE を通さず、署名を自分で作って叩くこともできる:

```bash
BODY='{"destination":"U0","events":[]}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$LINE_CHANNEL_SECRET" -binary | base64)
curl -i -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" -H "x-line-signature: $SIG" -d "$BODY"
```

## 設計の理由

### すぐ 200 を返し、返信は `after()` でやる

LINE は webhook の応答が遅いと失敗とみなして同じイベントを送り直す。
Gemini の生成は数秒かかるので、生成を待ってから 200 を返すと、
再送のたびに返信が重なる。先に 200 を返し、`next/server` の `after()`
の中で生成と返信をやる(Vercel では応答後も関数が生き続ける)。

`maxDuration = 30` は `after()` の中にも効く。生成の打ち切りを 20 秒に
してあるのは、返信を送る分を残すため。

### 署名の検証は必ず通す

これが無いと、URL を知っていれば誰でも webhook を叩けて、Gemini の
利用枠を他人に使われる。照合には**パースする前の本文**が要るので、
`request.text()` で受けてから `JSON.parse` している。
順番を入れ替えると、鍵と署名が正しくても一致しない。

### Markdown を使わないよう指示している

LINE のトークは Markdown を解釈しない。既定のままだと Gemini は
`**強調**` や見出しを使うので、記号がそのまま本文に出る。

### 長さを切る

LINE のテキストは1通 5000 字まで。超えると LINE が 400 を返すので、
`lineClient.ts` で切って末尾に `…` を付ける。

## 確認済みのこと

ローカルの本番ビルド(`next build && next start`)に POST して確認した。

| 送ったもの | 結果 |
| --- | --- |
| 正しい署名 + テキストイベント | 200 `{"ok":true}`、`after()` で生成と返信を実行 |
| 署名を書き換えたもの | 401 |
| 署名ヘッダー無し | 401 |
| `events: []`(検証ボタン相当) | 200、返信は発生しない |
| `replyToken` が `000…0` | 200、返信を試みない |
| JSON でない本文 | 400 |

## 未了 — 動かす前に必要

### 1. Gemini API が有効になっていない

渡された `GEMINI_API_KEY` は本物として通った(認証は成功する)が、鍵に紐づく
Google Cloud プロジェクトで Gemini API が有効になっておらず、403 が返る。

```
PERMISSION_DENIED / SERVICE_DISABLED
Gemini API has not been used in project ... before or it is disabled.
```

エラー本文に出ているプロジェクト番号入りの URL、または
Google Cloud コンソールの「APIとサービス」で
**Generative Language API**(`generativelanguage.googleapis.com`)を
有効にする(反映まで数分)。それまで bot は
「すみません、いまうまく返事を作れませんでした」を返す。

### 2. 鍵を作り直す

この3つの鍵はチャットの平文で渡されたため、履歴に残っている。
本番に使う前に、LINE のチャネルアクセストークンとチャネルシークレット、
Gemini の鍵をそれぞれ再発行することを勧める。
アクセストークンが漏れると、公式アカウントから誰でもメッセージを
送れてしまう。
