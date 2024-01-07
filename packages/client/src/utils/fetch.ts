import {
  Bonus,
  FrequencyListEntry,
  PartialOptional,
  QuestionFilters,
  SelectedClue,
  Tossup,
} from '@qbhub/types';
import { Err, Result, log, makeErr, makeOk } from '@qbhub/utils';
import axios from 'axios';
import qs from 'qs';

const ENDPOINTS = {
  bonus: '/api/bonuses',
  clue: '/api/clues',
  frequencyList: '/api/freq',
  tossup: '/api/tossups',
};

const addParams = (url: string, params: string) => `${url}?${params}`;

type TossupQuestionFilters = PartialOptional<
  QuestionFilters,
  'answer' | 'from' | 'limit' | 'offset' | 'sort' | 'text' | 'until'
>;
export const fetchTossups = async (
  params: TossupQuestionFilters,
): Promise<Tossup[]> => {
  const url = addParams(ENDPOINTS.tossup, qs.stringify(params));

  try {
    log.info('Fetching tossups');
    const { data } = await axios.get<Tossup[]>(url);
    log.info('Finished fetching tossups');
    return data;
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
  const url = addParams(ENDPOINTS.bonus, qs.stringify(params));

  try {
    log.info('Fetching bonuses');
    const { data } = await axios.get<Bonus[]>(url);
    log.info('Finished fetching bonuses');
    return data;
  } catch (err) {
    log.error('Error fetching bonuses', err);
    return [];
  }
};

export type FetchFreqErr = Err<{ errType: 'FetchFreqErr' }>;

type FreqQuestionFilters = PartialOptional<
  QuestionFilters,
  'answer' | 'from' | 'limit' | 'sort' | 'text' | 'until'
>;
export const fetchFreq = async (
  params: FreqQuestionFilters,
): Promise<Result<{ entries: FrequencyListEntry[] }, FetchFreqErr>> => {
  const url = addParams(ENDPOINTS.frequencyList, qs.stringify(params));

  try {
    log.info('Fetching frequency list');
    const { data } = await axios.get<FrequencyListEntry[]>(url);
    log.info('Finished fetching frequency list');

    return makeOk({ entries: data });
  } catch (error) {
    return makeErr({ errType: 'FetchFreqErr' as const });
  }
};

type AnswerlineQuestionFilters = PartialOptional<
  QuestionFilters,
  'from' | 'limit' | 'offset' | 'sort' | 'text' | 'until'
>;
export const fetchAnswerlines = async (
  params: AnswerlineQuestionFilters,
): Promise<FrequencyListEntry[]> => {
  const url = addParams(ENDPOINTS.frequencyList, qs.stringify(params));

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
  const url = addParams(ENDPOINTS.clue, qs.stringify(params));

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
