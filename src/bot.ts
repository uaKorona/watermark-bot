import {Context, Telegraf} from 'telegraf';
import {Update} from 'typegram';
import {MessageTypes} from "./message-types.enum.js";
import {BotHelper} from "./helpers/bot-helper.js";
import {ENV_CONFIG} from "./env/env.config.js";
import {BotCommands} from "./helpers/bot-commands.js";
import {MARK_POSITIONS} from "./consts/image.consts.js";

const botHelper = await BotHelper.builder();
export const bot: Telegraf<Context<Update>> = new Telegraf(ENV_CONFIG.BOT_TOKEN);

const botCommands = new BotCommands(botHelper);

bot.start(botCommands.onStart);

bot.use(botCommands.skipMessageFromChat);

bot.on([MessageTypes.photo, MessageTypes.video], botCommands.onMedia);

bot.use(botCommands.otherMessagesHandler);



