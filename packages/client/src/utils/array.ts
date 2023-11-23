import { getRand } from './number';

/**
 * checks if arrays have the same elements
 * assumes the two arrays only have unique elements
 */
export const compareArrays = <T>(arr1: T[], arr2: T[]) => {
  const set1 = new Set(arr1);
  return arr2.every((item) => set1.has(item));
};

/**
 * Filter callback for removing empty strings.
 */
export const emptyStringFilter = (s: string) => s !== '';

/**
 * Remove duplicate elements from array.
 * e.g. [1,1,2,1,2,3,3] => [1,2,3] (ordering not guaranteed)
 */
export const getUnique = <T>(arr: T[]) => [...new Set(arr)];

/**
 * Concatenate arrays.
 */
export const combine = <T>(...arrs: T[][]) => arrs.flat();

/**
 * Get a random array element.
 */
export const random = <T>(arr: T[]) => arr[getRand(arr.length)];

/**
 * Create ranged sequences, similar to Python's `range`.
 */
export const range = (startOrEnd: number, end?: number) => {
  if (end == null) {
    return [...Array(startOrEnd).keys()];
  }

  return Array(end - startOrEnd)
    .fill(null)
    .map((_, i) => i + startOrEnd);
};

/**
 * Zips an arbitrary number of arrays together, similar to Python's `zip`.
 */
export const zip = (...arrs: any[]) => {
  const maxLength = arrs.reduce((max, arr) => Math.max(max, arr.length), 0);
  return new Array(maxLength)
    .fill(null)
    .map((_, i) => arrs.map((arr) => arr[i]));
};

export const getCSVURL = (rows: any[][]) => {
  const csvString = rows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  return URL.createObjectURL(blob);
};

export const getJSONURL = (json: object) => {
  const jsonString = JSON.stringify(json, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return URL.createObjectURL(blob);
};

export const isEmpty = (arr: unknown[]) => arr.length === 0;

export const isNotNullOrEmpty = <T>(arr?: T[]): arr is T[] =>
  arr != null && arr.length > 0;
