import { log } from '@qbhub/utils';
import { Request, Response, Router } from 'express';
import { getFreq } from '../models/freq.js';
import { QueryStringParsingError } from '../types/errors.js';
import { parseQueryString } from '../utils/controller.js';

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
    log.error('error sending frequency list to client', e);
  }
});

export default freqRouter;
