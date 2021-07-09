import { Request, Response } from 'express';
import { isNumberArray } from '../utils/typeGuards';
import db from '../utils/db';
import { error, info } from '../utils/logger';

const tossupsRouter = require('express').Router();

tossupsRouter.get('/', async (req: Request, res: Response) => {
  const { query: queryOptions } = req;
  const { categories } = queryOptions;
  const { difficulties } = queryOptions;

  if ('categories' in queryOptions && !isNumberArray(categories)) {
    return res
      .status(400)
      .send('The query string field `categories` must be a number array.');
  }

  if ('difficulties' in queryOptions && !isNumberArray(difficulties)) {
    return res
      .status(400)
      .send('The query string field `difficulties` must be a number array.');
  }

  const categoriesQueryString = categories
    ? `tossups.category_id in (${categories.join(', ')})`
    : true;
  const difficultiesQueryString = difficulties
    ? `tournaments.difficulty in (${difficulties.join(', ')})`
    : true;

  try {
    const query = `
      select tournaments.name as tournament_name, tournaments.difficulty as tournament_difficulty, text, answer, formatted_text, formatted_answer from tossups
      inner join tournaments on tossups.tournament_id = tournaments.id
      where ${categoriesQueryString} and ${difficultiesQueryString}
      order by random()
      limit 10;
    `;
    const data: any = await db.query(query);
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
