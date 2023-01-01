/* Main */
const levels = require('./levels.js');
const config = require('./config.js');
const loggers = {};

class Logger {
  constructor(name) {
    this._name = name ?? '';
  }

  trace = msg => this.log(msg, levels.TRACE);
  debug = msg => this.log(msg, levels.DEBUG);
  info  = msg => this.log(msg, levels.INFO);
  warn  = msg => this.log(msg, levels.WARN);
  error = msg => this.log(msg, levels.ERROR);
  fatal = msg => this.log(msg, levels.FATAL);

  log(message, level = levels.TRACE) {
    if (level >= config.threshold) {
      const two = num => `0${num.toString()}`.slice(-2);
      const now = new Date();
      const timestamp = `${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`;
      
      for (let i = 0; i < config.actions.length; i++) {
        config.actions[i](timestamp, level, this._name, message);
      }
    }
  }
}

function getLogger(name) {
  if (!loggers[name]) {
    loggers[name] = new Logger(name);
  }

  return loggers[name];
}

module.exports = {
  config,
  levels,
  loggers,
  getLogger
};
