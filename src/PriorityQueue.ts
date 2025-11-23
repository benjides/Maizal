export type PriorityQueue<T> = Node<T>[]

export type Node<T> = {
  priority: number
  data: T
}

export const empty: <T>() => PriorityQueue<T> = () => []

export const values = <T>(priorityQueue: PriorityQueue<T>) =>
  priorityQueue.map((node: Node<T>) => node.data)

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

export const poll: <T>(
  priorityQueue: PriorityQueue<T>,
) => [T | null, PriorityQueue<T>] = <T>(priorityQueue: PriorityQueue<T>) => [
  priorityQueue[0]?.data ?? null,
  priorityQueue.slice(1),
]
