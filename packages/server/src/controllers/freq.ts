import { Request, Response, Router } from 'express';
import { getFreq } from '../models/freq';
import { QueryStringParsingError } from '../types/errors';
import { parseQueryString } from '../utils/controller';
import logger from '../utils/logger';

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
    logger.error(e);
  }
});

export default freqRouter;
