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

  // Make sure each of the message's color styling are correct
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

  // Make sure each of the message's chained styling is correct
  assert.deepEqual(printer.messages, {
    warn: [['%ca warning', 'font-weight: bold;']],
    debug: [['%ca debug', 'color: blue;text-decoration: underline;']],
    log: [
      ['%ca log', 'background-color: yellow;text-decoration: line-through;']
    ],
    error: [['%can error', 'font-style: italic;']]
  });
});

QUnit.test('Logging with multiple styles per message', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.warn, printer);
  logger.huge.error('OMG you have an error!');
  logger.big.warn('Houston, we have a problem');

  // Make sure each of the message's chained styling is correct
  assert.deepEqual(printer.messages.error, [
    ['%cOMG you have an error!', 'font-size: 2em;']
  ]);
  assert.deepEqual(printer.messages.warn, [
    ['%cHouston, we have a problem', 'font-size: 1.5em;']
  ]);
});

QUnit.test('Prefixes are styled correctly', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.warn, printer);
  logger.pushPrefix('prefix');
  logger.error('Prefix this error');

  // Make sure Prefix is styled %c[prefix]%c
  assert.deepEqual(
    printer.messages.error[0][0],
    '[prefix]%c %cPrefix this error' // console.log('%c[]......')
  );
  assert.ok(
    printer.messages.error[0].indexOf(
      // search ALL arguments that might have been passed to console.log
      'color: inherit; background-color: transparent;'
    ) >= 0,
    'I found the style for a "blank space" somewhere'
  );
});
