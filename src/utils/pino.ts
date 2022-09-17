import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';

const stream = createWriteStream({
  apiKey: process.env.LOGFLARE_API_KEY,
  sourceToken: process.env.LOGFLARE_SOURCE_TOKEN,
});

export default pino({ stream });
