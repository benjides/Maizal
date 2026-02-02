import * as PQ from './PriorityQueue'
import { PriorityQueue } from './PriorityQueue'
import * as HS from './HashSet'
import { HashSet } from './HashSet'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

type Node<S> = {
  key: number
  state: S
  parent: Node<S> | null
}

type OpenSet<S> = PriorityQueue<Node<S>>

type ClosedSet<S> = HashSet<S>

const isDone: <S>(eq: Eq<S>, node: S) => (state: S) => boolean =
  <T>(eq: Eq<T>, node: T) =>
  (state: T) =>
    eq(node, state)

const initialNode: <S>(state: S) => Node<S> = <S>(state: S): Node<S> => ({
  key: 0,
  state: state,
  parent: null,
})

const toArray: <S>(node: Node<S>) => S[] = <S>(node: Node<S>) =>
  node.parent === null ? [node.state] : [...toArray(node.parent), node.state]

const openSet: <S>(initial: S) => OpenSet<S> = <S>(initial: S) =>
  PQ.of(initialNode(initial))

const closedSet: <S>() => ClosedSet<S> = <S>() => HS.empty<S>()

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

const nodeOrd = <S>(a: Node<S>, b: Node<S>) => b.key - a.key

const nodeInsert: <S>(node: Node<S>) => (openSet: OpenSet<S>) => OpenSet<S> =
  <S>(node: Node<S>) =>
  (openSet: OpenSet<S>) =>
    PQ.insert(nodeOrd)(node)(openSet)

const hasBeenVisited =
  <S>(eq: Eq<S>, hashSet: HashSet<S>) =>
  (state: S) =>
    HS.has(eq)(state)(hashSet)

const expandRecursively = async <S>(
  openSet: OpenSet<S>,
  closedSet: ClosedSet<S>,
  isGoal: (state: S) => boolean,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  const [node, priorityQueue] = PQ.poll(openSet)

  if (node === null) {
    return []
  }

  if (isGoal(node.state)) {
    return toArray(node)
  }

  const closed: HS.HashSet<S> = HS.insert(node.state)(closedSet)

  const newStates: OpenSet<S> = (await Promise.all(expand(node.state)))
    .filter((state: S) => !hasBeenVisited(eq, closed)(state))
    .map(
      (state: S): Node<S> => ({
        key: node.key - 1,
        state: state,
        parent: node,
      }),
    )
    .reduce(
      (openSet: OpenSet<S>, node: Node<S>) => nodeInsert(node)(openSet),
      priorityQueue,
    )

  return expandRecursively(newStates, closed, isGoal, eq, expand)
}
