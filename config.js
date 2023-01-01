/* Global configuration object */
const levels = require('./levels.js');
const actions = require('./actions.js');

const globalKey = 'NODE_CONSOLOG_CONFIG';

class Config {
  threshold = process.env.LOGLEVEL ?? levels.INFO;
  actions = [...actions];
}

// Create a singleton instance of config object so that 
// settings can be shared (and controlled) across all 
// instances, even between different modules
if (typeof global[globalKey] === 'undefined') {
  global[globalKey] = new Config();
}

module.exports = global[globalKey];