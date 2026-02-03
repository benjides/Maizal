import { Node } from './Node'
import { Evaluate, Search, search } from './Search'

const bestFirstSearchEvaluate: <S>() => Evaluate<S> =
  <S>() =>
  (node: Node<S>) =>
    node.depth

export const bestFirstSearch: Search = search(bestFirstSearchEvaluate())
