import Logger, { Level } from 'bite-log'
import { makeTestPrinter } from './test-helpers';

QUnit.module('Log messages with colors');

QUnit.test('Logging with 1 style per message', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer);
  logger.red.warn('a warning');
  logger.red.debug('a debug');
  logger.red.log('a log');
  logger.red.error('an error');

  // Make sure each of the messages are correct
  assert.deepEqual(printer.messages, {
    debug: [['%ca debug', 'color: red;']],
    error: [['%can error', 'color: red;']],
    log: [['%ca log', 'color: red;']],
    warn: [['%ca warning', 'color: red;']]
  });
});
