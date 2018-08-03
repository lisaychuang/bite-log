import Logger, { Level } from 'bite-log';
import { logCountAssert, makeTestPrinter } from './test-helpers';

QUnit.module('Objects, arrays, functions, etc... should be loggable');

QUnit.test('I can log an object after my string message', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer); // only warns and error

  logger.log('Here are some numbers. They are increasing', [1, 2, 3, 4]);
  logCountAssert(
    { message: 'after a debug', assert, printer },
    { l: 1 } // one log message has been printed
  );

  assert.deepEqual(
    printer.messages,
    {
      log: [['Here are some numbers. They are increasing']],
      dir: [[1, 2, 3, 4]],
      error: [],
      warn: [],
      debug: []
    },
    'The thing passed to console.log was a string followed by my array of numbers'
  );
});

QUnit.test('Formatting is applied to the string', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer); // only warns and error

  logger.red.log('Here are some numbers. They are increasing', [1, 2, 3, 4]);
  logCountAssert(
    { message: 'after a debug', assert, printer },
    { l: 1 } // one log message has been printed
  );

  assert.deepEqual(
    printer.messages,
    {
      log: [['%cHere are some numbers. They are increasing', 'color: red;']],
      dir: [[1, 2, 3, 4]],
      error: [],
      warn: [],
      debug: []
    },
    'The thing passed to console.log was a string followed by my array of numbers'
  );
});

QUnit.test(
  'Formatting is applied to all strings passed to the logger',
  assert => {
    const printer = makeTestPrinter();
    const logger = new Logger(Level.debug, printer); // only warns and error

    logger.red.log(
      'Here are some numbers ',
      [1, 2, 3, 4],
      'They are increasing'
    );
    logCountAssert(
      { message: 'after a debug', assert, printer },
      { l: 1 } // one log message has been printed
    );

    // logger.red.txt('Here are some numbers. They are increasing')
    assert.deepEqual(
      printer.messages.log[0],
      ['%cHere are some numbers They are increasing', 'color: red;'],
      'The thing passed to console.log was a string followed by my array of numbers'
    );
  }
);
