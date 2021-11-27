import { Request, Response, Router } from 'express';
import { getTossups } from '../models/tossups';
import { QueryStringParsingError } from '../types/errors';
import { parseQueryString } from '../utils/controller';

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
  }
});

export default tossupsRouter;
