import cors from 'cors';
import path from 'path';
import express from 'express';

import tossupsRouter from './controllers/tossups';
import { info } from './utils/logger';

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api/tossups', tossupsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  info(`App is running on PORT ${PORT}`);
});
