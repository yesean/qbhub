type StringMapping = (s: string) => any;
type StringAccumulator = { [key: string]: any };

/**
 * Extends a mapping into a reduce function. Applies a mapping to each array
 * element, using the original element as a key and mapped value as the value.
 */
export const each =
  (f: StringMapping) => (acc: StringAccumulator, e: string) => ({
    ...acc,
    [e]: f(e),
  });

/**
 * Selects a random element from an array.
 */
export const random = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];
