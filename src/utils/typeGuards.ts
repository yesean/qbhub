export const isNumeric = (value: any) =>
  !Number.isNaN(value) && !Number.isNaN(parseFloat(value));

export const isNumericArray = (value: any[]) => value.every(isNumeric);

export const isNumber = (value: any): value is number =>
  typeof value === 'number' || value instanceof Number;

export const isNumberArray = (value: any[]): value is number[] =>
  value.every(isNumber);

export const isString = (value: any): value is string =>
  typeof value === 'string' || value instanceof String;

export const isStringArray = (value: any[]): value is string[] =>
  value.every(isString);
