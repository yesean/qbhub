/* eslint-disable no-console */

import { isDev } from './env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ignore = (..._: any[]) => {};

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
  info: isDev ? info : ignore,
  error,
};
