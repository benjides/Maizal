import type { Eq, Expand } from '../src/DepthFirstSearch.js'

export type Grid = {
  rows: number
  columns: number
}

export type Position = {
  x: number
  y: number
}

export const positionEquality: Eq<Position> = (a: Position, b: Position) =>
  a.y === b.y && a.x === b.x

type Movement = (position: Position) => Position | null

export const up: (grid: Grid) => Movement =
  (grid: Grid) => (position: Position) => {
    if (position.y === grid.rows - 1) {
      return null
    }
    return {
      x: position.x,
      y: position.y + 1,
    }
  }
export const down: (grid: Grid) => Movement = () => (position: Position) => {
  if (position.y === 0) {
    return null
  }
  return {
    x: position.x,
    y: position.y - 1,
  }
}
export const right: (grid: Grid) => Movement =
  (grid: Grid) => (position: Position) => {
    if (position.x === grid.columns - 1) {
      return null
    }

    return {
      x: position.x + 1,
      y: position.y,
    }
  }

export const left: (grid: Grid) => Movement = () => (position: Position) => {
  if (position.x === 0) {
    return null
  }

  return {
    x: position.x - 1,
    y: position.y,
  }
}

export const stall: () => Movement = () => (position: Position) => ({
  x: position.x,
  y: position.y,
})

export const expand: (
  grid: Grid,
) => (allowedMoves: ((grid: Grid) => Movement)[]) => Expand<Position> =
  (grid: Grid) =>
  (allowedMoves: ((grid: Grid) => Movement)[]) =>
  (position: Position) =>
    allowedMoves
      .map((gridMovement: (grid: Grid) => Movement) => gridMovement(grid))
      .map((movement: Movement) => movement(position))
      .filter((position: Position | null) => position !== null)
      .map((position: Position) => Promise.resolve(position))
