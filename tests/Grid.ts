import type { Eq, Expand } from '../src/DepthFirstSearch.js'

export type Position = {
  x: number
  y: number
}

export const positionEquality: Eq<Position> = (a: Position, b: Position) =>
  a.y === b.y && a.x === b.x

type Movement = (position: Position) => Position | null

const gridSize: number = 2

const up: Movement = (position: Position) => {
  if (position.y === gridSize) {
    return null
  }
  return {
    x: position.x,
    y: position.y + 1,
  }
}
const down: Movement = (position: Position) => {
  if (position.y === 0) {
    return null
  }
  return {
    x: position.x,
    y: position.y - 1,
  }
}
const right: Movement = (position: Position) => {
  if (position.x === gridSize) {
    return null
  }

  return {
    x: position.x + 1,
    y: position.y,
  }
}

const left: Movement = (position: Position) => {
  if (position.x === 0) {
    return null
  }

  return {
    x: position.x - 1,
    y: position.y,
  }
}

export const expandPosition: Expand<Position> = (position: Position) =>
  [up, down, right, left]
    .map((movement: Movement) => movement(position))
    .filter((position: Position | null) => position !== null)
    .map((position: Position) => Promise.resolve(position))
