import {
  Bonus,
  FrequencyListEntry,
  PartialOptional,
  QuestionFilters,
  SelectedClue,
  Tossup,
} from '@qbhub/types';
import { log } from '@qbhub/utils';
import axios from 'axios';
import { MIN_TOURNAMENT_YEAR } from './settings/constants';
import { cleanTossupText, normalizeTags } from './string';

const ENDPOINTS = {
  bonus: '/api/bonuses',
  clue: '/api/clues',
  frequencyList: '/api/freq',
  tossup: '/api/tossups',
};

export const combineParams = (...params: string[]) =>
  params.filter(Boolean).join('&');
export const createParamsFromArray = (field: string, values: any[]) =>
  combineParams(...values.map((val) => `${field}[]=${val}`));
export const addParams = (url: string, params: string) => `${url}?${params}`;

const createParams = ({
  answer = '',
  categories = [],
  difficulties = [],
  from = MIN_TOURNAMENT_YEAR,
  limit = 10,
  offset = 0,
  subcategories = [],
  text = '',
  tournaments = [],
}: Partial<QuestionFilters>) =>
  combineParams(
    createParamsFromArray('categories', categories),
    createParamsFromArray('subcategories', subcategories),
    createParamsFromArray('difficulties', difficulties),
    createParamsFromArray('tournaments', tournaments),
    `from=${from}`,
    text.length ? `text=${text}` : '',
    answer.length ? `answer=${answer}` : '',
    `limit=${limit}`,
    `offset=${offset}`,
  );

type TossupQuestionFilters = PartialOptional<
  QuestionFilters,
  'answer' | 'from' | 'limit' | 'offset' | 'sort' | 'text' | 'until'
>;
export const fetchTossups = async (
  params: TossupQuestionFilters,
): Promise<Tossup[]> => {
  const url = addParams(ENDPOINTS.tossup, createParams(params));

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

type BonusQuestionFilters = PartialOptional<
  QuestionFilters,
  'answer' | 'from' | 'limit' | 'offset' | 'sort' | 'text' | 'until'
>;
export const fetchBonuses = async (
  params: BonusQuestionFilters,
): Promise<Bonus[]> => {
  const url = addParams(ENDPOINTS.bonus, createParams(params));

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

type FreqQuestionFilters = PartialOptional<
  QuestionFilters,
  'answer' | 'from' | 'limit' | 'sort' | 'text' | 'until'
>;
export const fetchFreq = async (
  params: FreqQuestionFilters,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(ENDPOINTS.frequencyList, createParams(params));

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

type AnswerlineQuestionFilters = PartialOptional<
  QuestionFilters,
  'from' | 'limit' | 'offset' | 'sort' | 'text' | 'until'
>;
export const fetchAnswerlines = async (
  params: AnswerlineQuestionFilters,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(ENDPOINTS.frequencyList, createParams(params));

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

type ClueQuestionFilters = PartialOptional<
  QuestionFilters,
  'from' | 'limit' | 'offset' | 'sort' | 'text' | 'until'
>;
export const fetchClues = async (
  params: ClueQuestionFilters,
): Promise<SelectedClue[]> => {
  const url = addParams(ENDPOINTS.clue, createParams(params));

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
