// Uninformed
const bfs = require('./uninformed/bfs');
const dijkstra = require('./uninformed/dijkstra');
const random = require('./uninformed/random');
const dfs = require('./uninformed/dfs');

// Informed
const bestfs = require('./informed/bestfs');
const astar = require('./informed/astar');

module.exports = {
  bfs, dijkstra, random, dfs, bestfs, astar,
};
