'use strict';

var PriorityQueue = require('../util/PriorityQueue');
var HashSet = require('../util/HashSet');
var engines = require('../engine/engines');

/**
 * Create a new Maizal instance
 *
 */
function Maizal() {}

Maizal.prototype.setup = function(config) {
  if(config.engine.setup) config.engine.setup(config)

  this._pool = definePool(config.initial, config.engine.evaluationFn)
  this._closed = defineClosed(config.hash)
  this._actions = defineActions(config.actions)
  this._goals = defineGoals(config.goals, config.hash)
  
}

/**
 * Solves a search problem
 *
 * @param {Object} config The config specific for this engine
 */
Maizal.prototype.solve = function solve(config) {
  this.setup(config)
  return this.expand()
};

Maizal.prototype.expand =  function expand() {
  let _state = this._pool.dequeue();
  if (_state === undefined) return Promise.reject('The goal states could not be reached. Are you sure they are accesible?')
  if (_state.final) return Promise.resolve().then(() => rebuild(_state))
  let promises = this._actions.map(action => {
    return new Promise((resolve) => {
      resolve(action.expand(_state.data))
    }).then(states => {
      if(!Array.isArray(states)) states = [states]
      return states.filter(state => (state !== undefined && !this._closed.has(state)))
    }).then(states => {
      return states.map(state => {
        return {
          final: this._goals.has(state),
          cost: _state.cost + action.cost,
          depth: _state.depth + 1,
          parent: _state,
          action: action.name,
          data: state
        }
      })
    }).then(states => this._pool.enqueue(states))
  })
  return Promise.all(promises).then(() => this._closed.add(_state.data)).then(() => this.expand())
}

/**
 * Defines the pool of yet unexplored states
 * 
 * @param {Object} initial Intial state of the search
 * @param {String|Function} evaluationFn Function to place a state in the PriorityQueue
 * @returns {PriorityQueue}
 */
function definePool(initial, evaluationFn) {
  if(!initial) throw new Error('The initial state must be provided')
  var _pool = new PriorityQueue(evaluationFn);
  _pool.enqueue({
    final: false,
    cost: 0,
    depth: 0,
    data: initial
  });
  return _pool
}

/**
 * Defines a closed set to introduce already visited states
 * 
 * @param {String|Int|Function} hash HashFn to determine whether two states are essentially the same
 * @returns {HashSet}
 */
function defineClosed(hash) {
  if(!hash) throw new Error('The hash to determine whether two states are the same must be provided')
  return new HashSet(hash)
}

/**
 * Defines the user created actions
 * 
 * @param {Array|Object} actions Array or Object containing the user defined actions
 * @returns {Array} Actions array
 */
function defineActions(actions) {
  var _actions = actions;
  if (!Array.isArray(actions)) {
    _actions = [actions];
  }
  return _actions.map(function(action) {
    if (!action.expand) throw new Error('Every action needs to have its expand function on action ' + JSON.stringify(action) );
    return {
      name: action.name || 'expand',
      cost: action.cost || 1,
      expand: action.expand
    };
  });
};

/**
 * Defines the user created goal states
 * 
 * @param {Array|Object} goals Array containing the goal states
 * @param {String|Int|Function} hash HashFn to quickly recognize a goal state when is created
 * @returns {HashSet}
 */
function defineGoals(goals, hash) {
  var _goals = new HashSet(hash)
  _goals.add(goals)
  return _goals
};

/**
 * Rebuild the tree once the solution is found
 * 
 * @param {Object} state goal state of the search
 * @returns {Array} ordered array containing the path from the initial state to the goal one.
 */
function rebuild(state) {
  var tree = [];
  while (state !== undefined) {
    let {final, parent, ...s} = state
    tree.unshift(s);
    state = parent
  }
  return tree
}

/**
 * Expose maizal.engine
 */
Object.keys(engines).forEach(function(engine) {
  Maizal.prototype[engine] = function(config) {
    config.engine = {engine, ...engines[engine]};
    return this.solve(config);
  };
});

module.exports = Maizal;
