import { buildIsEnum } from './guards.js';

export enum LogLevel {
  Debug = 'debug',
  Error = 'error',
  Info = 'info',
  Warn = 'warn',
}
const isLogLevel = buildIsEnum(LogLevel);
const DEFAULT_LOG_LEVEL = LogLevel.Warn;

export const validateLogLevel = (data: string | undefined) =>
  isLogLevel(data) ? data : DEFAULT_LOG_LEVEL;

export const isLogLevelValid = (
  inputLevel: LogLevel,
  officialLevel: LogLevel,
) => {
  if (officialLevel === LogLevel.Debug) {
    return [
      LogLevel.Debug,
      LogLevel.Info,
      LogLevel.Warn,
      LogLevel.Error,
    ].includes(inputLevel);
  }

  if (officialLevel === LogLevel.Info) {
    return [LogLevel.Info, LogLevel.Warn, LogLevel.Error].includes(inputLevel);
  }

  if (officialLevel === LogLevel.Warn) {
    return [LogLevel.Warn, LogLevel.Error].includes(inputLevel);
  }

  if (officialLevel === LogLevel.Error) {
    return [LogLevel.Error].includes(inputLevel);
  }

  throw new Error(
    'error checking if log level is valid, if statements should be exhaustive',
  );
};
