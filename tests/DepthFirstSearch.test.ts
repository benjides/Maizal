import { describe, it, assert } from 'vitest'
import {
  depthFirstSearch,
  type Eq,
  type Expand,
} from '../src/DepthFirstSearch.js'

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

    const actualSolution = await depthFirstSearch(initial, goal, eq, () => [
      Promise.resolve(goal),
    ])

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

    const actualSolution = await depthFirstSearch(initial, goal, eq, () => [
      Promise.resolve(goal),
    ])

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
      (a: Position) => [
        Promise.resolve({
          x: a.x,
          y: a.y + 1,
        }),
      ],
    )

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding multiple states', async () => {
    const initial: Position = {
      x: 0,
      y: 0,
    }
    const goal: Position = {
      x: 0,
      y: 1,
    }
    type Movement = (position: Position) => Position
    const up: Movement = (position: Position) => ({
      x: position.x,
      y: position.y + 1,
    })
    const right: Movement = (position: Position) => ({
      x: position.x + 1,
      y: position.y,
    })
    const expand: Expand<Position> = (position: Position) =>
      [up, right]
        .map((movement: Movement) => movement(position))
        .map((position: Position) => Promise.resolve(position))

    const actualSolution = await depthFirstSearch(initial, goal, eq, expand)

    const expectedSolution: Position[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })

  it('solves after expanding multiple states filtering invalid movements', async () => {
    const initial: Position = {
      x: 0,
      y: 1,
    }
    const goal: Position = {
      x: 1,
      y: 1,
    }
    type Movement = (position: Position) => Position | null
    const up: Movement = (position: Position) => {
      if (position.y === 1) {
        return null
      }
      return {
        x: position.x,
        y: position.y + 1,
      }
    }
    const right: Movement = (position: Position): Position => ({
      x: position.x + 1,
      y: position.y,
    })
    const expand: Expand<Position> = (position: Position) =>
      [up, right]
        .map((movement: Movement) => movement(position))
        .filter((position: Position | null) => position !== null)
        .map((position: Position) => Promise.resolve(position))

    const actualSolution = await depthFirstSearch(initial, goal, eq, expand)

    const expectedSolution: Position[] = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]
    assert.deepStrictEqual(actualSolution, expectedSolution)
  })
})
