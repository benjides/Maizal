import { assert, describe, it } from 'vitest'
import { insert, toArray, type Tree, tree } from '../src/Tree.js'

describe('Tree', () => {
  describe('constructor', () => {
    it('creates for Tree Root', () => {
      const t: Tree<number, number> = tree({
        key: 1,
        value: 1,
      })

      const expectedValues = [1]
      assert.deepStrictEqual(toArray(t), expectedValues)
    })
  })

  describe('insert', () => {
    it('inserts value', () => {
      const childInsert = insert({
        key: 2,
        value: 2,
      })

      const t: Tree<number, number> = childInsert(tree({ key: 1, value: 1 }))

      const expectedValues = [1, 2]
      assert.deepStrictEqual(toArray(t), expectedValues)
    })

    it('inserts multiple values', () => {
      const childInsert = insert({
        key: 2,
        value: 2,
      })

      const t: Tree<number, number> = insert({
        key: 3,
        value: 3,
      })(
        childInsert(
          tree({
            key: 1,
            value: 1,
          }),
        ),
      )

      const expectedValues = [1, 2, 3]
      assert.deepStrictEqual(toArray(t), expectedValues)
    })
  })
})
