import { Request, Response } from 'express';
import { isNumeric, isNumericArray, isStringArray } from '../utils/typeGuards';
import { queryTossups } from '../utils/db';
import { error } from '../utils/logger';

const tossupsRouter = require('express').Router();

tossupsRouter.get('/', async (req: Request, res: Response) => {
  const { query: queryOptions } = req;
  const { categories = [] } = queryOptions;
  const { subcategories = [] } = queryOptions;
  const { difficulties = [] } = queryOptions;
  const { limit = 10 } = queryOptions;

  if (!Array.isArray(categories) || !isStringArray(categories)) {
    return res
      .status(400)
      .send('The query string field `categories` must be an array.');
  }

  if (!Array.isArray(subcategories) || !isStringArray(subcategories)) {
    return res
      .status(400)
      .send('The query string field `subcategories` must be an array.');
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

  if (!isNumericArray(subcategories)) {
    return res
      .status(400)
      .send('The query string field `subcategories` must be a number array.');
  }

  if (!isNumericArray(difficulties)) {
    return res
      .status(400)
      .send('The query string field `difficulties` must be a number array.');
  }

  if (!isNumeric(limit)) {
    return res
      .status(400)
      .send('The query string field `limit` must be a number.');
  }

  const parsedCategories = categories.map((e) => parseInt(e, 10));
  const parsedSubcategories = subcategories.map((e) => parseInt(e, 10));
  const parsedDifficulties = difficulties.map((e) => parseInt(e, 10));
  const parsedLimit = Number(limit);

  try {
    const data = await queryTossups(
      parsedCategories,
      parsedSubcategories,
      parsedDifficulties,
      parsedLimit
    );
    const tossups = data.rows.map((tu: any) => ({
      ...tu,
    }));
    res.json(tossups);
  } catch (e) {
    error(e);
  }
  return () => {};
});

export default tossupsRouter;
