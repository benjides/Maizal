import { describe, expect, it } from 'vitest'
import { insert, priorityQueue, values } from '../src/PriorityQueue.js'

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
    },
  ]
  expect(priorityQueueValues).toStrictEqual(expectedPriorityQueueValues)
})

describe('PriorityQueue insert', () => {
  it('inserts value at last position', () => {
    const months: Month[] = [
      {
        index: 1,
        name: 'February',
      },
    ]

    const month: Month = {
      index: 2,
      name: 'March',
    }

    const priority = (month: Month) => month.index

    const priorityQueueValues = insert(priority)(month)(
      priorityQueue(priority)(months),
    )

    const expectedPriorityQueueValues: Month[] = [
      {
        index: 1,
        name: 'February',
      },
      {
        index: 2,
        name: 'March',
      },
    ]
    expect(values(priorityQueueValues)).toStrictEqual(
      expectedPriorityQueueValues,
    )
  })

  it('inserts value at first position', () => {
    const months: Month[] = [
      {
        index: 2,
        name: 'March',
      },
    ]

    const month: Month = {
      index: 1,
      name: 'February',
    }

    const priority = (month: Month) => month.index

    const priorityQueueValues = insert(priority)(month)(
      priorityQueue(priority)(months),
    )

    const expectedPriorityQueueValues: Month[] = [
      {
        index: 1,
        name: 'February',
      },
      {
        index: 2,
        name: 'March',
      },
    ]
    expect(values(priorityQueueValues)).toStrictEqual(
      expectedPriorityQueueValues,
    )
  })
})
