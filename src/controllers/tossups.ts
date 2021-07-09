import { Request, Response } from 'express';
import { isNumberArray } from '../utils/typeGuards';
import { queryTossups } from '../utils/db';
import { error, info } from '../utils/logger';

const tossupsRouter = require('express').Router();

tossupsRouter.get('/', async (req: Request, res: Response) => {
  const { query: queryOptions } = req;
  const { categories } = queryOptions;
  const { difficulties } = queryOptions;

  if ('categories' in queryOptions && !isNumberArray(categories)) {
    res
      .status(400)
      .send('The query string field `categories` must be a number array.');
  }

  if ('difficulties' in queryOptions && !isNumberArray(difficulties)) {
    res
      .status(400)
      .send('The query string field `difficulties` must be a number array.');
  }

  try {
    if (isNumberArray(categories) && isNumberArray(difficulties)) {
      const data = await queryTossups(categories, difficulties);
      const tossups = data.rows.map((tu: any) => ({
        tournament: {
          name: tu.tournament_name,
          difficulty: tu.tournament_difficulty,
        },
        ...tu,
      }));
      res.json(tossups);
    }
  } catch (e) {
    error(e);
  }
});

export default tossupsRouter;
