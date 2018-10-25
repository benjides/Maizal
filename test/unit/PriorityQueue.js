'use strict';

var expect = require('chai').expect;
var PriorityQueue = require('../../lib/util/PriorityQueue');
var months = require('../months');

describe('PriorityQueue string Constructor', function() {
  var q = new PriorityQueue('index');
  it('An element should be inserted', function() {
    expect(q.enqueue(months[5])).to.eq(0);
  });
  it('An element with higer priority should be first', function() {
    expect(q.enqueue(months[0])).to.eq(0);
  });
  it('The top of the queue should be the first element', function() {
    expect(q.dequeue().name).to.eq('January');
  });
  it('An empty queue cannot dequeue its elements', function() {
    q.dequeue();
    expect(q.dequeue()).to.be.undefined;
  });
  it('An empty queue should not contains elements', function() {
    expect(q.size()).to.be.eq(0);
  });
  it('An array of elements can be inserted in their porper positions', function() {
    expect(q.enqueue(months)).to.have.lengthOf(12);
  });
  it('The queue size should be increased', function() {
    expect(q.size()).to.eq(12);
  });
  it('A cleared queue should be empty', function() {
    q.clear();
    expect(q.size()).to.be.eq(0);
  });
  it('Adding an array in a random order should not affect the priorities', function() {
    var rev = months.slice(0);
    q.enqueue(rev.reverse());
    expect(q.dequeue().name).to.eq('January');
  });
});

describe('PriorityQueue function Constructor', function() {
  var q = new PriorityQueue(function(a, b) {
    return a.index - b.index;
  });
  it('An element should be inserted first if the queue is empty', function() {
    expect(q.enqueue(months[5])).to.eq(0);
  });
  it('An element should be enqueued first if its priority is higher', function() {
    expect(q.enqueue(months[0])).to.eq(0);
  });
  it('An element with same priority will be inserted first', function() {
    expect(q.enqueue({index: 1, name: 'NoJanuary'})).to.eq(0);
  });
  it('Dequeueing should return the top element', function() {
    expect(q.dequeue().name).to.eq('NoJanuary');
  });
  it('Any array should be added according to their priority regarding the order', function() {
    var rev = months.slice(0);
    q.enqueue(rev.reverse());
    expect(q.dequeue().name).to.eq('January');
  });
});

describe('PriorityQueue default Constructor', function() {
  var q = new PriorityQueue();
  it('An element should be inserted', function() {
    expect(q.enqueue(months[0])).to.eq(0);
  });
  it('Any element should be inserted first', function() {
    expect(q.enqueue(months[5])).to.eq(0);
  });
  it('Dequeueing returns the first element in the queue (last element added)', function() {
    expect(q.dequeue().name).to.eq(months[5].name);
  });
  it('And array should be inserted as reversed', function() {
    q.enqueue(months);
    expect(q.dequeue().name).to.eq('December');
  });
});
