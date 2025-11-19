import {
  insert as insertQueue,
  poll,
  priorityQueue,
  type PriorityQueue,
} from './PriorityQueue.js'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>

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
      if (s.parent !== null) {
        return [s.state, s.parent.state].reverse()
      }

      return [s.state]
    }

    const ns: S = await expand(s.state)

    const data: State<S> = {
      parent: s,
      depth: s.depth + 1,
      state: ns,
    }
    const queue = insertQueue({
      priority: s.depth + 1,
      data: data,
    })(open)
    return expandRecursively(queue, poll(queue)[0] as State<S>)
  }
  const initState: State<S> = {
    depth: 0,
    parent: null,
    state: initial,
  }

  return expandRecursively(open, initState)
}
