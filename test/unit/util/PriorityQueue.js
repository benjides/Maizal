const { expect } = require('chai');
const PriorityQueue = require('../../../src/util/PriorityQueue');
const months = require('../../months');

describe('PriorityQueue ascending order elements', () => {
  const q = new PriorityQueue(({ index }) => index);
  it('An element should be inserted', () => {
    expect(q.enqueue(months[5])).to.eq(0);
  });
  it('An element with higer priority should be first', () => {
    expect(q.enqueue(months[0])).to.eq(0);
  });
  it('The top of the queue should be the first element', () => {
    expect(q.dequeue().name).to.eq('January');
  });
  it('An empty queue cannot dequeue its elements', () => {
    q.dequeue();
    expect(q.dequeue()).to.be.an('undefined');
  });
  it('An empty queue should not contains elements', () => {
    expect(q.size()).to.be.eq(0);
  });
  it('An array of elements can be inserted in their porper positions', () => {
    expect(q.enqueue(months)).to.have.lengthOf(12);
  });
  it('The queue size should be increased', () => {
    expect(q.size()).to.eq(12);
  });
  it('A cleared queue should not have size', () => {
    q.clear();
    expect(q.size()).to.be.eq(0);
  });
  it('An emptied queue should be empty', () => {
    expect(q.empty()).to.be.eq(true);
  });
  it('Adding an array in a random order should not affect the priorities', () => {
    const rev = months.slice(0);
    q.enqueue(rev.reverse());
    expect(q.dequeue().name).to.eq('January');
  });
});

describe('PriorityQueue reverse order', () => {
  const q = new PriorityQueue(toInsert => -toInsert.index);
  it('An element should be inserted first if the queue is empty', () => {
    expect(q.enqueue(months[5])).to.eq(0);
  });
  it('An element should be enqueued first if its priority is higher', () => {
    expect(q.enqueue(months[8])).to.eq(0);
  });
  it('An element with same priority will be inserted after', () => {
    expect(q.enqueue({ index: 9, name: 'NoJanuary' })).to.eq(1);
  });
  it('Dequeueing should return the top element', () => {
    expect(q.dequeue().name).to.eq('September');
  });
  it('Any array should be added according to their priority regarding the order', () => {
    q.enqueue(months);
    expect(q.dequeue().name).to.eq('December');
  });
});

describe('PriorityQueue no constructor', () => {
  it('A Queue cannot be created if no argument is provided', () => {
    expect(() => new PriorityQueue()).to.throw();
  });
});

describe('PriorityQueue undefined priority', () => {
  const q = new PriorityQueue(() => undefined);
  it('Undefined priorities can only be inserted on top', () => {
    expect(q.enqueue(months[2])).to.be.eq(0);
  });
  it('Undefined priorities must not be inserted', () => {
    expect(q.enqueue(months[5])).to.be.an('undefined');
  });
});
