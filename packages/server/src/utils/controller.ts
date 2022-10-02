import { QuestionFilters } from '../types/controller';
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
} from './queryString';

/**
 * Parses the QuestionFilters from a URL query string.
 */
const parseQuestionFilters = (
  q: qs.ParsedQs,
  { answer = false, limit = false },
): QuestionFilters => ({
  categories: parseCategories(q),
  subcategories: parseSubcategories(q),
  difficulties: parseDifficulties(q),
  tournaments: parseTournaments(q),
  text: parseText(q),
  answer: parseAnswer(q, answer),
  sort: parseSort(q),
  from: parseFrom(q),
  until: parseUntil(q),
  offset: parseOffset(q),
  limit: parseLimit(q, limit),
});

/**
 * Parse query string for the /tossups endpoint.
 */
const parseTossups = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { limit: true });

/**
 * Parse query string for the /bonuses endpoint.
 */
const parseBonuses = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { limit: true });

/**
 * Parse query string for the /freq endpoint.
 */
const parseFreq = (q: qs.ParsedQs) => parseQuestionFilters(q, { limit: true });

/**
 * Parse query string for the /clues endpoint.
 */
const parseClues = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { answer: true, limit: true });

export const parseQueryString = {
  tossups: parseTossups,
  bonuses: parseBonuses,
  freq: parseFreq,
  clues: parseClues,
};
