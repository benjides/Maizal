import * as PQ from './PriorityQueue'
import * as T from './Tree'
import * as HS from './HashSet'
import { PriorityQueue } from './PriorityQueue'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

type Node<S> = T.Tree<number, S>

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

const isDone: <T>(
  eq: Eq<T>,
) => (node: T) => (state: State<T>) => boolean =
  <T>(eq: Eq<T>) =>
  (node: T) =>
  (state: State<T>) =>
    eq(node, state.current.value)

export const depthFirstSearch: Search = async <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> =>
  expandRecursively(
    {
      current: T.fromRoot(1, goal),
      open: PQ.of(T.fromRoot(0, initial)),
      closed: HS.empty(),
    },
    isDone(eq)(goal),
    expandNewStates(expand)(eq),
  )

export const expandNewStates =
  <S>(expand: Expand<S>) =>
  (eq: Eq<S>) =>
  async (state: State<S>) =>
    (await Promise.all(expand(state.current.value)))
      .filter((vector: S) => !HS.has(eq)(vector)(state.closed))
      .map(
        (vector: S): Node<S> =>
          T.insert(state.current.key - 1, vector)(state.current),
      )
      .reduce(
        (priorityQueue: OpenSet<S>, treeBranch: Node<S>) =>
          PQ.insert((a: Node<S>, b: Node<S>) => b.key - a.key)(treeBranch)(
            priorityQueue,
          ),
        state.open,
      )

const expandRecursively = async <S>(
  state: State<S>,
  isGoal: (state: State<S>) => boolean,
  expandState: (state: State<S>) => Promise<OpenSet<S>>,
): Promise<S[]> => {
  const newState = poll(state)

  if (newState === null) {
    return []
  }

  if (isGoal(newState)) {
    return T.toArray(newState.current)
  }

  const newStates: OpenSet<S> = await expandState(newState)

  const next: State<S> = {
    current: newState.current,
    open: newStates,
    closed: newState.closed,
  }

  return expandRecursively(next, isGoal, expandState)
}
