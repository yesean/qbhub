/**
 * checks if arrays have the same elements
 * assumes the two arrays only have unique elements
 */
export const compareArrays = <T>(arr1: T[], arr2: T[]) => {
  const set1 = new Set(arr1);
  return arr2.every((item) => set1.has(item));
};
