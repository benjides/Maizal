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
  value: S
  parent: Node<S> | null
}

type OpenSet<S> = PriorityQueue<Node<S>>

type State<S> = {
  current: Node<S>
  open: OpenSet<S>
  closed: HS.HashSet<S>
}

export const poll: <T>(state: State<T>) => State<T> | null = <T>(
  state: State<T>,
) => {
  const [currentState, priorityQueue] = PQ.poll(state.open)

  if (currentState === null) {
    return null
  }

  return {
    current: currentState,
    closed: HS.insert(currentState.value)(state.closed),
    open: priorityQueue,
  }
}

const isDone: <T>(eq: Eq<T>, node: T) => (state: T) => boolean =
  <T>(eq: Eq<T>, node: T) =>
  (state: T) =>
    eq(node, state)

const initialNode: <S>(value: S) => Node<S> = <S>(value: S): Node<S> => ({
  key: 0,
  value: value,
  parent: null,
})

const toArray: <S>(node: Node<S>) => S[] = <S>(node: Node<S>) =>
  node.parent === null ? [node.value] : [...toArray(node.parent), node.value]

export const depthFirstSearch: Search = async <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> =>
  expandRecursively(
    {
      current: initialNode(initial),
      open: PQ.of(initialNode(initial)),
      closed: HS.empty(),
    },
    isDone(eq, goal),
    expandNewStates(expand, hasBeenVisited(eq)),
  )

const nodeOrd = <S>(a: Node<S>, b: Node<S>) => b.key - a.key

const nodeInsert: <S>(node: Node<S>) => (openSet: OpenSet<S>) => OpenSet<S> =
  <S>(node: Node<S>) =>
  (openSet: OpenSet<S>) =>
    PQ.insert(nodeOrd)(node)(openSet)

const hasBeenVisited: <S>(
  eq: Eq<S>,
) => (s: S) => (hashSet: HashSet<S>) => boolean =
  <S>(eq: Eq<S>) =>
  (s: S) =>
  (hashSet: HashSet<S>) =>
    HS.has(eq)(s)(hashSet)

export const expandNewStates =
  <S>(
    expand: Expand<S>,
    hasBeenVisited: (s: S) => (hashSet: HashSet<S>) => boolean,
  ) =>
  async (state: State<S>) =>
    (await Promise.all(expand(state.current.value)))
      .filter((vector: S) => !hasBeenVisited(vector)(state.closed))
      .map(
        (vector: S): Node<S> => ({
          key: state.current.key - 1,
          value: vector,
          parent: state.current,
        }),
      )
      .reduce(
        (priorityQueue: OpenSet<S>, node: Node<S>) =>
          nodeInsert(node)(priorityQueue),
        state.open,
      )

const expandRecursively = async <S>(
  state: State<S>,
  isGoal: (node: S) => boolean,
  expandState: (state: State<S>) => Promise<OpenSet<S>>,
): Promise<S[]> => {
  const newState = poll(state)

  if (newState === null) {
    return []
  }

  if (isGoal(newState.current.value)) {
    return toArray(newState.current)
  }

  const newStates: OpenSet<S> = await expandState(newState)

  const next: State<S> = {
    current: newState.current,
    open: newStates,
    closed: newState.closed,
  }

  return expandRecursively(next, isGoal, expandState)
}
