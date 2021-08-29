import ss from 'string-similarity';
import DOMPurify from 'dompurify';
import ReactHTMLParser from 'react-html-parser';
import logger from './logger';

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
    'g'
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
      .replaceAll(/\(\*\)/g, ' (*) ')
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
