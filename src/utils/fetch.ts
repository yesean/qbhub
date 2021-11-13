export const getQueryParamArray = (field: string, array: any[]) =>
  array.map((e) => `${field}[]=${e}`).join('&');

export const combineParams = (...array: any[]) => array.join('&');
