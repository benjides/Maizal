/**
 * Random search
 *
 * Expands nodes randomly
 *
 * completness: true
 * admissability: false
 */
module.exports = {
  evaluationFn: () => Math.round(Math.random()) + 1,
};
