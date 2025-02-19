/**
 * Retrieves the first element of an array.
 *
 * @param list - The input array.
 * @returns The first element of the array.
 */
export function first<T extends unknown[]>(list: T): T[number] {
  return list[0];
}
