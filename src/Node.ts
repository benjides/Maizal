import { Ord } from './PriorityQueue'

import { Evaluate } from './Search'

export type Node<S> = {
  state: S
  parent: Node<S> | null
  depth: number
}

export const node =
  <S>(node: Node<S>) =>
  (state: S): Node<S> => ({
    state: state,
    parent: node,
    depth: node.depth + 1,
  })

export const initial: <S>(state: S) => Node<S> = <S>(state: S): Node<S> => ({
  state: state,
  parent: null,
  depth: 0,
})

export const toArray: <S>(node: Node<S>) => S[] = <S>(node: Node<S>) =>
  node.parent === null ? [node.state] : [...toArray(node.parent), node.state]

export const nodeOrd: <S>(evaluate: Evaluate<S>) => Ord<Node<S>> =
  <S>(evaluate: Evaluate<S>) =>
  (a: Node<S>, b: Node<S>) =>
    evaluate(b) - evaluate(a)
