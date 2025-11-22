import * as PQ from './PriorityQueue.js'
import * as T from './Tree.js'
import * as HS from './HashSet.js'
import { type PriorityQueue } from './PriorityQueue.js'
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
    const [currentState, priorityQueue] = PQ.poll(open)

    if (currentState === null) {
      return []
    }

    if (eq(goal, currentState.value)) {
      return T.toArray(currentState)
    }

    const newStates: PriorityQueue<Tree<number, S>> = (
      await Promise.all(expand(currentState.value))
    )
      .filter((state: S) => !HS.has(eq)(state)(closed))
      .map(
        (state: S): Child<number, S> => ({
          key: currentState.key - 1,
          value: state,
        }),
      )
      .map((child: Child<number, S>) => T.insert(child)(currentState))
      .map((node: Node<number, S>) =>
        PQ.node((treeNode: Node<number, S>) => treeNode.key)(node),
      )
      .reduce(
        (
          priorityQueue: PriorityQueue<Tree<number, S>>,
          priorityNode: PQ.Node<T.Node<number, S>>,
        ) => PQ.insert(priorityNode)(priorityQueue),
        priorityQueue,
      )

    closed = HS.insert(currentState.value)(closed)
    return expandRecursively(newStates, closed)
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
