import { log } from '@qbhub/utils';
import { Request, Response, Router } from 'express';
import { getBonuses } from '../models/bonuses';
import { QueryStringParsingError } from '../types/errors';
import { parseQueryString } from '../utils/controller';

const bonusesRouter = Router();
bonusesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseQueryString.bonuses(req.query);
    const bonuses = await getBonuses(questionFilters);
    res.json(bonuses);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    }
    log.error(e);
  }
});

export default bonusesRouter;
