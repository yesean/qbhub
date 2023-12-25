import {
  Bonus,
  BonusPart,
  BonusPartResult,
  BonusResult,
  BonusScore,
  FormattedWord,
  TossupScore,
} from '@qbhub/types';
import { log } from '@qbhub/utils';
import { deburr } from 'lodash-es';
import { findBestMatch } from 'string-similarity';
import { combine, emptyStringFilter, getUnique } from './array';
import {
  anyTag,
  getCaptureGroups,
  ltgt,
  quotes,
  remove,
  removeNonAlphanumeric,
  removeTags,
} from './regex';
import {
  convertNumberToWords,
  getTextBetweenTags,
  getWords,
  getWordsBetweenTags,
  multipleLastIndexOf,
  normalizeSpacing,
  parseHTMLString,
  removeFirstNames,
} from './string';

export enum ReaderStatus {
  idle,
  fetching,
  reading,
  answering,
  partialJudged,
  prompting,
  judged,
  empty,
}

/**
 * Get words from string with formatting information, using tags
 * e.g. I <strong>love</strong> dogs => [I, love, dogs]
 */
export const getFormattedWords = (text: string): FormattedWord[] => {
  const boldWords = getWordsBetweenTags(text, 'strong').map(removeTags);
  const words = getWords(removeTags(text));

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
 * Get power index from tossup text.
 */
const POWER_MARKER = '(*)';
export const getPowerIndex = (words: FormattedWord[]) =>
  words.findIndex(({ value }) => value === POWER_MARKER);

/**
 * Calculate tossup score based on buzz.
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

export const getBonusScore = (results: BonusPartResult[]) => {
  const correctCount = results.reduce(
    (acc, res) => acc + (res.isCorrect ? 1 : 0),
    0,
  );

  if (correctCount === 3) {
    return BonusScore.thirty;
  }
  if (correctCount === 2) {
    return BonusScore.twenty;
  }
  if (correctCount === 1) {
    return BonusScore.ten;
  }
  return BonusScore.zero;
};

/**
 * Clean a tossup answerline for parsing.
 */
const cleanAnswerline = (s: string) =>
  normalizeSpacing(
    s
      .replaceAll(ltgt, '') // remove author metadata
      .replaceAll(/\((?!accept|or|prompt).*?\)/g, '') // remove parenthesized stuff if the information is not important
      .replaceAll('(', '[')
      .replaceAll(')', ']'),
  );

/**
 * Normalize answer for comparison.
 */
export const normalizeAnswer = (s: string) =>
  normalizeSpacing(
    removeNonAlphanumeric(
      convertNumberToWords(deburr(s).replaceAll(quotes, '')).toLowerCase(),
    ),
  );

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

  const startIndex = multipleLastIndexOf(input, [';', ',', '['], index);
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
  let normalizedAnswer = cleanAnswerline(answerline);

  // get bolded answers
  const boldAnswers = getTextBetweenTags(normalizedAnswer, 'strong').map(
    removeTags,
  );

  // remove tags since they are not needed anymore
  normalizedAnswer = remove(normalizedAnswer, anyTag);

  // convert html entities to unicode
  normalizedAnswer = (parseHTMLString(normalizedAnswer)[0] ??
    '') as unknown as string;

  // parse acceptable answers, roughly based on acf guidelines
  const primaryAnswer = /^(.*?)(?:$|(?:\[| or ).*)/g; // first answer up to '[' or EOL
  const acceptableAnswers =
    /(?:[[,; ])(?:accept |or )(.*?)(?= (?:do not|prompt|accept|or|until|before|after) |[,;[\]]|$)/g;
  const answers = [
    ...getCaptureGroups(normalizedAnswer, primaryAnswer),
    ...(
      Array.from(
        normalizedAnswer.matchAll(acceptableAnswers),
      ) as RegExpExecArray[]
    )
      .filter((match) => filterNegativeAnswers(match, 'accept'))
      .map((e) => e[1]),
  ];

  let allAnswers = combine(boldAnswers, answers);
  const answersWithoutFirstNames = allAnswers.flatMap(removeFirstNames);
  allAnswers = combine(allAnswers, answersWithoutFirstNames)
    .map(normalizeAnswer)
    .filter(emptyStringFilter);

  return getUnique(allAnswers);
};

/**
 * Parse all promptable answers from an answerline.
 */
export const parsePromptableAnswers = (answer: string) => {
  let normalizedAnswer = cleanAnswerline(answer);

  // get underlined answers
  const underlinedAnswers = getTextBetweenTags(normalizedAnswer, 'u').map(
    removeTags,
  );

  // remove tags since they are not needed anymore
  normalizedAnswer = remove(normalizedAnswer, anyTag);

  // parse promptable answers, roughly based on acf guidelines
  const promptRegex =
    /(?:[[,; ])(?:prompt on |or )(.*?)(?= (?:do not|prompt|accept|or|until|before|after) |[,;[\]]|$)/g;
  const prompts = (
    Array.from(normalizedAnswer.matchAll(promptRegex)) as RegExpExecArray[]
  )
    .filter((match) => filterNegativeAnswers(match, 'prompt'))
    .map((e) => e[1]);

  const allAnswers = combine(underlinedAnswers, prompts)
    .map(normalizeAnswer)
    .filter(emptyStringFilter);

  return getUnique(allAnswers);
};

export const getInputBorderColor = (
  status: ReaderStatus,
  result: { isCorrect: boolean },
) => {
  if (status !== ReaderStatus.judged) return 'gray.300';
  if (result.isCorrect) return 'green.400';
  return 'red.400';
};

/**
 * Check if an answer "approximately" matches any correct answers. Uses Dice's
 * coefficient to compare strings.
 */
const checkAnswer = (userAnswer: string, answers: string[]) => {
  if (answers.length === 0)
    return {
      bestMatch: {
        rating: 0,
      },
      bestMatchIndex: -1,
      ratings: [],
    };

  return findBestMatch(userAnswer, answers);
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

  constructor(answerline: string) {
    this.acceptableAnswers = parseAcceptableAnswers(answerline);
    this.promptableAnswers = parsePromptableAnswers(answerline);
    log.debug('accepted answers:', this.acceptableAnswers);
    log.debug('promptable answers:', this.promptableAnswers);
  }

  judge(userAnswer: string): JudgeResult {
    const MIN_RATING = 0.6;

    let ratings = checkAnswer(userAnswer, this.acceptableAnswers);
    log.debug(`acceptable answer ratings for: ${userAnswer}`, ratings.ratings);
    if (ratings.bestMatch.rating > MIN_RATING) {
      return JudgeResult.correct;
    }

    if (this.promptableAnswers.length > 0) {
      ratings = checkAnswer(userAnswer, this.promptableAnswers);
      log.debug(
        `promptable answer ratings for: ${userAnswer}`,
        ratings.ratings,
      );
      if (ratings.bestMatch.rating > MIN_RATING) {
        // remove promptable answer, so it does not get prompted again
        this.promptableAnswers.splice(ratings.bestMatchIndex, 1);
        return JudgeResult.prompt;
      }
    }

    return JudgeResult.incorrect;
  }
}

/**
 * Convert speed from percentage into a timeout delay.
 */
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
