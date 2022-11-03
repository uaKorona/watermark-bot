import Jimp from "jimp";
import {Buffer} from "buffer";
import {DEFAULT_RATIO, LOGO_PATH, MARK_POSITIONS, OPTIONS, ROWS, X, Y} from "../consts/image.consts.js";
import {MESSAGES} from "../messeges.js";

export class ImageHelper {

    static async builder(): Promise<ImageHelper> {
        const jLogo = await Jimp.read(LOGO_PATH);

        return new ImageHelper(jLogo);
    }

    private readonly _jLogo: Jimp;
    private _jImage: Jimp | null = null;
    private _jLogoResized: Jimp | null = null;

    constructor(jLogo: Jimp) {
        this._jLogo = jLogo;
    }

    async getWatermarkedImage(filePath: string): Promise<void | Buffer> {
        this._jImage = await Jimp.read(filePath);
        this._jLogoResized = this._getResizedJLogo(this._jImage);

        return this._markImage(this._jImage, this._jLogoResized).getBufferAsync(this._jImage.getMIME())
    }

     async getMarkedImageByPosition(position: MARK_POSITIONS): Promise<string | Buffer> {
        if (!this._jImage) {
            return Promise.resolve(MESSAGES.fileFirst());
        }

        if (!this._jLogoResized) {
            return Promise.resolve(MESSAGES.logoNotFound());
        }

        const {x, y} = this._getXYbyPositions(position, this._jImage, this._jLogoResized);

        return this._markImage(this._jImage, this._jLogoResized, x, y).getBufferAsync(this._jImage.getMIME())
    }

    private _markImage(jImage: Jimp, jLogo: Jimp, x: number = X, y: number = Y): Jimp {
        return jImage.clone().composite(jLogo, x, y, OPTIONS);
    }

    private _getResizedJLogo(jImage: Jimp): Jimp {
        return this._doesLogoNeedResize(this._jLogo, jImage)
            ? this._resizeLogo(this._jLogo, jImage.getWidth())
            : this._jLogo;
    }

    private _getSquare(jImg: Jimp): number {
        return jImg.getHeight() * jImg.getWidth();
    }

    private _doesLogoNeedResize(jLogo: Jimp, jImage: Jimp): boolean {
        const logoSquare: number = this._getSquare(jLogo);
        const imageSquare: number = this._getSquare(jImage);
        /*console.log(
            'imageSquare', Math.trunc(imageSquare),
            'logoSquare', Math.trunc(logoSquare),
            'ratio', Math.trunc(imageSquare / logoSquare)
        );*/

        return imageSquare / logoSquare < DEFAULT_RATIO;
    }

    private _resizeLogo(jLogo: Jimp, imgWidth: number): Jimp {
        const newWidth = Math.trunc(imgWidth / ROWS);

        return jLogo.resize(newWidth, Jimp.AUTO)
    }

    private _getXYbyPositions(position: MARK_POSITIONS, jImg: Jimp, jLogo: Jimp): { x: number, y: number } {
        const maxLogoX = jImg.getWidth() - jLogo.getWidth();
        const maxLogoY = jImg.getHeight() - jLogo.getHeight();

        switch (position) {
            case MARK_POSITIONS.TOP_RIGHT:
                return {x: maxLogoX, y: Y};

            case MARK_POSITIONS.BOTTOM_RIGHT:
                return {x: maxLogoX, y: maxLogoY};

            case MARK_POSITIONS.BOTTOM_LEFT:
                return {x: X, y: maxLogoY};

            default:
                return {x: X, y: Y};
        }

    }
}





