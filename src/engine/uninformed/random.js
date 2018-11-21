/**
 * Random search
 *
 * Expands nodes randomly
 *
 * completness: true
 * admissability: false
 */
module.exports = {
  evaluationFn: () => 2 * Math.round(Math.random()) - 1,
};
