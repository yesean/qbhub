import {
  isNumeric,
  isNumericArray,
  isString,
  isStringArray,
  stringToNumber,
} from '../utils/typeGuards';

const fieldMessage = (t: string) => (field: string) =>
  `The query string field '${field}' must be a ${t}.`;
export const fieldNumberMessage = (field: string) =>
  fieldMessage('number')(field);
export const fieldStringMessage = (field: string) =>
  fieldMessage('string')(field);
export const fieldNumberArrayMessage = (field: string) =>
  fieldMessage('number array')(field);

export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParsingError';
  }
}

export const parseTossupQueryString = (q: qs.ParsedQs) => {
  const {
    categories = [],
    subcategories = [],
    difficulties = [],
    text = '',
    answer = '',
    limit,
  } = q;

  // verify categories is a number array
  if (!isStringArray(categories) || !isNumericArray(categories))
    throw new ParsingError(fieldNumberArrayMessage('categories'));

  // verify subcategories is a number array
  if (!isStringArray(subcategories) || !isNumericArray(subcategories))
    throw new ParsingError(fieldNumberArrayMessage('subcategories'));

  // verify difficulties is a number array
  if (!isStringArray(difficulties) || !isNumericArray(difficulties))
    throw new ParsingError(fieldNumberArrayMessage('difficulties'));

  // verify text is string
  if (!isString(text)) throw new ParsingError(fieldStringMessage('text'));

  // verify answer is string
  if (!isString(answer)) throw new ParsingError(fieldStringMessage('answer'));

  // verify limit exists and is number
  if (limit === undefined || !isNumeric(limit))
    throw new ParsingError(fieldNumberMessage('limit'));

  // verify limit is less than or equal to 100 (to reduce server load)
  const parsedLimit = stringToNumber(limit as string);
  if (parsedLimit > 100) {
    throw new ParsingError(
      'The query string field `limit` must less than or equal to 100.',
    );
  }

  return {
    categories: categories.map(stringToNumber),
    subcategories: subcategories.map(stringToNumber),
    difficulties: difficulties.map(stringToNumber),
    text,
    answer,
    limit: parsedLimit,
  };
};

export const parseFreqQueryString = (q: qs.ParsedQs) => {
  const { offset } = q;

  // verify offset exists and is number
  if (offset === undefined || !isNumeric(offset))
    throw new ParsingError(fieldNumberMessage('offset'));

  return {
    ...parseTossupQueryString(q),
    offset: stringToNumber(offset as string),
  };
};
