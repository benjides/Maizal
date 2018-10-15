'use strict';

/**
 * Creates a new instance of a HashSet
 * 
 * @param {Function|String} hashFunction Field or function to check whether two elements are essentially the same
 * @constructor
 */
function HashSet(hashFunction) {
  if (hashFunction === undefined) {
    throw new TypeError('hashFunction is required argument');
  }
  if (typeof hashFunction === 'string') {
    this.hashFn = function (item) {
      if (item[hashFunction] !== undefined) {
        return item[hashFunction];
      } else {
        throw new Error('Undefined was returned by hash function on object ' + JSON.stringify(item) );
      }
    }
  } else {
    this.hashFn = hashFunction;
  }
  this._hashObject = {};
  this.length = 0;
}

/**
 * Inserts the element into the set if it is not already present.
 * 
 * @param {*} value Value to add
 * @returns {boolean} True if the item was added
 */
HashSet.prototype.add = function(value) {
  var r = !this.has(value);
  if (r) {
    //does not contain
    this._hashObject[this.hashFn(value)] = value;
    this.length++;
  }
  return r;
}

/**
 * Get the key/hashes of the set.
 * 
 * @returns {Array} Array of keys
 */
HashSet.prototype.keys = function() {
  return Object.keys(this._hashObject);
}

/**
 * Clear the set and keep the Hash Function
 */
HashSet.prototype.clear = function() {
  this._hashObject = {};
  this.length = 0;
}

/**
 * Get the value given a hash
 * 
 * @param {String} hash 
 * @returns {*} stored value or undefined if the hash did not found anything
 */
HashSet.prototype.getValue = function(hash) {
  return this._hashObject[hash];
}

/**
 * Get the hash given a value
 * 
 * @param {*} value
 * @returns {string} stored hash or undefined if the hash did not found anything
 */
HashSet.prototype.getHash = function(value) {
  return this.hashFn(value);
}

/**
 * Deletes a value from the set given its hash or value
 * 
 * @param {*} valueOrHash either hash or an object
 * @returns {boolean} whether it removed the item
 */
HashSet.prototype.delete = function(valueOrHash) {
  if (this.has(valueOrHash)) {
    // does contain
    if (typeof valueOrHash === 'object') {
      delete this._hashObject[this.hashFn(valueOrHash)];
    } else {
      delete this._hashObject[valueOrHash];
    }
    this.length--;
    return true;
  } else {
    return false;
  }
}

/**
 * Check if the set contains the given value or hash
 * 
 * @param {*} valueOrHash either hash or an object
 * @returns {boolean}
 */
HashSet.prototype.has = function(valueOrHash) {
  if (typeof valueOrHash === 'object') {
    return this._hashObject[this.hashFn(valueOrHash)] !== undefined;
  } else {
    return this._hashObject[valueOrHash] !== undefined;
  }
}

/**
 * Size of the Set
 * 
 * @returns {number}
 */
HashSet.prototype.size = function() {
  return this.length;
}

/**
 * Runs iteratorFunction for each value of set
 * 
 * @param {Function} iteratorFunction to execute for each element
 * @param {*} [thisObj] this context for iterator
 */
HashSet.prototype.each = function(iteratorFunction, thisObj) {
  var keys = Object.keys(this._hashObject).reverse();
  var item;
  while(item = keys.pop()) {
    var contx = thisObj || this._hashObject[item];
    iteratorFunction.call(contx, this._hashObject[item]);
  }
}

/**
 * Gets the set as an Array
 * 
 * @returns {Array}
 */
HashSet.prototype.toArray = function () {
  var r = [];
  for(var i in this._hashObject){
    r.push(this._hashObject[i]);
  }
  return r;
}

/**
 * Filters the set given a predicate. This not modifies the current set
 * 
 * @param {Function} predicate function to remove an item when it is true
 * @returns {HashSet} of filtered items
 */
HashSet.prototype.filter = function(predicate) {
  var result = new HashSet(this.hashFn);
  this.each(function(item) {
    if (predicate(item)) {
      result.add(item);
    }
  });
  return result;
}

HashSet.prototype.values = HashSet.prototype.toArray; //alias
HashSet.prototype.hashes = HashSet.prototype.keys; //alias

module.exports = HashSet;