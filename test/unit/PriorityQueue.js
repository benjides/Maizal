const { expect } = require('chai');
const PriorityQueue = require('../../src/util/PriorityQueue');
const months = require('../months');

describe('PriorityQueue string Constructor', () => {
  const q = new PriorityQueue('index');
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
    expect(q.dequeue()).to.be.undefined;
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

describe('PriorityQueue function Constructor', () => {
  const q = new PriorityQueue((queue, toInsert) => toInsert.index - queue.index);
  it('An element should be inserted first if the queue is empty', () => {
    expect(q.enqueue(months[5])).to.eq(0);
  });
  it('An element should be enqueued first if its priority is higher', () => {
    expect(q.enqueue(months[8])).to.eq(0);
  });
  it('An element with same priority will be inserted first', () => {
    expect(q.enqueue({ index: 9, name: 'NoJanuary' })).to.eq(0);
  });
  it('Dequeueing should return the top element', () => {
    expect(q.dequeue().name).to.eq('NoJanuary');
  });
  it('Any array should be added according to their priority regarding the order', () => {
    q.enqueue(months);
    expect(q.dequeue().name).to.eq('December');
  });
});

describe('PriorityQueue no constructur', () => {
  it('A Queue cannot be created if no argument is provided', () => {
    expect(() => new PriorityQueue()).to.throw();
  });
});

describe('Priority Queue string Constructor using a not existent field', () => {
  const q = new PriorityQueue('iDoNotExist');
  it('An element is inserted but only once', () => {
    expect(() => q.enqueue(months[3])).to.not.throw();
  });
  it('An array cannot be inserted and an error thrown', () => {
    expect(() => q.enqueue(months)).to.throw();
  });
});
