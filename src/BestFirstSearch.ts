import { Node } from './Node'
import { Evaluate, Search, solver } from './Search'

const bestFirstSearchEvaluate: <S>() => Evaluate<S> =
  <S>() =>
  (node: Node<S>) =>
    node.depth

export const bestFirstSearch: <S>(search: Search<S>) => Promise<S[]> = solver(
  bestFirstSearchEvaluate(),
)
