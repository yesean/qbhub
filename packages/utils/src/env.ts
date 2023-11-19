import { buildIsEnum, LogLevel } from '@qbhub/types';

const ENV_KEYS = {
  nodePort: 'NODE_PORT',
  nodeEnv: 'NODE_ENV',
  logLevel: 'LOG_LEVEL',
  viteLogLevel: 'VITE_LOG_LEVEL',
};

export const nodePort = process.env[ENV_KEYS.nodePort];
export const isDev = process.env[ENV_KEYS.nodeEnv] === 'development';

const isLogLevel = buildIsEnum(LogLevel);
const envLogLevel = process.env[ENV_KEYS.logLevel];
export const DEFAULT_LOG_LEVEL = LogLevel.Warn;
export const validateLogLevel = (data: string | undefined) =>
  isLogLevel(data) ? data : DEFAULT_LOG_LEVEL;
export const logLevel = validateLogLevel(envLogLevel);
