// Uninformed
const bfs = require('./uninformed/bfs');
const dijkstra = require('./uninformed/dijkstra');
const random = require('./uninformed/random');
const dfs = require('./uninformed/dfs');

// Informed
const bestfs = require('./informed/bestfs');

module.exports = {
  bfs, dijkstra, random, dfs, bestfs,
};
