/**
 * Depth-first Search
 *
 * Expands nodes on depth
 *
 * completness: true
 * admissability: false
 */
module.exports = {
  evaluationFn: (current, insert) => insert.depth - current.depth,
};
