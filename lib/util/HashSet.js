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
    this.hashFn = function hashFn(item) {
      if (item[hashFunction] !== undefined) {
        return item[hashFunction];
      }
      throw new Error('Undefined was returned by hash function on object ' + JSON.stringify(item) );
    };
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
HashSet.prototype.add = function add(value) {
  if (Array.isArray(value)) {
    return this.addArray(value);
  }
  var r = !this.has(value);
  if (r) {
    this._hashObject[this.hashFn(value)] = value;
    this.length++;
  }
  return r;
};

/**
 * Adds an Array of elements
 *
 * @param {array} values Array of values to be added
 * @return {array} Boolean array specifying if the value was added
 */
HashSet.prototype.addArray = function addArray(values) {
  return values.map(function map(value) {
    return this.add(value);
  }.bind(this));
};

/**
 * Get the key/hashes of the set.
 *
 * @returns {Array} Array of keys
 */
HashSet.prototype.keys = function keys() {
  return Object.keys(this._hashObject);
};

/**
 * Clear the set and keep the Hash Function
 */
HashSet.prototype.clear = function clear() {
  this._hashObject = {};
  this.length = 0;
};

/**
 * Get the value given a hash
 *
 * @param {String} hash
 * @returns {*} stored value or undefined if the hash did not found anything
 */
HashSet.prototype.getValue = function getValue(hash) {
  return this._hashObject[hash];
};

/**
 * Get the hash given a value
 *
 * @param {*} value
 * @returns {string} stored hash or undefined if the hash did not found anything
 */
HashSet.prototype.getHash = function getHash(value) {
  return this.hashFn(value);
};

/**
 * Removes a value from the set given its hash or value
 *
 * @param {*} valueOrHash either hash or an object
 * @returns {boolean} whether it removed the item
 */
HashSet.prototype.remove = function remove(valueOrHash) {
  if (this.has(valueOrHash)) {
    if (typeof valueOrHash === 'object') {
      delete this._hashObject[this.hashFn(valueOrHash)];
    } else {
      delete this._hashObject[valueOrHash];
    }
    this.length--;
    return true;
  }
  return false;
};

/**
 * Check if the set contains the given value or hash
 *
 * @param {*} valueOrHash either hash or an object
 * @returns {boolean}
 */
HashSet.prototype.has = function has(valueOrHash) {
  if (typeof valueOrHash === 'object') {
    return this._hashObject[this.hashFn(valueOrHash)] !== undefined;
  }
  return this._hashObject[valueOrHash] !== undefined;
};

/**
 * Size of the Set
 *
 * @returns {number}
 */
HashSet.prototype.size = function size() {
  return this.length;
};

/**
 * Runs iteratorFunction for each value of set
 *
 * @param {Function} iteratorFunction to execute for each element
 * @param {*} [thisObj] this context for iterator
 */
HashSet.prototype.each = function each(iteratorFunction, thisObj) {
  var keys = Object.keys(this._hashObject).reverse();
  var item;
  while ((item = keys.pop())) {
    var contx = thisObj || this._hashObject[item];
    iteratorFunction.call(contx, this._hashObject[item]);
  }
};

/**
 * Gets the set as an Array
 *
 * @returns {Array}
 */
HashSet.prototype.toArray = function toArray() {
  var r = [];
  for (var i in this._hashObject) {
    r.push(this._hashObject[i]);
  }
  return r;
};

/**
 * Filters the set given a predicate. This not modifies the current set
 *
 * @param {Function} predicate function to remove an item when it is true
 * @returns {HashSet} of filtered items
 */
HashSet.prototype.filter = function filter(predicate) {
  var result = new HashSet(this.hashFn);
  this.each(function each(item) {
    if (predicate(item)) {
      result.add(item);
    }
  });
  return result;
};

HashSet.prototype.values = HashSet.prototype.toArray;
HashSet.prototype.hashes = HashSet.prototype.keys;

module.exports = HashSet;
