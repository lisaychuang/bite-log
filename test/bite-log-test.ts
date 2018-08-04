import * as BL from 'bite-log';
// tslint:disable-next-line:no-duplicate-imports
import { LoggerWithStyles } from 'bite-log';

QUnit.module('Public API is correct');

QUnit.test('Logger as a default export', assert => {
  assert.equal(typeof BL.default, 'function', 'it\'s a function');
  assert.deepEqual(
    Object.keys(BL),
    ['default'],
    'aside from types, there is a "default" export'
  );
  assert.deepEqual(
    typeof BL.default.prototype,
    'object',
    'Logger looks like a class'
  );
  assert.ok(new BL.default(), 'Logger can be used with the `new` keyword');
});

QUnit.test('Level as a named export', assert => {
  assert.equal(BL.Level.error, 1, 'Level.error = 1');
  assert.equal(BL.Level.warn, 2, 'Level.error = 2');
  assert.equal(BL.Level.log, 3, 'Level.error = 3');
  assert.equal(BL.Level.debug, 4, 'Level.error = 4');
});

/**
 * The following are just TS interface/type tests. Their failures may be caught
 * by running `npm run-script problems`
 */

const x: LoggerWithStyles = new BL.default(4);
// tslint:disable-next-line:no-unused-expression
x.red;
// tslint:disable-next-line:no-unused-expression
x.bgBeige;
// tslint:disable-next-line:no-unused-expression
x.bold;
