import { Node } from './Node'
import { Evaluate, Search, search } from './Search'

const bestFirstSearchEvaluate: <S>() => Evaluate<S> =
  <S>() =>
  (node: Node<S>) =>
    node.key + 1

export const bestFirstSearch: Search = search(bestFirstSearchEvaluate())
