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

export const depthFirstSearch: Search = async <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> =>
  expandRecursively(
    goal,
    PQ.of(0, T.fromRoot(0, initial)),
    HS.empty(),
    eq,
    expand,
  )

const expandRecursively = async <S>(
  goal: S,
  open: PQ.PriorityQueue<T.Tree<number, S>>,
  closed: HS.HashSet<S>,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  const state: State<S> = {
    current: T.fromRoot(1, goal),
    open: open,
    closed: closed,
  }
  const ns = poll(state)

  if (ns === null) {
    return []
  }

  if (eq(goal, ns.current.value)) {
    return T.toArray(ns.current)
  }

  const newStates: PQ.PriorityQueue<T.Tree<number, S>> = (
    await Promise.all(expand(ns.current.value))
  )
    .filter((state: S) => !HS.has(eq)(state)(ns.closed))
    .map(
      (state: S): T.Tree<number, S> =>
        T.insert(ns.current.key - 1, state)(ns.current),
    )
    .reduce(
      (
        priorityQueue: PQ.PriorityQueue<T.Tree<number, S>>,
        treeBranch: T.Tree<number, S>,
      ) => PQ.insert(treeBranch.key, treeBranch)(priorityQueue),
      ns.open,
    )

  return expandRecursively(goal, newStates, ns.closed, eq, expand)
}
