import Logger, { Level } from 'bite-log';
import { makeTestLogger } from './test-helpers';
QUnit.module('The ability to color console messages');

QUnit.test('Logger in red works', assert => {
  const { logger, printer } = makeTestLogger(Level.debug);
  assert.ok(logger.red instanceof Logger, 'logger.red is a logger');
  assert.equal(
    typeof logger.red.log,
    'function',
    'logger.red.log is a function'
  );
  logger.red.log('foo');

  assert.logCount(
    printer,
    { e: 0, w: 0, l: 1, d: 0 },
    'after logging in red, we should see one log message'
  );
});

QUnit.test('Logger in blue background works', assert => {
  const { logger, printer } = makeTestLogger(Level.debug);
  assert.ok(logger.bgBlue instanceof Logger, 'logger.bgBlue is a logger');
  assert.equal(
    typeof logger.bgBlue.log,
    'function',
    'logger.bgBlue.log is a function'
  );
  logger.bgBlue.log('my background is blue');

  assert.logCount(
    printer,
    { e: 0, w: 0, l: 1, d: 0 },
    'after logging with blue background, we should see one log message'
  );
});
