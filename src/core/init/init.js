const PriorityQueue = require('../../util/PriorityQueue');
const HashSet = require('../../util/HashSet');

/**
 * Defines the pool of yet unexplored states
 *
 * @param {Object} initial Intial state of the search
 * @param {String|Function} evaluationFn Function to place a state in the PriorityQueue
 * @returns {PriorityQueue}
 */
function initPool(goals, { initial, engine: { evaluationFn } }) {
  console.log(evaluationFn);
  if (!initial) {
    throw new Error('Missing initial state');
  }
  const pool = new PriorityQueue(evaluationFn);
  pool.enqueue({
    final: goals.has(initial),
    data: initial,
  });
  return pool;
}

/**
 * Defines a closed set to introduce already visited states
 *
 * @param {String|Int|Function} hash HashFn to determine whether two states are essentially the same
 * @returns {HashSet}
 */
function initClosed({ hash }) {
  return new HashSet(hash);
}

/**
 * Defines the user created actions
 *
 * @param {Array|Object} actions Array or Object containing the user defined actions
 * @returns {Array} Actions array
 */
function initActions({ actions }) {
  return (Array.isArray(actions) ? actions : [actions]).map((action) => {
    if (!action.expand) throw new Error(`Every action needs to have its expand functionno on action ${JSON.stringify(action)}`);
    return {
      name: action.name || 'expand',
      cost: action.cost || 1,
      expand: action.expand,
    };
  });
}

/**
 * Defines the user created goal states
 *
 * @param {Array|Object} goals Array containing the goal states
 * @param {String|Int|Function} hash HashFn to quickly recognize a goal state when is created
 * @returns {HashSet}
 */
function initGoals({ goals, hash }) {
  if (!hash) {
    throw new Error('Missing Hash function');
  }
  if (!goals) {
    throw new Error('Missing Goals states');
  }
  const g = new HashSet(hash);
  g.add(goals);
  return g;
}

/**
 * Sets the configuartion for the Maizal search
 *
 * @param {Maizal} maizal Maizal instance
 * @param {Object} config
 */
function init(maizal, config) {
  maizal.goals = initGoals(config);
  maizal.pool = initPool(maizal.goals, config);
  maizal.closed = initClosed(config);
  maizal.actions = initActions(config);
}

module.exports = init;
