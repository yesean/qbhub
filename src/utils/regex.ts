export const nonAlphaNumeric = /[^\w\d\s]/g;
export const anyTag = /<.*?>/g;
export const tag = (t: string) => new RegExp(`<${t}>|</${t}>`, 'g');
export const betweenTags = (t: string) => new RegExp(`<${t}>(.*?)</${t}>`, 'g');
export const betweenParentheses = /\(.*?\)/g;
export const duplicateSpace = /\s\s+/g;
export const ltgt = /&lt;.*?&gt;/g;
export const quotes = /["'\u2018\u2019\u201C\u201D]/g;

/**
 * Get all regex capture groups from a string. Assumes only capture group per
 * match.
 */
export const getCaptureGroups = (s: string, r: RegExp) => {
  return Array.from(s.matchAll(r)).map((m) => m[1]);
};

/**
 * Remove regex match from string.
 */
export const remove = (s: string, r: RegExp) => s.replaceAll(r, '');
