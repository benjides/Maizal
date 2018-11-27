const { expect } = require('chai');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

let c = {};

describe('Simple Base corridor search', () => {
  it('A simple search should reach the last position in the corridor', async () => {
    const res = await maizal.bfs(corridor);
    it('The search should provide the solution found and the stats', () => {
      expect(res).to.have.all.keys('solution', 'stats');
    });
    const { solution, stats } = res;
    it('The solution must be and ordered array with the found nodes from initial to last', () => {
      expect(solution).to.be.an('array');
    });
    it('Checks of the initial state of the solution', () => {
      const initial = solution[0];
      expect(initial.action).to.be.an('undefined');
      expect(initial.depth).to.be(0);
      expect(initial.cost).to.be(0);
    });
    it('Checks of the goal state found', () => {
      const final = solution.pop();
      expect(final.position).to.eq(corridor.goals.position);
      expect(final.action).to.eq('right');
      expect(final.cost).to.eq(3);
      expect(final.depth).to.eq(3);
    });
    it('The statistics must be an object with search results info', () => {
      expect(stats).to.be.an('object');
      expect(stats.nodes).to.eq(4);
      expect(stats.depth).to.eq(3);
      expect(stats.nodes).to.eq(3);
    });
  });
  it('If the final states are not reachable the search should be rejected', () => {
    c = Object.assign({}, corridor);
    c.actions = {
      expand: ({ position }) => Promise.resolve({ position }),
    };
    return expect(maizal.bfs(c)).to.be.rejected;
  });
  it('Chain two maizal searches', async () => {
    maizal.bfs(corridor);
    c = Object.assign({}, corridor);
    c.goals = {
      position: 2,
    };
    const { solution, stats } = await maizal.bfs(c);
    expect(stats.nodes).to.eq(1);
    expect(solution.pop().data.position).to.eq(c.goals.position);
  });
  describe('Initial set testing', () => {
    it('If the intial is the goal should not expand any action', async () => {
      c = Object.assign({}, corridor);
      c.goals = { position: 1 };
      const { solution, stats } = await maizal.bfs(c);
      expect(solution).to.have.length(1);
      expect(solution[0].data.position).to.eq(c.goals.position);
      expect(stats.nodes).to.eq(0);
    });
    it('A search cannot start without an initial state', () => {
      c = Object.assign({}, corridor);
      delete c.initial;
      return expect(maizal.dfs(c)).to.be.rejected;
    });
    it('A search cannot start with an empty initial state', () => {
      c = Object.assign({}, corridor);
      c.initial = {};
      return expect(maizal.random(c)).to.be.rejected;
    });
  });
  describe('Action testing', () => {
    it('Promise actions are supported and the robot shall reach the end of the corridor', async () => {
      c = Object.assign({}, corridor);
      c.actions = {
        expand: ({ position }) => Promise.resolve({ position: position + 1 }),
      };
      const { solution, stats } = await maizal.bfs(c);
      const final = solution.pop();
      expect(final.data.position).to.eq(c.goals.position);
      expect(final.action).to.eq('expand');
      expect(stats.nodes).to.eq(3);
    });
    it('A search with no actions should be rejected', () => {
      c = Object.assign({}, corridor);
      c.actions = {};
      return expect(maizal.bfs(c)).to.be.rejected;
    });
    it('An empty expand function should be rejected', () => {
      c = Object.assign({}, corridor);
      c.actions = {
        name: 'IdoNotHaveExpand',
      };
      return expect(maizal.bfs(c)).to.be.rejected;
    });
    it('Newly generated states should be able to be hashed', () => {
      c = Object.assign({}, corridor);
      c.actions = {
        expand: () => ({ notPosition: 3 }),
      };
      return expect(maizal.bfs(c)).to.be.rejected;
    });
    it('Actions returning several states are allowed', async () => {
      c = Object.assign({}, corridor);
      c.actions = {
        expand: ({ position }) => {
          if (position > 5 || position < 0) {
            return undefined;
          }
          return [{ position: position + 1 }, { position: position - 1 }];
        },
      };
      const { solution, stats } = await maizal.bfs(c);
      expect(solution.pop().data.position).to.be.eq(c.goals.position);
      expect(solution.pop().action).to.be.eq('expand');
      expect(stats.nodes).to.be.eq(5);
    });
  });
  describe('Hash testing', () => {
    it('Function hashes are allowed', async () => {
      c = Object.assign({}, corridor);
      c.hash = ({ position }) => position + 15;
      const { solution, stats } = await maizal.bfs(c);
      expect(solution).to.have.length(4);
    });
    it('A search with no hash should be rejected', () => {
      c = Object.assign({}, corridor);
      delete c.hash;
      return expect(maizal.bfs(c)).to.be.rejected;
    });
    it('A non existing hash should be rejected', () => {
      c = Object.assign({}, corridor);
      c.hash = 'IdoNotExist';
      return expect(maizal.bfs(c)).to.be.rejected;
    });
  });
  describe('Goals testing', () => {
    it('A search with no goals should be rejected', () => {
      c = Object.assign({}, corridor);
      delete c.goals;
      return expect(maizal.bfs(c)).to.be.rejected;
    });
  });
});
