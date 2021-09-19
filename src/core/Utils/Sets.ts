

/**
 * Returns a set that contains **the elements of both set a and set b.**
 * @param setA the first set involved
 * @param setB the second set involved
 */
export function union<T>(a: Set<T> = new Set(), b: Set<T> = new Set()): Set<T> {
  return new Set([...a, ...b]);
}

/**
 * Returns a set that contains **the elements of set a also in set b.**
 * @param a the first set involved
 * @param b the second set involved
 */
export function intersection<T>(a: Set<T> = new Set(), b: Set<T> = new Set()): Set<T> {
  return new Set([...a].filter((x) => b.has(x)));
}

/**
 * Returns a set that contains **the elements of set a that are not in set b.**
 * @param a the first set involved
 * @param b the second set involved
 */
export function difference<T>(a: Set<T> = new Set(), b: Set<T> = new Set()): Set<T> {
  return new Set([...a].filter((x) => !b.has(x)));
}

/**
 * Checks if the two sets contain the same elements (are equal).
 * @param a the first set involved
 * @param b the second set involved
 */
export function equals<T>(a: Set<T> = new Set(), b: Set<T> = new Set()): boolean {
  return difference(a, b).size === 0;
}
