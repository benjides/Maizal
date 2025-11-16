import { expect, it } from 'vitest'
import { priorityQueue, values } from '../src/PriorityQueue.js'

type Month = {
  index: number
  name: string
}

it('creates empty PriorityQueue', () => {
  const priorityQueueValues = values(priorityQueue(() => 1)([]))

  expect(priorityQueueValues).toStrictEqual([])
})

it('sorts values on creation', () => {
  const months: Month[] = [
    {
      index: 1,
      name: 'February',
    },
    {
      index: 0,
      name: 'January',
    },
  ]

  const priorityQueueValues = values(
    priorityQueue((month: Month) => month.index)(months),
  )

  const expectedPriorityQueueValues: Month[] = [
    {
      index: 0,
      name: 'January',
    },
    {
      index: 1,
      name: 'February',
    }
  ]
  expect(priorityQueueValues).toStrictEqual(expectedPriorityQueueValues)
})
