/**
 * Creates a new node
 *
 * @param {Object} parent state
 * @param {Object} data information about the state
 * @param {boolean} final
 * @param {Object} action taken action
 */
const node = ({
  parent, data, final, action,
}) => ({
  parent,
  data,
  final,
  action: action.name,
  cost: parent.cost + action.cost || action.cost,
  depth: parent.depth + 1 || 1,
});

module.exports = node;
