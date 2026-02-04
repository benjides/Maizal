import { initial, node, Node, nodeOrd, toArray } from './Node'
import {
  insert as priorityQueueInsert,
  poll,
  priorityQueue,
  PriorityQueue,
} from './PriorityQueue'
import { has, hashSet, HashSet, insert as hashSetInsert } from './HashSet'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search<S> = (
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

type OpenSet<S> = PriorityQueue<Node<S>>

const openSet: <S>(state: S) => OpenSet<S> = <S>(state: S) =>
  priorityQueue(initial(state))

type ClosedSet<S> = HashSet<S>

const closedSet: <S>() => ClosedSet<S> = <S>() => hashSet<S>()

export type Evaluate<S> = (node: Node<S>) => number

const isDone: <S>(eq: Eq<S>, node: S) => (state: S) => boolean =
  <T>(eq: Eq<T>, node: T) =>
  (state: T) =>
    eq(node, state)

export const search: <S>(evaluate: Evaluate<S>) => Search<S> =
  <S>(evaluate: Evaluate<S>) =>
  async (initial: S, goal: S, eq: Eq<S>, expand: Expand<S>): Promise<S[]> =>
    expandRecursively(
      openSet(initial),
      closedSet(),
      nodeInsert(evaluate),
      isDone(eq, goal),
      eq,
      expand,
    )

const nodeInsert: <S>(
  evaluate: Evaluate<S>,
) => (node: Node<S>) => (openSet: OpenSet<S>) => OpenSet<S> =
  <S>(evaluate: Evaluate<S>) =>
  (node: Node<S>) =>
  (openSet: OpenSet<S>) =>
    priorityQueueInsert(nodeOrd(evaluate))(node)(openSet)

const hasBeenVisited: <S>(
  eq: Eq<S>,
  closedSet: ClosedSet<S>,
) => (state: S) => boolean =
  <S>(eq: Eq<S>, closedSet: ClosedSet<S>) =>
  (state: S) =>
    has(eq)(state)(closedSet)

const expandRecursively = async <S>(
  openSet: OpenSet<S>,
  closedSet: ClosedSet<S>,
  openSetInsert: (node: Node<S>) => (openSet: OpenSet<S>) => OpenSet<S>,
  isGoal: (state: S) => boolean,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  const [n, priorityQueue] = poll(openSet)

  if (n === null) {
    return []
  }

  if (isGoal(n.state)) {
    return toArray(n)
  }

  const closed: ClosedSet<S> = hashSetInsert(n.state)(closedSet)

  const newStates: OpenSet<S> = (await Promise.all(expand(n.state)))
    .filter((state: S) => !hasBeenVisited(eq, closed)(state))
    .map(node(n))
    .reduce(
      (openSet: OpenSet<S>, node: Node<S>) => openSetInsert(node)(openSet),
      priorityQueue,
    )

  return expandRecursively(newStates, closed, openSetInsert, isGoal, eq, expand)
}
