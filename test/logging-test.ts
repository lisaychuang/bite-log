import Logger, { Printer } from 'bite-log';

function makeTestPrinter(): Printer & { messages: any } {
    const printer = {
        messages: {
            log: [],
            debug: [],
            warn: [],
            error: [],
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

QUnit.module('Logging through the printer');

QUnit.test('Logger', assert => {
    const printer = makeTestPrinter();
    const logger = new Logger(2, printer); // only warns and error
    logger.warn('a warning');

    assert.equal(printer.messages.warn.length, 1, 'One warning was logged');
});
