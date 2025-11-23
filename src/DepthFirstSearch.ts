import * as PQ from './PriorityQueue.js'
import * as T from './Tree.js'
import * as HS from './HashSet.js'

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
  const open: PQ.PriorityQueue<T.Tree<number, S>> = PQ.empty()
  const closed: HS.HashSet<S> = HS.empty()

  async function expandRecursively(
    open: PQ.PriorityQueue<T.Tree<number, S>>,
    closed: HS.HashSet<S>,
  ): Promise<S[]> {
    const [currentState, priorityQueue] = PQ.poll(open)

    if (currentState === null) {
      return []
    }
    closed = HS.insert(currentState.value)(closed)

    if (eq(goal, currentState.value)) {
      return T.toArray(currentState)
    }

    const newStates: PQ.PriorityQueue<T.Tree<number, S>> = (
      await Promise.all(expand(currentState.value))
    )
      .filter((state: S) => !HS.has(eq)(state)(closed))
      .map(
        (state: S): T.Child<number, S> => ({
          key: currentState.key - 1,
          value: state,
        }),
      )
      .map((child: T.Child<number, S>) => T.insert(child)(currentState))
      .reduce(
        (
          priorityQueue: PQ.PriorityQueue<T.Tree<number, S>>,
          treeBranch: T.Tree<number, S>,
        ) => PQ.insert(treeBranch.key, treeBranch)(priorityQueue),
        priorityQueue,
      )

    return expandRecursively(newStates, closed)
  }

  const t: T.Tree<number, S> = T.fromRoot({
    key: 0,
    value: initial,
  })

  return expandRecursively(PQ.insert(0, t)(open), closed)
}
