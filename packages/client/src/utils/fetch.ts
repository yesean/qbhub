import {
  Bonus,
  Category,
  Difficulty,
  FrequencyListEntry,
  SelectedClue,
  Subcategory,
  Tossup,
  Tournament,
} from '@qbhub/types';
import { log } from '@qbhub/utils';
import axios from 'axios';
import { MIN_TOURNAMENT_YEAR } from './settings/constants';
import { cleanTossupText, normalizeTags } from './string';

const API_URL = '/api';
const TOSSUP_URL = `${API_URL}/tossups`;
const BONUS_URL = `${API_URL}/bonuses`;
const FREQ_URL = `${API_URL}/freq`;
const CLUES_URL = `${API_URL}/clues`;

export const combineParams = (...params: string[]) =>
  params.filter(Boolean).join('&');
export const createParamsFromArray = (field: string, values: any[]) =>
  combineParams(...values.map((val) => `${field}[]=${val}`));
export const addParams = (url: string, params: string) => `${url}?${params}`;

type FetchParams = {
  categories?: Category[];
  subcategories?: Subcategory[];
  difficulties?: Difficulty[];
  tournaments?: Tournament[];
  fromYear?: number;
  text?: string;
  answer?: string;
  limit?: number;
  offset?: number;
};

const createParams = ({
  categories = [],
  subcategories = [],
  difficulties = [],
  tournaments = [],
  fromYear = MIN_TOURNAMENT_YEAR,
  text = '',
  answer = '',
  limit = 10,
  offset = 0,
}: FetchParams) =>
  combineParams(
    createParamsFromArray('categories', categories),
    createParamsFromArray('subcategories', subcategories),
    createParamsFromArray('difficulties', difficulties),
    createParamsFromArray('tournaments', tournaments),
    `from=${fromYear}`,
    text.length ? `text=${text}` : '',
    answer.length ? `answer=${answer}` : '',
    `limit=${limit}`,
    `offset=${offset}`,
  );

export const fetchTossups = async (params: FetchParams): Promise<Tossup[]> => {
  const url = addParams(TOSSUP_URL, createParams(params));

  try {
    log.info('fetching tossups');
    const { data } = await axios.get<Tossup[]>(url);
    const tossups = data.map((tu) => ({
      id: tu.id,
      text: cleanTossupText(tu.text),
      answer: tu.answer,
      formattedText: cleanTossupText(tu.formattedText),
      formattedAnswer: normalizeTags(tu.formattedAnswer),
      normalizedAnswer: tu.normalizedAnswer,
      category: tu.category,
      subcategory: tu.subcategory,
      difficulty: tu.difficulty,
      tournament: tu.tournament,
      year: tu.year,
    }));
    log.info('finished fetching tossups');
    return tossups;
  } catch (err) {
    log.error('error fetching tossups', err);
    return [];
  }
};

export const fetchBonuses = async (params: FetchParams): Promise<Bonus[]> => {
  const url = addParams(BONUS_URL, createParams(params));

  try {
    log.info('fetching bonuses');
    const { data } = await axios.get<Bonus[]>(url);
    const bonuses = data.map((bn) => ({
      id: bn.id,
      leadin: bn.leadin,
      formattedLeadin: normalizeTags(bn.formattedLeadin),
      category: bn.category,
      subcategory: bn.subcategory,
      difficulty: bn.difficulty,
      tournament: bn.tournament,
      year: bn.year,
      parts: bn.parts.map((part) => ({
        ...part,
        formattedText: normalizeTags(part.formattedText),
        formattedAnswer: normalizeTags(part.formattedAnswer),
      })),
    }));
    log.info('finished fetching bonuses');
    return bonuses;
  } catch (err) {
    log.error('error fetching bonuses', err);
    return [];
  }
};

export const fetchFreq = async (
  params: FetchParams,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(FREQ_URL, createParams(params));

  try {
    log.info('fetching frequency list');
    const { data } = await axios.get<FrequencyListEntry[]>(url);
    log.info('finished fetching frequency list');
    return data;
  } catch (err) {
    log.error('error fetching frequency list', err);
    return [];
  }
};

export const fetchAnswers = async (
  params: FetchParams,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(FREQ_URL, createParams(params));

  try {
    log.info('fetching answers');
    const { data } = await axios.get<FrequencyListEntry[]>(url);
    log.info('finished fetching answers');
    return data;
  } catch (err) {
    log.error('error fetching answers', err);
    return [];
  }
};

export const fetchClues = async (
  params: FetchParams,
): Promise<SelectedClue[]> => {
  const url = addParams(CLUES_URL, createParams(params));

  try {
    log.info('fetching clues');
    const { data } = await axios.get<SelectedClue[]>(url);
    log.info('finished fetching clues');
    return data;
  } catch (err) {
    log.error('error fetching clues');
    return [];
  }
};
