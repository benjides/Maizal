/**
 * Best-first search
 *
 * Expands based purely on heuristics
 * note that the 1 is added to ensure we arte not getting 0 values on reaching goal states.
 *
 * completness: (depending on the heuristics)
 * admissability: (depending on the heuristics)
 */
module.exports = {
  requires: {
    heuristics: 'function',
  },
  evaluationFn: ({ data }, { heuristics }) => 1 + heuristics(data),
};
