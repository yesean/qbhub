import { Category, Difficulty, Subcategory, Tournament } from '@qbhub/types';

// primitive type guards
export const isNumber = (value: any): value is number =>
  typeof value === 'number' || value instanceof Number;
export const isString = (value: any): value is string =>
  typeof value === 'string' || value instanceof String;
export const isNumeric = (value: any): value is string | number =>
  !Number.isNaN(value) && !Number.isNaN(parseFloat(value));

// array type guards
export const isNumberArray = (value: any): value is number[] =>
  Array.isArray(value) && value.every(isNumber);
export const isStringArray = (value: any): value is string[] =>
  Array.isArray(value) && value.every(isString);
export const isNumericArray = (value: any): value is (string | number)[] =>
  Array.isArray(value) && value.every(isNumeric);

// question parameter type guards
export const isCategory = (value: any): value is Category =>
  Object.prototype.hasOwnProperty.call(Category, value);
export const isSubcategory = (value: any): value is Subcategory =>
  Object.prototype.hasOwnProperty.call(Subcategory, value);
export const isDifficulty = (value: any): value is Difficulty =>
  Object.prototype.hasOwnProperty.call(Difficulty, value);
export const isTournament = (value: any): value is Tournament =>
  Object.prototype.hasOwnProperty.call(Tournament, value);

export const isCategoryArray = (value: any): value is Category[] =>
  Array.isArray(value) && value.every(isCategory);
export const isSubcategoryArray = (value: any): value is Subcategory[] =>
  Array.isArray(value) && value.every(isSubcategory);
export const isDifficultyArray = (value: any): value is Difficulty[] =>
  Array.isArray(value) && value.every(isDifficulty);
export const isTournamentArray = (value: any): value is Tournament[] =>
  Array.isArray(value) && value.every(isTournament);

// type conversion helpers
export const stringToNumber = (value: string) => parseInt(value, 10);
