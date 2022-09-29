import http from "serverless-http";
import {bot} from "./src/bot.js";
import {MESSAGES} from "./src/messeges.js";

bot.use((ctx) => {
    return ctx.replyWithHTML(MESSAGES.unSupportType());
});

// setup webhook
export const watermarkBot = http(bot.webhookCallback("/telegraf"));