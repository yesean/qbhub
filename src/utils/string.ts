import nlp from 'compromise';
import DOMPurify from 'dompurify';
import { toWords } from 'number-to-words';
import ReactHTMLParser from 'react-html-parser';
import { getRand } from './number';
import { betweenTags, getCaptureGroups, removeExtraSpaces } from './regex';

/**
 * Shuffle a string using Fischer-Yates shuffle.
 */
export const shuffle = (s: string) => {
  const chars = s.split('');
  const shuffled = [];
  while (shuffled.length < s.length) {
    const randomIndex = getRand(chars.length);
    const [removedChar] = chars.splice(randomIndex, 1);
    shuffled.push(removedChar);
  }
  return shuffled.join('');
};

/**
 * Squeeze multiple spaces and trim string.
 */
export const normalizeSpacing = (s: string) => removeExtraSpaces(s).trim();

/**
 * Normalize equivalent markup tags.
 */
export const normalizeTags = (s: string) => {
  return s
    .replaceAll(/<b>/g, '<strong>')
    .replaceAll(/<\/b>/g, '</strong>')
    .replaceAll(/<i>/g, '<em>')
    .replaceAll(/<\/i>/g, '</em>');
};

/**
 * Normalize tags and adjust spacing for power marking.
 */
export const cleanTossupText = (text: string) => {
  return normalizeSpacing(
    normalizeTags(text)
      .replaceAll(/<\/strong>\s*\(\*\)/g, '(*) </strong>')
      .replaceAll(/\(\*\)/g, ' (*) ')
      .replaceAll(/\(\*\)\s<\/strong>\)/g, '(*) </strong>'),
  );
};

/**
 * Sanitize and parse string into JSX.
 */
export const parseHTMLString = (s: string) =>
  ReactHTMLParser(DOMPurify.sanitize(s));

/**
 * Check if string is numeric.
 */
export const isNumeric = (s: string) => /^-?\d+$/.test(s);

/**
 * Convert number to words.
 * e.g. '1 dog' => 'one dog'
 */
export const convertNumberToWords = (s: string) =>
  s
    .split(' ')
    .map((w) => (isNumeric(w) ? toWords(w) : w))
    .join(' ');

/**
 * Get text between opening and closing tags.
 * e.g. <foo>bar hello world</foo> => bar hello world
 */
export const getTextBetweenTags = (text: string, t: string, lazy = true) =>
  getCaptureGroups(text, betweenTags(t, lazy));

/**
 * Get words between opening and closing tags.
 * e.g. <foo>bar hello world</foo> => [bar, hello, world]
 */
export const getWordsBetweenTags = (text: string, t: string, lazy = true) =>
  normalizeSpacing(getTextBetweenTags(text, t, lazy).join(' ')).split(' ');

/**
 * Remove first names from full names.
 * e.g. Michael Jordan went to Larry Bird's house -> Jordan went to Bird's house
 */
export const removeFirstNames = (s: string) =>
  nlp(s)
    .replace('[#FirstName+] #LastName', (name: any) =>
      name.match('#LastName')[0].text(),
    )
    .text();
