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

const up: (grid: Grid) => Movement = (grid: Grid) => (position: Position) => {
  if (position.y === grid.rows) {
    return null
  }
  return {
    x: position.x,
    y: position.y + 1,
  }
}
const down: (grid: Grid) => Movement = () => (position: Position) => {
  if (position.y === 0) {
    return null
  }
  return {
    x: position.x,
    y: position.y - 1,
  }
}
const right: (grid: Grid) => Movement =
  (grid: Grid) => (position: Position) => {
    if (position.x === grid.columns) {
      return null
    }

    return {
      x: position.x + 1,
      y: position.y,
    }
  }

const left: (grid: Grid) => Movement = () => (position: Position) => {
  if (position.x === 0) {
    return null
  }

  return {
    x: position.x - 1,
    y: position.y,
  }
}

export const expandPosition: (grid: Grid) => Expand<Position> =
  (grid: Grid) => (position: Position) =>
    [up, down, right, left]
      .map((m: (grid: Grid) => Movement) => m(grid))
      .map((movement: Movement) => movement(position))
      .filter((position: Position | null) => position !== null)
      .map((position: Position) => Promise.resolve(position))
