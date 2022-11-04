// import library
const consolog = require('./index');
const { LogLevel } = consolog;

// configure mocks
const mockAction = jest.fn().mockName('mockAction');
consolog.actions.push(mockAction);

// helper functions
function expectLogWithParams(level, message) {
  const lastCall = mockAction.mock.calls[mockAction.mock.calls.length - 1];

  expect(lastCall[1]).toBe(level);
  expect(lastCall[3]).toBe(message);
}

const logger = consolog.getLogger();

// get testing!
test('Basic log', () => {
  logger.info('Basic log');
  expectLogWithParams(LogLevel.INFO, 'Basic log');
  expect(mockAction.mock.calls[mockAction.mock.calls.length - 1][2]).toBe('');
});

test('Named logger', () => {
  const nlog = consolog.getLogger('named')
  nlog.info('Named logger');
  expectLogWithParams(LogLevel.INFO, 'Named logger');
  expect(mockAction.mock.calls[mockAction.mock.calls.length - 1][2]).toBe('named');
});

// Loop through all thresholds and levels
for (let level = LogLevel.TRACE; level <= LogLevel.FATAL; level++){
  testThreshold(level);
}

function testThreshold(threshold) {
  const threshName = Object.keys(LogLevel)[threshold];
  const tmpLogger = consolog.getLogger(`threshold-${threshName}`);
  tmpLogger.threshold = threshold;

  test(`Threshold ${threshName}: Testing trace message`, () => {
    const callCount = mockAction.mock.calls.length;
    tmpLogger.trace('this is a trace message');
    validateLog(threshold, LogLevel.TRACE, 'this is a trace message', callCount);
  });

  test(`Threshold ${threshName}: Testing debug message`, () => {
    const callCount = mockAction.mock.calls.length;
    tmpLogger.debug('this is a debug message');
    validateLog(threshold, LogLevel.DEBUG, 'this is a debug message', callCount);
  });

  test(`Threshold ${threshName}: Testing info message`, () => {
    const callCount = mockAction.mock.calls.length;
    tmpLogger.info('this is an info message');
    validateLog(threshold, LogLevel.INFO, 'this is an info message', callCount);
  });

  test(`Threshold ${threshName}: Testing warning message`, () => {
    const callCount = mockAction.mock.calls.length;
    tmpLogger.warn('this is a warning message');
    validateLog(threshold, LogLevel.WARN, 'this is a warning message', callCount);
  });

  test(`Threshold ${threshName}: Testing error message`, () => {
    const callCount = mockAction.mock.calls.length;
    tmpLogger.error('this is an error message');
    validateLog(threshold, LogLevel.ERROR, 'this is an error message', callCount);
  });

  test(`Threshold ${threshName}: Testing fatal message`, () => {
    const callCount = mockAction.mock.calls.length;
    tmpLogger.fatal('this is a fatal message');
    validateLog(threshold, LogLevel.FATAL, 'this is a fatal message', callCount);
  });
}

function validateLog(threshold, level, message, callCount) {
  if (level >= threshold) {
    expect(mockAction.mock.calls.length).toBe(callCount + 1);
    expectLogWithParams(level, message);
  }
  else {
    expect(mockAction.mock.calls.length).toBe(callCount);
  }
}
