import { PlainTossup } from 'clues';
import { Request, Response } from 'express';
import { getClues } from '../models/clues';
import { QueryStringParsingError } from '../types/errors';
import { getAllClues, getUniqueClues } from '../utils/clues';
import { parseClues } from '../utils/controller';
import logger from '../utils/logger';

const cluesRouter = require('express').Router();

cluesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseClues(req.query);
    const data = await getClues(questionFilters);
    const answers = data.rows as PlainTossup[];
    logger.info('Parsing tossups into clues.');
    const clues = getAllClues(answers);
    const uniqueClues = getUniqueClues(clues);
    res.json(uniqueClues);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    } else {
      logger.error(e);
    }
  }
});

export default cluesRouter;
