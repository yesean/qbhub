/**
 * Return a random number in a range, given the start and length of the range.
 */
export const random = (start = 0, len = 1) =>
  Math.floor(Math.random() * len + start);

/**
 * Round a number to a specified number of decimal places.
 */
export const round = (n: number, decimalPlaces: number = 0) =>
  Math.round(n * 10 ** decimalPlaces) / 10 ** decimalPlaces;
