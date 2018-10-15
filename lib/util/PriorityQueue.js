'use strict';

/**
 * Creates a new PriorityQueue
 *
 * @param {Function} compareFn Comparator function to place the element
 * @constructor
 */
function PriorityQueue(compareFn) {
  this._queue = []
  this.compareFn = compareFn || (() => 1 ) 
}

/**
 * Enqueues an element
 *
 * @param {*} element Enqueues an element in the proper position using the comparator function
 */
PriorityQueue.prototype.enqueue = function(element) {
  for (let i = 0; i < this._queue.length; i++) {
    if(this.compareFn(this._queue[i],element) >= 0) {
      this._queue.splice(i,0,element);
      return
    }
  }
  this._queue.push(element);
};

/**
 * Dequeues an element
 *
 * @return {*} Gets the first element of the queue and removes from the list
 */
PriorityQueue.prototype.dequeue = function() { 
  return this._queue.splice(0,1)[0] 
};

/**
 * Clears the queue
 */
PriorityQueue.prototype.clear = function() {
  this._queue = [];
}

/**
 * Gets the queue size
 * 
 * @returns {number}
 */
PriorityQueue.prototype.size = function() {
  return this._queue.length;
}

module.exports = PriorityQueue;
