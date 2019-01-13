/**
 * A* search
 *
 * Expands based on cost and heuristics
 *
 * completness: (depending on the heuristics)
 * admissability: (depending on the heuristics)
 */
module.exports = {
  requires: {
    heuristics: 'function',
  },
  evaluationFn: ({ cost, data }, { heuristics }) => cost + heuristics(data),
};
