import Jimp from "jimp";
import {Buffer} from "buffer";

const OPTIONS = {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 1
} as const;

const ROWS = 3 as const;
const DEFAULT_RATIO = 9 as const;
const LOGO_PATH = './assets/logo4.png';
const X = 0, Y = 0;


export class ImageHelper {

    static async builder(): Promise<ImageHelper> {
        const jLogo = await Jimp.read(LOGO_PATH);

        return new ImageHelper(jLogo);
    }

    _jLogo: Jimp;

    constructor(jLogo: Jimp) {
        this._jLogo = jLogo;
    }

    async getWatermarkedImage(filePath: string): Promise<void | Buffer> {
        const jImage = await Jimp.read(filePath);

        return this._markImage(jImage).getBufferAsync(jImage.getMIME())
    }

    private _markImage(jImage: Jimp): Jimp {
        const jLogo = this._doesLogoNeedResize(this._jLogo, jImage)
            ? this._resizeLogo(this._jLogo, jImage.getWidth())
            : this._jLogo;

        return jImage.composite(jLogo, X, Y, OPTIONS);
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
}





