/* eslint-disable no-console */

const shouldLog = process.env.NODE_ENV === 'development';
const nullLogger = (..._: any[]) => {};
export default {
  info: shouldLog
    ? (...args: any[]) => console.log('INFO:', ...args)
    : nullLogger,
  error: console.error,
};
