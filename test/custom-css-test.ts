import Logger, { Level } from 'bite-log';
import { makeTestPrinter } from './test-helpers';

QUnit.module('Custom CSS test');
QUnit.test('Custom CSS can be applied', assert => {
  const printer = makeTestPrinter();
  const logger = new Logger(Level.debug, printer);

  // log something with custom css
  logger.css('color: #aaa').warn('a warning');
  // get the first warning message (an array of arguments
  const firstWarning = printer.messages.warn[0];
  const [firstWarnMessage, firstWarnStyle ] = firstWarning;
  assert.ok(firstWarnMessage.indexOf('a warning') >= 0, 'Message is correct');
  assert.equal(firstWarnStyle, 'color: #aaa', 'Style is correct');
});
