/* eslint-disable no-console */
import { isLogLevelValid, LogLevel } from '@qbhub/types';
import * as env from './env';

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

const buildLog =
  (logLevel: LogLevel) =>
  (...params: unknown[]) =>
    log(logLevel, ...params);

export const debug = buildLog(LogLevel.Debug);
export const info = buildLog(LogLevel.Info);
export const warn = buildLog(LogLevel.Warn);
export const error = buildLog(LogLevel.Error);
