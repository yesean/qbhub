/* eslint-disable no-console */

/**
 * Logger middleware for normal messages.
 */
const info = (...params: any[]) => {
  console.log('INFO:', ...params, '\n');
};

/**
 * Logger middleware for critical messages.
 */
const error = (...params: any[]) => {
  console.error('ERROR:', ...params);
};

export default {
  info,
  error,
};
