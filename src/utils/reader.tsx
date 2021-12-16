import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import nlp from 'compromise';
import { Fragment } from 'react';
import ss from 'string-similarity';
import { JudgeResult, TossupScore, TossupWord } from '../types/tossups';
import { combine, emptyStringFilter, getUnique } from './array';
import logger from './logger';
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
  normalizeSpacing,
  removeFirstNames,
} from './string';

/**
 * Get words from string without any tags.
 * e.g. I <strong>love</strong> dogs -> [I, love, dogs]
 */
export const getTossupWords = (text: string): TossupWord[] => {
  const boldWords = getWordsBetweenTags(text, 'strong').map(removeTags);
  const words = getWords(removeTags(text));

  let boldWordIndex = 0;
  const tossupWords = words.map((word) => {
    if (boldWordIndex < boldWords.length && word === boldWords[boldWordIndex]) {
      boldWordIndex += 1;
      return { word, bold: true };
    }
    return { word, bold: false };
  });

  return tossupWords;
};

/**
 * Get power index from tossup text.
 */
export const getPowerIndex = (tossupWords: TossupWord[]) => {
  const POWER_MARKER = '(*)';
  return tossupWords.findIndex(({ word }) => word === POWER_MARKER);
};

/**
 * Calculate tossup score based on buzz.
 */
export const getTossupScore = (isCorrect: boolean, isInPower: boolean) => {
  if (isCorrect) {
    return isInPower ? TossupScore.power : TossupScore.ten;
  }
  return TossupScore.neg;
};

/**
 * Render a question given its reading position. Display the buzz symbol if
 * specified.
 */
export const renderQuestion = (
  words: { word: string; bold: boolean }[],
  { visible = words.length, buzz = -1 },
) => {
  const renderBell = (shouldRender: boolean) => {
    if (shouldRender) {
      return (
        <Container
          color="cyan.500"
          m={0}
          p={0}
          w="auto"
          d="inline-flex"
          alignItems="center"
          whiteSpace="pre"
          verticalAlign="bottom"
        >
          <BellIcon w={4} h={4} />
          <Text d="inline"> </Text>
        </Container>
      );
    }
    return null;
  };

  return words.map((w, i) => (
    <Fragment key={`${w}${i}`}>
      <Text
        /* eslint react/no-array-index-key: "off" */
        d="inline-flex"
        alignItems="center"
        whiteSpace="pre"
        visibility={i <= visible ? 'visible' : 'hidden'}
        fontWeight={w.bold ? 'bold' : 'normal'}
      >
        {`${w.word} `}
      </Text>
      {renderBell(i === buzz)}
    </Fragment>
  ));
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
      convertNumberToWords(
        nlp(s).normalize('light').text().replaceAll(quotes, ''),
      ).toLowerCase(),
    ),
  );

/**
 * Parse all valid answers from an answerline.
 */
const parseCorrectAnswers = (answerline: string): string[] => {
  let normalizedAnswer = cleanAnswerline(answerline);

  // get bolded answers
  const boldAnswers = getTextBetweenTags(normalizedAnswer, 'strong').map(
    removeTags,
  );

  // remove tags since they are not needed anymore
  normalizedAnswer = remove(normalizedAnswer, anyTag);

  // parse acceptable answers, roughly based on acf guidelines
  const answerRegexes = [
    /^(.*?)(?:$|(?:\[| or ).*)/g, // first answer up to '[' or EOL
    /(?<=[[,;\s])(?:(?<!do not (?:prompt on or )?)accept|(?<!(?:do not accept|(?:do not )?prompt on)[^,;]* )or)\s(.*?)(?=\s(?:(?:do not )?(?:prompt on|accept)|or|until|before|after)\s|[,;[\]]|$)/g,
  ];
  const answers = answerRegexes.flatMap((regex) =>
    getCaptureGroups(normalizedAnswer, regex),
  );

  let allAnswers = combine(boldAnswers, answers);
  const answersWithoutFirstNames = allAnswers.map(removeFirstNames);
  allAnswers = combine(allAnswers, answersWithoutFirstNames)
    .map(normalizeAnswer)
    .filter(emptyStringFilter);

  return getUnique(allAnswers);
};

/**
 * Parse all promptable answers from an answerline.
 */
const parsePromptableAnswers = (answer: string) => {
  let normalizedAnswer = cleanAnswerline(answer);

  // get underlined answers
  const underlinedAnswers = getTextBetweenTags(normalizedAnswer, 'u').map(
    removeTags,
  );

  // remove tags since they are not needed anymore
  normalizedAnswer = remove(normalizedAnswer, anyTag);

  // parse promptable answers, roughly based on acf guidelines
  const promptRegexes = [
    /(?<=[[,;\s])(?:(?<!do not(?: accept or)? )prompt on|(?<=(?<!do not(?: accept or)? )prompt on(?:[^,;\n]*))or)\s(.*?)(?=\s(?:(?:do not )?(?:prompt on|accept)|or|until|before|after)\s|[,;[\]]|$)/g,
  ];
  const answers = promptRegexes.flatMap((regex) =>
    getCaptureGroups(normalizedAnswer, regex),
  );

  const allAnswers = combine(underlinedAnswers, answers)
    .map(normalizeAnswer)
    .filter(emptyStringFilter);

  return getUnique(allAnswers);
};

/**
 * Check if an answer "approximately" matches any correct answers. Uses Dice's
 * coefficient to compare strings.
 */
const checkAnswer = (userAnswer: string, answers: string[]) => {
  return ss.findBestMatch(userAnswer, answers);
};

/**
 * Class for judging user answers against an answerline, supports prompts.
 */
export class Judge {
  correctAnswers: string[];

  promptableAnswers: string[];

  constructor(answerline: string) {
    this.correctAnswers = parseCorrectAnswers(answerline);
    this.promptableAnswers = parsePromptableAnswers(answerline);
    logger.info('Correct answers:', this.correctAnswers);
    logger.info('Promptable answers:', this.promptableAnswers);
  }

  judge(userAnswer: string): JudgeResult {
    const MIN_RATING = 0.6;

    let ratings = checkAnswer(userAnswer, this.correctAnswers);
    logger.info(`Correct answer ratings for "${userAnswer}":`, ratings.ratings);
    if (ratings.bestMatch.rating > MIN_RATING) {
      return JudgeResult.correct;
    }

    if (this.promptableAnswers.length > 0) {
      ratings = checkAnswer(userAnswer, this.promptableAnswers);
      logger.info(
        `Promptable answer ratings for "${userAnswer}":`,
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
