import { Printer } from 'bite-log';

export function makeTestPrinter(): Printer & { messages: any } {
  const printer = {
    messages: {
      log: [] as string[],
      debug: [] as string[],
      warn: [] as string[],
      error: [] as string[]
    },
    log(msg: string) {
      printer.messages.log.push(msg);
    },
    debug(msg: string) {
      printer.messages.debug.push(msg);
    },
    warn(msg: string) {
      printer.messages.warn.push(msg);
    },
    error(msg: string) {
      printer.messages.error.push(msg);
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
  { e, w, l, d }: { e?: number; w?: number; l?: number; d?: number }
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
