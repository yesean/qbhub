import cors from 'cors';
import express from 'express';

import tossupsRouter from './controllers/tossups';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/tossups', tossupsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
