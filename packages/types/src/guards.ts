import { Category } from './category';
import { Difficulty } from './difficulty';
import { Subcategory } from './subcategory';
import { Tournament } from './tournament';

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

export const buildIsEnum =
  <T extends { [key: string]: unknown }>(e: T) =>
  (value: unknown): value is T[keyof T] =>
    Object.values(e).includes(value as T[keyof T]);

// question parameter type guards
export const isCategory = buildIsEnum(Category);
export const isSubcategory = buildIsEnum(Subcategory);
export const isDifficulty = buildIsEnum(Difficulty);
export const isTournament = buildIsEnum(Tournament);

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