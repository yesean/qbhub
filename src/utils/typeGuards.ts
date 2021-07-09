export const isNumeric = (value: string) => {
  return !Number.isNaN(value) && !Number.isNaN(parseFloat(value));
};

export const isNumberArray = (value: any): value is number[] => {
  return Array.isArray(value) && value.every(isNumeric);
};
