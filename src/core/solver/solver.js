const node = require('../node');
const rebuild = require('./rebuild');
const stats = require('./stats');

/**
 * Expands recursively the most promising node acording to the priorityQueue
 *
 * @param {Maizal} maizal instance
 * @returns {Promise} the results of the search
 */
function expand(maizal) {
  const state = maizal.poll.dequeue();
  if (!state) {
    return Promise.reject(new Error('The goal states could not be reached. Are you sure they are accesible?'));
  }
  if (state.final) {
    return Promise.resolve().then(() => ({ stats: stats(maizal, state), solution: rebuild(state) }));
  }
  const promises = maizal.actions.map(action => new Promise(resolve => resolve(action.expand(state.data)))
    .then(states => (Array.isArray(states) ? states : [states]))
    .then(states => states.filter(data => (data && !maizal.closed.has(data))))
    .then(states => states.map(data => node({
      parent: state, data, final: maizal.goals.has(data), action,
    })))
    .then(states => maizal.poll.enqueue(states)));
  return Promise.all(promises).then(() => maizal.closed.add(state.data)).then(() => expand(maizal));
}

module.exports = maizal => expand(maizal);
