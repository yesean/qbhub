import axios from 'axios';
import { Category, Difficulty, Freq, Subcategory } from '../types';
import { combineParams, getQueryParamArray } from './utils';

const TOSSUP_ENDPOINT = `/api/freq`;

export const fetchFreq = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  limit: number,
  offset: number,
): Promise<Freq[]> => {
  const categoriesQueryString = getQueryParamArray('categories', categories);
  const subcategoriesQueryString = getQueryParamArray(
    'subcategories',
    subcategories,
  );
  const difficultiesQueryString = getQueryParamArray(
    'difficulties',
    difficulties,
  );
  const limitQueryString = `limit=${limit}`;
  const offsetQueryString = `offset=${offset}`;
  const params = combineParams(
    categoriesQueryString,
    subcategoriesQueryString,
    difficultiesQueryString,
    limitQueryString,
    offsetQueryString,
  );

  try {
    const url = `${TOSSUP_ENDPOINT}?${params}`;
    const response = await axios.get(url);
    const { data: freqs } = response;
    return freqs.map((freq: any) => ({
      answer: freq.answer,
      count: freq.count,
    }));
  } catch (e) {
    return [];
  }
};
