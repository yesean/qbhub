export const random = (start = 0, len = 1) =>
  Math.floor(Math.random() * len + start);

export const round = (n: number, decimalPlaces: number = 0) =>
  Math.round(n * 10 ** decimalPlaces) / 10 ** decimalPlaces;
