export type Graph<S> = Vertex<S>[]

export type Vertex<T> = {
  data: T
  adjacentVertexes: number[]
}
export type Eq<T> = (x: T, y: T) => boolean

export const graph: <S>() => Graph<S> = <S>(): Graph<S> => []

export const vertex: <S>(
  eq: Eq<S>,
  vertex: S,
) => (graph: Graph<S>) => Graph<S> =
  <S>(eq: Eq<S>, vertex: S) =>
  (graph: Graph<S>) =>
    hasVertex(eq, vertex)(graph)
      ? graph
      : [
          ...graph,
          {
            data: vertex,
            adjacentVertexes: [],
          },
        ]

export const hasVertex: <S>(
  eq: Eq<S>,
  vertex: S,
) => (graph: Graph<S>) => boolean =
  <S>(eq: Eq<S>, vertex: S) =>
  (graph: Graph<S>) =>
    getVertex(eq, vertex)(graph) !== null

const getVertex: <S>(
  eq: Eq<S>,
  x: S,
) => (graph: Graph<S>) => Vertex<S> | null =
  <S>(eq: Eq<S>, x: S) =>
  (graph: Graph<S>) =>
    graph.find((vertex: Vertex<S>) => eq(vertex.data, x)) ?? null

const vertexIndex: <S>(eq: Eq<S>, x: S) => (graph: Graph<S>) => number =
  <S>(eq: Eq<S>, x: S) =>
  (graph: Graph<S>) =>
    graph.findIndex((vertex: Vertex<S>) => eq(vertex.data, x))

export const edge =
  <S>(eq: Eq<S>, x: S, y: S) =>
  (graph: Graph<S>): Graph<S> =>
    graph.map((vertex: Vertex<S>) => {
      if (eq(vertex.data, x)) {
        return {
          data: vertex.data,
          adjacentVertexes: [
            ...vertex.adjacentVertexes,
            vertexIndex(eq, y)(graph),
          ],
        }
      }

      if (eq(vertex.data, y)) {
        return {
          data: vertex.data,
          adjacentVertexes: [
            ...vertex.adjacentVertexes,
            vertexIndex(eq, x)(graph),
          ],
        }
      }
      return vertex
    })

export const hasEdge =
  <S>(eq: Eq<S>, x: S, y: S) =>
  (graph: Graph<S>) =>
    getVertex(
      eq,
      x,
    )(graph)?.adjacentVertexes.includes(vertexIndex(eq, y)(graph))

export const adjacent =
  <S>(eq: Eq<S>, x: S, adjacent: S[]) =>
  (graph: Graph<S>): Graph<S> =>
    adjacent.reduce(
      (accumulatedGraph: Graph<S>, v: S) =>
        edge(eq, x, v)(vertex(eq, v)(accumulatedGraph)),
      graph,
    )

export const size: <S>(graph: Graph<S>) => number = <S>(graph: Graph<S>) =>
  graph.length
