// Import library
const levels = require('./levels.js');
const consolog = require('./index.js');

// Create logger
const logger = consolog.getLogger();

// Configure mocks
const mockAction = jest.fn().mockName('mockAction');
consolog.config.actions.push(mockAction);

// Helper functions
function expectLogWithParams(level, message) {
  const lastCall = mockAction.mock.calls[mockAction.mock.calls.length - 1];

  expect(lastCall[1]).toBe(level);
  expect(lastCall[3]).toBe(message);
}

// Get testing!
test('Basic log', () => {
  logger.info('Basic log');
  expectLogWithParams(levels.INFO, 'Basic log');
  expect(mockAction.mock.calls[mockAction.mock.calls.length - 1][2]).toBe('');
});

test('Named logger', () => {
  const nlog = consolog.getLogger('named')
  nlog.info('Named logger');
  expectLogWithParams(levels.INFO, 'Named logger');
  expect(mockAction.mock.calls[mockAction.mock.calls.length - 1][2]).toBe('named');
});

function testThreshold(threshold) {
  const threshName = Object.keys(levels)[threshold];

  test(`Threshold ${threshName}: Testing trace message`, () => {
    const callCount = mockAction.mock.calls.length;
    consolog.config.threshold = threshold;
    logger.trace('this is a trace message');
    validateLog(threshold, levels.TRACE, 'this is a trace message', callCount);
  });

  test(`Threshold ${threshName}: Testing debug message`, () => {
    const callCount = mockAction.mock.calls.length;
    consolog.config.threshold = threshold;
    logger.debug('this is a debug message');
    validateLog(threshold, levels.DEBUG, 'this is a debug message', callCount);
  });

  test(`Threshold ${threshName}: Testing info message`, () => {
    const callCount = mockAction.mock.calls.length;
    consolog.config.threshold = threshold;
    logger.info('this is an info message');
    validateLog(threshold, levels.INFO, 'this is an info message', callCount);
  });

  test(`Threshold ${threshName}: Testing warning message`, () => {
    const callCount = mockAction.mock.calls.length;
    consolog.config.threshold = threshold;
    logger.warn('this is a warning message');
    validateLog(threshold, levels.WARN, 'this is a warning message', callCount);
  });

  test(`Threshold ${threshName}: Testing error message`, () => {
    const callCount = mockAction.mock.calls.length;
    consolog.config.threshold = threshold;
    logger.error('this is an error message');
    validateLog(threshold, levels.ERROR, 'this is an error message', callCount);
  });

  test(`Threshold ${threshName}: Testing fatal message`, () => {
    const callCount = mockAction.mock.calls.length;
    consolog.config.threshold = threshold;
    logger.fatal('this is a fatal message');
    validateLog(threshold, levels.FATAL, 'this is a fatal message', callCount);
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

for (let level = levels.TRACE; level <= levels.FATAL; level++) {
  testThreshold(level);
}