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
 * Creates a Tree for a given Root
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(toArray(fromRoot(1, 1)), [1])
 * ```
 */
export const fromRoot: <K, V>(key: K, value: V) => Tree<K, V> = <K, V>(
  key: K,
  value: V,
): Tree<K, V> => ({
  key: key,
  value: value,
  parent: null,
})

/**
 * Inserts a child for a given Tree and returns a Tree pointing to the inserted child
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(toArray(insert(2, 2)(fromRoot(1, 1))), [1, 2])
 * ```
 */
export const insert: <K, V>(
  key: K,
  value: V,
) => (tree: Tree<K, V>) => Tree<K, V> =
  <K, V>(key: K, value: V) =>
  (tree: Tree<K, V>) => ({
    key: key,
    value: value,
    parent: tree,
  })

/**
 * Returns an ordered list of values from Root for a given Tree iterating over its parents recursively
 *
 * @example
 * ```ts
 * assert.deepStrictEqual(toArray(fromRoot(1, 1)), [1])
 * ```
 */
export const toArray: <K, V>(tree: Tree<K, V>) => V[] = <K, V>(
  tree: Tree<K, V>,
) =>
  tree.parent === null ? [tree.value] : [...toArray(tree.parent), tree.value]
