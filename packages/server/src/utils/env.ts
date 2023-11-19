import { buildIsEnum, LogLevel } from '@qbhub/types';

export const nodePort = process.env.NODE_PORT;
export const isDev = process.env.NODE_ENV === 'development';

const isLogLevel = buildIsEnum(LogLevel);
const envLogLevel = process.env.LOGL_LEVEL;
export const logLevel = isLogLevel(envLogLevel) ? envLogLevel : LogLevel.Warn;
