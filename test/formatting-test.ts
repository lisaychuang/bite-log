import Logger, { Level } from 'bite-log';
import { makeTestPrinter } from './test-helpers';

QUnit.module('Log messages with a variety of formatting');

QUnit.test('Logging with 1 style per message', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer);
  logger.red.warn('a warning');
  logger.bgYellow.debug('a debug');
  logger.darkOrchid.log('a log');
  logger.bgLavenderBlush.error('an error');

  // Make sure each of the messages are correct
  assert.deepEqual(printer.messages, {
    warn: [['%ca warning', 'color: red;']],
    debug: [['%ca debug', 'background-color: yellow;']],
    log: [['%ca log', 'color: darkOrchid;']],
    error: [['%can error', 'background-color: lavenderBlush;']]
  });
});

QUnit.test('Logging with multiple styles per message', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer);
  logger.bold.warn('a warning');
  logger.blue.underline.debug('a debug');
  logger.bgYellow.strikethrough.log('a log');
  logger.italic.error('an error');

  // Make sure each of the messages are correct
  assert.deepEqual(printer.messages, {
    warn: [['%ca warning', 'font-weight: bold;']],
    debug: [['%ca debug', 'color: blue;text-decoration: underline;']],
    log: [['%ca log', 'background-color: yellow;text-decoration: line-through;']],
    error: [['%can error', 'font-style: italic;']]
  });
});
