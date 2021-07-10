export const isNumeric = (value: any) => {
  return !Number.isNaN(value) && !Number.isNaN(parseFloat(value));
};

export const isNumericArray = (value: any[]) => {
  return value.every(isNumeric);
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' || value instanceof Number;
};

export const isNumberArray = (value: any[]): value is number[] => {
  return value.every(isNumber);
};

export const isString = (value: any): value is string => {
  return typeof value === 'string' || value instanceof String;
};

export const isStringArray = (value: any[]): value is string[] => {
  return value.every(isString);
};
