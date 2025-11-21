import {
  insert as insertQueue,
  poll,
  priorityQueue,
  type PriorityQueue,
} from './PriorityQueue.js'
import { empty, has, type HashSet, insert } from './HashSet.js'
import {
  type Child,
  toArray,
  type Tree,
  insert as insertChild,
  tree,
} from './Tree.js'

export type Eq<S> = (a: S, b: S) => boolean

export type Expand<S> = (s: S) => Promise<S>[]

export type Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
) => Promise<S[]>

export const depthFirstSearch: Search = <S>(
  initial: S,
  goal: S,
  eq: Eq<S>,
  expand: Expand<S>,
): Promise<S[]> => {
  const open: PriorityQueue<Tree<number, S>> = priorityQueue([])
  const closed: HashSet<S> = empty()

  async function expandRecursively(
    open: PriorityQueue<Tree<number, S>>,
    closed: HashSet<S>,
  ): Promise<S[]> {
    const r = poll(open)

    const next = r[0]
    let nextQueue = r[1]

    if (next === null) {
      return []
    }

    if (eq(goal, next.value)) {
      return toArray(next)
    }

    const newStates = (await Promise.all(expand(next.value)))
      .filter((state: S) => !has(eq)(state)(closed))
      .map(
        (state: S): Child<number, S> => ({
          key: next.key + 1,
          value: state,
        }),
      )

    for (const newState of newStates) {
      const tree: Tree<number, S> = insertChild(newState)(next)
      nextQueue = insertQueue({
        priority: -newState.key,
        data: tree,
      })(nextQueue)
    }

    closed = insert(next.value)(closed)
    return expandRecursively(nextQueue, closed)
  }

  const t: Tree<number, S> = tree({
    key: 0,
    value: initial,
  })

  return expandRecursively(
    insertQueue({
      data: t,
      priority: 0,
    })(open),
    closed,
  )
}
