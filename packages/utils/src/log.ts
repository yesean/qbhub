/* eslint-disable no-console */
import { isLogLevelValid, LogLevel } from '@qbhub/types';
import * as env from './env.js';

const log = (logLevel: LogLevel, ...params: unknown[]) => {
  // only log in development mode
  if (!env.isDev) return;

  // check if log level is valid, e.g. don't log debug messages in error level
  if (!isLogLevelValid(logLevel, env.logLevel)) return;

  if (logLevel === LogLevel.Debug) console.debug(...params);
  if (logLevel === LogLevel.Info) console.info(...params);
  if (logLevel === LogLevel.Warn) console.warn(...params);
  if (logLevel === LogLevel.Error) console.error(...params);
};

export const debug = (...params: unknown[]) => log(LogLevel.Debug, ...params);
export const info = (...params: unknown[]) => log(LogLevel.Info, ...params);
export const warn = (...params: unknown[]) => log(LogLevel.Warn, ...params);
export const error = (...params: unknown[]) => log(LogLevel.Error, ...params);
