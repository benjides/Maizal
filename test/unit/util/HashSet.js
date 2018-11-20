
const { expect } = require('chai');
const HashSet = require('../../../src/util/HashSet');
const months = require('../../months');

describe('HashSet string Constructor using an integer field', () => {
  const set = new HashSet('index');
  it('An elment not present should be inserted', () => {
    expect(set.add(months[3])).to.eq(true);
  });
  it('The same reference element should not be inserted', () => {
    expect(set.add(months[3])).to.eq(false);
  });
  it('The same new element should not be inserted', () => {
    expect(set.add({ index: 4, name: 'April' })).to.eq(false);
  });
  it('An element without field should not be inserted and an error returned', () => {
    expect(() => set.add({ name: 'Blue' })).to.throw();
  });
  it('An element previously added should be present', () => {
    expect(set.has(months[3])).to.eq(true);
    expect(set.getHash(months[3])).to.eq(4);
  });
  it('An element not previously added should not be present', () => {
    expect(set.has(months[7])).to.eq(false);
  });
  it('An element can be removed if its present', () => {
    expect(set.remove(months[3])).to.eq(true);
    expect(set.add(months[3])).to.eq(true);
    expect(set.remove(4)).to.eq(true);
  });
  it('Cannot remove an element if it is not present', () => {
    expect(set.remove(months[9])).to.eq(false);
  });
  it('Can get an element if its present', () => {
    set.add(months[3]);
    expect(set.getValue(4).name).to.eq('April');
  });
  it('Cannot get an element if it is not present', () => {
    expect(set.getValue(6)).to.be.undefined;
  });
  it('An array of elements can be added', () => {
    expect(set.add(months).filter(value => value)).to.have.length(11);
  });
  it('Clear a HashSet and maintaing the hash key', () => {
    set.clear();
    expect(set.size()).to.eq(0);
    expect(set.add(months[3])).to.eq(true);
  });
});

describe('HashSet string Constructor using a String field', () => {
  const set = new HashSet('name');
  it('An elment not present should be inserted', () => {
    expect(set.add(months[3])).to.eq(true);
  });
  it('The same reference element should not be inserted', () => {
    expect(set.add(months[3])).to.eq(false);
  });
  it('The same new element should not be inserted', () => {
    expect(set.add({ index: 4, name: 'April' })).to.eq(false);
  });
  it('An element without field should not be inserted and an error returned', () => {
    expect(() => set.add({ id: 5 })).to.throw();
  });
  it('An element previously added should be present', () => {
    expect(set.has(months[3])).to.eq(true);
    expect(set.getHash(months[3])).to.eq('April');
  });
  it('An element not previously added should not be present', () => {
    expect(set.has(months[7])).to.eq(false);
  });
  it('An element can be removed if its present', () => {
    expect(set.remove(months[3])).to.eq(true);
    expect(set.add(months[3])).to.eq(true);
    expect(set.remove('April')).to.eq(true);
  });
  it('Cannot remove an element if it is not present', () => {
    expect(set.remove(months[9])).to.eq(false);
  });
  it('Can get an element if its present', () => {
    set.add(months[3]);
    expect(set.getValue('April').id).to.eq(months[3].id);
  });
  it('Cannot get an element if it is not present', () => {
    expect(set.getValue(6)).to.be.undefined;
  });
  it('An array of elements can be added', () => {
    expect(set.add(months).filter(value => value)).to.have.length(11);
  });
  it('Get the keys of a HashSet', () => {
    set.clear();
    set.add(months);
    expect(set.keys()).to.deep.eq(months.map(({ name }) => name));
  });
});

describe('HashSet string Constructor using a not existent field', () => {
  const set = new HashSet('iDoNotExist');
  it('An element cannot be inserted and error thrown', () => {
    expect(() => set.add(months[3])).to.throw();
  });
  it('An array cannot be inserted an error thrown', () => {
    expect(() => set.add(months)).to.throw();
  });
});

describe('HashSet using a function', () => {
  const set = new HashSet(value => value.index + 15);
  it('An elment not present should be inserted', () => {
    expect(set.add(months[3])).to.eq(true);
  });
  it('The same reference element should not be inserted', () => {
    expect(set.add(months[3])).to.eq(false);
  });
  it('The same new element should not be inserted', () => {
    expect(set.add({ index: 4, name: 'April' })).to.eq(false);
  });
  it('An element without field may be added depending on how the function deals with hash asignment', () => {
    expect(set.add({ name: 'Blue' })).to.eq(true);
  });
  it('An element previously added should be present', () => {
    expect(set.has(months[3])).to.eq(true);
  });
  it('An element not previously added should not be present', () => {
    expect(set.has(months[7])).to.eq(false);
  });
  it('An element can be removed if its present', () => {
    expect(set.remove(months[3])).to.eq(true);
  });
  it('Cannot remove an element if it is not present', () => {
    expect(set.remove(months[9])).to.eq(false);
  });
  it('Can get an element if its present', () => {
    set.add(months[3]);
    expect(set.getValue(19).name).to.eq('April');
  });
  it('Cannot get an element if it is not present', () => {
    expect(set.getValue(6)).to.be.undefined;
  });
  it('An array of elements can be added', () => {
    expect(set.add(months).filter(value => value)).to.have.length(11);
  });
});

describe('HashSet without providing a function', () => {
  it('The set cannot be created and error thrown', () => {
    expect(() => new HashSet()).to.throw();
  });
});
