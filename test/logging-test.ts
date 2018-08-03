import Logger, { Level } from 'bite-log';
import { logCountAssert, makeTestPrinter } from './test-helpers';

QUnit.module('Logging through the printer');

QUnit.test('Logger @ level 4', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer); // only warns and error
  logger.warn('a warning');
  logCountAssert(
    { message: 'after a warning', assert, printer },
    { e: 0, w: 1, l: 0, d: 0 }
  );
  logger.error('an error');
  logCountAssert(
    { message: 'after an error', assert, printer },
    { e: 1, w: 1, l: 0, d: 0 }
  );
  logger.log('a log');
  logCountAssert(
    { message: 'after a log', assert, printer },
    { e: 1, w: 1, l: 1, d: 0 }
  );
  logger.debug('a debug');
  logCountAssert(
    { message: 'after a debug', assert, printer },
    { e: 1, w: 1, l: 1, d: 1 }
  );
});

QUnit.test('Logger @ level 2', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.warn, printer); // only warns and error
  logger.warn('a warning');
  logCountAssert(
    { message: 'after logging a warning', assert, printer },
    { e: 0, w: 1, l: 0, d: 0 }
  );
  logger.error('an error');
  logCountAssert(
    { message: 'after logging an error', assert, printer },
    { e: 1, w: 1, l: 0, d: 0 }
  );
  logger.log('a log');
  logCountAssert(
    { message: 'after logging', assert, printer },
    { e: 1, w: 1, l: 0, d: 0 }
  );
  logger.debug('a debug');
  logCountAssert(
    { message: 'after logging a debug', assert, printer },
    { e: 1, w: 1, l: 0, d: 0 }
  );
});
