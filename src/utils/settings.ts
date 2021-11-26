import {
  CATEGORIES_LS_KEY,
  DEFAULT_READING_SPEED,
  DIFFICULTIES_LS_KEY,
  READING_SPEED_LS_KEY,
  SUBCATEGORIES_LS_KEY,
} from '../constants';
import { Category, Difficulty, Subcategory } from '../types/questions';

const checkReadingSpeedValid = (speed: number) => {
  return speed >= 0 && speed <= 100 && speed % 5 === 0;
};

export const setInitialReadingSpeed = (speed: number) => {
  window.localStorage.setItem(READING_SPEED_LS_KEY, JSON.stringify(speed));
};

export const setInitialCategories = (categories: Category[]) => {
  window.localStorage.setItem(CATEGORIES_LS_KEY, JSON.stringify(categories));
};

export const setInitialSubcategories = (subcategories: Subcategory[]) => {
  window.localStorage.setItem(
    SUBCATEGORIES_LS_KEY,
    JSON.stringify(subcategories),
  );
};

export const setInitialDifficulties = (difficulties: Difficulty[]) => {
  window.localStorage.setItem(
    DIFFICULTIES_LS_KEY,
    JSON.stringify(difficulties),
  );
};

export const getInitialReadingSpeed = () => {
  const speed = window.localStorage.getItem(READING_SPEED_LS_KEY);
  const parsedSpeed = Number(speed);
  if (
    speed === null ||
    Number.isNaN(parsedSpeed) ||
    !checkReadingSpeedValid(parsedSpeed)
  ) {
    setInitialReadingSpeed(DEFAULT_READING_SPEED);
    return DEFAULT_READING_SPEED;
  }
  return parsedSpeed;
};

export const getInitialCategories = () => {
  const defaultCategories = [Category.Science];
  const categories = window.localStorage.getItem(CATEGORIES_LS_KEY);
  if (categories === null) {
    setInitialCategories(defaultCategories);
    return defaultCategories;
  }
  return JSON.parse(categories) as Category[];
};

export const getInitialSubcategories = () => {
  const defaultSubcategories = [Subcategory['Science Computer Science']];
  const subcategories = window.localStorage.getItem(SUBCATEGORIES_LS_KEY);
  if (subcategories === null) {
    setInitialSubcategories(defaultSubcategories);
    return defaultSubcategories;
  }
  return JSON.parse(subcategories) as Subcategory[];
};

export const getInitialDifficulties = () => {
  const defaultDifficulties = [
    Difficulty['Easy College'],
    Difficulty['Regular College'],
  ];
  const difficulties = window.localStorage.getItem(DIFFICULTIES_LS_KEY);
  if (difficulties === null) {
    setInitialDifficulties(defaultDifficulties);
    return defaultDifficulties;
  }
  return JSON.parse(difficulties) as Difficulty[];
};

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
