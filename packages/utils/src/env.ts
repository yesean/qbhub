import { buildIsEnum, LogLevel } from '@qbhub/types';

const ENV_KEYS = {
  nodePort: 'NODE_PORT',
  nodeEnv: 'NODE_ENV',
  logLevel: 'LOG_LEVEL',
};

export const nodePort = process.env[ENV_KEYS.nodePort];
export const isDev = process.env[ENV_KEYS.nodeEnv] === 'development';

const DEFAULT_LOG_LEVEL = LogLevel.Warn;
const isLogLevel = buildIsEnum(LogLevel);
const envLogLevel = process.env[ENV_KEYS.logLevel];
export const logLevel = isLogLevel(envLogLevel)
  ? envLogLevel
  : DEFAULT_LOG_LEVEL;
