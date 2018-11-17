const init = require('./init/init');
const solve = require('./solver/solver');

/**
 * Creates a Maizal instance
 *
 * @constructor
 * @param {Object} config object containing the necesarry configuation to start a search
 */
function Maizal(config) {
  init(this, config);
}

/**
 * Solves a search problem
 *
 * @returns {Promise} Promise including the search results
 */
Maizal.prototype.solve = function () {
  return solve(this);
};

module.exports = Maizal;
