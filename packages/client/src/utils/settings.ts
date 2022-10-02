import {
  Category,
  Difficulty,
  Subcategory,
  Tournament,
} from '../types/questions';
import {
  CATEGORIES_LS_KEY,
  DEFAULT_READING_SPEED,
  DIFFICULTIES_LS_KEY,
  FROM_YEAR_LS_KEY,
  MAX_TOURNAMENT_YEAR,
  MIN_TOURNAMENT_YEAR,
  READING_SPEED_LS_KEY,
  SUBCATEGORIES_LS_KEY,
  TOURNAMENTS_LS_KEY,
} from './constants';

const save = (key: string, data: any) =>
  window.localStorage.setItem(key, JSON.stringify(data));

export const saveReadingSpeed = (speed: number) =>
  save(READING_SPEED_LS_KEY, speed);

export const saveCategories = (categories: Category[]) =>
  save(CATEGORIES_LS_KEY, categories);

export const saveSubcategories = (subcategories: Subcategory[]) =>
  save(SUBCATEGORIES_LS_KEY, subcategories);

export const saveDifficulties = (difficulties: Difficulty[]) =>
  save(DIFFICULTIES_LS_KEY, difficulties);

export const saveTournaments = (tournaments: Tournament[]) =>
  save(TOURNAMENTS_LS_KEY, tournaments);

export const saveFromYear = (from: number) => save(FROM_YEAR_LS_KEY, from);

const restore = (key: string) => window.localStorage.getItem(key);

const validateReadingSpeed = (speed: number) =>
  speed >= 0 && speed <= 100 && speed % 5 === 0;

export const restoreReadingSpeed = () => {
  const speed = restore(READING_SPEED_LS_KEY);
  const parsedSpeed = Number(speed);

  const isInvalid =
    speed === null ||
    Number.isNaN(parsedSpeed) ||
    !validateReadingSpeed(parsedSpeed);
  if (isInvalid) {
    saveReadingSpeed(DEFAULT_READING_SPEED);
    return DEFAULT_READING_SPEED;
  }

  return parsedSpeed;
};

export const restoreCategories = () => {
  const categories = restore(CATEGORIES_LS_KEY);

  if (categories === null) {
    saveCategories([]);
    return [];
  }
  return JSON.parse(categories) as Category[];
};

export const restoreSubcategories = () => {
  const subcategories = restore(SUBCATEGORIES_LS_KEY);

  if (subcategories === null) {
    saveSubcategories([]);
    return [];
  }
  return JSON.parse(subcategories) as Subcategory[];
};

export const restoreDifficulties = () => {
  const difficulties = restore(DIFFICULTIES_LS_KEY);

  if (difficulties === null) {
    saveDifficulties([]);
    return [];
  }
  return JSON.parse(difficulties) as Difficulty[];
};

export const restoreTournaments = () => {
  const tournaments = restore(TOURNAMENTS_LS_KEY);

  if (tournaments === null) {
    saveTournaments([]);
    return [];
  }
  return JSON.parse(tournaments) as Tournament[];
};

export const validateFromYear = (year: number) =>
  year >= MIN_TOURNAMENT_YEAR && year <= MAX_TOURNAMENT_YEAR;

export const restoreFromYear = () => {
  const year = restore(FROM_YEAR_LS_KEY);
  const parsedYear = Number(year);

  const isInvalid =
    year === null || Number.isNaN(parsedYear) || !validateFromYear(parsedYear);
  if (isInvalid) {
    saveFromYear(MIN_TOURNAMENT_YEAR);
    return MIN_TOURNAMENT_YEAR;
  }

  return parsedYear;
};

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
