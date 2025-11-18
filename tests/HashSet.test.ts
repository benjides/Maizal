import { assert, describe, it } from 'vitest'

import { empty, has, insert } from '../src/HashSet.js'

type Vector = {
  x: number
  y: number
}

describe('HashSet', () => {
  describe('constructor', () => {
    it('creates empty', () => {
      assert.deepStrictEqual(empty<Vector>(), [])
    })
  })

  describe('insert', () => {
    it('inserts value', () => {
      const vector: Vector = {
        x: -3,
        y: 8,
      }

      const hashSet = insert(vector)(empty())

      const expectedHashSetValues: Vector[] = [
        {
          x: -3,
          y: 8,
        },
      ]
      assert.deepStrictEqual(hashSet, expectedHashSetValues)
    })
  })

  describe('has', () => {
    it('does not have element for an empty HashSet', () => {
      const hashSet = empty<Vector>()

      const hasVector = has(
        (a: Vector, b: Vector) => a.x === b.x && b.y === b.y,
      )

      const vector: Vector = {
        x: -3,
        y: 8,
      }
      assert.isFalse(hasVector(vector)(hashSet))
    })

    it('has element for an element present in the HashSet', () => {
      const vector: Vector = {
        x: -3,
        y: 8,
      }

      const hashSet = insert(vector)(empty())

      const hasVector = has(
        (a: Vector, b: Vector) => a.x === b.x && b.y === b.y,
      )

      assert.isTrue(hasVector(vector)(hashSet))
    })

    it('has element for an element present in the HashSet with swapped properties', () => {
      const vector: Vector = {
        x: -3,
        y: 8,
      }

      const hashSet = insert(vector)(empty())

      const hasVector = has(
        (a: Vector, b: Vector) => a.x === b.x && b.y === b.y,
      )

      const swappedPropertiesVector: Vector = {
        y: 8,
        x: -3,
      }
      assert.isTrue(hasVector(swappedPropertiesVector)(hashSet))
    })

    it('not present HashSet', () => {
      const vector: Vector = {
        x: -3,
        y: 8,
      }

      const hashSet = insert(vector)(empty())

      const hasVector = has(
        (a: Vector, b: Vector) => a.x === b.x && b.y === b.y,
      )

      assert.isFalse(hasVector({ x: 1, y: -18 })(hashSet))
    })
  })
})
