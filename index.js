const logger = require('loglevel');
const prefix = require('loglevel-plugin-prefix');
const chalk = require('chalk');

const colors = {
  TRACE: chalk.gray,
  DEBUG: chalk.magenta,
  INFO: chalk.cyan,
  WARN: chalk.yellowBright,
  ERROR: chalk.redBright,
};

logger.setLevel(process.env.LOGLEVEL || logger.levels.INFO);
prefix.reg(logger);
prefix.apply(logger, {
  format(level, name, timestamp) {
    return `${chalk.bgGray.black(` ${timestamp} `)} ${chalk.gray(`${name}`)} ${colors[level.toUpperCase()](level)}`;
  },
});

module.exports = {
  getLogger: name => logger.getLogger(name)
};