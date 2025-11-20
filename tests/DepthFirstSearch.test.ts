import { describe, it, assert } from 'vitest'
import { depthFirstSearch } from '../src/DepthFirstSearch.js'
import {
  expandPosition,
  type Grid,
  type Position,
  positionEquality,
} from './Grid.js'

describe('DepthFirstSearch', () => {
  it('solves when initial and goal are equals', async () => {
    const grid: Grid = { rows: 1, columns: 1 }
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
      expandPosition(grid),
    )

    const expectedSolution: Position[] = [{ x: 0, y: 0 }]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding once', async () => {
    const grid: Grid = { rows: 2, columns: 1 }
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
      expandPosition(grid),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding twice', async () => {
    const grid: Grid = { rows: 3, columns: 1 }
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
      expandPosition(grid),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding n times', async () => {
    const grid: Grid = { rows: 3, columns: 2 }
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
      expandPosition(grid),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('return empty array for unsolvable searches', async () => {
    const grid: Grid = { rows: 2, columns: 2 }
    const initial: Position = {
      x: 0,
      y: 1,
    }
    const goal: Position = {
      x: 100,
      y: 100,
    }

    const actualSolution = await depthFirstSearch(
      initial,
      goal,
      positionEquality,
      expandPosition(grid),
    )

    const expectedSolution: Position[] = []
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })
})
