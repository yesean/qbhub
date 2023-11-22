import { buildIsEnum, LogLevel } from '@qbhub/types';

const ENV_KEYS = {
  nodePort: 'NODE_PORT',
  nodeEnv: 'NODE_ENV',
  logLevel: 'LOG_LEVEL',
  viteLogLevel: 'VITE_LOG_LEVEL',
};

const VITE_ENV_KEYS = {
  logLevel: 'VITE_LOG_LEVEL',
};

const isLogLevel = buildIsEnum(LogLevel);
export const DEFAULT_LOG_LEVEL = LogLevel.Warn;
export const validateLogLevel = (data: string | undefined) =>
  isLogLevel(data) ? data : DEFAULT_LOG_LEVEL;

const viteEnv = (import.meta as any).env;
const isVite = viteEnv != null;

const viteIsDev = viteEnv?.DEV;
const viteLogLevel = validateLogLevel(viteEnv?.[VITE_ENV_KEYS.logLevel]);

const envLogLevel = window.process?.env?.[ENV_KEYS.logLevel];
const nodePort = window.process?.env?.[ENV_KEYS.nodePort];
const nodeIsDev = window.process?.env?.[ENV_KEYS.nodeEnv] === 'development';
const nodeLogLevel = validateLogLevel(envLogLevel);

const isDev = isVite ? viteIsDev : nodeIsDev;
const logLevel = isVite ? viteLogLevel : nodeLogLevel;

export { nodePort, isDev, logLevel };
