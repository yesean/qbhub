import { buildIsEnum } from './guards';

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

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

export const isLogLegel = buildIsEnum(LogLevel);
