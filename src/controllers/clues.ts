import { PlainTossup } from 'clues';
import { Request, Response } from 'express';
import { getClues } from '../models/clues';
import { getAllClues, getUniqueClues } from '../utils/clues';
import { error } from '../utils/logger';
import { parseTossupQueryString, ParsingError } from './utils';

const cluesRouter = require('express').Router();

cluesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { categories, subcategories, difficulties, answer, limit } =
      parseTossupQueryString(req.query);
    const data = await getClues(
      categories,
      subcategories,
      difficulties,
      answer,
      limit,
    );
    const answers = data.rows as PlainTossup[];
    const clues = getAllClues(answers);
    const uniqueClues = getUniqueClues(clues);
    res.json(uniqueClues);
  } catch (e) {
    if (e instanceof ParsingError) res.status(400).send(e.message);
    else error(e);
  }
});

export default cluesRouter;
