import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_ID;

export async function sendTelegramMessage(message: string) {
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: GROUP_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }
    );
    return res
  } catch (error) {
    console.error("Telegram error:", error);
  }
}