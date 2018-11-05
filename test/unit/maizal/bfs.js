var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var maizal = require('../../../lib/maizal')
var corridor = require('../../corridor')

chai.use(chaiAsPromised);

describe('Simple BFS corridor search', () => {
    it('A simple search should reach the last position in the corridor', () => {
        return expect(maizal.bfs(corridor).then(tree => tree.pop().data.position)).to.eventually.eq(4);
    });
    it('A better solution must prioritize over a worse one', () => {
        c = Object.assign({}, corridor)
        c.goals = [{
            position: 2
        }, {
            position: 4
        }]
        return expect(maizal.bfs(c).then(tree => tree.pop().data.position)).to.eventually.eq(2); 
    });
    it('If the intial is the goal should not expand any action', () => {
        c = Object.assign({}, corridor)
        c.goals = { position: 0 }
        return expect(maizal.bfs(c).then(tree => tree)).to.eventually.have.length(1); 
    });
    it('A search cannot start without an initial state', () => {
        c = Object.assign({}, corridor)
        c.initial = {}
        return expect(maizal.bfs(c).then(tree => tree)).to.be.rejected; 
    });
    it('Promise actions are supported and the robot shall reach the end of the corridor', () => {
        c = Object.assign({}, corridor)
        c.actions = {
            expand: ({position}) => Promise.resolve({ position: position +1 })
        }
        return expect(maizal.bfs(c).then(tree => tree.pop().data.position)).to.eventually.eq(4); 
    });
    it('If the final states are not reachable the search should be rejected', () => {
        c = Object.assign({}, corridor)
        c.actions = {
            expand: ({position}) => Promise.resolve({ position: position })
        }
        return expect(maizal.bfs(c).then(tree => tree)).to.be.rejected; 
    });
    it('An empty expand function should be rejected', () => {
        c = Object.assign({}, corridor)
        c.actions = {
            name: 'IdoNotHaveExpand'
        }
        return expect(maizal.bfs(c).then(tree => tree)).to.be.rejected; 
    });
});