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
  answer?: string;
  categories?: Category[];
  difficulties?: Difficulty[];
  fromYear?: number;
  limit?: number;
  offset?: number;
  subcategories?: Subcategory[];
  text?: string;
  tournaments?: Tournament[];
};

const createParams = ({
  answer = '',
  categories = [],
  difficulties = [],
  fromYear = MIN_TOURNAMENT_YEAR,
  limit = 10,
  offset = 0,
  subcategories = [],
  text = '',
  tournaments = [],
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
    log.info('Fetching tossups');
    const { data } = await axios.get<Tossup[]>(url);
    const tossups = data.map((tossup) => ({
      ...tossup,
      formattedAnswer: normalizeTags(tossup.formattedAnswer),
      formattedText: cleanTossupText(tossup.formattedText),
      text: cleanTossupText(tossup.text),
    }));
    log.info('Finished fetching tossups');
    return tossups;
  } catch (err) {
    log.error('Error fetching tossups', err);
    return [];
  }
};

export const fetchBonuses = async (params: FetchParams): Promise<Bonus[]> => {
  const url = addParams(BONUS_URL, createParams(params));

  try {
    log.info('Fetching bonuses');
    const { data } = await axios.get<Bonus[]>(url);
    const bonuses = data.map((bonus) => ({
      ...bonus,
      formattedLeadin: normalizeTags(bonus.formattedLeadin),
      parts: bonus.parts.map((part) => ({
        ...part,
        formattedAnswer: normalizeTags(part.formattedAnswer),
        formattedText: normalizeTags(part.formattedText),
      })),
    }));
    log.info('Finished fetching bonuses');
    return bonuses;
  } catch (err) {
    log.error('Error fetching bonuses', err);
    return [];
  }
};

export const fetchFreq = async (
  params: FetchParams,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(FREQ_URL, createParams(params));

  try {
    log.info('Fetching frequency list');
    const { data } = await axios.get<FrequencyListEntry[]>(url);
    log.info('Finished fetching frequency list');
    return data;
  } catch (err) {
    log.error('Error fetching frequency list', err);
    return [];
  }
};

export const fetchAnswers = async (
  params: FetchParams,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(FREQ_URL, createParams(params));

  try {
    log.info('Fetching answers');
    const { data } = await axios.get<FrequencyListEntry[]>(url);
    log.info('Finished fetching answers');
    return data;
  } catch (err) {
    log.error('Error fetching answers', err);
    return [];
  }
};

export const fetchClues = async (
  params: FetchParams,
): Promise<SelectedClue[]> => {
  const url = addParams(CLUES_URL, createParams(params));

  try {
    log.info('Fetching clues');
    const { data } = await axios.get<SelectedClue[]>(url);
    log.info('Finished fetching clues');
    return data;
  } catch (err) {
    log.error('Error fetching clues');
    return [];
  }
};
