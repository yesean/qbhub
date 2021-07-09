import { Client } from 'pg';

const client = new Client({
  user: 'sean',
  host: 'localhost',
  database: 'quizbowl',
  port: 5432,
});
client.connect();

export default client;
