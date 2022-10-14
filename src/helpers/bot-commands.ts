import {MESSAGES} from "../messeges.js";
import {Context, Markup} from "telegraf";
import {Update} from "typegram";
import {BotHelper} from "./bot-helper.js";
import {Buffer} from "buffer";
import {bot} from "../bot.js";
import {MARK_POSITIONS} from "../consts/image.consts.js";
import {Message} from "typegram/message";
import {TypeGuardsHelper} from "./type-guards.helper.js";


export class BotCommands {
    constructor(
        private readonly _botHelper: BotHelper
    ) {
    }

    onStart = (ctx: Context<Update>) =>
        ctx.replyWithHTML(
            MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'),
            Markup.keyboard([
                [MARK_POSITIONS.TOP_LEFT, MARK_POSITIONS.TOP_RIGHT],
                [MARK_POSITIONS.BOTTOM_LEFT, MARK_POSITIONS.BOTTOM_RIGHT],
            ]).resize()
        );

    skipMessageFromChat = async (ctx: Context<Update>, next: () => Promise<void>) => {
        if (this._botHelper.isMessageFromChat(ctx)) {
            // skip running next middlewares for messages from chat
            return;
        }

        return next(); // running next middleware
    }

    onMedia = async (ctx: Context<Update>) => {
        const fileId = this._botHelper.getFileId(ctx.message);

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

        const buffer = await this._botHelper.getWatermarkedImage(fileUrl) as Buffer;

        return ctx.replyWithPhoto({source: buffer})
    }

    otherMessagesHandler = async (ctx: Context<Update>) => {
        const {text} = ctx.message as Message.TextMessage;

        switch (text) {
            case MARK_POSITIONS.TOP_LEFT:
            case MARK_POSITIONS.TOP_RIGHT:
            case MARK_POSITIONS.BOTTOM_LEFT:
            case MARK_POSITIONS.BOTTOM_RIGHT: {
                const result = await this._botHelper.changeWatermarkPosition(text);

                if (TypeGuardsHelper.isString(result)) {
                    return ctx.reply(result);
                }

                return ctx.reply('processing:  ' + text)
                    .then(() => ctx.replyWithPhoto({source: result}));
            }

            default:
                return ctx.replyWithHTML(MESSAGES.unSupportType());
        }
    }
}