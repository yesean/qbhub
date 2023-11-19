import { log } from '@qbhub/utils';
import { Request, Response, Router } from 'express';
import { getFreq } from '../models/freq';
import { QueryStringParsingError } from '../types/errors';
import { parseQueryString } from '../utils/controller';

const freqRouter = Router();
freqRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseQueryString.freq(req.query);
    const freq = await getFreq(questionFilters);
    res.json(freq);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    }
    log.error(e);
  }
});

export default freqRouter;
