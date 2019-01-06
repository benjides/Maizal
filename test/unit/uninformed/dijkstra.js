const { expect } = require('chai');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

let c = {};

describe('Simple Dijkstra corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    const { solution } = await maizal.dijkstra(corridor);
    expect(solution.pop().data.position).to.eq(corridor.goals.position);
  });
  it('A better solution must prioritize over a worse one', async () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 2,
    }, {
      position: 4,
    }];
    const { solution } = await maizal.dijkstra(c);
    expect(solution.pop().data.position).to.eq(c.goals[0].position);
  });
  it('A better solution must prioritize over a worse one, Dijkstra with action cost = 0 means a BFS so it should act as so', async () => {
    // Dijkstra with action cost = 0 means a BFS so it should act as so
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 0,
    }, {
      position: 4,
    }];
    const { solution } = await maizal.dijkstra(c);
    expect(solution.pop().data.position).to.eq(c.goals[0].position);
  });
  it('Smaller cost nodes should be expanded first', async () => {
    c = Object.assign({}, corridor);
    c.initial = {
      position: 3,
    };
    c.actions = [{
      name: 'right',
      cost: 50,
      expand: (state) => {
        if (state.position + 1 > 4) return undefined;
        return { position: state.position + 1 };
      },
    },
    {
      name: 'left',
      expand: (state) => {
        if (state.position - 1 < 0) return undefined;
        return { position: state.position - 1 };
      },
    }];
    const { solution, stats } = await maizal.dijkstra(c);
    expect(solution.pop().data.position).to.eq(c.goals.position);
    expect(stats.nodes).to.eq(4);
    expect(stats.depth).to.eq(1);
    expect(stats.cost).to.eq(50);
  });
});
