export const isNumberArray = (value: any): value is number[] => {
  return Array.isArray(value) && value.every((e) => !Number.isNaN(e));
};
