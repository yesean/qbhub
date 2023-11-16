import { Category, Difficulty, Question, Subcategory } from '@qbhub/types';
import { isEmpty, isNotNullOrEmpty } from '../array';
import { SUBCATEGORY_MAP } from '../constants';
import { MAX_TOURNAMENT_YEAR, MIN_TOURNAMENT_YEAR } from './constants';
import { FromYear, ReadingSpeed, Settings } from './types';

// check if settings matches default values
export const isSettingsDefault = (settings: Settings) =>
  isEmpty(settings.categories) &&
  isEmpty(settings.subcategories) &&
  isEmpty(settings.difficulties) &&
  isEmpty(settings.tournaments) &&
  settings.readingSpeed === undefined &&
  settings.fromYear === undefined;

// check if question passes settings filters
export const isQuestionValid = (
  question: Question,
  settings: Partial<Settings>,
) => {
  if (
    isNotNullOrEmpty(settings.categories) &&
    !settings.categories.includes(question.category)
  )
    return false;

  if (
    isNotNullOrEmpty(settings.subcategories) &&
    (question.subcategory == null ||
      !settings.subcategories.includes(question.subcategory))
  )
    return false;

  if (
    isNotNullOrEmpty(settings.difficulties) &&
    !settings.difficulties.includes(question.difficulty)
  )
    return false;

  if (
    isNotNullOrEmpty(settings.tournaments) &&
    !settings.tournaments.includes(question.tournament)
  )
    return false;

  if (settings.fromYear != null && settings.fromYear > question.year)
    return false;

  return true;
};

// check if tournament passes settings filters
type TournamentInfo = { difficulty: Difficulty; year: number };
export const isTournamentValid = (
  { difficulty, year }: TournamentInfo,
  { difficulties, fromYear }: Settings,
) => {
  const isWithinDifficulties =
    isEmpty(difficulties) || difficulties.includes(difficulty);
  const isAboveFromYear = fromYear === undefined || year >= fromYear;
  return isWithinDifficulties && isAboveFromYear;
};

export const isReadingSpeedValid = (s: number): s is ReadingSpeed =>
  s >= 0 && s <= 100 && s % 5 === 0;

export const isFromYearValid = (year: number): year is FromYear =>
  year >= MIN_TOURNAMENT_YEAR && year <= MAX_TOURNAMENT_YEAR;

// when a new subcategory is added, remove the parent category (if present) since we want a narrower type
// return updated list of categories
export const getUpdatedCategoriesFromSubcategories = (
  categories: Category[],
  newSubcategories: Subcategory[],
) => {
  if (newSubcategories === undefined) return categories;

  const invalidCategories = newSubcategories.map(
    (sub) => SUBCATEGORY_MAP[sub].category,
  );
  return categories.filter((cat) => !invalidCategories.includes(cat));
};

// when a new category is added, remove any child subcategories (if present) since we want a wider type
// return updated list of subcategories
export const getUpdatedSubcategoriesFromCategories = (
  subcategories: Subcategory[],
  newCategories: Category[],
) => {
  if (newCategories === undefined) return subcategories;

  return subcategories.filter(
    (sub) => !newCategories.includes(SUBCATEGORY_MAP[sub].category),
  );
};
