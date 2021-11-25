import { Category, Difficulty, Subcategory } from 'questions';
import { QueryStringParsingError } from '../types/errors';
import {
  isCategoryArray,
  isDifficultyArray,
  isNumeric,
  isNumericArray,
  isString,
  isStringArray,
  isSubcategoryArray,
  stringToNumber,
} from './types';

/**
 * Helper functions for creating error messages.
 */
const requiredMessage = (field: string) =>
  `The query string field '${field}' is required.`;
const typeErrorMessage = (field: string, T: string) =>
  `The query string field '${field}' must be a ${T}.`;
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

  if (castedLimit < 0 || castedLimit > 100)
    throw new QueryStringParsingError(rangeErrorMessage('limit', 0, 100));

  return castedLimit;
};
