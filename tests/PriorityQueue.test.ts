import { expect, it } from 'vitest'
import { priorityQueue, values } from '../src/PriorityQueue.js'

it('creates empty PriorityQueue', () => {
  const priorityQueueValues = values(priorityQueue(() => 1)([]))

  expect(priorityQueueValues).toStrictEqual([])
})
