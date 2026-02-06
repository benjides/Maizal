import { assert, describe, it } from 'vitest'
import {
  adjacent,
  edge,
  Eq,
  graph,
  Graph,
  hasEdge,
  hasVertex,
  vertex,
} from '../src/Graph'

type Person = string

const personEq: Eq<Person> = (a: Person, b: Person): boolean => a === b

const addFriends: (
  a: Person,
  b: Person,
) => (graph: Graph<string>) => Graph<string> = (a: Person, b: Person) =>
  edge(personEq, a, b)

const areFriends = (a: Person, b: Person) => (graph: Graph<string>) =>
  hasEdge(personEq, a, b)(graph)

describe('Graph', () => {
  describe('vertex', () => {
    it('adds given vertex', () => {
      const john: Person = 'John'

      const networkGraph = vertex(john)(graph<Person>())

      assert.isTrue(hasVertex(personEq, john)(networkGraph))
      const sally: Person = 'sally'
      assert.isFalse(hasVertex(personEq, sally)(networkGraph))
    })
  })

  describe('edge', () => {
    it('adds edge for two vertexes', () => {
      const john: Person = 'John'
      const jane: Person = 'Jane'

      const networkGraph = addFriends(
        john,
        jane,
      )(vertex(jane)(vertex(john)(graph())))

      assert.isTrue(areFriends(jane, john)(networkGraph))
      assert.isTrue(areFriends(john, jane)(networkGraph))
    })
  })

  describe('adjacent', () => {
    it('adds all adjacent vertex for a given vertex', () => {
      const john: Person = 'John'
      const jane: Person = 'Jane'
      const sally: Person = 'Sally'

      const networkGraph = adjacent(personEq, john, [jane, sally])(
        vertex(john)(graph()),
      )

      assert.isTrue(areFriends(john, jane)(networkGraph))
      assert.isTrue(areFriends(john, sally)(networkGraph))
      assert.isFalse(areFriends(jane, sally)(networkGraph))
    })
  })
})
