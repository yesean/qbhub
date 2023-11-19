/* eslint-disable no-console */
import * as env from '@qbhub/utils';

const ignore = (..._: any[]) => {};
const info = (...args: any[]) => console.log('INFO:', ...args);

export default {
  info: env.isDev ? info : ignore,
  error: console.error,
};
