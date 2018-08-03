import Logger, { Level } from 'bite-log';

QUnit.module('bite-log tests');

QUnit.test('Logger', assert => {
  const logger = new Logger(Level.warn); // only warns and error
  // console.log('%c Oh my heavens! ', 'background: #222; color: #bada55');
  logger.debug(' (debug) Oh my heavens');
  logger.log(' (log) Oh my heavens');
  logger.warn(' (warn) Oh my heavens');
  logger.error(' (error) Oh my heavens');
  assert.ok(logger, 'logger exists');
});


// logger

// logger
//   .bgWhite.red.txt('my message')
//   .blue.large.txt('another');
//   .debug();

// logger
//   .bgWhite.red.txt('my message')
//   .blue.large.debug('another');


// msgsAndStyles
// [
//   ['hello', 'color: red'],
//   ['Im yellow', 'background: yellow']
// ]
