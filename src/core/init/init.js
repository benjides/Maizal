const PriorityQueue = require('../../util/PriorityQueue');
const HashSet = require('../../util/HashSet');

/**
 * Defines the poll of yet unexplored states
 *
 * @param {HashSet} goals HashSet containing the user defined goals
 * @param {Object} config User defined search configuration
 * @returns {PriorityQueue}
 */
function initPoll(goals, config) {
  if (!config.initial) {
    throw new Error('Missing initial state');
  }

  const evaluationFn = state => config.engine.evaluationFn(state, config);

  const poll = new PriorityQueue(evaluationFn);
  poll.enqueue({
    final: goals.has(config.initial),
    data: config.initial,
  });
  return poll;
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

function setup(config) {
  if (!config.engine.requires) {
    return;
  }
  Object.keys(config.engine.requires).forEach((requirement) => {
    if (typeof config[requirement] !== config.engine.requires[requirement]) {
      throw new Error(`The search requires the field ${requirement} to be a ${config.engine.requires[requirement]}`);
    }
  });
}

/**
 * Sets the configuartion for the Maizal search
 *
 * @param {Maizal} maizal Maizal instance
 * @param {Object} config
 */
function init(maizal, config) {
  setup(config);
  maizal.goals = initGoals(config);
  maizal.poll = initPoll(maizal.goals, config);
  maizal.closed = initClosed(config);
  maizal.actions = initActions(config);
}

module.exports = init;
