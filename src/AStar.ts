import { Node } from './Node'
import { Evaluate, Search, solver } from './Search'

const aStarEvaluate: <S>(heuristics: Heuristics<S>) => Evaluate<S> =
  <S>(heuristics: Heuristics<S>) =>
  (node: Node<S>) =>
    node.depth + heuristics(node.state)

export type Heuristics<S> = (currentState: S) => number

export const aStar: <S>(
  heuristics: Heuristics<S>,
) => (search: Search<S>) => Promise<S[]> = <S>(heuristics: Heuristics<S>) =>
  solver(aStarEvaluate(heuristics))
