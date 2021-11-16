import cors from 'cors';
import path from 'path';
import express from 'express';

import tossupsRouter from './controllers/tossups';
import freqRouter from './controllers/freq';
import { info } from './utils/logger';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/tossups', tossupsRouter);
app.use('/api/freq', freqRouter);
app.use('*', express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  info(`App is running on PORT ${PORT}`);
});
