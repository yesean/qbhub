import { Request, Response } from 'express';
import {
  isNumberArray,
  isNumericArray,
  isStringArray,
} from '../utils/typeGuards';
import { queryTossups } from '../utils/db';
import { error, info } from '../utils/logger';

const tossupsRouter = require('express').Router();

tossupsRouter.get('/', async (req: Request, res: Response) => {
  const { query: queryOptions } = req;
  const { categories = [] } = queryOptions;
  const { difficulties = [] } = queryOptions;

  if (!Array.isArray(categories) || !isStringArray(categories)) {
    return res
      .status(400)
      .send('The query string field `categories` must be an array.');
  }

  if (!Array.isArray(difficulties) || !isStringArray(difficulties)) {
    return res
      .status(400)
      .send('The query string field `difficulties` must be an array.');
  }

  if (!isNumericArray(categories)) {
    return res
      .status(400)
      .send('The query string field `categories` must be a number array.');
  }

  if (!isNumericArray(difficulties)) {
    return res
      .status(400)
      .send('The query string field `difficulties` must be a number array.');
  }

  const parsedCategories = categories.map((e) => parseInt(e, 10));
  const parsedDifficulties = difficulties.map((e) => parseInt(e, 10));

  try {
    const data = await queryTossups(parsedCategories, parsedDifficulties);
    const tossups = data.rows.map((tu: any) => ({
      tournament: {
        name: tu.tournament_name,
        difficulty: tu.tournament_difficulty,
      },
      ...tu,
    }));
    res.json(tossups);
  } catch (e) {
    error(e);
  }
});

export default tossupsRouter;
