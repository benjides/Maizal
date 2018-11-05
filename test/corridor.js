module.exports = {
    initial: {
        position: 0
    },
    goals: {
        position: 4
    },
    actions: [
        {
            name: 'right',
            expand: (state) => {
                if(state.psotion + 1 > 4) return;
                return {position: state.position + 1}
            }
        },
        {
            name: 'left',
            expand: (state) => {
                if(state.psotion - 1 < 0) return;
                return {position: state.position - 1}
            }
        }
    ],
    hash: 'position'
};
