/**
 * HashSet containing arbitrary data
 *
 * @category model
 */
export type HashSet<T> = T[]

/**
 * Given two elements of the same type, checks if they are essentially the same
 *
 * @category model
 */
export type Eq<T> = (x: T, y: T) => boolean

/**
 * Creates an empty HashSet
 *
 * @category constructor
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(empty(), [2])
 * ```
 */
export const empty: <T>() => HashSet<T> = () => []

/**
 * Inserts an element for a given HashSet. Does not check if the element is already present
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(insert(2)(empty<number>()), [2])
 * ```
 */
export const insert: <T>(element: T) => (hashSet: HashSet<T>) => HashSet<T> =
  <T>(element: T) =>
  (hashSet: HashSet<T>) => [...hashSet, element]

/**
 * Checks if an element is present for a given Eq and a given HashSet
 *
 * @example
 * ```ts
 * const hashSet : hashSet<number> = insert(2)(empty())
 * const eq : Eq<number> = (x: number, y: number) => x === y
 *
 * assert.isTrue(has(eq)(2)(hashSet))
 * ```
 * @example
 * ```ts
 * const hashSet : hashSet<number> = insert(2)(empty())
 * const eq : Eq<number> = (x: number, y: number) => x === y
 *
 * assert.isFalse(has(eq)(87557)(hashSet))
 * ```
 *
 * @see Eq
 */
export const has: <T>(
  eq: Eq<T>,
) => (element: T) => (hashSet: HashSet<T>) => boolean =
  <T>(eq: Eq<T>) =>
  (element: T) =>
  (hashSet: HashSet<T>): boolean =>
    hashSet.findIndex((a: T) => eq(a, element)) !== -1
