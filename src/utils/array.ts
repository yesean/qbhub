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
 * Zips an arbitrary number of arrays together, similar to Python's `zip`.
 */
export const zip = (...arrs: any[]) => {
  const maxLength = arrs.reduce((max, arr) => Math.max(max, arr.length), 0);
  return new Array(maxLength)
    .fill(null)
    .map((_, i) => arrs.map((arr) => arr[i]));
};
