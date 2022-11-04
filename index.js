const LogLevel = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
};

const globalThreshold = process.env.LOGLEVEL ?? LogLevel.INFO;
const actions = [printToConsole];
const loggers = {};

class Logger {
  threshold;

  constructor(name, threshold) {
    this._name = name ?? '';
    this.threshold = threshold ?? globalThreshold;
  }

  trace = msg => this.log(msg, LogLevel.TRACE);
  debug = msg => this.log(msg, LogLevel.DEBUG);
  info  = msg => this.log(msg, LogLevel.INFO);
  warn  = msg => this.log(msg, LogLevel.WARN);
  error = msg => this.log(msg, LogLevel.ERROR);
  fatal = msg => this.log(msg, LogLevel.FATAL);

  log(message, level = LogLevel.TRACE) {
    if (level >= this.threshold) {
      const two = num => `0${num.toString()}`.slice(-2);
      const now = new Date();
      const timestamp = `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`;

      for (let i = 0; i < actions.length; i++) {
        actions[i](timestamp, level, this._name, message);
      }
    }
  }
}

function printToConsole(timestamp, level, name, message) {
  const color = [
    { label: 'TRACE', fg: 90, bg: 49 },
    { label: 'DEBUG', fg: 36, bg: 49 },
    { label: 'INFO ', fg: 37, bg: 49 },
    { label: 'WARN ', fg: 30, bg: 103, accent: 93 },
    { label: 'ERROR', fg: 30, bg: 101, accent: 91 },
    { label: 'FATAL', fg: 30, bg: 105, accent: 95 }
  ][level];

  const style = (str, ...codes) => `\x1b[${codes.join(';')}m${str}\x1b[0m`;

  console.log(''
    + style(`[${timestamp}] `, color.accent ?? 37)
    + style(`${color.label}`, color.fg, color.bg)
    + style((name ? ` (${name}) ` : ' '), color.accent ?? 90)
    + style(`${message}`, 39, 49)
  );
}

function getLogger(name, threshold) {
  if (!loggers[name]) {
    loggers[name] = new Logger(name, threshold);
  }

  return loggers[name];
}

module.exports = {
  LogLevel,
  actions,
  loggers,
  getLogger
};
