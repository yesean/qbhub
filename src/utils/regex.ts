export const nonAlphanumeric = /[^\w\d\s]/g;
export const anyTag = /<.*?>/g;
export const betweenTags = (t: string, lazy = true) =>
  new RegExp(`<${t}>(.*${lazy ? '?' : ''})</${t}>`, 'g');
export const betweenParentheses = /\(.*?\)/g;
export const duplicateSpace = /\s\s+/g;
export const ltgt = /&lt;.*?&gt;/g;
export const quotes = /["'\u2018\u2019\u201C\u201D]/g;

/**
 * Get all regex capture groups from a string. Assumes only one capture group per
 * match.
 */
export const getCaptureGroups = (s: string, r: RegExp) => {
  return Array.from(s.matchAll(r)).map((m) => m[1]);
};

/**
 * Remove regex match from string.
 */
export const remove = (s: string, r: RegExp) => s.replaceAll(r, '');

/**
 * Remove all tags from string.
 */
export const removeTags = (s: string) => remove(s, anyTag);

/**
 * Squeeze multiple spaces into one space.
 */
export const removeExtraSpaces = (s: string) => s.replaceAll(/\s\s+/g, ' ');

/**
 * Remove non-alphanumeric characters.
 */
export const removeNonAlphanumeric = (s: string) => remove(s, nonAlphanumeric);
