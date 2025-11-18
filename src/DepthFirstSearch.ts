export type Node<T> = {
  parent: Node<T> | null
  depth: number
  data: T
  goal: boolean
}

export type Search = <S>(initial: S, goal: S) => Promise<void>

export type Expand<S> = (state: S) => Array<Promise<S>>
