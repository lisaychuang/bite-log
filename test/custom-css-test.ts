import { Level } from 'bite-log';
import { makeTestLogger } from './test-helpers';

QUnit.module('Custom CSS test');
QUnit.test('Custom CSS can be applied', assert => {
  const {
    logger,
    printer: {
      messages: { warn }
    }
  } = makeTestLogger(Level.debug);

  // log something with custom css
  logger.css('color: #aaa').warn('a warning');
  // get the first warning message (an array of arguments
  const firstWarning = warn[0];
  const [firstWarnMessage, firstWarnStyle] = firstWarning;
  assert.ok(firstWarnMessage.indexOf('a warning') >= 0, 'Message is correct');
  assert.equal(firstWarnStyle, 'color: #aaa', 'Style is correct');
});
