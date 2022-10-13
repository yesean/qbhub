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
  apiKey: import.meta.env.VITE_LOGFLARE_API_KEY as string,
  sourceToken:
    import.meta.env.NODE_ENV === 'development'
      ? (import.meta.env.VITE_LOGFLARE_CLIENT_DEV_ID as string)
      : (import.meta.env.VITE_LOGFLARE_CLIENT_PROD_ID as string),
});

const logger = pino({
  browser: { asObject: true, transmit: { send }, disabled: true },
});
export default logger.child(browserInfo);
