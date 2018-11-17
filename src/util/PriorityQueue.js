/**
 * Creates a new PriorityQueue
 *
 * @param {Function|Field} priorityFunction Field or function to place the element
 * @constructor
 */
function PriorityQueue(priorityFunction) {
  switch (typeof priorityFunction) {
    case 'string':
      this.priorityFn = (a, b) => {
        if (b[priorityFunction] === undefined) {
          throw new Error(`Undefined was returned by priority function on object ${JSON.stringify(b)}`);
        }
        return a[priorityFunction] - b[priorityFunction];
      };
      break;
    case 'function':
      this.priorityFn = (a, b) => priorityFunction(a) - priorityFunction(b);
      break;
    default:
      this.priorityFn = () => 1;
  }
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
    if (this.priorityFn(this.queue[i], element) >= 0) {
      this.queue.splice(i, 0, element);
      return i;
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
