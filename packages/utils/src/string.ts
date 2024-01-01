import nlp from 'compromise';
import { deburr } from 'lodash-es';
import converter from 'number-to-words';

export class QBString {
  private str: string;

  constructor(str: string) {
    this.str = str;
  }

  get() {
    return this.str;
  }

  /**
   * Return the underlying string as space separated words
   * @example 'I am a dog' => ['I', 'am', 'a', 'dog']
   */
  getWords() {
    return this.normalizeWhitespace().get().split(' ');
  }

  /**
   * Same as this.getWords(), declared as static for convenience
   */
  static getWords(str: string) {
    return new QBString(str).getWords();
  }

  apply(fn: (input: string) => string) {
    this.str = fn(this.str);
    return this;
  }

  replacePattern(pattern: RegExp | string, replacement: string) {
    this.str = this.str.replaceAll(pattern, replacement);
    return this;
  }

  removePattern(pattern: RegExp | string) {
    return this.replacePattern(pattern, '');
  }

  replaceTag(tag: string, replacementTag: string) {
    return this.replacePattern(
      `<${tag}>`,
      `<${replacementTag}>`,
    ).replacePattern(`</${tag}>`, `</${replacementTag}>`);
  }

  removeTag(tag: string) {
    return this.replacePattern(`<${tag}>`, '').replacePattern(`</${tag}>`, '');
  }

  removeTags() {
    return this.removePattern(/<.*?>/g) // ASCII angle brackets
      .removePattern(/&lt;.*?&gt;/g); // HTML entity angle brackets
  }

  /**
   * Remove ***most*** non-alphanumeric characters, leaving a few semantically
   * important characters. The non-alphanumeric characters left in are characters
   * commonly used in answerlines.
   */
  removeNonAlphanumeric() {
    return this.removePattern(/[^\w\d\s!?%-+:]/g);
  }

  /**
   * Collapse one or more consecutive whitespace characters into one
   */
  collapseWhitespace() {
    return this.replacePattern(/\s+/g, ' ');
  }

  trim() {
    this.str = this.str.trim();
    return this;
  }

  deburr() {
    this.str = deburr(this.str);
    return this;
  }

  /**
   * Collapse and trim all whitespace
   */
  normalizeWhitespace() {
    return this.collapseWhitespace().trim();
  }

  /**
   * Same as this.normalizeWhitespace(), declared as static for convenience
   */
  static normalizeWhitespace(str: string) {
    return new QBString(str).normalizeWhitespace().get();
  }

  /**
   * Replace all brackets (parenthesis, square brackets) with square brackets
   */
  normalizeBrackets() {
    return this.replacePattern('(', '[').replacePattern(')', ']');
  }

  /**
   * Normalize equivalent markup tags
   * @example <b> -> <strong>
   * @example <i> -> <em>
   */
  normalizeTags() {
    return this.replaceTag('b', 'strong').replaceTag('i', 'em');
  }

  static normalizeTags(str: string) {
    return new QBString(str).normalizeTags().get();
  }

  static isInteger(str: string) {
    return !Number.isNaN(parseInt(str, 10));
  }

  replaceIntegersWithWords() {
    this.str = this.getWords()
      .map((word) =>
        QBString.isInteger(word) ? converter.toWords(word) : word,
      )
      .join(' ');
    return this;
  }
}

/**
 * Cleanup power-related markup in tossups
 */
export function cleanTossupText(text: string): string {
  return new QBString(text)
    .normalizeTags()
    .replacePattern(/(<strong>.*<\/strong>)/g, ' $1 ') // isolate bold section
    .replacePattern(/<\/strong>\s*\(\*\)/g, '(*) </strong>') // place power marking inside of bold section
    .replacePattern('(*)', ' (*) ') // isolate power marking
    .normalizeWhitespace()
    .replacePattern('(*) </strong> )', '(*) </strong>') // fix trailing closing parenthesis (common formatting quirk)
    .normalizeWhitespace()
    .get();
}

/**
 * Returns an array of all text between a tag, supports multiple tag instances
 * @example ('<b>foo bar</b> hello world <b>hot dog </b>', b) -> ['foo bar', 'hot dog ']
 */
export function getTextBetweenTag(text: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'g');
  const matches = text.matchAll(regex);
  return Array.from(matches).map(([_, textBetweenTag]) => textBetweenTag);
}

/**
 * Returns an array of all words between a tag, supports multiple tag instances
 * @example ('<b>foo bar</b> hello world <b>hot dog</b>', b) -> ['foo', 'bar', 'hot', 'dog']
 */
export function getWordsBetweenTag(text: string, tag: string): string[] {
  return getTextBetweenTag(text, tag).map(QBString.getWords).flat();
}

/**
 * @summary Returns an array of strings with full names replaced with only last names
 * @example 'John Doe talked to Mary Jane' -> ['Doe talked to Jane', ...]
 *
 * This function uses multiple methods of stripping first names from the text.
 * The results from all methods are returned together as an array. The results
 * are not perfect as they rely on compromise.js to detect full names, which
 * sometimes misses names especially foreign names.
 */
export function removeFirstNames(s: string): string[] {
  const firstNameReduction = nlp(s);
  firstNameReduction.replace('#FirstName+ #LastName', (name: any) =>
    name.matchOne('#LastName').text(),
  );

  const personReduction = nlp(s);
  personReduction.replace('#Person+', (name: any) =>
    name.match('#Person').out('array').at(-1),
  );

  return [firstNameReduction.text(), personReduction.text()];
}

/**
 * Same as String.prototype.lastIndexOf but with multiple search strings
 * @returns index of the search string closest to the end of the string, -1 if no search string is found
 * @example ('hello world', ['a', 'ld', 'wo']) => 9
 */
export function lastIndexOfMultiple(
  str: string,
  searchStrings: string[],
  position: number = str.length,
): number {
  return Math.max(
    ...searchStrings.map((searchString) =>
      str.lastIndexOf(searchString, position),
    ),
  );
}

/**
 * Return all capture groups from a regex pattern on a string
 */
export function getAllCaptureGroups(str: string, pattern: RegExp): string[] {
  return Array.from(str.matchAll(pattern)).flatMap(
    ([_, ...captureGroups]) => captureGroups,
  );
}
