import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';
import * as env from './env';

const stream = createWriteStream({
  apiKey: env.logflare.apiKey,
  sourceToken: env.isDev ? env.logflare.devID : env.logflare.prodID,
});

export default pino({ stream });
