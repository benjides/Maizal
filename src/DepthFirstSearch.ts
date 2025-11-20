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
  ): Promise<S[]> {
    const r = poll(open)

    const next = r[0]
    let nextQueue = r[1]

    if (next === null) {
      return []
    }

    if (eq(goal, next.state)) {
      return solution(next)
    }

    const newStates = (await Promise.all(expand(next.state)))
      .filter((state: S) => !has(eq)(state)(closed))
      .map(
        (state: S): State<S> => ({
          parent: next,
          depth: next.depth + 1,
          state: state,
        }),
      )

    for (const newState of newStates) {
      nextQueue = insertQueue({
        priority: -newState.depth,
        data: newState,
      })(nextQueue)
    }

    closed = insert(next.state)(closed)
    return expandRecursively(nextQueue, closed)
  }

  const initState: State<S> = {
    depth: 0,
    parent: null,
    state: initial,
  }

  return expandRecursively(
    insertQueue({
      data: initState,
      priority: initState.depth,
    })(open),
    closed,
  )
}
