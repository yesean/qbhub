import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';
import * as env from './env';

const stream = createWriteStream({
  apiKey: env.logflare.apiKey,
  sourceToken: env.logflare.sourceToken,
});

export default pino({ stream });
