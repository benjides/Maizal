import { assert, describe, it } from 'vitest'
import {
  insert,
  node,
  poll,
  priorityQueue,
  values,
  type Node,
  type PriorityQueue,
} from '../src/PriorityQueue.js'

type Person = {
  age: number
  name: string
}

const priority = (person: Person) => person.age

const personNode: (e: Person) => Node<Person> = node(priority)

const personsPriorityQueue: (persons: Person[]) => PriorityQueue<Person> = (
  persons: Person[],
) => priorityQueue(persons.map(personNode))

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('creates empty', () => {
      const priorityQueueValues = values(personsPriorityQueue([]))

      assert.deepStrictEqual(priorityQueueValues, [])
    })

    it('sorts Nodes on creation', () => {
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

      const priorityQueueValues = values(personsPriorityQueue(persons))

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
      assert.deepStrictEqual(priorityQueueValues, expectedPriorityQueueValues)
    })
  })
  describe('insert', () => {
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

      const priorityQueueValues = insert(personNode(person))(
        personsPriorityQueue(persons),
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
      assert.deepStrictEqual(
        values(priorityQueueValues),
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

      const priorityQueueValues = insert(personNode(person))(
        personsPriorityQueue(persons),
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
      assert.deepStrictEqual(
        values(priorityQueueValues),
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

      const priorityQueueValues = insert(personNode(person))(
        personsPriorityQueue(persons),
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
      assert.deepStrictEqual(
        values(priorityQueueValues),
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

      const priorityQueueValues = insert(personNode(person))(
        personsPriorityQueue(persons),
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
      assert.deepStrictEqual(
        values(priorityQueueValues),
        expectedPriorityQueueValues,
      )
    })
  })
  describe('poll', () => {
    it('polls non empty PriorityQueue', () => {
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

      const [person, priorityQueue] = poll(personsPriorityQueue(persons))

      const expectedPerson: Person = {
        age: 27,
        name: 'Jane',
      }
      const expectedPriorityQueueValues: Person[] = [
        {
          age: 34,
          name: 'John',
        },
      ]
      assert.deepStrictEqual(person, expectedPerson)
      assert.deepStrictEqual(values(priorityQueue), expectedPriorityQueueValues)
    })

    it('polls empty PriorityQueue', () => {
      const persons: Person[] = []

      const [person, priorityQueue] = poll(personsPriorityQueue(persons))

      assert.isNull(person)
      assert.deepStrictEqual(priorityQueue, [])
    })
  })
})
