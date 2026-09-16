import { after, NextRequest, NextResponse } from "next/server";
import type { webhook } from "@line/bot-sdk";
import { isLineConfigured, isValidLineSignature, replyText } from "@/lib/lineClient";
import { generateReply, isGeminiConfigured } from "@/lib/geminiReply";

// LINE の webhook 受け口。
//
// LINE Developers コンソールの Webhook URL に
// https://<デプロイ先>/api/webhook を入れると、ここに POST が来る。
//
// 流れ:
//   1. 署名を確かめて、LINE から来たことを確認する
//   2. すぐに 200 を返す
//   3. 返答を作って送るのは after() の中(応答を返したあと)でやる
//
// なぜ 2 と 3 を分けるか:
//   LINE は webhook の応答が遅いと失敗とみなし、同じイベントを送り直す。
//   Gemini の生成は数秒かかるので、待ってから 200 を返すと、再送のたびに
//   返信が重なる。先に 200 を返し、生成は後ろでやる。

// after() の中の処理もこの秒数までしか動けない。生成の待ち時間(20秒)に
// 返信を送る分を足した余裕を取る
export const maxDuration = 30;

// コンソールの「検証」ボタンや接続確認で来る、返信できない replyToken。
// これに返信しようとすると LINE 側が 400 を返す
const VERIFY_TOKENS = new Set([
  "00000000000000000000000000000000",
  "ffffffffffffffffffffffffffffffff",
]);

// 生成できなかったときに返す文面。黙って終わると、ユーザーからは
// 「既読にもならず無視された」ようにしか見えない
const FALLBACK_TEXT = "すみません、いまうまく返事を作れませんでした。もう一度送ってみてください。";

async function handleEvent(event: webhook.Event): Promise<void> {
  if (event.type !== "message") return;

  // replyToken は型の上では任意。無いイベント(再配信など)には返信できない
  const replyToken = event.replyToken;
  if (!replyToken || VERIFY_TOKENS.has(replyToken)) return;

  if (event.message.type !== "text") {
    await replyText(replyToken, "いまは文字のメッセージにだけ答えられます。");
    return;
  }

  const userText = event.message.text.trim();
  if (!userText) return;

  const answer = await generateReply(userText);
  await replyText(replyToken, answer ?? FALLBACK_TEXT);
}

export async function POST(request: NextRequest) {
  // 設定が足りないうちは、何が足りないのかを返す。署名の検証だけで落とすと
  // 「401 が返る」以外の手がかりが無く、原因を追えない
  if (!isLineConfigured) {
    console.error("[webhook] LINE_CHANNEL_ACCESS_TOKEN / LINE_CHANNEL_SECRET が未設定");
    return NextResponse.json({ error: "LINE の設定が未完了です" }, { status: 503 });
  }
  if (!isGeminiConfigured) {
    console.error("[webhook] GEMINI_API_KEY が未設定");
    return NextResponse.json({ error: "Gemini の設定が未完了です" }, { status: 503 });
  }

  // 署名の照合には、受け取ったままの本文が要る(JSON にすると一致しない)
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!isValidLineSignature(rawBody, signature)) {
    return NextResponse.json({ error: "署名が正しくありません" }, { status: 401 });
  }

  let body: webhook.CallbackRequest;
  try {
    body = JSON.parse(rawBody) as webhook.CallbackRequest;
  } catch {
    return NextResponse.json({ error: "本文が JSON ではありません" }, { status: 400 });
  }

  // 接続確認では events が空の配列で来る。返すものは無いが 200 で応じる
  const events = body.events ?? [];

  after(async () => {
    // 1件が失敗しても他の返信は送りたいので、まとめずに個別に受け止める
    await Promise.all(
      events.map(async (event) => {
        try {
          await handleEvent(event);
        } catch (error) {
          console.error("[webhook] イベントの処理に失敗した", error);
        }
      })
    );
  });

  return NextResponse.json({ ok: true });
}
