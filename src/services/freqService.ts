import axios from 'axios';
import { Freq } from '../types/frequencyList';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { combineParams, createParamsFromArray } from '../utils/fetch';

const TOSSUP_ENDPOINT = `/api/freq`;

export const fetchFreq = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  limit: number,
  offset: number,
): Promise<Freq[]> => {
  const params = combineParams(
    createParamsFromArray('categories', categories),
    createParamsFromArray('subcategories', subcategories),
    createParamsFromArray('difficulties', difficulties),
    `limit=${limit}`,
    `offset=${offset}`,
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
