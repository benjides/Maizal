/**
 * Get statistics from the search
 *
 * @param {Maizal} maizal solved instance
 * @param {State} state reached goal state
 * @returns {Object}
 */
function stats(maizal, state) {
  return {
    cost: state.cost,
    depth: state.depth,
    nodes: maizal.closed.size(),
  };
}

module.exports = stats;
