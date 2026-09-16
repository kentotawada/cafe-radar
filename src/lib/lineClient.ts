import { messagingApi, validateSignature } from "@line/bot-sdk";

// LINE Messaging API を使う側の後始末をここに集める。
//
// 鍵をモジュールの読み込み時に検査しないのは、鍵が無い環境(手元で
// bot を触らないとき、CI のビルド)でも `next build` を通したいため。
// 使う直前に isLineConfigured で確かめる。

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET;

/** 返信に必要な2つの環境変数が両方そろっているか */
export const isLineConfigured = Boolean(channelAccessToken && channelSecret);

// テキストメッセージ1通の上限。これを超えると LINE 側が 400 を返す
const TEXT_LIMIT = 5000;

let client: messagingApi.MessagingApiClient | null = null;

function getClient(): messagingApi.MessagingApiClient {
  if (!client) {
    client = new messagingApi.MessagingApiClient({
      channelAccessToken: channelAccessToken as string,
    });
  }
  return client;
}

/**
 * 署名を確かめる。
 *
 * これが無いと、URL を知っている人が誰でも webhook を叩けてしまい、
 * こちらの Gemini の利用枠が他人に使われる。LINE から来たことの
 * 確認はここだけが根拠なので、必ず通す。
 *
 * 比較には受け取ったままの本文(パースする前の文字列)が要る。
 * JSON にして組み直した文字列では、鍵と署名が正しくても一致しない。
 */
export function isValidLineSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !channelSecret) return false;
  try {
    return validateSignature(rawBody, channelSecret, signature);
  } catch {
    // 署名の形が壊れている場合。不正な要求として扱う
    return false;
  }
}

/** LINE に載る形に整える(空なら null、長すぎるなら切る) */
function toLineText(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length <= TEXT_LIMIT) return trimmed;
  // 切ったことが読む人に分かるように印を付ける
  return `${trimmed.slice(0, TEXT_LIMIT - 1)}…`;
}

/**
 * replyToken を使って1通返す。
 *
 * replyToken は1回しか使えず、有効な時間も短い。呼ぶのは1イベントに
 * 1度だけにする。
 */
export async function replyText(replyToken: string, text: string): Promise<void> {
  const body = toLineText(text);
  if (!body) return;
  await getClient().replyMessage({
    replyToken,
    messages: [{ type: "text", text: body }],
  });
}
