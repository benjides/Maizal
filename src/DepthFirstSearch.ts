import * as PQ from './PriorityQueue.js'
import * as T from './Tree.js'
import * as HS from './HashSet.js'
import type { PriorityQueue } from './PriorityQueue.js'
import type { Child, Tree, Node } from './Tree.js'
import type { HashSet } from './HashSet.js'

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
  const open: PriorityQueue<Tree<number, S>> = PQ.priorityQueue([])
  const closed: HashSet<S> = HS.empty()

  async function expandRecursively(
    open: PriorityQueue<Tree<number, S>>,
    closed: HashSet<S>,
  ): Promise<S[]> {
    console.log(open)
    const r = PQ.poll(open)

    const next = r[0]
    let nextQueue = r[1]

    if (next === null) {
      return []
    }

    if (eq(goal, next.value)) {
      return T.toArray(next)
    }

    const newStates: PQ.Node<T.Node<number, S>>[] = (
      await Promise.all(expand(next.value))
    )
      .filter((state: S) => !HS.has(eq)(state)(closed))
      .map(
        (state: S): Child<number, S> => ({
          key: next.key + 1,
          value: state,
        }),
      )
      .map((child: Child<number, S>) => T.insert(child)(next))
      .map((node: Node<number, S>) =>
        PQ.node((a: Node<number, S>) => -a.key)(node),
      )

    for (const newState of newStates) {
      nextQueue = PQ.insert(newState)(nextQueue)
    }

    closed = HS.insert(next.value)(closed)
    return expandRecursively(nextQueue, closed)
  }

  const t: T.Tree<number, S> = T.fromRoot({
    key: 0,
    value: initial,
  })

  return expandRecursively(
    PQ.insert({
      data: t,
      priority: 0,
    })(open),
    closed,
  )
}
