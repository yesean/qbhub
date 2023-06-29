import { createPinoBrowserSend } from '@seanye/pino-logflare';
import { detect } from 'detect-browser';
import pino from 'pino';

const browser = detect();
export const browserInfo = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  os: browser?.os,
  browser: browser?.name,
  version: browser?.version,
};

const send = createPinoBrowserSend({
  apiKey: LOGFLARE_API_KEY,
  sourceToken: LOGFLARE_SOURCE_TOKEN,
});

const logger = pino({
  browser: { asObject: true, transmit: { send }, disabled: true },
});
export default logger.child(browserInfo);
