import { Level } from 'bite-log';
import { makeTestLogger } from './test-helpers';

QUnit.module('Log messages with a variety of formatting');

QUnit.test('Logging with 1 style per message', assert => {
  const {
    printer: { messages },
    logger
  } = makeTestLogger(Level.debug);
  logger.red.warn('a warning');
  logger.bgYellow.debug('a debug');
  logger.darkOrchid.log('a log');
  logger.bgLavenderBlush.error('an error');

  // Make sure each of the message's color styling are correct
  assert.deepEqual(messages, {
    warn: [['%ca warning', 'color: red;']],
    debug: [['%ca debug', 'background-color: yellow;']],
    log: [['%ca log', 'color: darkOrchid;']],
    error: [['%can error', 'background-color: lavenderBlush;']]
  });
});

QUnit.test('Logging with multiple styles per message', assert => {
  const {
    printer: { messages },
    logger
  } = makeTestLogger(Level.debug);
  logger.bold.warn('a warning');
  logger.blue.underline.debug('a debug');
  logger.bgYellow.strikethrough.log('a log');
  logger.italic.error('an error');

  // Make sure each of the message's chained styling is correct
  assert.deepEqual(messages, {
    warn: [['%ca warning', 'font-weight: bold;']],
    debug: [['%ca debug', 'color: blue;text-decoration: underline;']],
    log: [
      ['%ca log', 'background-color: yellow;text-decoration: line-through;']
    ],
    error: [['%can error', 'font-style: italic;']]
  });
});

QUnit.test('Logging with multiple styles per message', assert => {
  const {
    logger,
    printer: {
      messages: { error, warn }
    }
  } = makeTestLogger(Level.warn);
  logger.huge.error('OMG you have an error!');
  logger.big.warn('Houston, we have a problem');

  // Make sure each of the message's chained styling is correct
  assert.deepEqual(error, [['%cOMG you have an error!', 'font-size: 2em;']]);
  assert.deepEqual(warn, [
    ['%cHouston, we have a problem', 'font-size: 1.5em;']
  ]);
});

QUnit.test('Prefixes are styled correctly', assert => {
  const {
    logger,
    printer: {
      messages: { error }
    }
  } = makeTestLogger(Level.warn);
  logger.pushPrefix('prefix');
  logger.error('Prefix this error');

  // Make sure Prefix is styled %c[prefix]%c
  assert.deepEqual(
    error[0][0],
    '[prefix]%c %cPrefix this error' // console.log('%c[]......')
  );
  assert.ok(
    error[0].indexOf(
      // search ALL arguments that might have been passed to console.log
      'color: inherit; background-color: transparent;'
    ) >= 0,
    'I found the style for a "blank space" somewhere'
  );
});

QUnit.test(
  'Unsyled stuff following styled stuff gets "clear" styles',
  assert => {
    const {
      printer: {
        messages: { log }
      },
      logger
    } = makeTestLogger(Level.debug);
    logger.bgAliceBlue.pushPrefix('AAA').pushPrefix('bbb');
    logger.red.txt('should be red').log('should be "clear');

    assert.ok(
      log[0].indexOf(
        // search ALL arguments that might have been passed to console.log
        'color: inherit; background-color: transparent;'
      ) >= 0,
      'I found the style for a "blank space" somewhere'
    );
    assert.deepEqual(
      log[0],

      [
        '%c[AAA]%c[bbb]%c %cshould be red%cshould be "clear',
        'background-color: aliceBlue;',
        'color: inherit; background-color: transparent;',
        'color: inherit; background-color: transparent;',
        'color: red;',
        'color: inherit; background-color: transparent;'
      ],
      'first log message is correct'
    );
  }
);

// logger.debug('hello')  --> console.log('hello')
QUnit.test('No styles are applied', assert => {
  const {
    printer: { messages },
    logger
  } = makeTestLogger(Level.debug);
  logger.log('I have no prefix or colors');

  // No prefix or colors
  assert.deepEqual(messages, {
    log: [['I have no prefix or colors']],
    warn: [],
    error: [],
    debug: []
  });
});
