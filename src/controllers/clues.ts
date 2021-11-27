import { Request, Response, Router } from 'express';
import { getClues } from '../models/clues';
import { QueryStringParsingError } from '../types/errors';
import { parseQueryString } from '../utils/controller';

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
  }
});

export default cluesRouter;
