import { assert, describe, it } from 'vitest'
import { insert, toArray, type Tree, fromRoot } from '../src/Tree'

describe('Tree', () => {
  describe('constructor', () => {
    it('creates for Tree Root', () => {
      const t: Tree<number, number> = fromRoot(1, 1)

      const expectedValues = [1]
      assert.deepStrictEqual(toArray(t), expectedValues)
    })
  })

  describe('insert', () => {
    it('inserts value', () => {
      const childInsert = insert(2, 2)

      const t: Tree<number, number> = childInsert(fromRoot(1, 1))

      const expectedValues = [1, 2]
      assert.deepStrictEqual(toArray(t), expectedValues)
    })

    it('inserts multiple values', () => {
      const childInsert = insert(2, 2)

      const t: Tree<number, number> = insert(3, 3)(childInsert(fromRoot(1, 1)))

      const expectedValues = [1, 2, 3]
      assert.deepStrictEqual(toArray(t), expectedValues)
    })
  })
})
