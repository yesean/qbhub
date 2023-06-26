import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';
import { env, isDev } from './env';

const stream = createWriteStream({
  apiKey: env.logflare.apiKey,
  sourceToken: isDev ? env.logflare.serverDevID : env.logflare.serverProdID,
});

export default pino({ stream });
