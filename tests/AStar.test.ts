import { describe, it, assert } from 'vitest'
import {
  down,
  expand,
  type Grid,
  left,
  type Position,
  positionEquality,
  right,
  stall,
  up,
} from './Grid'
import { aStar, Heuristics } from '../src/AStar'

const euclideanDistance: (goal: Position) => Heuristics<Position> =
  (goal: Position) => (position: Position) =>
    Math.sqrt(Math.pow(goal.x - position.x, 2) + Math.pow(goal.y - goal.y, 2))

describe('AStar', () => {
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

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(grid)([]),
    )

    const expectedSolution: Position[] = [{ x: 0, y: 0 }]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding once', async () => {
    const corridor: Grid = { rows: 1, columns: 2 }
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 1,
      y: 0,
    }

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(corridor)([right]),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding twice', async () => {
    const corridor: Grid = { rows: 1, columns: 3 }
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 2,
      y: 0,
    }

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(corridor)([right]),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
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

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(grid)([up, down, right, left]),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves best solution', async () => {
    const grid: Grid = { rows: 3, columns: 3 }
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 2,
      y: 2,
    }

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(grid)([up, down, right, left]),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves worst solution', async () => {
    const grid: Grid = { rows: 3, columns: 3 }
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 2,
      y: 2,
    }

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(grid)([up, down, right, left]),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
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

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(grid)([up]),
    )

    const expectedSolution: Position[] = []
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('filters already visited states on expanding', async () => {
    const corridor: Grid = { rows: 1, columns: 3 }
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 2,
      y: 0,
    }

    const actualSolution = await aStar(euclideanDistance(goal))(
      initial,
      goal,
      positionEquality,
      expand(corridor)([stall, right]),
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })
})
