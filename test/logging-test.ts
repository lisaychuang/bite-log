import Logger, { Printer } from 'bite-log';

function makeTestPrinter(): Printer & { messages: any } {
    const printer = {
        messages: {
            log: [],
            debug: [],
            warn: [],
            error: []
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
        },
    }
    return printer;
}

function logCountAssert(
    {message, assert, logger, printer}: { message: string; assert: Assert; logger: Logger; printer: Printer },
    { e, w, l, d }: { e: number; w: number; l: number; d: number }
) {
    assert.equal(
        (printer as any).messages.error.length,
        e,
        `${message}: ${e} error(s) were logged`
    );
    assert.equal(
        (printer as any).messages.warn.length,
        w,
        `${message}: ${w} warning(s) was logged`
    );
    assert.equal(
        (printer as any).messages.debug.length,
        d,
        `${message}: ${d} debug(s) were logged`
    );
    assert.equal(
        (printer as any).messages.log.length,
        l,
        `${message}: ${l} log(s) were logged`
    );
}

QUnit.module('Logging through the printer');

QUnit.test('Logger @ level 4', assert => {
    const printer = makeTestPrinter();
    const logger = new Logger(4, printer); // only warns and error
    logger.warn('a warning');
    logCountAssert({ message: 'after a warning', assert, logger, printer }, { e: 0, w: 1, l: 0, d: 0 });
    logger.error('an error');
    logCountAssert({ message: 'after an error', assert, logger, printer }, { e: 1, w: 1, l: 0, d: 0 });
    logger.log('a log');
    logCountAssert({ message: 'after a log', assert, logger, printer }, { e: 1, w: 1, l: 1, d: 0 });
    logger.debug('a debug');
    logCountAssert({ message: 'after a debug', assert, logger, printer }, { e: 1, w: 1, l: 1, d: 1 });
});

QUnit.test('Logger @ level 2', assert => {
    const printer = makeTestPrinter();
    const logger = new Logger(2, printer); // only warns and error
    logger.warn('a warning');
    logCountAssert({ message: 'after logging a warning', assert, logger, printer }, { e: 0, w: 1, l: 0, d: 0 });
    logger.error('an error');
    logCountAssert({ message: 'after logging an error', assert, logger, printer }, { e: 1, w: 1, l: 0, d: 0 });
    logger.log('a log');
    logCountAssert({ message: 'after logging', assert, logger, printer }, { e: 1, w: 1, l: 0, d: 0 });
    logger.debug('a debug');
    logCountAssert({ message: 'after logging a debug', assert, logger, printer }, { e: 1, w: 1, l: 0, d: 0});
});
