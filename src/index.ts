import COLORS from './color';

// Log levels (lower number are more severe)
const LVL_ERROR = 1;
const LVL_WARN = 2;
const LVL_LOG = 3;
const LVL_DEBUG = 4;

// Names of the functions corresponding to Log levels (console.log style)
const CONSOLE_FUNCTIONS: { [k: number]: keyof Printer } = {
  [LVL_ERROR]: 'error',
  [LVL_WARN]: 'warn',
  [LVL_LOG]: 'log',
  [LVL_DEBUG]: 'debug'
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

export type ILoggerInstance = Printer & {
  [K in keyof typeof COLORS]: ILoggerInstance
} & {
  txt(str: string): ILoggerInstance
  pushPrefix(str: string): ILoggerInstance
  popPrefix(): ILoggerInstance
};
// tslint:disable-next-line:interface-name
export interface ILogger {
  new(level?: number, printer?: Printer): ILoggerInstance;
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

  /** Log an error message */
  error(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(LVL_ERROR);
  }
  /** Log a warning */
  warn(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(LVL_WARN);
  }
  /** Print some general information */
  log(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(LVL_LOG);
  }
  /** Print something for debugging purposes only */
  debug(str?: string) {
    if (typeof str !== 'undefined') this.txt(str);
    return this.printMessage(LVL_DEBUG);
  }

  /**
   * According to the styles in './color.ts', set up
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
    for (let c in COLORS) {
      // Make sure the property is on the instance, not the prototype
      if (COLORS.hasOwnProperty(c)) {
        // Define a new property on this, of name c (i.e. "red")
        //  that is getter-based (instead of value based)
        const self = this;
        Object.defineProperty(this, c, {
          get() {
            const cStyle = COLORS[c as keyof typeof COLORS]; // i.e. ('color: red;')
            self.stylesInProgress.push(cStyle);
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
      for (let [msg, style] of this.prefixesAndStyles) {
        allMsgs += `%c[${msg}]`;
        allStyles.push(style);
      }
      if (allMsgs.length > 0) allMsgs += ' ';
      for (let [msg, style] of this.msgsAndStyles) {
        allMsgs += `%c ${msg}`;
        allStyles.push(style);
      }
      logFunction(allMsgs, ...allStyles);
      this.msgsAndStyles = [];
    }
  }
}

export default (Logger as any) as ILogger;
