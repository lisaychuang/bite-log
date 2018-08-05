import { Level } from 'bite-log';
import { makeTestLogger } from './test-helpers';

QUnit.module('Tagged logging');

QUnit.test(
  'Pushing a tag results in the log mesages being prefixed',
  assert => {
    const { logger, printer } = makeTestLogger(Level.debug);
    logger.log('hello'); // "hello"
    logger.log('world'); // "world"
    logger.pushPrefix('foo');
    logger.log('goodbye'); // "[foo]: goodbye"
    logger.log('mars'); // "[foo]: mars"
    logger.pushPrefix('bar');
    logger.log('(and saturn!)'); // "[foo][bar]: (and saturn)!"
    logger.popPrefix();
    logger.popPrefix();
    logger.log('but not pluto'); // "but not pluto"
    assert.logCount(printer, { l: 6 }, 'after logging four things');
    const logs = printer.messages.log;
    assert.ok(
      logs[0].join('').indexOf('foo') < 0,
      'First message has no "foo" tag'
    );
    assert.ok(
      logs[1].join('').indexOf('foo') < 0,
      'Second message has no "foo" tag'
    );
    assert.ok(
      logs[2].join('').indexOf('foo') >= 0,
      'Third message has a "foo" tag'
    );
    assert.ok(
      logs[3].join('').indexOf('foo') >= 0,
      'Fourth message has a "foo" tag'
    );
    assert.ok(
      logs[4].join('').indexOf('foo') >= 0,
      'Fifth message has a "foo" tag'
    );
    assert.ok(
      logs[4].join('').indexOf('bar') >= 0,
      'Fifth message has a "bar" tag'
    );
    assert.ok(
      logs[5].join('').indexOf('foo') < 0,
      'Sixth message has no "foo" tag'
    );
  }
);
