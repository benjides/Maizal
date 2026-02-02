import {
  poll,
  priorityQueue,
  PriorityQueue,
  insert as priorityQueueInsert,
} from './PriorityQueue'
import { hashSet, has, HashSet, insert as hashSetInsert } from './HashSet'
import { initial, node, Node, nodeOrd, toArray } from './Node'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

type OpenSet<S> = PriorityQueue<Node<S>>

type ClosedSet<S> = HashSet<S>

const isDone: <S>(eq: Eq<S>, node: S) => (state: S) => boolean =
  <T>(eq: Eq<T>, node: T) =>
  (state: T) =>
    eq(node, state)

const openSet: <S>(state: S) => OpenSet<S> = <S>(state: S) =>
  priorityQueue(initial(state))

const closedSet: <S>() => ClosedSet<S> = <S>() => hashSet<S>()

export const depthFirstSearch: Search = async <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  return expandRecursively(
    openSet(initial),
    closedSet(),
    isDone(eq, goal),
    eq,
    expand,
  )
}

const nodeInsert: <S>(node: Node<S>) => (openSet: OpenSet<S>) => OpenSet<S> =
  <S>(node: Node<S>) =>
  (openSet: OpenSet<S>) =>
    priorityQueueInsert(nodeOrd<S>())(node)(openSet)

const hasBeenVisited =
  <S>(eq: Eq<S>, hashSet: HashSet<S>) =>
  (state: S) =>
    has(eq)(state)(hashSet)

const expandRecursively = async <S>(
  openSet: OpenSet<S>,
  closedSet: ClosedSet<S>,
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

  const closed: HashSet<S> = hashSetInsert(n.state)(closedSet)

  const newStates: OpenSet<S> = (await Promise.all(expand(n.state)))
    .filter((state: S) => !hasBeenVisited(eq, closed)(state))
    .map(node(n))
    .reduce(
      (openSet: OpenSet<S>, node: Node<S>) => nodeInsert(node)(openSet),
      priorityQueue,
    )

  return expandRecursively(newStates, closed, isGoal, eq, expand)
}
