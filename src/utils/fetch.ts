import axios from 'axios';
import { Freq } from '../types/frequencyList';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { Tossup } from '../types/tossupReader';
import logger from './logger';
import { cleanTossupText } from './string';

const API_URL = '/api';
const TOSSUP_URL = `${API_URL}/tossups`;
const FREQ_URL = `${API_URL}/freq`;

export const combineParams = (...params: any[]) => params.join('&');
export const createParamsFromArray = (field: string, values: any[]) =>
  combineParams(values.map((val) => `${field}[]=${val}`));

export const addParams = (url: string, params: string) => `${url}?${params}`;

type FetchParams = {
  categories?: Category[];
  subcategories?: Subcategory[];
  difficulties?: Difficulty[];
  limit?: number;
  offset?: number;
};

const createParams = ({
  categories = [],
  subcategories = [],
  difficulties = [],
  limit = 10,
  offset = 0,
}: FetchParams) =>
  combineParams(
    createParamsFromArray('categories', categories),
    createParamsFromArray('subcategories', subcategories),
    createParamsFromArray('difficulties', difficulties),
    `limit=${limit}`,
    `offset=${offset}`,
  );

export const fetchTossups = async (params: FetchParams): Promise<Tossup[]> => {
  const url = addParams(TOSSUP_URL, createParams(params));

  try {
    logger.info('Fetching tossups.');
    const { data } = await axios.get(url);
    const tossups = data.map((tu: any) => ({
      text: cleanTossupText(tu.text),
      answer: tu.answer,
      formattedText: cleanTossupText(tu.formatted_text),
      formattedAnswer: tu.formatted_answer,
      category: tu.category,
      subcategory: tu.subcategory,
      difficulty: tu.difficulty,
      tournament: tu.tournament,
    }));
    logger.info('Received tossups:', tossups);
    return tossups;
  } catch (err) {
    return [];
  }
};

export const fetchFreq = async (params: FetchParams): Promise<Freq[]> => {
  const url = addParams(FREQ_URL, createParams(params));

  try {
    logger.info('Fetching frequency list.');
    const { data } = await axios.get(url);
    logger.info('Received frequency list:', data);
    return data;
  } catch (err) {
    return [];
  }
};
