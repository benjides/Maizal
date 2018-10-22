'use strict';

/**
 * Creates a new PriorityQueue
 *
 * @param {Function|Field} compareFunction Field or function to place the element
 * @constructor
 */
function PriorityQueue(compareFunction) {
  switch (typeof compareFunction) {
  case 'string':
    this.compareFn = function compareFn(a, b) {
      return a[compareFunction] - b[compareFunction];
    };
    break;
  case 'function':
    this.compareFn = compareFunction;
    break;
  default:
    this.compareFn = function compareFn() {
      return 1;
    };
  }
  this._queue = [];
}

/**
 * Enqueues an element
 *
 * @param {*} element Enqueues an element in the proper position using the comparator function
 * @return {number} Position where the element was placed
 */
PriorityQueue.prototype.enqueue = function enqueue(element) {
  if (Array.isArray(element)) {
    return this.enqueueArray(element);
  }
  for (var i = 0; i < this._queue.length; i++) {
    if (this.compareFn(this._queue[i], element) >= 0) {
      this._queue.splice(i, 0, element);
      return i;
    }
  }
  return this._queue.push(element) - 1;
};

/**
 * Enqueues an Array of elements
 *
 * @param {array} array Array of elements to be enqueued
 * @return {array} Position array where the elements were placed
 */
PriorityQueue.prototype.enqueueArray = function enqueueArray(elements) {
  return elements.map(function map(element) {
    return this.enqueue(element);
  }.bind(this));
};

/**
 * Dequeues an element
 *
 * @return {*} Gets the first element of the queue and removes from the list
 */
PriorityQueue.prototype.dequeue = function dequeue() {
  return this._queue.splice(0, 1)[0];
};

/**
 * Clears the queue
 */
PriorityQueue.prototype.clear = function clear() {
  this._queue = [];
};

/**
 * Gets the queue size
 *
 * @returns {number}
 */
PriorityQueue.prototype.size = function size() {
  return this._queue.length;
};

module.exports = PriorityQueue;
