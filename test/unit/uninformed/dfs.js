const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const maizal = require('../../../src/maizal');
const corridor = require('../../corridor');

const { expect } = chai;

chai.use(chaiAsPromised);

let c = {};

describe('Simple Depth-First corridor search', () => {
  it('A simple search should reach the last position in the corridor', () => expect(maizal.dfs(corridor).then(({ solution }) => solution.pop().data.position)).to.eventually.eq(4));
  it('A better solution may not prioritize over a worse one', () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 0,
    }, {
      position: 4,
    }];
    return expect(maizal.dfs(c).then(({ solution }) => solution.pop().data.position)).to.eventually.eq(4);
  });
  it('The search shall expand on right until the maximun depth is reached and retreat', () => {
    c = Object.assign({}, corridor);
    c.goals = [{
      position: 0,
    }];
    return expect(maizal.dfs(c).then(({ stats }) => stats.nodes)).to.eventually.eq(4);
  });
  it('If the final states are not reachable the search should be rejected', () => {
    c = Object.assign({}, corridor);
    c.actions = {
      expand: ({ position }) => Promise.resolve({ position }),
    };
    return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
  });
  it('Chain two maizal searches', () => {
    maizal.dfs(corridor);
    c = Object.assign({}, corridor);
    c.goals = {
      position: 0,
    };
    return expect(maizal.dfs(c).then(({ solution }) => solution.pop().data.position)).to.eventually.eq(0);
  });
  describe('Initial set testing', () => {
    it('If the intial is the goal should not expand any action', () => {
      c = Object.assign({}, corridor);
      c.goals = { position: 1 };
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.eventually.have.length(1);
    });
    it('A search cannot start without an initial state', () => {
      c = Object.assign({}, corridor);
      delete c.initial;
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
    it('A search cannot start with an empty initial state', () => {
      c = Object.assign({}, corridor);
      c.initial = {};
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
  });
  describe('Action testing', () => {
    it('Promise actions are supported and the robot shall reach the end of the corridor', () => {
      c = Object.assign({}, corridor);
      c.actions = {
        expand: ({ position }) => Promise.resolve({ position: position + 1 }),
      };
      return expect(maizal.dfs(c).then(({ solution }) => solution.pop().data.position)).to.eventually.eq(4);
    });
    it('A search with no actions should be rejected', () => {
      c = Object.assign({}, corridor);
      c.actions = {};
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
    it('An empty expand function should be rejected', () => {
      c = Object.assign({}, corridor);
      c.actions = {
        name: 'IdoNotHaveExpand',
      };
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
    it('Actions returning several states are allowed', () => {
      c = Object.assign({}, corridor);
      c.actions = {
        expand: ({ position }) => {
          if (position > 5 || position < 0) {
            return undefined;
          }
          return [{ position: position + 1 }, { position: position - 1 }];
        },
      };
      return expect(maizal.dfs(c).then(({ solution }) => solution.pop().data.position)).to.eventually.eq(4);
    });
  });
  describe('Hash testing', () => {
    it('Function hashes are allowed', () => {
      c = Object.assign({}, corridor);
      c.hash = ({ position }) => position + 15;
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.eventually.have.length(4);
    });
    it('A search with no hash should be rejected', () => {
      c = Object.assign({}, corridor);
      delete c.hash;
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
    it('A non existing hash should be rejected', () => {
      c = Object.assign({}, corridor);
      c.hash = 'IdoNotExist';
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
  });
  describe('Goals testing', () => {
    it('A search with no goals should be rejected', () => {
      c = Object.assign({}, corridor);
      delete c.goals;
      return expect(maizal.dfs(c).then(({ solution }) => solution)).to.be.rejected;
    });
  });
});
