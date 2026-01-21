import { assert, describe, it } from 'vitest'
import {
  empty,
  insert,
  of,
  Ord,
  poll,
  type PriorityQueue,
  values,
} from '../src/PriorityQueue'

type Person = {
  age: number
  name: string
}

const ageOrd: Ord<Person> = (a: Person, b) => b.age - a.age

describe('PriorityQueue', () => {
  describe('constructor', () => {
    it('creates empty', () => {
      const priorityQueueValues = values(empty<Person>())

      assert.deepStrictEqual(priorityQueueValues, [])
    })

    it('creates for element', () => {
      const jane: Person = {
        age: 27,
        name: 'Jane',
      }

      const priorityQueue: PriorityQueue<Person> = of(jane)

      const expectedPriorityQueueValues: Person[] = [
        {
          age: 27,
          name: 'Jane',
        },
      ]
      assert.deepStrictEqual(values(priorityQueue), expectedPriorityQueueValues)
    })
  })
  describe('insert', () => {
    it('inserts value at last position', () => {
      const jane: Person = {
        age: 27,
        name: 'Jane',
      }
      const personsPriorityQueue = insert(ageOrd)(jane)(empty())

      const john: Person = {
        age: 34,
        name: 'John',
      }
      const priorityQueueValues = insert(ageOrd)(john)(personsPriorityQueue)

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
      const john: Person = {
        age: 34,
        name: 'John',
      }
      const personsPriorityQueue = insert(ageOrd)(john)(empty())

      const jane: Person = {
        age: 27,
        name: 'Jane',
      }
      const priorityQueueValues = insert(ageOrd)(jane)(personsPriorityQueue)

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
      const jane: Person = {
        age: 27,
        name: 'Jane',
      }
      const john: Person = {
        age: 34,
        name: 'John',
      }
      const personsPriorityQueue = insert(ageOrd)(jane)(
        insert(ageOrd)(john)(empty()),
      )

      const sally: Person = {
        age: 28,
        name: 'Sally',
      }
      const priorityQueueValues = insert(ageOrd)(sally)(personsPriorityQueue)

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
      const jane: Person = {
        age: 27,
        name: 'Jane',
      }
      const personsPriorityQueue = insert(ageOrd)(jane)(empty())

      const sally = {
        age: 27,
        name: 'Sally',
      }
      const priorityQueueValues = insert(ageOrd)(sally)(personsPriorityQueue)

      const expectedPriorityQueueValues: Person[] = [
        {
          age: 27,
          name: 'Jane',
        },
        {
          age: 27,
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
      const jane: Person = {
        age: 27,
        name: 'Jane',
      }
      const john: Person = {
        age: 34,
        name: 'John',
      }
      const personsPriorityQueue = insert(ageOrd)(jane)(
        insert(ageOrd)(john)(empty()),
      )

      const [person, modifiedQueue] = poll(personsPriorityQueue)

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
      assert.deepStrictEqual(values(modifiedQueue), expectedPriorityQueueValues)
    })

    it('polls empty PriorityQueue', () => {
      const [person, modifiedQueue] = poll(empty())

      assert.isNull(person)
      assert.deepStrictEqual(modifiedQueue, [])
    })
  })
})
