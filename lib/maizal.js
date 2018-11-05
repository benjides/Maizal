var Maizal = require('./core/Maizal');

/**
 * Create an instance of Maizal
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Maizal} A new Maizal instance
 */
function createInstance(defaultConfig) {
  var instance = new Maizal(defaultConfig);
  return instance;
}

var maizal = createInstance();

maizal.Maizal = Maizal;

module.exports = maizal;

module.exports.default = maizal;
