import { Printer } from 'bite-log';

export function makeTestPrinter(): Printer & { messages: any } {
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

export function logCountAssert(
  {
    message,
    assert,
    printer
  }: { message: string; assert: Assert; printer: Printer },
  {
    e,
    w,
    l,
    d,
    dir
  }: { e?: number; w?: number; l?: number; d?: number; dir?: number }
) {
  if (typeof e !== 'undefined') {
    assert.equal(
      (printer as any).messages.error.length,
      e,
      `${message}: ${e} error(s) were logged`
    );
  }
  if (typeof w !== 'undefined') {
    assert.equal(
      (printer as any).messages.warn.length,
      w,
      `${message}: ${w} warning(s) was logged`
    );
  }
  if (typeof d !== 'undefined') {
    assert.equal(
      (printer as any).messages.debug.length,
      d,
      `${message}: ${d} debug(s) were logged`
    );
  }
  if (typeof l !== 'undefined') {
    assert.equal(
      (printer as any).messages.log.length,
      l,
      `${message}: ${l} log(s) were logged`
    );
  }
}
