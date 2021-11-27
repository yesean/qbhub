import { Request, Response, Router } from 'express';
import { getFreq } from '../models/freq';
import { QueryStringParsingError } from '../types/errors';
import { parseQueryString } from '../utils/controller';

const freqRouter = Router();
freqRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseQueryString.freq(req.query);
    const data = await getFreq(questionFilters);
    const answers = data.rows;

    res.json(answers);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    }
  }
});

export default freqRouter;
