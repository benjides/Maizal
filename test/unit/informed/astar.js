const { expect } = require('chai');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

let c = {};

describe('Simple A* corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    const { solution } = await maizal.astar(corridor);
    expect(solution.pop().data.position).to.eq(corridor.goals.position);
  });
  it('A better solution must prioritize over a worse one if the heuristics point to them', async () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 2,
    }, {
      position: 4,
    }];
    const { solution } = await maizal.astar(c);
    expect(solution.pop().data.position).to.eq(c.goals[0].position);
  });
  it('The solution is found at the least cost even if the heuristics point otherwise (incresing cost weight)', async () => {
    c = Object.assign({}, corridor);
    c.actions = [
      {
        name: 'right',
        cost: 50,
        expand: (state) => {
          if (state.position + 1 > 4) return undefined;
          return { position: state.position + 1 };
        },
      },
      {
        name: 'left',
        cost: 50,
        expand: (state) => {
          if (state.position - 1 < 0) return undefined;
          return { position: state.position - 1 };
        },
      },
    ];
    c.goals = [{
      position: 4,
    }, {
      position: 0,
    }];
    const { solution } = await maizal.astar(c);
    expect(solution.pop().data.position).to.eq(c.goals[1].position);
  });
  it('Force the search to find the solution on the left', async () => {
    c = Object.assign({}, corridor);
    c.heuristics = ({ position }) => position;
    c.goals = {
      position: 0,
    };
    const { solution } = await maizal.astar(c);
    expect(solution.pop().data.position).to.eq(c.goals.position);
  });
  it('Forcing the heuristics wrong must provide a solution if any but more costly (computer wise)', async () => {
    c = Object.assign({}, corridor);
    c.goals = {
      position: 0,
    };
    const { stats, solution } = await maizal.astar(c);
    expect(solution.pop().data.position).to.eq(c.goals.position);
    expect(stats.nodes).to.be.eq(4);
    expect(stats.depth).to.be.eq(1);
  });
});
