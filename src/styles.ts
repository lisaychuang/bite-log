import X11_COLORS from './colors';

interface StyleObj { [k: string]: string; };

const COLOR_STYLES: StyleObj = { };
for (let c of X11_COLORS) {
  // i.e. "Red"
  COLOR_STYLES[c] = `color: ${c};`;
  // i.e. "bgRed"
  COLOR_STYLES[`bg${c[0].toUpperCase()}${c.substring(1)}`] = `background-color: ${c};`;
}

// const fontStyles: StyleObj = {
//   bold: 'font-weight: 500;'
// };

export default {
  ...COLOR_STYLES,
  // ...fontStyles
};
