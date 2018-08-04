import Logger, { Level, LoggerWithStyles, Printer } from 'bite-log';

export function makeTestLogger(
  level: Level
): { logger: LoggerWithStyles; printer: Printer & { messages: any } } {
  let printer = makeTestPrinter();
  let logger = new Logger(level, printer);
  return { printer, logger };
}

function makeTestPrinter(): Printer & { messages: any } {
  const printer = {
    messages: {
      log: [] as any[][],
      debug: [] as any[][],
      warn: [] as any[][],
      error: [] as any[][]
    } as {
      log: any[][];
      debug: any[][];
      warn: any[][];
      error: any[][];
      dir?: any[][];
    },
    log(_msg: string) {
      printer.messages.log.push([...arguments]);
    },
    debug(_msg: string) {
      printer.messages.debug.push([...arguments]);
    },
    warn(_msg: string) {
      printer.messages.warn.push([...arguments]);
    },
    error(_msg: string) {
      printer.messages.error.push([...arguments]);
    },
    dir(_msg: string) {
      if (typeof printer.messages.dir === 'undefined') {
        // if it's missing
        printer.messages.dir = []; // define the array so we can use it on the next line
      }
      printer.messages.dir.push(...arguments);
    }
  };
  return printer;
}

declare global {
  interface Assert {
    logCount(
      printer: Printer,
      counts: { e?: number; w?: number; l?: number; d?: number; dir?: number },
      message?: string
    ): void;
  }
}

QUnit.assert.logCount = function(
  printer: Printer,
  {
    e,
    w,
    l,
    d,
    dir
  }: { e?: number; w?: number; l?: number; d?: number; dir?: number },
  message?: string
) {
  const actual: {
    errors?: number;
    logs?: number;
    debugs?: number;
    warns?: number;
    dirs?: number;
  } = {};
  const expected: {
    errors?: number;
    logs?: number;
    debugs?: number;
    warns?: number;
    dirs?: number;
  } = {};
  if (typeof e !== 'undefined') {
    expected.errors = e;
    actual.errors = (printer as any).messages.error.length;
  }
  if (typeof w !== 'undefined') {
    expected.warns = w;
    actual.warns = (printer as any).messages.warn.length;
  }
  if (typeof l !== 'undefined') {
    expected.logs = l;
    actual.logs = (printer as any).messages.log.length;
  }
  if (typeof d !== 'undefined') {
    expected.debugs = d;
    actual.debugs = (printer as any).messages.debug.length;
  }
  if (typeof dir !== 'undefined') {
    expected.dirs = dir;
    actual.dirs = (printer as any).messages.dir.length;
  }

  this.pushResult({
    result: JSON.stringify(actual) === JSON.stringify(expected),
    actual,
    expected,
    message: message || 'message counts match'
  });
};
