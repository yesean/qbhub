/* eslint-disable no-console */
import { isLogLevelValid, LogLevel } from '@qbhub/types';

import * as env from './env.js';

const log = (logLevel: LogLevel, ...params: unknown[]) => {
  const logLevelDisplay = `[${logLevel.toUpperCase()}]`;
  const paramsWithLevel = [logLevelDisplay, ...params];

  // always log errors
  if (logLevel === LogLevel.Error) console.error(...paramsWithLevel);

  // only log warn and below in development mode
  if (!env.isDev) return;

  // check if log level is valid, e.g. don't log debug messages in error level
  if (!isLogLevelValid(logLevel, env.logLevel)) return;

  if (logLevel === LogLevel.Warn) console.warn(...paramsWithLevel);
  if (logLevel === LogLevel.Info) console.info(...paramsWithLevel);
  if (logLevel === LogLevel.Debug) console.debug(...paramsWithLevel);
};

export const debug = (...params: unknown[]) => log(LogLevel.Debug, ...params);
export const info = (...params: unknown[]) => log(LogLevel.Info, ...params);
export const warn = (...params: unknown[]) => log(LogLevel.Warn, ...params);
export const error = (...params: unknown[]) => log(LogLevel.Error, ...params);
