import { log } from '@qbhub/utils';
import { Request, Response, Router } from 'express';

import { getClues } from '../models/clues.js';
import { QueryStringParsingError } from '../types/errors.js';
import { parseQueryString } from '../utils/controller.js';

const cluesRouter = Router();
cluesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseQueryString.clues(req.query);
    const clues = await getClues(questionFilters);
    res.json(clues);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    }
    log.error('error sending clues to client', e);
  }
});

export default cluesRouter;
