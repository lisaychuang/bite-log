import hello from 'bite-log';

QUnit.module('bite-log tests');

QUnit.test('hello', assert => {
  assert.equal(hello(), 'Hello from bite-log');
});
