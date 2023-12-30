import { QuestionFilters } from '@qbhub/types';
import {
  parseAnswer,
  parseCategories,
  parseDifficulties,
  parseFrom,
  parseLimit,
  parseOffset,
  parseSort,
  parseSubcategories,
  parseText,
  parseTournaments,
  parseUntil,
} from './queryString.js';

/**
 * Parses the QuestionFilters from a URL query string.
 */
const parseQuestionFilters = (
  q: qs.ParsedQs,
  { answer } = { answer: false },
): QuestionFilters => ({
  answer: parseAnswer(q, answer),
  categories: parseCategories(q),
  difficulties: parseDifficulties(q),
  from: parseFrom(q),
  limit: parseLimit(q),
  offset: parseOffset(q),
  sort: parseSort(q),
  subcategories: parseSubcategories(q),
  text: parseText(q),
  tournaments: parseTournaments(q),
  until: parseUntil(q),
});

/**
 * Parse query string for the /tossups endpoint.
 */
const parseTossups = (q: qs.ParsedQs) => parseQuestionFilters(q);

/**
 * Parse query string for the /bonuses endpoint.
 */
const parseBonuses = (q: qs.ParsedQs) => parseQuestionFilters(q);

/**
 * Parse query string for the /freq endpoint.
 */
const parseFreq = (q: qs.ParsedQs) => parseQuestionFilters(q);

/**
 * Parse query string for the /clues endpoint.
 */
const parseClues = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { answer: true });

export const parseQueryString = {
  bonuses: parseBonuses,
  clues: parseClues,
  freq: parseFreq,
  tossups: parseTossups,
};
