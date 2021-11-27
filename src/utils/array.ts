type Mapping<T, S> = (s: T) => S;
type StringAccumulator = { [key: string]: any };

/**
 * Identity function
 */
const id = <T>(e: T) => e;

/**
 * Extends a mapping into a reduce function. Applies a mapping to each array
 * element, using the original element as a key and mapped value as the value.
 */
export const each =
  <T>(f: Mapping<string, T>) =>
  (acc: StringAccumulator, e: string) => ({
    ...acc,
    [e]: f(e),
  });

/**
 * Reducer to keep only unique elements in an array.
 */
export const unique =
  <T>(f: Mapping<T, string>) =>
  (acc: [T[], Set<string>], e: T): [T[], Set<string>] => {
    const [results, set] = acc;
    if (!set.has(f(e))) {
      set.add(f(e));
      return [results.concat(e), set];
    }
    return acc;
  };

/**
 * Selects a random element from an array.
 */
export const random = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];

type NumberMapping = Mapping<number, number>;

/**
 * Reducer for the sum of all elements in an array.
 */
export const sum =
  (f: NumberMapping = id) =>
  (acc: number, e: number) =>
    acc + f(e);

/**
 * Reducer for the max of all elements in an array.
 */
export const max =
  (f: NumberMapping = id) =>
  (acc: number, e: number) =>
    f(e) > f(acc) ? e : acc;

/**
 * Reducer for the max of all elements in an array.
 */
export const min =
  (f: NumberMapping = id) =>
  (acc: number, e: number) =>
    f(e) < f(acc) ? e : acc;
