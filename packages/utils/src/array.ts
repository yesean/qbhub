import { getRandomNumber } from './number.js';

/**
 * Remove duplicate elements from array, with optional callback to get a unique key for each item
 * e.g. [1,1,2,1,2,3,3] => [1,2,3]
 */
export function getUniqueItems<T>(
  items: T[],
  keyMapping: (item: T) => unknown = (item) => item,
) {
  return items.reduce(
    (acc, item) => {
      const key = keyMapping(item);
      if (acc.prevKeys.has(key)) {
        return acc;
      }

      acc.prevKeys.add(key);
      acc.uniqueItems.push(item);
      return acc;
    },
    { prevKeys: new Set<unknown>(), uniqueItems: [] as T[] },
  ).uniqueItems;
}

export function getSum(items: number[]) {
  return items.reduce((acc, item) => acc + item);
}

/**
 * Get the max item from a number array
 */
export function getMax(items: number[]): number;
/**
 * Get the max item from a generic array, with a callback to get the numeric value of each item
 */
export function getMax<T>(items: T[], valueMapping: (item: T) => number): T;
export function getMax<T>(items: T[], valueMapping?: (item: T) => number): T {
  return items.reduce(
    (acc, item) => {
      const value = valueMapping?.(item) ?? item;
      if (acc.maxValue > value) {
        return acc;
      }

      return {
        maxItem: item,
        maxValue: value,
      };
    },
    { maxItem: items[0], maxValue: valueMapping?.(items[0]) ?? items[0] },
  ).maxItem;
}

export function getRandomItem<T>(array: T[]) {
  const randomIndex = getRandomNumber(0, array.length - 1);
  return array[randomIndex];
}

export function getEmptyArray(length: number) {
  return Array.from({ length });
}

export function getRange(start: number, end: number) {
  const rangeLength = end - start + 1;
  return getEmptyArray(rangeLength).map((_, index) => index + start);
}

/**
 * Interleave two arrays together
 * ([a, b, c], [d, e, f]) => [a, d, b, e, c, f]
 */
export function interleaveArrays<T, U>(a: T[], b: U[]): Array<T | U> {
  const longestArrayLength = Math.max(a.length, b.length);

  return getRange(0, longestArrayLength - 1).reduce(
    (acc, index) => {
      if (a[index] !== undefined) {
        acc.push(a[index]);
      }
      if (b[index] !== undefined) {
        acc.push(b[index]);
      }

      return acc;
    },
    [] as Array<T | U>,
  );
}

export function isEmpty(array: unknown[]) {
  return array.length === 0;
}

/**
 * Shuffle an array using the Fisher-Yates shuffle
 * reference: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
export function shuffleArray<T>(array: T[]) {
  const arrayCopy = [...array];
  getRange(0, arrayCopy.length - 1).forEach((index) => {
    const randomIndex = getRandomNumber(index, arrayCopy.length - 1);
    [arrayCopy[index], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[index],
    ];
  });
  return arrayCopy;
}
