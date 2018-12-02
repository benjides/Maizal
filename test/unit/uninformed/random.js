const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

const { expect } = chai;

chai.use(chaiAsPromised);

let c = {};

describe('Simple Random corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    const { solution } = await maizal.random(corridor);
    expect(solution.pop().data.position).to.eq(corridor.goals.position);
  });
  it('A random search with several solutions must return a solution', async () => {
    c = Object.assign({}, corridor);
    c.initial = { position: 3 };
    c.goals = [{
      position: 2,
    }, {
      position: 4,
    }];
    const { solution } = await maizal.random(c);
    expect(solution.pop().data.position).to.be.oneOf([2, 4]);
  });
});
