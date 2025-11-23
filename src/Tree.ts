/**
 * Tree main Node data containing arbitrary key and value and optionally a parent Node
 *
 * @see Node
 */
export type Node<K, V> = {
  key: K
  value: V
  parent: Node<K, V> | null
}

/**
 * Tree containing arbitrary key and values for each Node
 *
 * @see Node
 */
export type Tree<K, V> = Node<K, V>

/**
 * Particular case of a Node without parent pointer
 *
 * @see Tree
 * @see Node
 */
export type Root<K, V> = Omit<Node<K, V>, 'parent'>

/**
 * Particular case of a Node without parent pointer
 *
 * @see Tree
 * @see Node
 */
export type Child<K, V> = Omit<Node<K, V>, 'parent'>

/**
 * Creates a Tree for a given Root
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(toArray(fromRoot({ key: 1, value: 1 })), [1])
 * ```
 *
 * @see Root
 */
export const fromRoot: <K, V>(root: Root<K, V>) => Tree<K, V> = <K, V>(
  root: Root<K, V>,
): Tree<K, V> => ({
  key: root.key,
  value: root.value,
  parent: null,
})

/**
 * Inserts a Child for a given Node and returns a Node pointing to the inserted Child
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(toArray(insert({ key: 1, value: 1 })(fromRoot({ key: 1, value: 1 }))), [1, 2])
 * ```
 *
 * @see Node
 * @see Child
 */
export const insert: <K, V>(
  child: Child<K, V>,
) => (tree: Tree<K, V>) => Tree<K, V> =
  <K, V>(child: Child<K, V>) =>
  (tree: Tree<K, V>) => ({
    key: child.key,
    value: child.value,
    parent: tree,
  })

/**
 * Returns an ordered list of values from Root for a given Node iterating over its parents recursively
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(toArray(fromRoot({ key: 1, value: 1 })), [1])
 * ```
 */
export const toArray: <K, V>(tree: Tree<K, V>) => V[] = <K, V>(
  tree: Tree<K, V>,
) =>
  tree.parent === null ? [tree.value] : [...toArray(tree.parent), tree.value]
