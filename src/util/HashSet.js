/**
 * Creates a new instance of a HashSet
 *
 * @param {Function|String} hashFunction to check whether two elements are essentially the same
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
      }
      throw new Error(`Undefined was returned by hash function on object ${JSON.stringify(item)}`);
    };
  } else {
    this.hashFn = hashFunction;
  }
  this.hashObject = {};
  this.length = 0;
}

/**
 * Inserts the element into the set if it is not already present.
 *
 * @param {*} value Value to add
 * @returns {boolean} True if the item was added
 */
HashSet.prototype.add = function (value) {
  if (Array.isArray(value)) {
    return this.addArray(value);
  }
  const r = !this.has(value);
  if (r) {
    this.hashObject[this.hashFn(value)] = value;
    this.length += 1;
  }
  return r;
};

/**
 * Adds an Array of elements
 *
 * @param {array} values Array of values to be added
 * @return {array} Boolean array specifying if the value was added
 */
HashSet.prototype.addArray = function (values) {
  return values.map(value => this.add(value));
};

/**
 * Get the key/hashes of the set.
 *
 * @returns {Array} Array of keys
 */
HashSet.prototype.keys = function () {
  return Object.keys(this.hashObject);
};

/**
 * Clear the set and keep the Hash Function
 */
HashSet.prototype.clear = function () {
  this.hashObject = {};
  this.length = 0;
};

/**
 * Get the value given a hash
 *
 * @param {String} hash
 * @returns {*} stored value or undefined if the hash did not found anything
 */
HashSet.prototype.getValue = function (hash) {
  return this.hashObject[hash];
};

/**
 * Get the hash given a value
 *
 * @param {*} value
 * @returns {string} stored hash or undefined if the hash did not found anything
 */
HashSet.prototype.getHash = function (value) {
  return this.hashFn(value);
};

/**
 * Removes a value from the set given its hash or value
 *
 * @param {*} valueOrHash either hash or an object
 * @returns {boolean} whether it removed the item
 */
HashSet.prototype.remove = function (valueOrHash) {
  if (this.has(valueOrHash)) {
    if (typeof valueOrHash === 'object') {
      delete this.hashObject[this.hashFn(valueOrHash)];
    } else {
      delete this.hashObject[valueOrHash];
    }
    this.length -= 1;
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
HashSet.prototype.has = function (valueOrHash) {
  if (typeof valueOrHash === 'object') {
    return this.hashObject[this.hashFn(valueOrHash)] !== undefined;
  }
  return this.hashObject[valueOrHash] !== undefined;
};

/**
 * Size of the Set
 *
 * @returns {number}
 */
HashSet.prototype.size = function () {
  return this.length;
};

HashSet.prototype.hashes = HashSet.prototype.keys;

module.exports = HashSet;
