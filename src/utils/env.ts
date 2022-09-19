export const { PORT } = process.env;
export const isDev = process.env.NODE_ENV === 'development';
export const LOGFLARE = {
  apiKey: process.env.LOGFLARE_API_KEY,
  serverProdID: process.env.LOGFLARE_SERVER_PROD_ID,
  serverDevID: process.env.LOGFLARE_SERVER_DEV_ID,
};
export const PG = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.password,
  port: Number(process.env.PGPORT),
};
