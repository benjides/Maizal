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
