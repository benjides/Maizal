'use strict';

/**
 * Creates a new PriorityQueue
 *
 * @param {Function} compare Comparator function to place the element
 */
function PriorityQueue(compare) {
  this.data = []
  this.compare = compare || (() => 1 ) 
}

/**
 * Enqueues an element
 *
 * @param {Object} element Enqueues an element in the proper position using the comparator function
 */
PriorityQueue.prototype.enqueue = function(element) {
  for (let i = 0; i < this.data.length; i++) {
    if(this.compare(this.data[i],element) >= 0) {
      this.data.splice(i,0,element);
      return
    }
  }
  this.data.push(element);
};

/**
 * Dequeues an element
 *
 * @return {Object} Gets the first element of the queue and removes from the list
 */
PriorityQueue.prototype.dequeue = function() { 
  return this.data.splice(0,1)[0] 
};


module.exports = PriorityQueue;
