import { PlainTossup } from 'clues';
import { Request, Response, Router } from 'express';
import { getClues } from '../models/clues';
import { QueryStringParsingError } from '../types/errors';
import { getAllClues, getUniqueClues } from '../utils/clues';
import { parseQueryString } from '../utils/controller';
import logger from '../utils/logger';

const cluesRouter = Router();
cluesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseQueryString.clues(req.query);
    const data = await getClues(questionFilters);
    const answers = data.rows as PlainTossup[];

    // extract clues from tossups
    logger.info('Parsing tossups into clues.');
    const clues = getAllClues(answers);
    logger.info('Extracting unique clues from all clues.');
    const uniqueClues = getUniqueClues(clues);

    res.json(uniqueClues);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    }
  }
});

export default cluesRouter;
