/* eslint-disable no-console */
export const info = (...params: any[]) => {
  console.log('INFO:', ...params);
};

export const error = (...params: any[]) => {
  console.error(...params);
};
