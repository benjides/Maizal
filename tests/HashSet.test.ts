import { describe, expect, it } from 'vitest'

import { empty, has, insert } from '../src/HashSet.js'

type Vector = {
  x: number
  y: number
}

describe('HashSet creation', () => {
  it('creates empty HashSet', () => {
    expect(empty<Vector>()).toStrictEqual([])
  })
})

describe('HashSet insert', () => {
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
    expect(hashSet).toStrictEqual(expectedHashSetValues)
  })
})

describe('PriorityQueue has', () => {
  it('does not have element for an empty HashSet', () => {
    const hashSet = empty<Vector>()

    const hasVector = has((a: Vector, b: Vector) => a.x === b.x && b.y === b.y)

    const vector: Vector = {
      x: -3,
      y: 8,
    }
    expect(hasVector(vector)(hashSet)).toBe(false)
  })

  it('has element for an element present in the HashSet', () => {
    const vector: Vector = {
      x: -3,
      y: 8,
    }

    const hashSet = insert(vector)(empty())

    const hasVector = has((a: Vector, b: Vector) => a.x === b.x && b.y === b.y)

    expect(hasVector(vector)(hashSet)).toBe(true)
  })

  it('has element for an element present in the HashSet with swapped properties', () => {
    const vector: Vector = {
      x: -3,
      y: 8,
    }

    const hashSet = insert(vector)(empty())

    const hasVector = has((a: Vector, b: Vector) => a.x === b.x && b.y === b.y)

    const swappedPropertiesVector: Vector = {
      y: 8,
      x: -3,
    }
    expect(hasVector(swappedPropertiesVector)(hashSet)).toBe(true)
  })

  it('not present HashSet', () => {
    const vector: Vector = {
      x: -3,
      y: 8,
    }

    const hashSet = insert(vector)(empty())

    const hasVector = has((a: Vector, b: Vector) => a.x === b.x && b.y === b.y)

    expect(
      hasVector({
        x: 1,
        y: -18,
      })(hashSet),
    ).toBe(false)
  })
})
