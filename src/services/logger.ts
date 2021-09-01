/* eslint-disable no-console */

const shouldLog = process.env.NODE_ENV === 'development';
const nullLogger = (..._: any[]) => {};
export default {
  info: shouldLog ? console.log : nullLogger,
  error: console.error,
};
