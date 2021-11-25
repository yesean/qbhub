import { QuestionFilters } from 'questions';
import {
  parseAnswer,
  parseCategories,
  parseDifficulties,
  parseLimit,
  parseOffset,
  parseSubcategories,
  parseText,
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
  text: parseText(q),
  answer: parseAnswer(q, answer),
  offset: parseOffset(q),
  limit: parseLimit(q, limit),
});

/**
 * Parse query string for the /tossups endpoint.
 */
export const parseTossups = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { limit: true });

/**
 * Parse query string for the /bonuses endpoint.
 */
export const parseBonuses = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { limit: true });

/**
 * Parse query string for the /freq endpoint.
 */
export const parseFreq = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { limit: true });

/**
 * Parse query string for the /clues endpoint.
 */
export const parseClues = (q: qs.ParsedQs) =>
  parseQuestionFilters(q, { answer: true, limit: true });
