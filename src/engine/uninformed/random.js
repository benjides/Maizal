/**
 * Random search
 *
 * Expands nodes randomly
 *
 * completness: true
 * admissability: false
 */
module.exports = {
  evaluationFn: () => Math.floor(Math.random() * 100),
};
