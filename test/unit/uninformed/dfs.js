const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

const { expect } = chai;

chai.use(chaiAsPromised);

let c = {};

describe('Simple Depth-First corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    const { solution } = await maizal.dfs(corridor);
    expect(solution.pop().data.position).to.eq(corridor.goals.position);
  });
  it('A better solution may not prioritize over a worse one', async () => {
    // DFS expands on depth using the right as primary action losing the left
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 0,
    }, {
      position: 4,
    }];
    const { solution, stats } = await maizal.dfs(c);
    expect(solution.pop().data.position).to.eq(c.goals[1].position);
    expect(stats.nodes).to.eq(3);
  });
  it('The search shall expand on right until the maximun depth is reached and retreat', async () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 0,
    }];
    const { solution, stats } = await maizal.dfs(c);
    expect(solution.pop().data.position).to.eq(c.goals[0].position);
    expect(stats.nodes).to.eq(4);
  });
});
