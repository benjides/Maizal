/**
 * Weighted A* search
 *
 * Expands based on cost and heuristics giving a weight value to the heuristics
 *
 * completness: (depending on the heuristics)
 * admissability: (depending on the heuristics)
 */
module.exports = {
  requires: {
    heuristics: 'function',
    epsilon: 'number',
  },
  evaluationFn: ({ cost, data }, { heuristics, epsilon }) => cost + epsilon * heuristics(data),
};
