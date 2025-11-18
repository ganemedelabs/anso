/* eslint-disable no-unused-vars */
type Styler = (text: string) => string;
type StaticColor = keyof typeof STATIC;
type HexColor = string & { __hexBrand?: never };
type ColorProxy = { [K in StaticColor]: Styler } & { [K in HexColor]: Styler } & ((hex: HexColor) => Styler);
/* eslint-enable no-unused-vars */

const c = (h: string) => `color:#${h}`;
const b = (h: string) => `background:#${h}`;

const STATIC = (() => {
    const map: Record<string, string> = {};

    map.reset = "";
    map.bold = "font-weight:bold";
    map.dim = "opacity:0.6";
    map.italic = "font-style:italic";
    map.underline = "text-decoration:underline";
    map.overline = "text-decoration:overline";
    map.inverse = "filter:invert(1)";
    map.hidden = "visibility:hidden";
    map.strikethrough = "text-decoration:line-through";
    map.blink = "text-decoration:blink";
    map.doubleUnderline = "text-decoration:underline double";

    const fgBase = {
        black: "000",
        red: "f00",
        green: "0f0",
        yellow: "ff0",
        blue: "00f",
        magenta: "f0f",
        cyan: "0ff",
        white: "fff",
    };
    for (const k in fgBase) map[k] = c(fgBase[k]);

    const fgBright = {
        blackBright: "555",
        gray: "aaa",
        grey: "aaa",
        redBright: "f55",
        greenBright: "5f5",
        yellowBright: "ff5",
        blueBright: "55f",
        magentaBright: "f5f",
        cyanBright: "5ff",
        whiteBright: "eee",
    };
    for (const k in fgBright) map[k] = c(fgBright[k]);

    for (const k in fgBase) map["bg" + capitalize(k)] = b(fgBase[k]);
    for (const k in fgBright) map["bg" + capitalize(k)] = b(fgBright[k]);

    return map as Record<string, string>;
})();

function capitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1);
}

const cache: Record<string, Styler> = Object.create(null);

function makeSpan(style: string, text: string): string {
    return style ? `<span style="${style}">${text}</span>` : text;
}

function getStyler(key: string): Styler {
    if (cache[key]) return cache[key];

    if (key in STATIC) {
        const css = STATIC[key];
        const fn: Styler = (t) => makeSpan(css, t);
        cache[key] = fn;
        return fn;
    }

    const isBg = key.startsWith("bg");
    const raw = isBg ? key.slice(2) : key;

    if (/^[0-9a-f]{3}$/i.test(raw) || /^[0-9a-f]{6}$/i.test(raw)) {
        const hex = raw.length === 3 ? raw.replace(/(.)/g, "$1$1") : raw;
        const css = (isBg ? b : c)(hex);
        const fn: Styler = (t) => makeSpan(css, t);
        cache[key] = fn;
        return fn;
    }

    return (cache[key] = (t) => t);
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
