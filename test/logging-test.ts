import { Level } from 'bite-log';
import { makeTestLogger } from './test-helpers';

QUnit.module('Logging through the printer');

QUnit.test('Logger @ level 4', assert => {
  const { logger, printer } = makeTestLogger(Level.debug);
  logger.warn('a warning');
  assert.logCount(printer, { e: 0, w: 1, l: 0, d: 0 }, 'after a warning');
  logger.error('an error');
  assert.logCount(printer, { e: 1, w: 1, l: 0, d: 0 }, 'after an error');
  logger.log('a log');
  assert.logCount(printer, { e: 1, w: 1, l: 1, d: 0 }, 'after a log');
  logger.debug('a debug');
  assert.logCount(printer, { e: 1, w: 1, l: 1, d: 1 }, 'after a debug');
});

QUnit.test('Logger @ level 2', assert => {
  const { logger, printer } = makeTestLogger(Level.warn);
  logger.warn('a warning');
  assert.logCount(
    printer,
    { e: 0, w: 1, l: 0, d: 0 },
    'after logging a warning'
  );
  logger.error('an error');
  assert.logCount(
    printer,
    { e: 1, w: 1, l: 0, d: 0 },
    'after logging an error'
  );
  logger.log('a log');
  assert.logCount(printer, { e: 1, w: 1, l: 0, d: 0 }, 'after logging');
  logger.debug('a debug');
  assert.logCount(printer, { e: 1, w: 1, l: 0, d: 0 }, 'after logging a debug');
});
