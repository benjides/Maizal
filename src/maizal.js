const Maizal = require('./core/Maizal');
const engines = require('./engine/engines');

const maizal = {};

/**
 * Expose maizal.engine
 */
Object.keys(engines).forEach((engine) => {
  maizal[engine] = (config) => {
    config.engine = engines[engine];
    try {
      return new Maizal(config).solve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
});

module.exports = maizal;
