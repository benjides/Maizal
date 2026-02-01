import { assert, describe, it } from 'vitest'
import {
  edge,
  Eq,
  Graph,
  graph,
  hasVertex,
  hasEdge,
  size,
  vertex,
  adjacent,
} from '../src/Graph'

type Person = string

const personEq: Eq<Person> = (a: Person, b: Person): boolean => a === b

const person: (person: Person) => (graph: Graph<string>) => Graph<string> = (
  person: Person,
) => vertex(personEq, person)

const friends: (
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

      const networkGraph = person(john)(graph<Person>())

      assert.isTrue(hasVertex(personEq, john)(networkGraph))
    })

    it('does not add existing vertex', () => {
      const john: Person = 'John'

      const networkGraph = person(john)(person(john)(graph<Person>()))

      assert.deepStrictEqual(size(networkGraph), 1)
    })
  })

  describe('edge', () => {
    it('adds edge for two vertexes', () => {
      const john: Person = 'John'
      const jane: Person = 'Jane'

      const networkGraph = friends(
        john,
        jane,
      )(person(jane)(person(john)(graph())))

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
        person(john)(graph()),
      )

      assert.isTrue(areFriends(john, jane)(networkGraph))
      assert.isTrue(areFriends(john, sally)(networkGraph))
      assert.isFalse(areFriends(jane, sally)(networkGraph))
    })
  })
})
