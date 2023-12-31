/**
 * Get a random integer between start and end (inclusive)
 */
export function getRandomNumber(start: number, end: number) {
  const rangeLength = end - start + 1;
  return Math.floor(Math.random() * rangeLength) + start;
}

/**
 * Round a number to a specified number of decimal places.
 */
export function roundNumber(n: number, decimalPlaces: number = 0) {
  const scale = 10 ** decimalPlaces;
  return Math.round(n * scale) / scale;
}
