import {
  isCategoryArray,
  isDifficultyArray,
  isNumber,
  isSubcategoryArray,
  isTournamentArray,
} from '@qbhub/types';
import { restore, save } from '../storage';
import { FromYear, ReadingSpeed, Settings } from './types';
import { isFromYearValid, isReadingSpeedValid } from './validate';

const KEYS = {
  categories: 'categories',
  subcategories: 'subcategories',
  difficulties: 'difficulties',
  tournaments: 'tournaments',
  readingSpeed: 'readingSpeed',
  fromYear: 'fromYear',
};

export const saveSettings = (settings: Partial<Settings>) => {
  save(KEYS.categories, settings.categories);
  save(KEYS.subcategories, settings.subcategories);
  save(KEYS.difficulties, settings.difficulties);
  save(KEYS.tournaments, settings.tournaments);

  if (settings.readingSpeed !== undefined)
    save(KEYS.readingSpeed, settings.readingSpeed);

  if (settings.fromYear !== undefined) save(KEYS.fromYear, settings.fromYear);
};

export const restoreSettings = (): Partial<Settings> => {
  const categories = restore(KEYS.categories, isCategoryArray);
  const subcategories = restore(KEYS.subcategories, isSubcategoryArray);
  const difficulties = restore(KEYS.difficulties, isDifficultyArray);
  const tournaments = restore(KEYS.tournaments, isTournamentArray);
  const fromYear = restore(
    KEYS.fromYear,
    (value): value is FromYear => isNumber(value) && isFromYearValid(value),
  );
  const readingSpeed = restore(
    KEYS.readingSpeed,
    (value): value is ReadingSpeed =>
      isNumber(value) && isReadingSpeedValid(value),
  );

  return {
    categories,
    subcategories,
    difficulties,
    tournaments,
    fromYear,
    readingSpeed,
  };
};
