/* eslint-disable no-unused-vars */
type CodePair = readonly [on: number, off: number];
type ColorMap = Record<string, CodePair>;
type Styler = (text: string) => string;
type StaticColor = keyof typeof STATIC;
type HexColor = string & { __hexBrand?: never };
type ColorProxy = { [K in StaticColor]: Styler } & { [K in HexColor]: Styler } & ((hex: HexColor) => Styler);
/* eslint-enable no-unused-vars */

const ESC = "\x1b[";
const RESET = "\x1b[0m";

const STATIC = {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
    blink: [5, 25],
    doubleUnderline: [21, 24],

    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],

    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],

    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],

    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
} as const satisfies ColorMap;

const hasProcess = typeof process !== "undefined" && process && typeof process.env === "object";

const isColorSupported =
    hasProcess &&
    !("NO_COLOR" in process.env || process.argv.includes("--no-color")) &&
    ("FORCE_COLOR" in process.env ||
        process.argv.includes("--color") ||
        process.platform === "win32" ||
        (process.stdout.isTTY && process.env.TERM !== "dumb") ||
        "CI" in process.env);

const supported = isColorSupported;

const cache: Record<string, Styler> = Object.create(null);

if (supported) {
    for (const key in STATIC) {
        const [on, off] = STATIC[key as keyof typeof STATIC];
        const prefix = ESC + on + "m";
        const suffix = off === 0 ? RESET : ESC + off + "m";
        cache[key] = (t: string) => prefix + t + suffix;
    }
}

function getStyler(key: string): Styler {
    if (cache[key]) return cache[key];

    if (!supported) {
        const id: Styler = (t) => t;
        cache[key] = id;
        return id;
    }

    const isBg = key.startsWith("bg");
    const str = isBg ? key.slice(2) : key;

    let hexStr = str;
    const len = hexStr.length;

    const valid = /^[0-9a-fA-F]{3}$/.test(str) || /^[0-9a-f-A-F]{6}$/.test(str);

    if (valid && (len === 3 || len === 6)) {
        if (len === 3) hexStr = hexStr.replace(/(.)/g, "$1$1");

        const hex = parseInt(hexStr, 16);
        const r = (hex >> 16) & 255;
        const g = (hex >> 8) & 255;
        const b = hex & 255;

        const prefix = ESC + (isBg ? 48 : 38) + `;2;${r};${g};${b}m`;
        const fn: Styler = (t) => prefix + t + RESET;
        cache[key] = fn;
        return fn;
    }

    const id: Styler = (t) => t;
    cache[key] = id;
    return id;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const color: ColorProxy = new Proxy(((hex: string) => getStyler(hex)) as any, {
    get(_, prop: string) {
        return getStyler(prop);
    },
    apply(_, __, args: [string]) {
        return getStyler(args[0]);
    },
});

export default color;
