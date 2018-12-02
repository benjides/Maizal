const { expect } = require('chai');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

let c = {};

describe('Simple BFS corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    const { solution } = await maizal.bfs(corridor);
    expect(solution.pop().data.position).to.eq(corridor.goals.position);
  });
  it('A better solution must prioritize over a worse one', async () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 2,
    }, {
      position: 4,
    }];
    const { solution } = await maizal.bfs(c);
    expect(solution.pop().data.position).to.eq(c.goals[0].position);
  });
  it('A better solution must prioritize over a worse one', async () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 4,
    }, {
      position: 0,
    }];
    const { solution } = await maizal.bfs(c);
    expect(solution.pop().data.position).to.eq(c.goals[1].position);
  });
  it('In case there a two optimal solutions the first defined action should prioritize', async () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 0,
    }, {
      position: 2,
    }];
    const { solution } = await maizal.bfs(c);
    expect(solution.pop().action).to.eq(c.actions[0].name);
  });
});
