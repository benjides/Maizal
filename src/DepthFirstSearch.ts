import { Node } from './Node'
import { Evaluate, Search, search } from './Search'

const depthFirstSearchEvaluate: <S>() => Evaluate<S> =
  <S>() =>
  (node: Node<S>) =>
    node.key - 1

export const depthFirstSearch: Search = search(depthFirstSearchEvaluate())
