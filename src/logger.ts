import { BgColors, FontSizes, FontStyles, TextColors } from './style-types';
import logStyles, { CLEAR_STYLE } from './styles';
import { isBrowser } from './utils';

// Log levels (lower number are more severe)
export enum Level {
  error = 1,
  warn = 2,
  log = 3,
  debug = 4
}

// Names of the functions corresponding to Log levels (console.log style)
const CONSOLE_FUNCTIONS: { [k: number]: keyof Printer } = {
  [Level.error]: 'error',
  [Level.warn]: 'warn',
  [Level.log]: 'log',
  [Level.debug]: 'debug'
};

/**
 * A CustomStyle is a style that doesn't correspond to a X11 color.
 * This could be custom CSS in the browser, or custom ANSI codes in Node
 */
interface CustomStyle {
  /**
   * Data for the custom color (i.e., the CSS string)
   */
  custom: string;
}
/**
 * A list of styles that usually accompany a list of message parts.
 * A `StyleParts` usually accompanies a token within a message
 *
 * @example
 * ```ts
 * logger.red.bgYellow.underline.debug('Hello World');
 * ```
 *
 * The `StyleParts` might look like ['red', 'bgYellow', 'underline']
 */
type StyleParts = Array<string | CustomStyle>;

/**
 * Something that looks like console.*. I suspect
 * that it might be useful to use a non-console thing
 * in tests.
 */
export interface Printer {
  error: typeof console.error;
  warn: typeof console.warn;
  log: typeof console.log;
  debug: typeof console.debug;
  dir: typeof console.dir;
}

function makeStyleString(styleParts: StyleParts): string {
  const parts: string[] = [];
  for (let s of styleParts) {
    if (typeof s === 'string') {
      parts.push(logStyles[s]);
    } else {
      parts.push(s.custom);
    }
  }
  return parts.join('');
}

// tslint:disable-next-line:no-namespace
export namespace Logger {
  export interface Config {
    printer: Printer;
    env?: 'browser' | 'node';
  }
}

const DEFAULT_CONFIG: Logger.Config = {
  printer: console
};

/**
 * A class which allows for colorful, tagged logging
 */
export class Logger {
  // The log level threshold, below which no messages are printed
  private level: number;

  // A console.* ish thing that actually does the printing
  private printer: Printer;

  // An array of current styles
  private stylesInProgress: StyleParts = [];

  // An array of prefixes that go at the beginning of each message
  private prefixesAndStyles: Array<[string, StyleParts]> = [];

  // An array of any message that is not a string
  private nonStringsToLog: Array<[any]> = [];

  // An array of message & their associated styles
  private msgsAndStyles: Array<[string, StyleParts]> = [];

  private env: 'browser' | 'node';
  /**
   * Create a new instance of Logger
   * @param level the log level (1=error, 2=warn, etc...)
   * @param printer the object that actually prints messages (looks like console.*),
   */
  constructor(
    level: number = 2,
    printerOrConfig: Printer | Logger.Config = DEFAULT_CONFIG
  ) {
    this.level = level;
    if (typeof (printerOrConfig as any).printer === 'undefined') {
      // printerOrConfig is a Printer
      this.printer = printerOrConfig as Printer;
      this.env = isBrowser() ? 'browser' : 'node';
    } else {
      // printerOrConfig is a Logger.Config
      const config: Logger.Config = printerOrConfig as Logger.Config;
      this.printer = config.printer;
      this.env = config.env || (isBrowser() ? 'browser' : 'node');
    }
  }

  /**
   * Adds a prefix that will be applied to all messages.
   * This is useful for indicating the context in which a message is logged,
   * without forcing developers to "re-state" that context over and over.
   *
   * @example
   * ```ts
   * const logger = new Logger();
   *
   * function fooFunction() {
   *   logger.pushPrefix('foo');
   *   ...
   *   logger.log('hello');
   *   logger.log('world');
   *   ...
   *    logger.popPrefix();
   * }
   *
   * logger.log('begin');   // "begin"
   * fooFunction();         // "[foo] hello"
   *                        // "[foo] world"
   * logger.log('end');     // "end"
   *
   * ```
   * @param name the name of the tag
   */
  pushPrefix(name: string) {
    /**
     * stylesInProgress is a StyleParts i.e., ['red', 'blue', { custom: 'font-weight: 900;'}]
     * Here we create a shallow clone of the array, and push it into prefixesAndStyles to be dealt with later
     */
    this.prefixesAndStyles.push([name, [...this.stylesInProgress]]);
    this.stylesInProgress = [];
    return this;
  }

  /**
   * Remove the most recently added prefix from the logger
   *
   * @see {Logger.pushPrefix}
   */
  popPrefix() {
    this.prefixesAndStyles.pop();
    return this;
  }

  /**
   * Add custom CSS styles
   * @param style
   * a string of CSS, similar to what you'd use for <div style="">
   */
  css(style: string) {
    this.stylesInProgress.push({ custom: style });
    return this;
  }

  /** Stage a string and accumulated styles for later console functions */
  txt(...args: any[]) {
    // EXAMPLE: ['my list is', [12, 22, 14], '<< it is great'
    let fullString = '';
    /**
     * stylesInProgress is a StyleParts i.e., ['red', 'blue', { custom: 'font-weight: 900;'}]
     * Here we create a shallow clone of the array
     */
    let fullStringStyles = [...this.stylesInProgress]; // for example 'color: red; background-color: yellow;'
    this.stylesInProgress = [];
    for (let arg of args) {
      if (typeof arg === 'string') {
        fullString += arg;
      } else {
        this.nonStringsToLog.push(arg);
      }
      // in the case where there are some string arguments
    }
    if (fullString) {
      /**
       * Only if there's text to print, store the message and associated styles so they can be dealt with later
       * We skip this in cases where ONLY non-strings (i.e., an array) are being logged
       */
      this.msgsAndStyles.push([fullString, fullStringStyles]);
    }
    return this;
  }

  // Log an error message
  error(...args: any[]) {
    this.txt(...args);
    return this.printMessage(Level.error);
  }
  // Log a warning
  warn(...args: any[]) {
    this.txt(...args);
    return this.printMessage(Level.warn);
  }
  // Print some general information
  log(...args: any[]) {
    this.txt(...args);
    return this.printMessage(Level.log);
  }
  // Print something for debugging purposes only
  debug(...args: any[]) {
    this.txt(...args);
    return this.printMessage(Level.debug);
  }

  /**
   * Actually print the message to the printer (maybe console.*)
   * @param level the level of the current message
   * @param msg the message text
   */
  private printMessage(level: number) {
    if (this.env === 'browser') {
      return this.printBrowserMessage(level);
    } else {
      return this.printNodeMessage(level);
    }
  }

  private printBrowserMessage(level: number) {
    if (level <= this.level) {
      let functionName = CONSOLE_FUNCTIONS[level];
      let logFunction = this.printer[functionName];
      let allMsgs = '';
      let allStyles: string[] = [];

      /** Flush all prefix and styles into msgsAndStyles
       * Note: there may not be styles associated with a message or prefix!
       */

      // prefix styles
      for (let [msg, styleParts] of this.prefixesAndStyles) {
        if (styleParts && styleParts.length > 0) {
          // with styles
          allMsgs += `%c[${msg}]`;
          allStyles.push(makeStyleString(styleParts)); // Only add style to allStyles if present
        } else if (allStyles.length > 0) {
          // unstyled, but following something styled
          allMsgs += `%c[${msg}]`;
          allStyles.push(CLEAR_STYLE); // Only add style to allStyles if present
        } else {
          // unstyled, following nothing (or other unstyled stuff)
          allMsgs += `[${msg}]`;
        }
      }
      // white space style
      if (allMsgs.length > 0) {
        allMsgs += '%c '; // space between prefixes and rest of logged message
        allStyles.push(CLEAR_STYLE);
      }
      // message styles
      for (let [msg, styleParts] of this.msgsAndStyles) {
        if (styleParts && styleParts.length > 0) {
          allMsgs += `%c${msg}`;
          allStyles.push(makeStyleString(styleParts)); // only add style to allStyles if present
        } else if (allStyles.length > 0) {
          allMsgs += `%c${msg}`;
          allStyles.push(CLEAR_STYLE); // only add style to allStyles if present
        } else {
          allMsgs += `${msg}`;
        }
      }
      logFunction(allMsgs, ...allStyles);
      this.msgsAndStyles = [];
    }
    // in printMessage, we need to deal with that array (i.e., printer.dir([1, 2, 3])  )
    // and set the array of non-strings back to empty
    // log.debug([1, 2, 3]);
    for (let nonString of this.nonStringsToLog) {
      this.printer.dir(nonString);
    }
    this.nonStringsToLog = [];
  }

  private printNodeMessage(level: number) {
    if (level <= this.level) {
      let functionName = CONSOLE_FUNCTIONS[level];
      let logFunction = this.printer[functionName];
      let allMsgs = '';

      /** Flush all prefix and styles into msgsAndStyles
       * Note: there may not be styles associated with a message or prefix!
       */

      // prefix styles
      for (let [msg] of this.prefixesAndStyles) {
        // all node messages are unstyled... for now
        allMsgs += `[${msg}]`;
      }
      // white space between Prefix and Message
      if (allMsgs.length > 0) {
        allMsgs += ' '; // space between prefixes and rest of logged message
      }
      // message styles
      for (let [msg] of this.msgsAndStyles) {
        allMsgs += `${msg}`;
      }
      logFunction(allMsgs);
      this.msgsAndStyles = [];
    }
    // in printMessage, we need to deal with that array (i.e., printer.dir([1, 2, 3])  )
    // and set the array of non-strings back to empty
    // log.debug([1, 2, 3]);
    for (let nonString of this.nonStringsToLog) {
      this.printer.dir(nonString);
    }
    this.nonStringsToLog = [];
  }
}

/**
 * According to the logStyles in './style.ts', set up
 * a property for each, kind of like
 * ```ts
 *   {
 *     get red() { }, //  store "color: red"
 *     get bgYellow() { } // store "background-color: yellow"
 *   }
 * ```
 * Ultimately, we want to be able to do something like
 * logger.red.bgYellow.txt('Hello red and yellow')
 */
function setupStyles() {
  // Loop over each style name (i.e. "red")
  for (let styleName in logStyles) {
    // Make sure the property is on the instance, not the prototype
    if (logStyles.hasOwnProperty(styleName)) {
      // Define a new property on this, of name c (i.e. "red")
      //  that is getter-based (instead of value based)
      Object.defineProperty(Logger.prototype, styleName, {
        get() {
          /**
           * Store the styleName, to be dealt with the next time
           * a `.txt()`, `.log()`, `.debug()`, `.error()` or `.warn()` call is made
           */
          this.stylesInProgress.push(styleName);
          return this;
        }
      });
    }
  }
}

export type LoggerWithStyles = Logger &
  {
    [K in keyof (TextColors &
      BgColors &
      FontStyles &
      FontSizes)]: LoggerWithStyles
  };

export interface LoggerConstructor {
  new (
    level?: Level,
    printerOrConfig?: Printer | Logger.Config
  ): LoggerWithStyles;
}

setupStyles(); // install all the color getter functions onto the prototype

export default Logger as LoggerConstructor;
