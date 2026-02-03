import { Ord } from './PriorityQueue'

import { Evaluate } from './Search'

export type Node<S> = {
  key: number
  state: S
  parent: Node<S> | null
}

export const node =
  <S>(evaluate: Evaluate<S>) =>
  (node: Node<S>) =>
  (state: S): Node<S> => ({
    key: evaluate(node),
    state: state,
    parent: node,
  })

export const initial: <S>(state: S) => Node<S> = <S>(state: S): Node<S> => ({
  key: 0,
  state: state,
  parent: null,
})

export const toArray: <S>(node: Node<S>) => S[] = <S>(node: Node<S>) =>
  node.parent === null ? [node.state] : [...toArray(node.parent), node.state]

export const nodeOrd: <S>() => Ord<Node<S>> =
  <S>() =>
  (a: Node<S>, b: Node<S>) =>
    b.key - a.key
