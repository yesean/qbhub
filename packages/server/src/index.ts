import { env, log } from '@qbhub/utils';
import cors from 'cors';
import express from 'express';
import path from 'path';
import bonusesRouter from './controllers/bonuses.js';
import cluesRouter from './controllers/clues.js';
import freqRouter from './controllers/freq.js';
import tossupsRouter from './controllers/tossups.js';

const CLIENT_BUILD_DIR = new URL('../dist-client', import.meta.url).pathname;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(CLIENT_BUILD_DIR));

app.use('/api/tossups', tossupsRouter);
app.use('/api/bonuses', bonusesRouter);
app.use('/api/freq', freqRouter);
app.use('/api/clues', cluesRouter);

app.get('*', (_, res) =>
  res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html')),
);

app.listen(env.nodePort, () => {
  log.info(`App is running on PORT ${env.nodePort}.`);
});
