import { GoogleGenAI } from "@google/genai";

// ユーザーの文章を Gemini に渡して、返信用の文章を1つ作る。

const apiKey = process.env.GEMINI_API_KEY;

// モデル名を環境変数で差し替えられるようにしてある。既定は「最新の flash」を
// 指す別名で、モデルが世代交代してもコードを直さずに済む。速さと値段を
// 変えたいときだけ GEMINI_MODEL を入れる
const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

/** 鍵がそろっているか */
export const isGeminiConfigured = Boolean(apiKey);

// LINE のトークは Markdown を解釈しない。** や # をそのまま出すと
// 記号が地の文に混ざって読みにくいので、書式を使わないよう指示する。
// 長さも、スマホで読める範囲に収まるよう頼んでおく
const DEFAULT_SYSTEM_INSTRUCTION = [
  "あなたはLINEのトーク上で質問に答えるアシスタントです。",
  "日本語で、親しみやすく簡潔に答えてください。",
  "LINEはMarkdownを表示できないので、**強調** や # 見出し、表は使わず、",
  "普通の文章と、必要なら「・」の箇条書きだけで書いてください。",
  "長さは目安として400文字以内にまとめてください。",
].join("\n");

const systemInstruction = process.env.GEMINI_SYSTEM_INSTRUCTION ?? DEFAULT_SYSTEM_INSTRUCTION;

// 考えている間ずっと待つと、LINE の replyToken が切れる。先に自分で打ち切る
const TIMEOUT_MS = 20_000;

// 上限は思考に使う分も含めて数える。ここを絞りすぎると、考えるだけで
// 使い切って本文が空のまま返ってくることがあるので、余裕を持たせる
const MAX_OUTPUT_TOKENS = 2048;

let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: apiKey as string });
  }
  return ai;
}

/**
 * 答えの文章を返す。作れなかったときは null。
 *
 * 呼ぶ側で「うまくいかなかったときの文面」を決められるように、
 * ここでは例外を投げずに null にしている。
 */
export async function generateReply(userText: string): Promise<string | null> {
  if (!isGeminiConfigured) return null;

  const timeout = AbortSignal.timeout(TIMEOUT_MS);

  try {
    const response = await getClient().models.generateContent({
      model,
      contents: userText,
      config: {
        systemInstruction,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        abortSignal: timeout,
      },
    });

    const text = response.text?.trim();
    if (text) return text;

    // 本文が無いときは、なぜ無いのかを残す。安全フィルタで止められた場合と
    // 長さで打ち切られた場合で、直し方が違うため
    const reason = response.candidates?.[0]?.finishReason ?? "不明";
    console.error(`[gemini] 本文が空だった (finishReason: ${reason})`);
    return null;
  } catch (error) {
    console.error("[gemini] 生成に失敗した", error);
    return null;
  }
}
