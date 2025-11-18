export type Eq<S> = (a: S, b: S) => boolean

export type Search = <S>(initial: S, goal: S, eq: Eq<S>) => Promise<S[]>

export const depthFirstSearch: Search = <S>(initial: S, goal: S, eq: Eq<S>) =>
  eq(initial, goal) ? Promise.resolve([goal]) : Promise.resolve([])
