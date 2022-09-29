import {Context, Telegraf} from 'telegraf';
import {Update} from 'typegram';
import {MESSAGES} from "./messeges.js";
import {MessageTypes} from "./message-types.enum.js";
import {BotHelper} from "./bot-helper.js";
import {Buffer} from "buffer";

const {WATERMARK_BOT_TOKEN} = process.env;

const botHelper = await BotHelper.builder();
export const bot: Telegraf<Context<Update>> = new Telegraf(WATERMARK_BOT_TOKEN as string);


bot.start((ctx) => {
    ctx.replyWithHTML(MESSAGES.startMessage(ctx.from.first_name));
});

bot.use(async (ctx, next) => {
    if (botHelper.isMessageFromChat(ctx)) {
        // skip running next middlewares for messages from chat
        return;
    }

    return next(); // running next middleware
})

bot.on([MessageTypes.photo, MessageTypes.video], async (ctx) => {
    //console.log( ctx.message);

    const fileId = botHelper.getFileId(ctx.message);

    if (fileId === null) {
        throw new Error('Can`t get fileId');
    }

    const fileUrl = await bot.telegram
        .getFileLink(fileId)
        .then(url => url.toString());

    if (typeof fileUrl === 'undefined') {
        return ctx.replyWithHTML(MESSAGES.unknownFileId(ctx.message));
    }

    ctx.reply('start proceeding');

    const buffer = await botHelper.getWatermarkedImage(fileUrl) as Buffer;

    return ctx.replyWithPhoto({source: buffer})
});



