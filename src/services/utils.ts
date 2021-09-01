import ss from 'string-similarity';
import DOMPurify from 'dompurify';
import ReactHTMLParser from 'react-html-parser';
import logger from './logger';
import { Category, Difficulty, Subcategory } from '../types';
import {
  CATEGORIES_LS_KEY,
  DEFAULT_READING_SPEED,
  DIFFICULTIES_LS_KEY,
  READING_SPEED_LS_KEY,
  SUBCATEGORIES_LS_KEY,
} from '../constants';

export const checkAnswer = (answer: string, correctAnswers: string[]) => {
  const minRating = 0.6;
  const ratings = ss.findBestMatch(answer, correctAnswers);
  logger.info('answer ratings: ', ratings);
  return ratings.bestMatch.rating > minRating;
};

export const parseHTMLString = (s: string) =>
  ReactHTMLParser(DOMPurify.sanitize(s));

export const addShortcut = (key: string, callback: () => void) => {
  const listener = (e: KeyboardEvent) => {
    if (e.key === key) callback();
  };
  window.addEventListener('keydown', listener);
  return () => window.removeEventListener('keydown', listener);
};

export const removeExtraSpaces = (s: string) => {
  return s.replaceAll(/\s\s+/g, ' ').trim();
};

export const getTextBetweenTags = (tag: string, text: string) => {
  const regex = new RegExp(
    /* eslint no-useless-escape: "off" */
    `<${tag}>(.*?)<\/${tag}>`,
    'g',
  );
  return Array.from(text.matchAll(regex)).map((t) => t[1]);
};

export const checkIfTagEnclosed = (tag: string, text: string, word: string) => {
  return getTextBetweenTags(tag, text).join(' ')?.includes(word);
};

export const getRand = (n: number) => Math.floor(Math.random() * n);

export const shuffleString = (s: string) => {
  const chars = s.split('');
  const shuffled = [];
  while (shuffled.length < s.length) {
    const randomIndex = getRand(chars.length);
    const [removedChar] = chars.splice(randomIndex, 1);
    shuffled.push(removedChar);
  }
  return shuffled.join('');
};

export const cleanTossupText = (text: string) => {
  return removeExtraSpaces(
    text
      .replaceAll(/<\/strong>\s*\(\*\)/g, '(*) </strong>')
      .replaceAll(/\(\*\)/g, ' (*) '),
  );
};

const getCaptureGroups = (s: string, r: RegExp) => {
  return Array.from(s.matchAll(r)).map((m) => m[1]);
};

export const getAnswers = (answer: string): string[] => {
  const normalizedAnswer = answer
    .replaceAll(/&lt;.*&gt;/g, '') // remove metadata
    .replaceAll(/\(.*?\)/g, '') // remove parenthesized stuff
    .replaceAll(/<u>|<\/u>|<em>|<\/em>/g, '') // remove underline tags
    .trim()
    .toLowerCase();

  const regexes = [
    /(.*)/g, // entire answer
    /(.*)\[/g, // first answer up to '['
    /(?:\[|\s)accept\s(.*?)\s(?=or\s)/g, // 'accept' to 'or'
    /(?:\[|\s)accept\s(.*?)\s(?=until\s)/g, // 'accept' to 'until'
    /(?:\[|\s)accept\s(.*?)\s(?=before\s)/g, // 'accept' to 'before'
    /(?:\[|\s)accept\s(.*?)(?:\,|\;|\])/g, // 'accept' to ',' | ';' | ']'
    /(?:\s|\,|\;|\[)or\s(.*?)(?=or\s)/g, // 'or' to 'or'
    /(?:\s|\,|\;|\[)or\s(.*?)(?=until\s)/g, // 'or' to 'until'
    /(?:\s|\,|\;|\[)or\s(.*?)(?=before\s)/g, // 'or' to 'before'
    /(?:\s|\,|\;|\[)or\s(.*?)(?:\,|\;|\])/g, // 'or' to ',' | ';' | ']'
    /<strong>(.*?)<\/strong>/g, // text between <strong> tags
    /<b>(.*?)<\/b>/g, // text between <b> tags
  ];

  const answers = regexes
    .flatMap((r) => {
      const matches = getCaptureGroups(normalizedAnswer, r);
      return matches.map((m) => m.replaceAll(/<.*?>|\;/g, '').trim());
    })
    .filter(Boolean);

  return Array.from(new Set(answers));
};

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
  const speed = Number(window.localStorage.getItem(READING_SPEED_LS_KEY));
  if (Number.isNaN(speed) || !checkReadingSpeedValid(speed)) {
    setInitialReadingSpeed(DEFAULT_READING_SPEED);
    return DEFAULT_READING_SPEED;
  }
  return speed;
};

export const getInitialCategories = () => {
  const defaultCategories = [Category.Science, Category.Literature];
  const categories = window.localStorage.getItem(CATEGORIES_LS_KEY);
  if (categories === null) {
    setInitialCategories(defaultCategories);
    return defaultCategories;
  }
  return JSON.parse(categories);
};

export const getInitialSubcategories = () => {
  const defaultSubcategories = [Subcategory['Science Computer Science']];
  const subcategories = window.localStorage.getItem(SUBCATEGORIES_LS_KEY);
  if (subcategories === null) {
    setInitialSubcategories(defaultSubcategories);
    return defaultSubcategories;
  }
  return JSON.parse(subcategories);
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
  return JSON.parse(difficulties);
};

export const getReadingTimeoutDelay = (speed: number) => {
  // these number seem like a reasonable range
  const SLOWEST_DELAY = 750;
  const FASTEST_DELAY = 25;
  // speed is a number between 0 - 100, however, a higher speed means a lower delay
  // we also don't want delay to be 0, which is too fast
  return SLOWEST_DELAY - (speed / 100) * (SLOWEST_DELAY - FASTEST_DELAY);
};
