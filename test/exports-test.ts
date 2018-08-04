import * as allExports from 'bite-log';

QUnit.module('the right things are exported from bite-log');

QUnit.test('Logger exists', assert => {
  assert.ok(allExports.default, 'default export exists');
});
