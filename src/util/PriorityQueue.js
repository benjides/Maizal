/**
 * Creates a new PriorityQueue
 *
 * @param {Function} priorityFunction Function over a element to state its integer priority
 * @constructor
 */
function PriorityQueue(priorityFunction) {
  if (!priorityFunction) {
    throw new Error('The priority function for an element must be provided');
  }
  this.priorityFn = (current, insert) => {
    if (!priorityFunction(insert)) {
      return undefined;
    }
    return priorityFunction(current) - priorityFunction(insert) > 0;
  };
  this.queue = [];
}

/**
 * Enqueues an element
 *
 * @param {*} element Enqueues an element in the proper position using the comparator function
 * @return {number} Position where the element was placed
 */
PriorityQueue.prototype.enqueue = function (element) {
  if (Array.isArray(element)) {
    return this.enqueueArray(element);
  }
  for (let i = 0; i < this.queue.length; i += 1) {
    switch (this.priorityFn(this.queue[i], element)) {
      case true:
        this.queue.splice(i, 0, element);
        return i;
      case undefined:
        return undefined;
      // no default
    }
  }
  return this.queue.push(element) - 1;
};

/**
 * Enqueues an Array of elements
 *
 * @param {array} array Array of elements to be enqueued
 * @return {array} Position array where the elements were placed
 */
PriorityQueue.prototype.enqueueArray = function (elements) {
  return elements.map(element => this.enqueue(element));
};

/**
 * Dequeues an element
 *
 * @return {*} Gets the first element of the queue and removes from the list
 */
PriorityQueue.prototype.dequeue = function () {
  return this.queue.shift();
};

/**
 * Clears the queue
 */
PriorityQueue.prototype.clear = function () {
  this.queue = [];
};

/**
 * Gets the queue size
 *
 * @returns {number}
 */
PriorityQueue.prototype.size = function () {
  return this.queue.length;
};

/**
 * Checks if the queue is empty
 *
 * @returns {boolean}
 */
PriorityQueue.prototype.empty = function () {
  return this.size() === 0;
};

module.exports = PriorityQueue;
