export type PriorityQueue<T> = Node<T>[]

export type Node<T> = {
  priority: number
  data: T
}

export const priorityQueue =
  <T>(priority: (node: T) => number) =>
  (data: T[]) =>
    data
      .map((node: T) => ({
        priority: priority(node),
        data: node,
      }))
      .sort((a: Node<T>, b: Node<T>) => a.priority - b.priority)

export const values = <T>(priorityQueue: PriorityQueue<T>) =>
  priorityQueue.map((node: Node<T>) => node.data)

export const insert =
  <T>(priority: (node: T) => number) =>
  (value: T) =>
  (priorityQueue: PriorityQueue<T>) => {
    const nodeToInsert: Node<T> = {
      priority: priority(value),
      data: value,
    }

    const index: number = priorityQueue.findIndex(
      (node: Node<T>) => nodeToInsert.priority < node.priority,
    )

    if (index === -1) return [...priorityQueue, nodeToInsert]
    return [
      ...priorityQueue.slice(0, index),
      nodeToInsert,
      ...priorityQueue.slice(index),
    ]
  }
