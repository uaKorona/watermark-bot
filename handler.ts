import http from "serverless-http";
import { Telegraf } from "telegraf";

const {WATERMARK_BOT_TOKEN} = process.env;
const bot = new Telegraf(WATERMARK_BOT_TOKEN as string);

// echo
bot.on("text", ctx => ctx.reply('Repeat ' + ctx.message.text));

// setup webhook
export const watermarkBot = http(bot.webhookCallback("/telegraf"));