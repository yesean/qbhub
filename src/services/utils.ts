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

export const getAnswers = (answer: string): string[] => {
  const getCaptureGroups = (matches: IterableIterator<RegExpMatchArray>) => {
    return Array.from(matches).map((e) => e[1]);
  };

  const answerWithoutMetadata = answer
    .replaceAll(/&lt;.*&gt;/g, '')
    .replaceAll(/\(.*\)/g, '');
  const normalizedAnswer = answerWithoutMetadata.trim().toLowerCase();
  const firstAnswerRegex = /(^\w(?:\w|\s|\.|'|"|-)*)(?:\[|$|\()/g;
  const acceptRegex = /(?:\[|(?:;\s))accept\s((?:\w|\s|'|"|-)+)(?:]|;|,)/g;
  const orRegex = /(?:\[|(?:;\s))or\s((?:\w|\s|'|"|-)+)(?:]|;|,)/g;
  const firstAnswer = getCaptureGroups(
    normalizedAnswer.matchAll(firstAnswerRegex)
  );
  const boldedAnswers = getTextBetweenTags(
    'strong',
    normalizedAnswer
  ).map((s) => s.replaceAll(/<em>|<\/em>|<i>|<\/i>/g, ''));
  const acceptAnswers = getCaptureGroups(
    normalizedAnswer.matchAll(acceptRegex)
  );
  const orAnswers = getCaptureGroups(normalizedAnswer.matchAll(orRegex));
  const acceptableAnswers = [
    normalizedAnswer,
    ...firstAnswer,
    ...boldedAnswers,
    ...acceptAnswers,
    ...orAnswers,
  ].map((s) => s.trim().toLowerCase());
  const uniqueAcceptableAnswers = Array.from(new Set(acceptableAnswers));
  return uniqueAcceptableAnswers;
};
