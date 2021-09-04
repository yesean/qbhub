import { Request, Response } from 'express';
import { error } from '../utils/logger';
import { parseFreqQueryString, ParsingError } from './utils';
import { getFreq } from '../models/freq';

const freqRouter = require('express').Router();

freqRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      categories,
      subcategories,
      difficulties,
      text,
      answer,
      limit,
      offset,
    } = parseFreqQueryString(req.query);
    const data = await getFreq(
      categories,
      subcategories,
      difficulties,
      text,
      answer,
      limit,
      offset,
    );
    const answers = data.rows;
    res.json(answers);
  } catch (e) {
    if (e instanceof ParsingError) res.status(400).send(e.message);
    else error(e);
  }
});

export default freqRouter;
