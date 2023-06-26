function v(key: string): string {
  if (process.env[key] == null)
    throw new Error(`${key} must be defined in the environment`);

  return process.env[key] as string;
}

export const { NODE_PORT } = process.env;
export const isDev = process.env.NODE_ENV === 'development';
export const env = {
  logflare: {
    apiKey: v('LOGFLARE_API_KEY'),
    serverProdID: v('LOGFLARE_SERVER_PROD_ID'),
    serverDevID: v('LOGFLARE_SERVER_DEV_ID'),
  },
};
