import {
  insert as insertQueue,
  poll,
  priorityQueue,
  type PriorityQueue,
} from './PriorityQueue.js'
import { empty, has, type HashSet, insert } from './HashSet.js'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

type State<S> = {
  parent: State<S> | null
  state: S
  depth: number
}

const solution = <S>(state: State<S>) => {
  let node: State<S> | null = state
  const sol: S[] = []
  while (node !== null) {
    sol.push(node.state)
    node = node.parent
  }

  return sol.reverse()
}

export const depthFirstSearch: Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  const open: PriorityQueue<State<S>> = priorityQueue([])
  const closed: HashSet<S> = empty()

  async function expandRecursively(
    open: PriorityQueue<State<S>>,
    closed: HashSet<S>,
    s: State<S>,
  ): Promise<S[]> {
    if (eq(goal, s.state)) {
      return solution(s)
    }

    const newStates = (await Promise.all(expand(s.state)))
      .filter((s: S) => !has(eq)(s)(closed))
      .map(
        (state: S): State<S> => ({
          parent: s,
          depth: s.depth + 1,
          state: state,
        }),
      )

    for (const newState of newStates) {
      open = insertQueue({
        priority: -newState.depth,
        data: newState,
      })(open)
    }

    const [next, nextQueue] = poll(open)
    closed = insert(s.state)(closed)
    return expandRecursively(nextQueue, closed, next as State<S>)
  }
  const initState: State<S> = {
    depth: 0,
    parent: null,
    state: initial,
  }

  return expandRecursively(open, closed, initState)
}
