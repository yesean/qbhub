import { Request, Response } from 'express';
import { getTossups } from '../models/tossups';
import { QueryStringParsingError } from '../types/errors';
import { parseTossups } from '../utils/controller';
import logger from '../utils/logger';

const tossupsRouter = require('express').Router();

tossupsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const questionFilters = parseTossups(req.query);
    const data = await getTossups(questionFilters);
    const tossups = data.rows;
    res.json(tossups);
  } catch (e) {
    if (e instanceof QueryStringParsingError) {
      res.status(400).send(e.message);
    } else {
      logger.error(e);
    }
  }
});

export default tossupsRouter;
