export const isNumber = (value: any): value is number =>
  typeof value === 'number' || value instanceof Number;

export const isString = (value: any): value is string =>
  typeof value === 'string' || value instanceof String;

export const isNumberArray = (value: any): value is number[] =>
  Array.isArray(value) && value.every(isNumber);

export const isStringArray = (value: any): value is string[] =>
  Array.isArray(value) && value.every(isString);

export const stringToNumber = (value: string) => parseInt(value, 10);

export const isNumeric = (value: any) =>
  !Number.isNaN(value) && !Number.isNaN(parseFloat(value));

export const isNumericArray = (value: any) =>
  Array.isArray(value) && value.every(isNumeric);
