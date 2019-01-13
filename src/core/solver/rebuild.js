/**
 * Rebuild the tree once the solution is found
 *
 * @param {Object} goal state of the search
 * @returns {Array} ordered array containing the path from the initial state to the goal one.
 */
function rebuild(goal) {
  const tree = [];
  let state = goal;
  while (state) {
    const {
      parent, data, action, cost, depth,
    } = state;
    const s = {
      data, cost, depth,
    };
    if (action) {
      s.action = action;
    }
    tree.unshift(s);
    state = parent;
  }
  return tree;
}

module.exports = rebuild;
