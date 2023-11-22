/* eslint-disable no-console */
import { isLogLevelValid, LogLevel } from '@qbhub/types';
import * as env from './env.js';

type LogParameters = {
  inputLevel: LogLevel;
  officialLevel: LogLevel;
  isDev: boolean;
};

const log = (
  { inputLevel, officialLevel, isDev }: LogParameters,
  ...params: unknown[]
) => {
  // only log in development mode
  if (!isDev) return;

  // check if log level is valid, e.g. don't log debug messages in error level
  if (!isLogLevelValid(inputLevel, officialLevel)) return;

  if (inputLevel === LogLevel.Debug) console.debug(...params);
  if (inputLevel === LogLevel.Info) console.info(...params);
  if (inputLevel === LogLevel.Warn) console.warn(...params);
  if (inputLevel === LogLevel.Error) console.error(...params);
};

export const buildClientLog =
  (logParameters: LogParameters) =>
  (...params: unknown[]) =>
    log(logParameters, ...params);

export const buildServerLog =
  (inputLevel: LogLevel) =>
  (...params: unknown[]) =>
    log(
      { inputLevel, officialLevel: env.logLevel, isDev: env.isDev },
      ...params,
    );

export const debug = buildServerLog(LogLevel.Debug);
export const info = buildServerLog(LogLevel.Info);
export const warn = buildServerLog(LogLevel.Warn);
export const error = buildServerLog(LogLevel.Error);
