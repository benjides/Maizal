import { Node } from './Node'
import { Evaluate, Search, solver } from './Search'

const depthFirstSearchEvaluate: <S>() => Evaluate<S> =
  <S>() =>
  (node: Node<S>) =>
    -node.depth

export const depthFirstSearch: <S>(search: Search<S>) => Promise<S[]> = solver(
  depthFirstSearchEvaluate(),
)
