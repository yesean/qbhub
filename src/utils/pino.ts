import { detect } from 'detect-browser';
import pino from 'pino';
import { createPinoBrowserSend } from 'pino-logflare';

const browser = detect();
export const browserInfo = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  os: browser?.os,
  browser: browser?.name,
  version: browser?.version,
};

const send = createPinoBrowserSend({
  apiKey: process.env.REACT_APP_LOGFLARE_API_KEY as string,
  sourceToken:
    process.env.NODE_ENV === 'development'
      ? (process.env.REACT_APP_LOGFLARE_CLIENT_DEV_ID as string)
      : (process.env.REACT_APP_LOGFLARE_CLIENT_PROD_ID as string),
});

const logger = pino({ browser: { asObject: true, transmit: { send } } });
export default logger.child(browserInfo);
