import { MiniTossup } from 'clues';
import { Request, Response } from 'express';
import { getSentences, getUniqueClues } from '../utils/clues';
import { getClues } from '../models/clues';
import { error } from '../utils/logger';
import { parseFreqQueryString, ParsingError } from './utils';

const cluesRouter = require('express').Router();

cluesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { categories, subcategories, difficulties, answer } =
      parseFreqQueryString(req.query);
    const data = await getClues(
      categories,
      subcategories,
      difficulties,
      answer,
    );
    const answers = data.rows as MiniTossup[];
    const clues = getSentences(answers);
    const uniqueClues = getUniqueClues(clues);
    res.json(uniqueClues);
  } catch (e) {
    if (e instanceof ParsingError) res.status(400).send(e.message);
    else error(e);
  }
});

export default cluesRouter;
