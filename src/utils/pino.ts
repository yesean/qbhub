import pino from 'pino-http';
import { createWriteStream } from 'pino-logflare';

// QBHub.digitalocean
const logflareSourceToken = '8815a6c9-412f-40a7-9abd-88f146cbdc40';

const stream = createWriteStream({
  apiKey: process.env.LOGFLARE_API_KEY,
  sourceToken: logflareSourceToken,
});

export default pino({ stream });
