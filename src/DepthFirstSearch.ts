import * as PQ from './PriorityQueue'
import * as T from './Tree'
import * as HS from './HashSet'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

type Node<S> = T.Tree<number, S>

type State<S> = {
  current: Node<S>
  open: PQ.PriorityQueue<Node<S>>
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

export const isDone: <T>(
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
    goal,
    {
      current: T.fromRoot(1, goal),
      open: PQ.of(0, T.fromRoot(0, initial)),
      closed: HS.empty(),
    },
    eq,
    expand,
  )

const expandRecursively = async <S>(
  goal: S,
  state: State<S>,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  const newState = poll(state)

  if (newState === null) {
    return []
  }

  if (isDone(eq)(goal)(newState)) {
    return T.toArray(newState.current)
  }

  const newStates: PQ.PriorityQueue<T.Tree<number, S>> = (
    await Promise.all(expand(newState.current.value))
  )
    .filter((state: S) => !HS.has(eq)(state)(newState.closed))
    .map(
      (state: S): T.Tree<number, S> =>
        T.insert(newState.current.key - 1, state)(newState.current),
    )
    .reduce(
      (
        priorityQueue: PQ.PriorityQueue<T.Tree<number, S>>,
        treeBranch: T.Tree<number, S>,
      ) => PQ.insert(treeBranch.key, treeBranch)(priorityQueue),
      newState.open,
    )

  const next: State<S> = {
    current: newState.current,
    open: newStates,
    closed: newState.closed,
  }

  return expandRecursively(goal, next, eq, expand)
}
