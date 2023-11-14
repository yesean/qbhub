import {
  Category,
  Difficulty,
  Question,
  Subcategory,
  Tournament,
} from '@qbhub/types';
import { isNotNullOrEmpty, isNullOrEmpty } from './array';
import {
  DEFAULT_READING_SPEED,
  localStorageKeys as keys,
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
} from './constants';
import { buildRestore, buildSave } from './storage';

export const saveReadingSpeed = buildSave<number>(keys.READING_SPEED);
export const saveCategories = buildSave<Category[]>(keys.CATEGORIES);
export const saveSubcategories = buildSave<Subcategory[]>(keys.SUBCATEGORIES);
export const saveDifficulties = buildSave<Difficulty[]>(keys.DIFFICULTIES);
export const saveTournaments = buildSave<Tournament[]>(keys.TOURNAMENTS);
export const saveFromYear = buildSave<number>(keys.FROM_YEAR);

export type Settings = {
  readingSpeed: number | undefined;
  categories: Category[] | undefined;
  subcategories: Subcategory[] | undefined;
  difficulties: Difficulty[] | undefined;
  tournaments: Tournament[] | undefined;
  fromYear: number | undefined;
};

export const saveSettings = (settings: Partial<Settings>) => {
  if (settings.readingSpeed != null) {
    saveReadingSpeed(settings.readingSpeed);
  }
  if (settings.categories != null) {
    saveCategories(settings.categories);
  }
  if (settings.subcategories != null) {
    saveSubcategories(settings.subcategories);
  }
  if (settings.difficulties != null) {
    saveDifficulties(settings.difficulties);
  }
  if (settings.tournaments != null) {
    saveTournaments(settings.tournaments);
  }
  if (settings.fromYear != null) {
    saveFromYear(settings.fromYear);
  }
};

const validateReadingSpeed = (s: number) => s >= 0 && s <= 100 && s % 5 === 0;
export const validateFromYear = (year: number) =>
  year >= MIN_TOURNAMENT_YEAR && year <= MAX_TOURNAMENT_YEAR;

export const restoreCategories = buildRestore<Category[]>(keys.CATEGORIES, []);
export const restoreSubcategories = buildRestore<Subcategory[]>(
  keys.SUBCATEGORIES,
  [],
);
export const restoreDifficulties = buildRestore<Difficulty[]>(
  keys.DIFFICULTIES,
  [],
);
export const restoreTournaments = buildRestore<Tournament[]>(
  keys.TOURNAMENTS,
  [],
);
export const restoreReadingSpeed = buildRestore<number>(
  keys.READING_SPEED,
  DEFAULT_READING_SPEED,
  (d: string) => !Number.isNaN(Number(d)) && validateReadingSpeed(Number(d)),
);
export const restoreFromYear = buildRestore<number>(
  keys.FROM_YEAR,
  MIN_TOURNAMENT_YEAR,
  (d: string) => !Number.isNaN(Number(d)) && validateFromYear(Number(d)),
);

/**
 * Convert speed from percentage into a timeout delay.
 */
export const getReadingTimeoutDelay = (speed: number) => {
  // these number seem like a reasonable range
  const SLOWEST_DELAY = 500;
  const FASTEST_DELAY = 25;
  const DELAY_RANGE = SLOWEST_DELAY - FASTEST_DELAY;
  const scaledSpeed = 10 * Math.sqrt(speed); // skew speed towards faster end, common reading speed will probably in the faster end
  // speed is a number between 0 - 100, however, a higher speed means a lower delay
  // we also don't want delay to be 0, which is too fast
  return SLOWEST_DELAY - DELAY_RANGE * (scaledSpeed / 100);
};
