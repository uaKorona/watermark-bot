import Jimp from "jimp";

export const OPTIONS = {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 1
} as const;

export const ROWS = 3 as const;
export const DEFAULT_RATIO = 9 as const;
export const LOGO_PATH = './assets/logo4.png';
export const X = 0, Y = 0;

export enum MARK_POSITIONS {
    TOP_LEFT = "TOP LEFT",
    TOP_RIGHT = "TOP RIGHT",
    BOTTOM_LEFT = "BOTTOM LEFT",
    BOTTOM_RIGHT = "BOTTOM RIGHT"
}