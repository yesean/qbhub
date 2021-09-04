import { Request, Response } from 'express';
import { getTossups } from '../models/tossups';
import { error } from '../utils/logger';
import { getTopAnswers } from '../utils/freq';
import { parseTossupQueryString, ParsingError } from './utils';

const freqRouter = require('express').Router();

freqRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { categories, subcategories, difficulties, text, answer, limit } =
      parseTossupQueryString(req.query);
    const data = await getTossups(
      categories,
      subcategories,
      difficulties,
      text,
      answer,
      limit,
    );
    const tossups = data.rows;
    const topAnswers = getTopAnswers(tossups);
    res.json(topAnswers);
  } catch (e) {
    if (e instanceof ParsingError) res.status(400).send(e.message);
    else error(e);
  }
});

export default freqRouter;
