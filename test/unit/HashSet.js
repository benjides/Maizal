'use strict';

var expect = require('chai').expect;
var HashSet = require('../../lib/util/HashSet');
var months = require('../months');

describe('HashSet string Constructor using an integer field', function() {
  var set = new HashSet('index');
  it('An elment not present should be inserted', function() {
    expect(set.add(months[3])).to.eq(true);
  });
  it('The same reference element should not be inserted', function() {
    expect(set.add(months[3])).to.eq(false);
  });
  it('The same new element should not be inserted', function() {
    expect(set.add({index: 4, name: 'April'})).to.eq(false);
  });
  it('An element without field should not be inserted and an error returned', function() {
    expect(function() { return set.add({name: 'Blue'});}).to.throw();
  });
  it('An element previously added should be present', function() {
    expect(set.has(months[3])).to.eq(true);
  });
  it('An element not previously added should not be present', function() {
    expect(set.has(months[7])).to.eq(false);
  });
  it('An element can be removed if its present', function() {
    expect(set.remove(months[3])).to.eq(true);
  });
  it('Cannot remove an element if it is not present', function() {
    expect(set.remove(months[9])).to.eq(false);
  });
  it('Can get an element if its present', function() {
    set.add(months[3]);
    expect(set.getValue(4).name).to.eq('April');
  });
  it('Cannot get an element if it is not present', function() {
    expect(set.getValue(6)).to.be.undefined;
  });
  it('An array of elements can be added', function() {
    expect(set.add(months).filter(function(value) { return value; })).to.have.length(11);
  });
});

describe('HashSet string Constructor using a String field', function() {
  var set = new HashSet('name');
  it('An elment not present should be inserted', function() {
    expect(set.add(months[3])).to.eq(true);
  });
  it('The same reference element should not be inserted', function() {
    expect(set.add(months[3])).to.eq(false);
  });
  it('The same new element should not be inserted', function() {
    expect(set.add({index: 4, name: 'April'})).to.eq(false);
  });
  it('An element without field should not be inserted and an error returned', function() {
    expect(function() { return set.add({id: 5});}).to.throw();
  });
  it('An element previously added should be present', function() {
    expect(set.has(months[3])).to.eq(true);
  });
  it('An element not previously added should not be present', function() {
    expect(set.has(months[7])).to.eq(false);
  });
  it('An element can be removed if its present', function() {
    expect(set.remove(months[3])).to.eq(true);
  });
  it('Cannot remove an element if it is not present', function() {
    expect(set.remove(months[9])).to.eq(false);
  });
  it('Can get an element if its present', function() {
    set.add(months[3]);
    expect(set.getValue('April').id).to.eq(months[3].id);
  });
  it('Cannot get an element if it is not present', function() {
    expect(set.getValue(6)).to.be.undefined;
  });
  it('An array of elements can be added', function() {
    expect(set.add(months).filter(function(value) { return value; })).to.have.length(11);
  });
});

describe('HashSet string Constructor using a not existent field', function() {
  var set = new HashSet('iDoNotExist');
  it('An element cannot be inserted and error thrown', function() {
    expect(function() { return set.add(months[3]); }).to.throw();
  });
  it('An array cannot be inserted an error thrown', function() {
    expect(function() { return set.add(months); }).to.throw();
  });
});

describe('HashSet using a function', function() {
  var set = new HashSet(function(value) {
    return value.index + 15;
  });
  it('An elment not present should be inserted', function() {
    expect(set.add(months[3])).to.eq(true);
  });
  it('The same reference element should not be inserted', function() {
    expect(set.add(months[3])).to.eq(false);
  });
  it('The same new element should not be inserted', function() {
    expect(set.add({index: 4, name: 'April'})).to.eq(false);
  });
  it('An element without field may be added depending on how the function deals with hash asignment', function() {
    expect(set.add({name: 'Blue'})).to.eq(true);
  });
  it('An element previously added should be present', function() {
    expect(set.has(months[3])).to.eq(true);
  });
  it('An element not previously added should not be present', function() {
    expect(set.has(months[7])).to.eq(false);
  });
  it('An element can be removed if its present', function() {
    expect(set.remove(months[3])).to.eq(true);
  });
  it('Cannot remove an element if it is not present', function() {
    expect(set.remove(months[9])).to.eq(false);
  });
  it('Can get an element if its present', function() {
    set.add(months[3]);
    expect(set.getValue(19).name).to.eq('April');
  });
  it('Cannot get an element if it is not present', function() {
    expect(set.getValue(6)).to.be.undefined;
  });
  it('An array of elements can be added', function() {
    expect(set.add(months).filter(function(value) { return value; })).to.have.length(11);
  });
});

describe('HashSet without providing a function', function() {
  it('The set cannot be created and error thrown', function() {
    expect(function() { return new HashSet(); }).to.throw();
  });
});
