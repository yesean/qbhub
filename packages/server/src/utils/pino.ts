import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';
import { isDev, LOGFLARE } from './env';

const stream = createWriteStream({
  apiKey: LOGFLARE.apiKey,
  sourceToken: isDev ? LOGFLARE.serverDevID : LOGFLARE.serverProdID,
});

export default pino({ stream });
