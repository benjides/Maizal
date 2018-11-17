const maizal = require('./lib/maizal');
const corridor = require('./test/corridor');


maizal.dijkstra({
  initial: {
    position: 3,
  },
  goals: {
    position: 4,
  },
  actions: [
    {
      name: 'right',
      cost: 40,
      expand: (state) => {
        if (state.position + 1 > 5) return undefined;
        return { position: state.position + 1 };
      },
    },
    {
      name: 'left',
      expand: (state) => {
        if (state.position - 1 < 0) return undefined;
        return { position: state.position - 1 };
      },
    },
  ],
  hash: 'position',
}).then(tree => console.log(tree));
