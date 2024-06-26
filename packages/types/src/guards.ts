import { Bonus } from './bonus.js';
import { Category } from './category.js';
import { Difficulty } from './difficulty.js';
import { Subcategory } from './subcategory.js';
import { Tossup } from './tossup.js';
import { Tournament } from './tournament.js';

// primitive type guards
export const isNumber = (value: any): value is number =>
  typeof value === 'number' || value instanceof Number;
export const isString = (value: any): value is string =>
  typeof value === 'string' || value instanceof String;
export const isNumeric = (value: any): value is number | string =>
  !Number.isNaN(value) && !Number.isNaN(parseFloat(value));

// array type guards
export const isNumberArray = (value: any): value is number[] =>
  Array.isArray(value) && value.every(isNumber);
export const isStringArray = (value: any): value is string[] =>
  Array.isArray(value) && value.every(isString);
export const isNumericArray = (value: any): value is (number | string)[] =>
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

// question type guards
export const isTossup = (question: Bonus | Tossup): question is Tossup =>
  (question as Tossup).normalizedAnswer !== undefined;
export const isBonus = (question: Bonus | Tossup): question is Bonus =>
  (question as Tossup).normalizedAnswer === undefined;

// type conversion helpers
export const stringToNumber = (value: string) => parseInt(value, 10);
