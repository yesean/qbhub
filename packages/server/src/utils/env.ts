function v(key: string): string {
  if (process.env[key] == null)
    throw new Error(`${key} must be defined in the environment`);

  return process.env[key] as string;
}

export const nodePort = process.env.NODE_PORT;
export const isDev = process.env.NODE_ENV === 'development';
export const logflare = {
  apiKey: v('LOGFLARE_API_KEY'),
  prodID: v('LOGFLARE_SERVER_PROD_ID'),
  devID: v('LOGFLARE_SERVER_DEV_ID'),
};
