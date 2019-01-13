const { expect } = require('chai');
const sinon = require('sinon');
const { to } = require('await-to-js');
const maizal = require('../../../src/maizal');
const Maizal = require('../../../src/core/Maizal');
const { bfs } = require('../../../src/engine/engines');
const corridor = require('../../corridor');

afterEach(() => {
  sinon.restore();
});

let c = {};

// All the core functionalities of maizal goes here

// For specific engine funcitonalty go to the dedicated test file

describe('Simple core base corridor search testing', () => {
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
  it('If the final states are not reachable the search should be rejected', async () => {
    c = Object.assign({}, corridor);
    c.actions = {
      expand: ({ position }) => Promise.resolve({ position }),
    };
    const [err, data] = await to(maizal.bfs(c));
    expect(err).to.be.an('error');
    expect(data).to.be.an('undefined');
  });
  it('Chain two maizal searches', async () => {
    await maizal.bfs(corridor);
    c = Object.assign({}, corridor);
    c.goals = {
      position: 2,
    };
    const { solution, stats } = await maizal.bfs(c);
    expect(stats.nodes).to.eq(1);
    expect(solution.pop().data.position).to.eq(c.goals.position);
  });

  describe('Checking hashing function call assertions', () => {
    it('Checking called assertions on the closed set hash function', async () => {
      c = Object.assign({}, corridor);
      c.engine = bfs;
      // Remove limitations to better calculate function callings
      c.actions = [
        {
          name: 'right',
          expand: ({ position }) => ({ position: position + 1 }),
        },
        {
          name: 'left',
          expand: ({ position }) => ({ position: position - 1 }),
        },
      ];
      const m = new Maizal(c);
      const hash = sinon.spy(m.closed, 'hashFn');
      const { stats } = await m.solve();

      // The hash function is called twice per closed state (has, add)
      // The hash function is called once per iteration (state closed) per action (each action generates a new state)
      sinon.assert.callCount(hash, stats.nodes * 2 * c.actions.length);
    });
    it('The hash function is called for each new state to determine if it is a goal state including the initial', async () => {
      c = Object.assign({}, corridor);
      c.engine = bfs;
      const m = new Maizal(c);
      const hash = sinon.spy(m.goals, 'hashFn');
      await m.solve();
      // Being BFS every single state must be checked and therefore called
      sinon.assert.callCount(hash, 4);
    });
  });

  describe('Checking priority function call assertions', () => {
    it('The evaluation function is called only once to reach the next cell', async () => {
      c = Object.assign({}, corridor);
      c.engine = bfs;
      c.goals = {
        position: 2,
      };
      const m = new Maizal(c);
      const priority = sinon.spy(m.poll, 'priorityFn');
      await m.solve();
      // This is called once, the first element is inserted at the beggining (no call) and the next is placed after (1 call)
      sinon.assert.calledOnce(priority);
    });
    it('The evaluation function is called twice to reach the end of the corridor', async () => {
      c = Object.assign({}, corridor);
      c.engine = bfs;
      const m = new Maizal(c);
      const priority = sinon.spy(m.poll, 'priorityFn');
      await m.solve();
      // This is tricky. As elements are removed there is no need to call the priority function for every new state
      sinon.assert.callCount(priority, 2);
    });
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
    it('A search cannot start without an initial state', async () => {
      c = Object.assign({}, corridor);
      delete c.initial;
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
    it('A search cannot start with an empty initial state', async () => {
      c = Object.assign({}, corridor);
      c.initial = {};
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
  });
  describe('Action testing', () => {
    it('Ensure the actions expand functions are called', async () => {
      c = Object.assign({}, corridor);
      c.engine = bfs;
      const right = sinon.spy(c.actions[0], 'expand');
      const left = sinon.spy(c.actions[1], 'expand');
      const m = new Maizal(c);
      await m.solve();
      sinon.assert.called(right);
      sinon.assert.called(left);
    });
    it('The expand actions should be called in order', async () => {
      c = Object.assign({}, corridor);
      c.engine = bfs;
      const right = sinon.spy(c.actions[0], 'expand');
      const left = sinon.spy(c.actions[1], 'expand');
      const m = new Maizal(c);
      await m.solve();
      sinon.assert.callOrder(right, left);
    });
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
    it('A search with no actions should be rejected', async () => {
      c = Object.assign({}, corridor);
      c.actions = {};
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
    it('An empty expand function should be rejected', async () => {
      c = Object.assign({}, corridor);
      c.actions = {
        name: 'IdoNotHaveExpand',
      };
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
    it('Newly generated states should be able to be hashed', async () => {
      c = Object.assign({}, corridor);
      c.actions = {
        expand: () => ({ notPosition: 3 }),
      };
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
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
      const hash = sinon.spy(c, 'hash');
      const { solution } = await maizal.bfs(c);
      expect(solution).to.have.length(4);
      sinon.assert.called(hash);
    });
    it('A search with no hash should be rejected', async () => {
      c = Object.assign({}, corridor);
      delete c.hash;
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
    it('A non existing hash should be rejected', async () => {
      c = Object.assign({}, corridor);
      c.hash = 'IdoNotExist';
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
  });
  describe('Goals testing', () => {
    it('A search with no goals should be rejected', async () => {
      c = Object.assign({}, corridor);
      delete c.goals;
      const [err, data] = await to(maizal.bfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
  });

  describe('Informed search testing', () => {
    it('Perform a simple Best-first search to reach the end of the corridor', async () => {
      c = Object.assign({}, corridor);
      const heuristics = sinon.spy(c, 'heuristics');
      const { solution } = await maizal.bestfs(c);
      expect(solution).to.have.length(4);
      sinon.assert.called(heuristics);
    });

    it('Ensure the requirements of the search are fullfilled', async () => {
      c = Object.assign({}, corridor);
      delete c.heuristics;
      const [err, data] = await to(maizal.bestfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });

    it('Ensure the requirements match the expected datatype', async () => {
      c = Object.assign({}, corridor);
      c.heuristics = 'iAmNotAFunction';
      const [err, data] = await to(maizal.bestfs(c));
      expect(err).to.be.an('error');
      expect(data).to.be.an('undefined');
    });
  });
});
