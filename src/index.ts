import cors from 'cors';
import express from 'express';
import path from 'path';
import bonusesRouter from './controllers/bonuses';
import cluesRouter from './controllers/clues';
import freqRouter from './controllers/freq';
import tossupsRouter from './controllers/tossups';
import logger from './utils/logger';
import pino from './utils/pino';

const app = express();
app.use(pino);
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/api/tossups', tossupsRouter);
app.use('/api/bonuses', bonusesRouter);
app.use('/api/freq', freqRouter);
app.use('/api/clues', cluesRouter);
app.get('*', (_, res) =>
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html')),
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`App is running on PORT ${PORT}.`);
});
