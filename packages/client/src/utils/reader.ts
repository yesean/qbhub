import {
  Bonus,
  BonusPart,
  BonusPartResult,
  BonusResult,
  BonusScore,
  FormattedWord,
  TossupScore,
} from '@qbhub/types';
import {
  QBString,
  getAllCaptureGroups,
  getTextBetweenTag,
  getUniqueItems,
  getWordsBetweenTag,
  isEmpty,
  lastIndexOfMultiple,
  log,
  removeFirstNames,
} from '@qbhub/utils';
import DOMPurify from 'isomorphic-dompurify';
import ReactHTMLParser from 'react-html-parser';
import { findBestMatch } from 'string-similarity';

/**
 * Sanitize and parse string into JSX
 */
export const parseHTMLString = (s: string) =>
  ReactHTMLParser(DOMPurify.sanitize(s));

/**
 * Get words from string with formatting information, using tags
 * e.g. I <strong>love</strong> dogs => [I, love, dogs]
 */
export const getFormattedWords = (text: string): FormattedWord[] => {
  const boldWords = getWordsBetweenTag(text, 'strong');
  const words = new QBString(text).removeTag('strong').getWords();

  let boldWordIndex = 0;
  const formattedWords = words.map((word) => {
    if (boldWordIndex < boldWords.length && word === boldWords[boldWordIndex]) {
      boldWordIndex += 1;
      return { isBold: true, value: word };
    }
    return { isBold: false, value: word };
  });

  return formattedWords;
};

/**
 * Get power index from tossup text
 */
const POWER_MARKER = '(*)';
export const getPowerIndex = (words: FormattedWord[]) =>
  words.findIndex(({ value }) => value === POWER_MARKER);

/**
 * Calculate tossup score based on buzz
 */
export const getTossupScore = (
  isCorrect: boolean,
  isInPower: boolean,
  didBuzzAtEnd: boolean,
) => {
  if (isCorrect) {
    return isInPower ? TossupScore.power : TossupScore.ten;
  }
  return didBuzzAtEnd ? TossupScore.incorrect : TossupScore.neg;
};

export function getBonusResult(
  results: BonusPartResult[],
  bonus: Bonus,
): BonusResult {
  const score = (() => {
    const correctPartsCount = results.filter(
      ({ isCorrect }) => isCorrect,
    ).length;
    switch (correctPartsCount) {
      case 3:
        return BonusScore.thirty;
      case 2:
        return BonusScore.twenty;
      case 1:
        return BonusScore.ten;
      default:
        return BonusScore.zero;
    }
  })();

  return {
    bonus,
    parts: results,
    score,
  };
}

function cleanAnswerlineForParsing(answerline: string): string {
  return new QBString(answerline)
    .removeTags()
    .replacePattern(/\((?!accept|or|prompt).*?\)/g, '') // remove parenthesized content if not important
    .normalizeBrackets()
    .normalizeWhitespace()
    .get();
}

/**
 * Normalize answer for comparison
 */
function normalizeAnswer(answer: string): string {
  return new QBString(answer)
    .deburr()
    .replaceIntegersWithWords()
    .removeNonAlphanumeric()
    .normalizeWhitespace()
    .get()
    .toLowerCase();
}

/**
 * Post-process parsed answers
 */
function processAnswers(answers: string[]): string[] {
  const lastNameAnswers = answers.flatMap(removeFirstNames);
  const allAnswers = [...answers, ...lastNameAnswers]
    .map(normalizeAnswer)
    .filter((s) => s !== '');

  return getUniqueItems(allAnswers);
}

/**
 * Filters out negated answers such as 'do not accept foo' or 'do not prompt on
 * or accept bar'. Used as a drop-in replacement for lookbehind assertions
 * (not supported in Safari) in the answer parser regex.
 * Answerlines often take the form 'do not accept foo or bar' and the answer
 * regex will match at 'accept' or 'or' so a lookup has to be performed to ensure
 * that an answer isn't proceeded by 'do not' or some other form of negation.
 */
const filterNegativeAnswers = (
  matchArray: RegExpExecArray,
  answerType: 'accept' | 'prompt',
) => {
  const { 0: match, index, input } = matchArray;
  const answerPrefix = match.slice(1).split(' ')[0];

  if (answerType === 'accept' && answerPrefix === 'accept') {
    const negatives = ['do not', 'do not prompt on or', 'do not prompt or'];
    return negatives.every((neg) => !input.endsWith(neg, index));
  }

  if (answerType === 'prompt' && answerPrefix === 'prompt') {
    const negatives = ['do not', 'do not accept or'];
    return negatives.every((neg) => !input.endsWith(neg, index));
  }

  const startIndex = lastIndexOfMultiple(input, [';', ',', '['], index);
  const prevString = input.slice(startIndex, index);

  if (answerType === 'accept' && answerPrefix === 'or') {
    const negatives = ['do not accept', 'prompt on', 'prompt'];
    return negatives.every((neg) => !prevString.includes(neg));
  }

  if (answerType === 'prompt' && answerPrefix === 'or') {
    const promptIndex = prevString.lastIndexOf('prompt on');
    if (promptIndex === -1) return false;

    const negatives = ['do not ', 'do not accept or '];
    return negatives.every((neg) => !prevString.endsWith(neg, promptIndex));
  }

  return true;
};

/**
 * Parse all valid answers from an answerline.
 */
export const parseAcceptableAnswers = (answerline: string): string[] => {
  const boldedAnswers = getTextBetweenTag(answerline, 'strong');

  let cleanedAnswerline = cleanAnswerlineForParsing(answerline);
  // convert html entities to unicode
  cleanedAnswerline = (parseHTMLString(cleanedAnswerline)[0] ??
    '') as unknown as string;

  // parse acceptable answers, roughly based on acf guidelines
  const primaryAnswer = /^(.*?)(?:$|(?:\[| or ).*)/g; // first answer up to '[' or EOL
  const acceptableAnswers =
    /(?:[[,; ])(?:accept |or )(.*?)(?= (?:do not|prompt|accept|or|until|before|after) |[,;[\]]|$)/g;
  const parsedAnswers = [
    ...getAllCaptureGroups(cleanedAnswerline, primaryAnswer),
    ...(
      Array.from(
        cleanedAnswerline.matchAll(acceptableAnswers),
      ) as RegExpExecArray[]
    )
      .filter((match) => filterNegativeAnswers(match, 'accept'))
      .map((e) => e[1]),
  ];

  const answers = [...boldedAnswers, ...parsedAnswers];
  return processAnswers(answers);
};

/**
 * Parse all promptable answers from an answerline.
 */
export const parsePromptableAnswers = (answerline: string) => {
  const underlinedAnswers = getTextBetweenTag(answerline, 'u');

  let cleanedAnswerline = cleanAnswerlineForParsing(answerline);
  // convert html entities to unicode
  cleanedAnswerline = (parseHTMLString(cleanedAnswerline)[0] ??
    '') as unknown as string;

  // parse promptable answers, roughly based on acf guidelines
  const promptRegex =
    /(?:[[,; ])(?:prompt on |or )(.*?)(?= (?:do not|prompt|accept|or|until|before|after) |[,;[\]]|$)/g;
  const parsedAnswers = (
    Array.from(cleanedAnswerline.matchAll(promptRegex)) as RegExpExecArray[]
  )
    .filter((match) => filterNegativeAnswers(match, 'prompt'))
    .map((e) => e[1]);

  const answers = [...underlinedAnswers, ...parsedAnswers];
  return processAnswers(answers);
};

export enum JudgeResult {
  correct,
  incorrect,
  prompt,
}

/**
 * Class for judging user answers against an answerline, supports prompts.
 */
export class Judge {
  acceptableAnswers: string[];
  promptableAnswers: string[];

  static ACCEPTABLE_DICE_SCORE = 0.6;

  constructor(answerline: string) {
    this.acceptableAnswers = parseAcceptableAnswers(answerline);
    this.promptableAnswers = parsePromptableAnswers(answerline);
    log.debug('Accepted answers:', this.acceptableAnswers);
    log.debug('Promptable answers:', this.promptableAnswers);
  }

  judge(userAnswer: string): JudgeResult {
    if (isEmpty(this.acceptableAnswers)) {
      return JudgeResult.incorrect;
    }

    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const acceptResult = findBestMatch(
      normalizedUserAnswer,
      this.acceptableAnswers,
    );
    log.debug(
      `Acceptable answer ratings for: ${userAnswer}`,
      acceptResult.ratings,
    );
    if (acceptResult.bestMatch.rating > Judge.ACCEPTABLE_DICE_SCORE) {
      return JudgeResult.correct;
    }

    if (isEmpty(this.promptableAnswers)) {
      return JudgeResult.incorrect;
    }

    const promptResult = findBestMatch(
      normalizedUserAnswer,
      this.promptableAnswers,
    );
    log.debug(
      `Promptable answer ratings for: ${userAnswer}`,
      promptResult.ratings,
    );
    if (promptResult.bestMatch.rating > Judge.ACCEPTABLE_DICE_SCORE) {
      // remove promptable answer, so it does not get prompted again
      this.promptableAnswers.splice(promptResult.bestMatchIndex, 1);
      return JudgeResult.prompt;
    }

    return JudgeResult.incorrect;
  }
}

export const BONUS_LEADIN_DELIMITER = '|:|';

/**
 * Combine leadin and part one text with a special delimiter, for the first bonus part
 */
export function combineBonusPartWithLeadin(bonusPart: BonusPart, bonus: Bonus) {
  return [
    bonus.formattedLeadin,
    BONUS_LEADIN_DELIMITER,
    bonusPart.formattedText,
  ].join(' ');
}

export function getBonusLeadinDelimiterIndex(words: FormattedWord[]) {
  const leadinDelimiterIndex = words.findIndex(
    ({ value }) => value === BONUS_LEADIN_DELIMITER,
  );
  return leadinDelimiterIndex === -1 ? undefined : leadinDelimiterIndex;
}

export function isLastBonusPart(bonusPartNumber: number, bonus: Bonus) {
  return bonusPartNumber === bonus.parts.length - 1;
}
