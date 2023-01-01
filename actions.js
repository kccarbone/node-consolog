/* Built-in actions */

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

module.exports = [
  printToConsole
];