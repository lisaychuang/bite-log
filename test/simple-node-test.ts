import Logger, { Level } from '../src/index';
import { makeTestLogger } from './test-helpers';

QUnit.module('Node.js simple logging cases');

QUnit.test('Logging with 1 style per message', assert => {
  const {
    printer: { messages },
    logger
  } = makeTestLogger(Level.debug, 'node');
  logger.red.warn('a warning');
  logger.bgYellow.debug('a debug');
  logger.darkOrchid.log('a log');
  logger.bgLavenderBlush.error('an error');

  // Make sure each of the message's color styling are not applied in Node
  assert.deepEqual(messages, {
    warn: [['a warning']],
    debug: [['a debug']],
    log: [['a log']],
    error: [['an error']]
  });
});

QUnit.test('Prefixes are styled correctly', assert => {
  const {
    logger,
    printer: {
      messages: { error }
    }
  } = makeTestLogger(Level.warn, 'node');
  logger.pushPrefix('prefix');
  logger.error('Prefix this error');

  // Make sure Prefix is styled [prefix]
  assert.deepEqual(error[0][0], '[prefix] Prefix this error');
  assert.equal(
    error[0].length,
    1,
    'There are no style applied to the "blank space"'
  );
});

QUnit.test('All style are removed from multi-segment messages', assert => {
  const {
    printer: {
      messages: { log }
    },
    logger
  } = makeTestLogger(Level.debug, 'node');
  logger.bgAliceBlue.pushPrefix('AAA').pushPrefix('bbb');
  logger.red.txt('should have no style').log('should have no styles either');

  assert.equal(
    log[0].length,
    1,
    'There are no style applied to the "blank space"'
  );
  assert.deepEqual(
    log[0],

    ['[AAA][bbb] should have no styleshould have no styles either'],
    'Log message in node has no styling'
  );
});
