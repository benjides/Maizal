import { describe, it, assert } from 'vitest'
import { depthFirstSearch } from '../src/DepthFirstSearch.js'
import { expandPosition, type Position, positionEquality } from './Grid.js'

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

    const actualSolution = await depthFirstSearch(
      initial,
      goal,
      positionEquality,
      expandPosition,
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

    const actualSolution = await depthFirstSearch(
      initial,
      goal,
      positionEquality,
      expandPosition,
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
      positionEquality,
      expandPosition,
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding n times', async () => {
    const initial: Position = {
      x: 0,
      y: 1,
    }
    const goal: Position = {
      x: 1,
      y: 2,
    }

    const actualSolution = await depthFirstSearch(
      initial,
      goal,
      positionEquality,
      expandPosition,
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })
})
