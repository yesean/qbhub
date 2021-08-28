/* eslint-disable no-console */

const shouldLog = true;
const nullLogger = (..._: any[]) => {};
export default {
  info: shouldLog ? console.log : nullLogger,
  error: console.error,
};
