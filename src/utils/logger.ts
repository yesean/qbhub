/* eslint-disable no-console */

const shouldLog = process.env.NODE_ENV === 'development';

const ignore = (..._: any[]) => {};
const info = (...args: any[]) => console.log('INFO:', ...args);

export default {
  info: shouldLog ? info : ignore,
  error: console.error,
};
