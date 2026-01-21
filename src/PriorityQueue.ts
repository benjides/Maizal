/**
 * Naive implementation of a PriorityQueue using sorted array as internal data structure
 */

/**
 * Queue containing arbitrary data sorted by ascending priority
 *
 * @category model
 */
export type PriorityQueue<T> = T[]

/**
 * Defines a total ordering over values of the same type
 * If `a` precedes `b` -1 shall be returned
 * If `b` precedes `c` 1 shall be returned
 * If `a` and `b` are in same position 0 shall be returned
 *
 * @category model
 */
export type Ord<T> = (a: T, b: T) => number

/**
 * Creates an empty PriorityQueue
 *
 * @category constructors
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(values(empty()), [])
 * ```
 */
export const empty: <T>() => PriorityQueue<T> = () => []

/**
 * Creates a PriorityQueue for a given element
 *
 * @category constructors
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(values(of('Hello World!')), ['Hello World!'])
 * ```
 */
export const of: <T>(data: T) => PriorityQueue<T> = <T>(data: T) => [data]

/**
 * Converts a given PriorityQueue into an array containing current values maintaining priority order
 *
 * @category conversions
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(values(of('Hello World!')), ['Hello World!'])
 * ```
 */
export const values = <T>(priorityQueue: PriorityQueue<T>) => priorityQueue

/**
 * Inserts an element for a given PriorityQueue
 *
 * @example
 * ```ts
 * const ord : Ord<string> = (a: string, b: string) => b.length - a .length
 *
 * const priorityQueue : PriorityQueue<string> = insert(ord)('Hello World!')(empty())
 *
 * assert.deepStrictEqual(values(priorityQueue), ['Hello World!'])
 * ```
 */
export const insert: <T>(
  ord: Ord<T>,
) => (data: T) => (priorityQueue: PriorityQueue<T>) => PriorityQueue<T> =
  <T>(ord: Ord<T>) =>
  (data: T) =>
  (priorityQueue: PriorityQueue<T>) => {
    const index: number = priorityQueue.findIndex(
      (node: T) => ord(data, node) > 0,
    )

    if (index === -1) {
      return [...priorityQueue, data]
    }

    return [
      ...priorityQueue.slice(0, index),
      data,
      ...priorityQueue.slice(index),
    ]
  }

/**
 * Returns the next element in the queue and the resulting PriorityQueue if possible
 *
 * @example
 * ```ts
 * const [element, priorityQueue] = poll(of('Hello World!'))
 *
 * assert.deepStrictEqual(element, 'Hello World!')
 * assert.deepStrictEqual(values(priorityQueue), [])
 * ```
 *
 * @example
 * ```ts
 * const [element, priorityQueue] = poll(empty())
 *
 * assert.isNull(element)
 * assert.deepStrictEqual(values(priorityQueue), [])
 * ```
 */
export const poll: <T>(
  priorityQueue: PriorityQueue<T>,
) => [T | null, PriorityQueue<T>] = <T>(priorityQueue: PriorityQueue<T>) => [
  priorityQueue[0] ?? null,
  priorityQueue.slice(1),
]
