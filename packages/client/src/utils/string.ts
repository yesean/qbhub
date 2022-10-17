import nlp from 'compromise/two';
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
export const normalizeTags = (s: string) =>
  s
    .replaceAll(/<b>/g, '<strong>')
    .replaceAll(/<\/b>/g, '</strong>')
    .replaceAll(/<i>/g, '<em>')
    .replaceAll(/<\/i>/g, '</em>');

/**
 * Normalize tags and adjust spacing for power marking.
 */
export const cleanTossupText = (text: string) =>
  normalizeSpacing(
    normalizeTags(text)
      .replaceAll(/([^\s])(<strong>)/g, '$1 $2')
      .replaceAll(/(<\/strong>)([^\s])/g, '$1 $2')
      .replaceAll(/<\/strong>\s*\(\*\)/g, '(*) </strong>')
      .replaceAll(/\(\*\)/g, ' (*) ')
      .replaceAll(/\(\*\)\s<\/strong>\)/g, '(*) </strong>'),
  );

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
 * Split string words.
 * e.g. hello it's me => [hello, it's, me]
 */
export const getWords = (s: string) => normalizeSpacing(s).split(' ');

/**
 * Get text between opening and closing tags.
 * e.g. <foo>bar hello</foo> <bar>world</bar> => [bar hello, world]
 */
export const getTextBetweenTags = (text: string, t: string) =>
  getCaptureGroups(text, betweenTags(t)).map(normalizeSpacing);

/**
 * Get words between opening and closing tags.
 * e.g. <foo>bar hello world</foo> => [bar, hello, world]
 */
export const getWordsBetweenTags = (text: string, t: string) =>
  getWords(getTextBetweenTags(text, t).join(' '));

/**
 * Remove first names from full names.
 * e.g. Michael Jordan went to Larry Bird's house => Jordan went to Bird's house
 */
export const removeFirstNames = (s: string) => {
  const firstNameReduction = nlp(s)
    .replace('#FirstName+ #LastName', (name: any) =>
      name.matchOne('#LastName').text(),
    )
    .text();
  const personReduction = nlp(s)
    .replace('#Person+', (name: any) =>
      name.match('#Person').out('array').at(-1),
    )
    .text();
  return [firstNameReduction, personReduction];
};

/**
 * Similar to String.prototype.lastIndexOf but accepts multiple values, stopping
 * the search when any of the values are found. Returns -1 if no values are found.
 */
export const multipleLastIndexOf = (
  s: string,
  values: string[] | Set<string>,
  fromIndex = s.length,
) => {
  values = new Set(values);
  for (let i = fromIndex; i >= 0; i -= 1) {
    const ch = s[i];
    if (values.has(ch)) return i;
  }
  return -1;
};
