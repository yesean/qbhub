import { env } from '@qbhub/utils';
import cors from 'cors';
import express from 'express';
import path from 'path';
import bonusesRouter from './controllers/bonuses';
import cluesRouter from './controllers/clues';
import freqRouter from './controllers/freq';
import tossupsRouter from './controllers/tossups';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/api/tossups', tossupsRouter);
app.use('/api/bonuses', bonusesRouter);
app.use('/api/freq', freqRouter);
app.use('/api/clues', cluesRouter);

const CLIENT_BUILD_DIR = path.join(__dirname, '..', 'dist-client');
app.get('*', (_, res) =>
  res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html')),
);

app.listen(env.nodePort, () => {
  logger.info(`App is running on PORT ${env.nodePort}.`);
});
