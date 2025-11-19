import {
  insert as insertQueue,
  poll,
  priorityQueue,
  type PriorityQueue,
} from './PriorityQueue.js'

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

  async function expandRecursively(
    open: PriorityQueue<State<S>>,
    s: State<S>,
  ): Promise<S[]> {
    if (eq(goal, s.state)) {
      return solution(s)
    }

    const ns: S[] = await Promise.all(expand(s.state))

    const newStates = ns.map(
      (state: S): State<S> => ({
        parent: s,
        depth: s.depth + 1,
        state: state,
      }),
    )

    for (const newState of newStates) {
      open = insertQueue({
        priority: newState.depth,
        data: newState,
      })(open)
    }

    const [next, nextQueue] = poll(open)
    return expandRecursively(nextQueue, next as State<S>)
  }
  const initState: State<S> = {
    depth: 0,
    parent: null,
    state: initial,
  }

  return expandRecursively(open, initState)
}
