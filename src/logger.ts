import { BgColors, FontSizes, FontStyles, TextColors } from './style-types';
import logStyles, { WHITE_SPACE_STYLE } from './styles';

// Log levels (lower number are more severe)
export const enum Level {
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
 * Something that looks like console.*. I suspect
 * that it might be useful to use a non-console thing
 * in tests.
 */
export interface Printer {
  error: typeof console.error;
  warn: typeof console.warn;
  log: typeof console.log;
  debug: typeof console.debug;
}

/**
 * A class which allows for colorful, tagged logging
 */
class Logger {
  // The log level threshold, below which no messages are printed
  private level: number;

  // A console.* ish thing that actually does the printing
  private printer: Printer;

  // An array of current styles
  private stylesInProgress: string[] = [];

  // An array of prefixes that go at the beginning of each message
  private prefixesAndStyles: Array<[string, string]> = [];

  // An array of message & their associated styles
  private msgsAndStyles: Array<[string, string]> = [];

  /**
   * Create a new instance of Logger
   * @param level the log level (1=error, 2=warn, etc...)
   * @param printer the object that actually prints messages (looks like console.*),
   */
  constructor(level: number = 2, printer: Printer = console) {
    this.level = level;
    this.printer = printer;
    this.setupStyles();
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
    this.prefixesAndStyles.push([name, this.stylesInProgress.join('')]);
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
    this.stylesInProgress.push(style);
    return this;
  }

  /** Stage a string and accumulated styles for later console functions */
  txt(str: string) {
    this.msgsAndStyles.push([str, this.stylesInProgress.join('')]);
    this.stylesInProgress = [];
    return this;
  }

  // Log an error message
  error(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(Level.error);
  }
  // Log a warning
  warn(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(Level.warn);
  }
  // Print some general information
  log(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(Level.log);
  }
  // Print something for debugging purposes only
  debug(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(Level.debug);
  }

  /**
   * According to the COLOR_STYLES in './style.ts', set up
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
  private setupStyles() {
    // Loop over each style name (i.e. "red")
    for (let c in logStyles) {
      // Make sure the property is on the instance, not the prototype
      if (logStyles.hasOwnProperty(c)) {
        // Define a new property on this, of name c (i.e. "red")
        //  that is getter-based (instead of value based)
        const self = this;
        Object.defineProperty(this, c, {
          get() {
            const styleCss = logStyles[c as keyof typeof logStyles]; // i.e. ('color: red;')
            self.stylesInProgress.push(styleCss);
            return this;
          }
        });
      }
    }
  }

  /**
   * Actually print the message to the printer (maybe console.*)
   * @param level the level of the current message
   * @param msg the message text
   */
  private printMessage(level: number) {
    if (level <= this.level) {
      let functionName = CONSOLE_FUNCTIONS[level];
      let logFunction = this.printer[functionName];
      let allMsgs = '';
      let allStyles: string[] = [];

      /** Flush all prefix and styles into msgsAndStyles
       * Note: there may not be styles associated with a message or prefix!
       */
      for (let [msg, style] of this.prefixesAndStyles) {
        // prefix styles
        if (style) {
          allMsgs += `%c[${msg}]`;
          allStyles.push(style); // Only add style to allStyles if present
        } else {
          allMsgs += `[${msg}]`;
        }
      }
      // white space style
      if (allMsgs.length > 0) {
        allMsgs += '%c '; // space between prefixes and rest of logged message
        allStyles.push(WHITE_SPACE_STYLE);
      }
      for (let [msg, style] of this.msgsAndStyles) {
        // message styles
        if (style) {
          allMsgs += `%c${msg}`;
          allStyles.push(style); // only add style to allStyles if present
        } else {
          allMsgs += `${msg}`;
        }
      }
      logFunction(allMsgs, ...allStyles);
      this.msgsAndStyles = [];
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
  new (level?: Level, printer?: Printer): LoggerWithStyles;
}

export default Logger as LoggerConstructor;
