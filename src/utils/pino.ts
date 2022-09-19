import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';

const stream = createWriteStream({
  apiKey: process.env.LOGFLARE_API_KEY,
  sourceToken:
    process.env.NODE_ENV === 'development'
      ? process.env.LOGFLARE_SERVER_DEV_ID
      : process.env.LOGFLARE_SERVER_PROD_ID,
});

export default pino({ stream });
