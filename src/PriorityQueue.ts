/**
 * Naive implementation of a PriorityQueue using sorted array as internal data structure
 */

/**
 * Queue containing arbitrary data sorted by ascending priority
 *
 * @category model
 */
export type PriorityQueue<T> = Node<T>[]

type Node<T> = {
  priority: number
  data: T
}

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
 * Creates a PriorityQueue for a given priority and element
 *
 * @category constructors
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(values(of(1, 'Hello World!'), ['Hello World!'])
 * ```
 */
export const of: <T>(priority: number, data: T) => PriorityQueue<T> = <T>(
  priority: number,
  data: T,
) => insert(priority, data)(empty())

/**
 * Converts a given PriorityQueue into an array containing current values maintaining priority order
 *
 * @category conversions
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(values(of(1, 'Hello World!'), ['Hello World!'])
 * ```
 */
export const values = <T>(priorityQueue: PriorityQueue<T>) =>
  priorityQueue.map((node: Node<T>) => node.data)

/**
 * Inserts an element with priority for a given PriorityQueue
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(values(insert(1, 'Hello World!')(empty()), ['Hello World!'])
 * ```
 */
export const insert: <T>(
  priority: number,
  data: T,
) => (priorityQueue: PriorityQueue<T>) => PriorityQueue<T> =
  <T>(priority: number, data: T) =>
  (priorityQueue: PriorityQueue<T>) => {
    const nodeToInsert: Node<T> = {
      priority: priority,
      data: data,
    }

    const index: number = priorityQueue.findIndex(
      (node: Node<T>) => nodeToInsert.priority < node.priority,
    )

    if (index === -1) {
      return [...priorityQueue, nodeToInsert]
    }

    return [
      ...priorityQueue.slice(0, index),
      nodeToInsert,
      ...priorityQueue.slice(index),
    ]
  }

/**
 * Returns the next element in the queue and the resulting PriorityQueue if possible
 *
 * @example
 * ```ts
 * const [element, priorityQueue] = poll(of(1, 'Hello World!'))
 *
 * assert.deepStrictEqual(element, 'Hello World!')
 * assert.deepStrictEqual(priorityQueue, [])
 * ```
 *
 * @example
 * ```ts
 * const [element, priorityQueue] = poll(empty())
 *
 * assert.isNull(element)
 * assert.deepStrictEqual(priorityQueue, [])
 * ```
 */
export const poll: <T>(
  priorityQueue: PriorityQueue<T>,
) => [T | null, PriorityQueue<T>] = <T>(priorityQueue: PriorityQueue<T>) => [
  priorityQueue[0]?.data ?? null,
  priorityQueue.slice(1),
]
