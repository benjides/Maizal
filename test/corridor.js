module.exports = {
  initial: {
    position: 1,
  },
  goals: {
    position: 4,
  },
  actions: [
    {
      name: 'right',
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
    },
  ],
  hash: 'position',
  heuristics: state => 4 - state.position,
};
