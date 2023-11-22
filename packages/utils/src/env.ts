import { validateLogLevel } from '@qbhub/types';

function getViteEnv() {
  const ENV_KEYS = {
    logLevel: 'VITE_LOG_LEVEL',
  };

  const viteEnv = (import.meta as any).env;

  const isDev = viteEnv?.DEV;
  const logLevel = validateLogLevel(viteEnv?.[ENV_KEYS.logLevel]);
  const isVite = viteEnv != null;

  return {
    isDev,
    logLevel,
    isVite,
  };
}

function getNodeEnv() {
  const ENV_KEYS = {
    nodePort: 'NODE_PORT',
    nodeEnv: 'NODE_ENV',
    logLevel: 'LOG_LEVEL',
  };

  const logLevel = validateLogLevel(
    globalThis.process?.env?.[ENV_KEYS.logLevel],
  );
  const isDev = globalThis.process?.env?.[ENV_KEYS.nodeEnv] === 'development';
  const nodePort = globalThis.process?.env?.[ENV_KEYS.nodePort];

  return {
    isDev,
    logLevel,
    nodePort,
  };
}

const viteEnv = getViteEnv();
const nodeEnv = getNodeEnv();

const isDev = viteEnv.isVite ? viteEnv.isDev : nodeEnv.isDev;
const logLevel = viteEnv.isVite ? viteEnv.logLevel : nodeEnv.logLevel;
const { nodePort } = nodeEnv;

export { isDev, logLevel, nodePort };
