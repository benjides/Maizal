import { describe, it, assert } from 'vitest'
import { depthFirstSearch, type Eq } from '../src/DepthFirstSearch.js'

type Position = {
  x: number
  y: number
}

const eq: Eq<Position> = (a: Position, b: Position) =>
  a.y === b.y && a.x === b.x

describe('DepthFirstSearch', () => {
  it('solves when initial and goal are equals', async () => {
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 0,
      y: 0,
    }

    const actualSolution = await depthFirstSearch(initial, goal, eq, () =>
      Promise.resolve(goal),
    )

    const expectedSolution: Position[] = [{ x: 0, y: 0 }]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding once', async () => {
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 0,
      y: 1,
    }

    const actualSolution = await depthFirstSearch(initial, goal, eq, () =>
      Promise.resolve(goal),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding twice', async () => {
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 0,
      y: 2,
    }

    const actualSolution = await depthFirstSearch(
      initial,
      goal,
      eq,
      (a: Position) =>
        Promise.resolve({
          x: a.x,
          y: a.y + 1,
        }),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })
})
