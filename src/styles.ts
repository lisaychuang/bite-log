import X11_COLORS from './colors';

interface StyleObj {
  [k: string]: string;
}

const COLOR_STYLES: StyleObj = {};
for (let c of X11_COLORS) {
  // i.e. "Red"
  COLOR_STYLES[c] = `color: ${c};`;
  // i.e. "bgRed"
  COLOR_STYLES[
    `bg${c[0].toUpperCase()}${c.substring(1)}`
  ] = `background-color: ${c};`;
}

const FONT_STYLES: StyleObj = {
  bold: 'font-weight: bold;',
  italic: 'font-style: italic;',
  overline: 'text-decoration: overline;',
  underline: 'text-decoration: underline;',
  strikethrough: 'text-decoration: line-through;'
};

const FONT_SIZES: StyleObj = {
  big: 'font-size: 1.5em;',
  huge: 'font-size: 2em;'
};

export const WHITE_SPACE_STYLE =
  'color: inherit; background-color: transparent;';

const stylesToPutOnLogger = {
  ...COLOR_STYLES,
  ...FONT_STYLES,
  ...FONT_SIZES
};

export default stylesToPutOnLogger;
