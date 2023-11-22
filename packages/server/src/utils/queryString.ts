import {
  Category,
  Difficulty,
  isCategoryArray,
  isDifficultyArray,
  isNumeric,
  isNumericArray,
  isString,
  isStringArray,
  isSubcategoryArray,
  isTournamentArray,
  SortOption,
  stringToNumber,
  Subcategory,
  Tournament,
} from '@qbhub/types';
import { QueryStringParsingError } from '../types/errors.js';
import {
  MAX_LIMIT,
  MAX_TOURNAMENT_YEAR,
  MIN_LIMIT,
  MIN_TOURNAMENT_YEAR,
} from './constants.js';

/**
 * Helper functions for creating error messages.
 */
const requiredMessage = (field: string) =>
  `The query string field '${field}' is required.`;
const typeErrorMessage = (field: string, T: string) =>
  `The query string field '${field}' must be of type '${T}'.`;
const noEmptyStringMessage = (field: string) =>
  `The query string field '${field}' cannot be an empty string.`;
const rangeErrorMessage = (field: string, low: number, high?: number) =>
  high !== undefined
    ? `The query string field '${field}' must be between ${low} and ${high}.`
    : `The query string field '${field}' must be greater than or equal to ${low}.`;

/**
 * Parses a number array from a query string field.
 */
export const parseNumericArray = (field: any, name: string) => {
  if (field === undefined) return [];

  if (!isStringArray(field))
    throw new QueryStringParsingError(typeErrorMessage(name, 'array'));

  if (!isNumericArray(field))
    throw new QueryStringParsingError(typeErrorMessage(name, 'number[].'));

  return field.map(stringToNumber);
};

/**
 * Parses the `categories` query string field.
 */
export const parseCategories = (q: qs.ParsedQs): Category[] => {
  const categories = parseNumericArray(q.categories, 'categories');

  if (!isCategoryArray(categories))
    throw new QueryStringParsingError(
      typeErrorMessage('categories', 'Category[]'),
    );

  return categories;
};

/**
 * Parses the `subcategories` query string field.
 */
export const parseSubcategories = (q: qs.ParsedQs): Subcategory[] => {
  const subcategories = parseNumericArray(q.subcategories, 'subcategories');

  if (!isSubcategoryArray(subcategories))
    throw new QueryStringParsingError(
      typeErrorMessage('subcategories', 'Subcategory[]'),
    );

  return subcategories;
};

/**
 * Parses the `difficulties` query string field.
 */
export const parseDifficulties = (q: qs.ParsedQs): Difficulty[] => {
  const difficulties = parseNumericArray(q.difficulties, 'difficulties');

  if (!isDifficultyArray(difficulties))
    throw new QueryStringParsingError(
      typeErrorMessage('difficulties', 'Difficulty[]'),
    );

  return difficulties;
};

/**
 * Parses the `tournaments` query string field.
 */
export const parseTournaments = (q: qs.ParsedQs): Tournament[] => {
  const tournaments = parseNumericArray(q.tournaments, 'tournaments');

  if (!isTournamentArray(tournaments))
    throw new QueryStringParsingError(
      typeErrorMessage('tournaments', 'Tournament[]'),
    );

  return tournaments;
};

/**
 * Parses the `text` query string field.
 */
export const parseText = (q: qs.ParsedQs): string => {
  const { text } = q;

  if (text === undefined) return '';

  if (!isString(text))
    throw new QueryStringParsingError(typeErrorMessage('text', 'string'));

  return text;
};

/**
 * Parses the `answer` query string field.
 */
export const parseAnswer = (q: qs.ParsedQs, required = false): string => {
  const { answer } = q;

  if (answer === undefined)
    if (required) throw new QueryStringParsingError(requiredMessage('answer'));
    else return '';

  if (!isString(answer))
    throw new QueryStringParsingError(typeErrorMessage('answer', 'string'));

  if (answer.length === 0)
    throw new QueryStringParsingError(noEmptyStringMessage('answer'));

  return answer;
};

/**
 * Parses the `sort` query string field.
 */
export const parseSort = (q: qs.ParsedQs): SortOption => {
  const { sort } = q;

  if (sort === undefined) return SortOption.random;

  if (!isString(sort))
    throw new QueryStringParsingError(typeErrorMessage('sort', 'string'));

  if (!Object.values<string>(SortOption).includes(sort))
    throw new QueryStringParsingError(
      typeErrorMessage('sort', 'random | latest | earliest'),
    );

  return sort as SortOption;
};

/**
 * Parses the `from` query string field.
 */
export const parseFrom = (q: qs.ParsedQs): number => {
  const { from } = q;

  if (from === undefined) return MIN_TOURNAMENT_YEAR;

  if (!isNumeric(from))
    throw new QueryStringParsingError(typeErrorMessage('from', 'number'));

  const castedFrom = stringToNumber(from);

  if (castedFrom < MIN_TOURNAMENT_YEAR || castedFrom > MAX_TOURNAMENT_YEAR)
    throw new QueryStringParsingError(
      rangeErrorMessage('from', MIN_TOURNAMENT_YEAR, MAX_TOURNAMENT_YEAR),
    );

  return castedFrom;
};

/**
 * Parses the `until` query string field.
 */
export const parseUntil = (q: qs.ParsedQs): number => {
  const { until } = q;

  if (until === undefined) return MAX_TOURNAMENT_YEAR;

  if (!isNumeric(until))
    throw new QueryStringParsingError(typeErrorMessage('until', 'number'));

  const castedUntil = stringToNumber(until);

  if (castedUntil < MIN_TOURNAMENT_YEAR || castedUntil > MAX_TOURNAMENT_YEAR)
    throw new QueryStringParsingError(
      rangeErrorMessage('until', MIN_TOURNAMENT_YEAR, MAX_TOURNAMENT_YEAR),
    );

  return castedUntil;
};

/**
 * Parses the `offset` query string field.
 */
export const parseOffset = (q: qs.ParsedQs): number => {
  const { offset } = q;

  if (offset === undefined) return 0;

  if (!isNumeric(offset))
    throw new QueryStringParsingError(typeErrorMessage('offset', 'number'));

  const castedOffset = stringToNumber(offset);

  if (castedOffset < 0)
    throw new QueryStringParsingError(rangeErrorMessage('offset', 0));

  return castedOffset;
};

/**
 * Parses the `limit` query string field.
 */
export const parseLimit = (q: qs.ParsedQs, required = false): number => {
  const { limit } = q;

  if (limit === undefined)
    if (required) throw new QueryStringParsingError(requiredMessage('limit'));
    else return -1;

  if (!isNumeric(limit))
    throw new QueryStringParsingError(typeErrorMessage('limit', 'number'));

  const castedLimit = stringToNumber(limit);

  if (castedLimit < MIN_LIMIT || castedLimit > MAX_LIMIT)
    throw new QueryStringParsingError(
      rangeErrorMessage('limit', MIN_LIMIT, MAX_LIMIT),
    );

  return castedLimit;
};
