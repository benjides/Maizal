const { expect } = require('chai');
const { to } = require('await-to-js');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

let c = {};

describe('Simple Weighted-A* corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    c = Object.assign({}, corridor);
    c.epsilon = 1.2;
    const { solution } = await maizal.weightedastar(c);
    expect(solution.pop().data.position).to.eq(corridor.goals.position);
  });
  it('A zero epsilon should behave as a dijkstra search', async () => {
    c = Object.assign({}, corridor);
    c.epsilon = 0;
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
    const { solution, stats } = await maizal.weightedastar(c);
    expect(solution.pop().data.position).to.eq(c.goals.position);
    expect(stats.nodes).to.eq(4);
    expect(stats.depth).to.eq(1);
    expect(stats.cost).to.eq(50);
  });
  it('A really high epsilon should behave as a best first search', async () => {
    c = Object.assign({}, corridor);
    c.epsilon = 999;
    c.goals = [{
      position: 4,
    }, {
      position: 0,
    }];
    const { solution } = await maizal.weightedastar(c);
    expect(solution.pop().data.position).to.eq(c.goals[0].position);
  });
  it('A Weighted-A* cannot start without an epsilon value', async () => {
    const [err, data] = await to(maizal.weightedastar(corridor));
    expect(err).to.be.an('error');
    expect(data).to.be.an('undefined');
  });
  it('The epsilon value must be a number', async () => {
    c = Object.assign({}, corridor);
    c.epsilon = "String";
    const [err, data] = await to(maizal.weightedastar(c));
    expect(err).to.be.an('error');
    expect(data).to.be.an('undefined');
  });
});
