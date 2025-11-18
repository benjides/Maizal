import { describe, it, assert } from 'vitest'
import { depthFirstSearch, type Eq } from '../src/DepthFirstSearch.js'

describe('DepthFirstSearch', () => {
  it('solves when initial and goal are equals', async () => {
    type Position = {
      x: number
      y: number
    }
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 0,
      y: 0,
    }
    const eq: Eq<Position> = (a: Position, b: Position) =>
      a.y === b.y && a.x === b.x

    const actualSolution = await depthFirstSearch(initial, goal, eq)

    const expectedSolution: Position[] = [{ x: 0, y: 0 }]

    assert.deepStrictEqual(actualSolution, expectedSolution)
  })
})
