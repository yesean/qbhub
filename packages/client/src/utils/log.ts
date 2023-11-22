/// <reference types="vite/client" />
import { LogLevel } from '@qbhub/types';
import { env, log } from '@qbhub/utils';

const viteLogLevel = import.meta.env.VITE_LOG_LEVEL;

const parameters = {
  officialLevel: env.validateLogLevel(viteLogLevel),
  isDev: import.meta.env.DEV,
};

export const debug = log.buildClientLog({
  ...parameters,
  inputLevel: LogLevel.Debug,
});
export const info = log.buildClientLog({
  ...parameters,
  inputLevel: LogLevel.Info,
});
export const warn = log.buildClientLog({
  ...parameters,
  inputLevel: LogLevel.Warn,
});
export const error = log.buildClientLog({
  ...parameters,
  inputLevel: LogLevel.Error,
});
