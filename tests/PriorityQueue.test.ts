import { describe, expect, it } from 'vitest'
import { insert, priorityQueue, values } from '../src/PriorityQueue.js'

type Person = {
  age: number
  name: string
}

it('creates empty PriorityQueue', () => {
  const priorityQueueValues = values(priorityQueue(() => 1)([]))

  expect(priorityQueueValues).toStrictEqual([])
})

it('sorts values on creation', () => {
  const persons: Person[] = [
    {
      age: 34,
      name: 'John',
    },
    {
      age: 27,
      name: 'Jane',
    },
  ]

  const priorityQueueValues = values(
    priorityQueue((person: Person) => person.age)(persons),
  )

  const expectedPriorityQueueValues: Person[] = [
    {
      age: 27,
      name: 'Jane',
    },
    {
      age: 34,
      name: 'John',
    },
  ]
  expect(priorityQueueValues).toStrictEqual(expectedPriorityQueueValues)
})

describe('PriorityQueue insert', () => {
  it('inserts value at last position', () => {
    const persons: Person[] = [
      {
        age: 27,
        name: 'Jane',
      },
    ]

    const person: Person = {
      age: 34,
      name: 'John',
    }

    const priority = (person: Person) => person.age

    const priorityQueueValues = insert(priority)(person)(
      priorityQueue(priority)(persons),
    )

    const expectedPriorityQueueValues: Person[] = [
      {
        age: 27,
        name: 'Jane',
      },
      {
        age: 34,
        name: 'John',
      },
    ]
    expect(values(priorityQueueValues)).toStrictEqual(
      expectedPriorityQueueValues,
    )
  })

  it('inserts value at first position', () => {
    const persons: Person[] = [
      {
        age: 34,
        name: 'John',
      },
    ]

    const person: Person = {
      age: 27,
      name: 'Jane',
    }

    const priority = (person: Person) => person.age

    const priorityQueueValues = insert(priority)(person)(
      priorityQueue(priority)(persons),
    )

    const expectedPriorityQueueValues: Person[] = [
      {
        age: 27,
        name: 'Jane',
      },
      {
        age: 34,
        name: 'John',
      },
    ]
    expect(values(priorityQueueValues)).toStrictEqual(
      expectedPriorityQueueValues,
    )
  })

  it('inserts value at the middle position', () => {
    const persons: Person[] = [
      {
        age: 27,
        name: 'Jane',
      },
      {
        age: 34,
        name: 'John',
      },
    ]

    const person: Person = {
      age: 28,
      name: 'Sally',
    }

    const priority = (person: Person) => person.age

    const priorityQueueValues = insert(priority)(person)(
      priorityQueue(priority)(persons),
    )

    const expectedPriorityQueueValues: Person[] = [
      {
        age: 27,
        name: 'Jane',
      },
      {
        age: 28,
        name: 'Sally',
      },
      {
        age: 34,
        name: 'John',
      },
    ]
    expect(values(priorityQueueValues)).toStrictEqual(
      expectedPriorityQueueValues,
    )
  })

  it('inserts after in case of same priority', () => {
    const persons: Person[] = [
      {
        age: 20,
        name: 'John',
      },
      {
        age: 28,
        name: 'Sally',
      },
    ]

    const person = {
      age: 20,
      name: 'Jane',
    }

    const priority = (person: Person) => person.age

    const priorityQueueValues = insert(priority)(person)(
      priorityQueue(priority)(persons),
    )

    const expectedPriorityQueueValues: Person[] = [
      {
        age: 20,
        name: 'John',
      },
      {
        age: 20,
        name: 'Jane',
      },
      {
        age: 28,
        name: 'Sally',
      },
    ]
    expect(values(priorityQueueValues)).toStrictEqual(
      expectedPriorityQueueValues,
    )
  })
})
