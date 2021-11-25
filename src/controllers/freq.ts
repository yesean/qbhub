import { Request, Response } from 'express';
import { getFreq } from '../models/freq';
import { QueryStringParsingError } from '../types/errors';
import { parseFreq } from '../utils/controller';
import logger from '../utils/logger';

const freqRouter = require('express').Router();

freqRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseFreq(req.query);
    const data = await getFreq(questionFilters);
    const answers = data.rows;
    res.json(answers);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    } else {
      logger.error(e);
    }
  }
});

export default freqRouter;
