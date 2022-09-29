import {Context} from "telegraf";
import {Update} from "typegram";
import {MessageTypes} from "./message-types.enum.js";
import {PhotoSize, Video, Message} from "typegram/message";
import {ImageHelper} from "./helpers/image-helper.js";

export class BotHelper {
    static async builder(): Promise<BotHelper> {
        const imageHelper = await ImageHelper.builder();

        return new BotHelper(imageHelper);
    };

    public readonly zero: number = 0;
    private _imageHelper!: ImageHelper;

    constructor(imageHelper: ImageHelper) {
        this._imageHelper = imageHelper;
    }

    public isMessageFromChat(ctx: Context<Update>): boolean {
        const id = ctx?.chat?.id ?? this.zero;

        return id < this.zero;
    }

    public getFileId(message: Message.PhotoMessage | Message.VideoMessage | unknown): string | null {
        const photo: PhotoSize[] = (message as Message.PhotoMessage)[MessageTypes.photo] || [];

        if (photo.length) {
            return photo[photo.length - 1].file_id;
        }

        const video: Video = (message as Message.VideoMessage)[MessageTypes.video] || {};

        if (video.file_id) {
            return video.file_id;
        }

        return null;
    }

    public getWatermarkedImage(filePath: string): Promise<void | Buffer> {
        return this._imageHelper.getWatermarkedImage(filePath);
    }
}
