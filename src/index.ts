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

/**
 * A class which allows for colorful, tagged logging
 */
class Logger {

  // The log level threshold, below which no messages are printed 
  private level: number;

  // A console.* ish thing that actually does the printing
  private printer: Printer;

  /**
   * Create a new instance of Logger
   * @param level the log level (1=error, 2=warn, etc...)
   * @param printer the object that actually prints messages (looks like console.*),
   */
  constructor(level: number = 2, printer: Printer = console) {
    this.level = level;
    this.printer = printer;
  }

  /** Log an error message */
  error(str: string) {
    return this.printMessage(LVL_ERROR, str);
  }
  /** Log a warning */
  warn(str: string) {
    return this.printMessage(LVL_WARN, str);
  }
  /** Print some general information */
  log(str: string) {
    return this.printMessage(LVL_LOG, str);
  }
  /** Print something for debugging purposes only */
  debug(str: string) {
    return this.printMessage(LVL_DEBUG, str);
  }

  /**
   * Actually print the message to the printer (maybe console.*)
   * @param level the level of the current message
   * @param msg the message text
   */
  private printMessage(level: number, msg: string) {
    if (level <= this.level) {
      let functionName = CONSOLE_FUNCTIONS[level];
      let logFunction = this.printer[functionName];
      logFunction(msg);
    }
  }
}

export default Logger;
