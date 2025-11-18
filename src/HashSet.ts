export type HashSet<T> = T[]

export type Eq<T> = (x: T, y: T) => boolean

export const empty: <T>() => HashSet<T> = () => []

export const insert: <T>(element: T) => (hashSet: HashSet<T>) => HashSet<T> =
  <T>(element: T) =>
  (hashSet: HashSet<T>) => [...hashSet, element]

export const has: <T>(
  eq: Eq<T>,
) => (element: T) => (hashSet: HashSet<T>) => boolean =
  <T>(eq: Eq<T>) =>
  (element: T) =>
  (hashSet: HashSet<T>): boolean =>
    hashSet.findIndex((a: T) => eq(a, element)) !== -1
