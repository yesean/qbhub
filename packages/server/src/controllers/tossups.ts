import { log } from '@qbhub/utils';
import { Request, Response, Router } from 'express';
import { getTossups } from '../models/tossups.js';
import { QueryStringParsingError } from '../types/errors.js';
import { parseQueryString } from '../utils/controller.js';

const tossupsRouter = Router();
tossupsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseQueryString.tossups(req.query);
    const tossups = await getTossups(questionFilters);
    res.json(tossups);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    }
    log.error(e);
  }
});

export default tossupsRouter;
