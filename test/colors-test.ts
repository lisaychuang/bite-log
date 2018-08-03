import Logger, { Level } from 'bite-log';
import { logCountAssert, makeTestPrinter } from './test-helpers';

QUnit.module('The ability to color console messages');

QUnit.test('Logger in red works', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer);
  assert.ok(logger.red instanceof Logger, 'logger.red is a logger');
  assert.equal(
    typeof logger.red.log,
    'function',
    'logger.red.log is a function'
  );
  logger.red.log('foo');

  logCountAssert(
    {
      message: 'after logging in red, we should see one log message',
      assert,
      printer
    },
    { e: 0, w: 0, l: 1, d: 0 }
  );
});

QUnit.test('Logger in blue background works', assert => {
    const printer = makeTestPrinter();
    const logger = new Logger(Level.debug, printer);
    assert.ok(logger.bgBlue instanceof Logger, 'logger.bgBlue is a logger');
    assert.equal(
      typeof logger.bgBlue.log,
      'function',
      'logger.bgBlue.log is a function'
    );
    logger.bgBlue.log('my background is blue');

    logCountAssert(
      {
        message: 'after logging with blue background, we should see one log message',
        assert,
        printer
      },
      { e: 0, w: 0, l: 1, d: 0 }
    );
  });

// logger.red().log('foo')

// logger
//   .bgWhite.red.txt('my message')
//   .blue.large.txt('another');
//   .debug();
