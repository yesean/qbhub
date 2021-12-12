import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import nlp from 'compromise';
import { Fragment } from 'react';
import ss from 'string-similarity';
import { JudgeResult, TossupReaderWord, TossupScore } from '../types/tossups';
import logger from './logger';
import {
  anyTag,
  betweenParentheses,
  getCaptureGroups,
  ltgt,
  quotes,
  remove,
  tag,
} from './regex';
import {
  convertNumberToWords,
  getTextBetweenTags,
  removeExtraSpaces,
} from './string';

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
 * Compute the visibility of a word, depending on the reading position.
 */
const computeVisibility = (
  index: number,
  visibleIndex: number,
): 'visible' | 'hidden' => (index <= visibleIndex ? 'visible' : 'hidden');

/**
 * Determine whether or not to get shuffled word, depending on the reading position.
 */
const getWord = (word: TossupReaderWord, index: number, visibleIndex: number) =>
  index <= visibleIndex ? word.original : word.shuffled;

/**
 * Render a question given its reading position. Display the buzz symbol if
 * specified.
 */
export const renderQuestion = (
  words: TossupReaderWord[],
  buzzIndex: number = -1,
  visibleIndex: number = words.length,
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
        visibility={computeVisibility(i, visibleIndex)}
        fontWeight={w.isInPower ? 'bold' : 'normal'}
      >
        {`${getWord(w, i, visibleIndex)} `}
      </Text>
      {renderBell(i === buzzIndex)}
    </Fragment>
  ));
};

/**
 * Clean a tossup answerline for parsing.
 */
const cleanAnswerline = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(ltgt, '') // remove author metadata
    .replaceAll(betweenParentheses, '') // remove parenthesized stuff
    .replaceAll(quotes, '')
    .replaceAll(tag('u'), '') // remove underline tags
    .replaceAll(tag('em'), '') // remove underline tags
    .replaceAll(/-/g, ' ') // dashes to spaces
    .trim();

/**
 * Parse all valid answers from an answerline.
 */
const parseCorrectAnswers = (answer: string): string[] => {
  // clean answerline
  let normalizedAnswer = cleanAnswerline(answer);

  // get all bold answers
  const boldTags = ['strong', 'b'];
  const boldAnswers = boldTags.flatMap((t) =>
    getTextBetweenTags(normalizedAnswer, t)
      .map(removeExtraSpaces)
      .map((s) => s.trim()),
  );

  // remove tags from answerline
  normalizedAnswer = remove(normalizedAnswer, anyTag);

  // parse answers according to acf guidelines
  const answerRegexes = [
    /(.*)\[/g, // first answer up to '['
    /(?!\[|,|;|\s)(?<!do not )(?:accept|or)\s(.*?)\s(?=accept|or|until|before|after\s)/g, // 'accept'/'or' to 'accept' | 'or' | 'until' | 'before' 'after'
    /(?!\[|,|;|\s)(?<!do not )(?:accept|or)\s(.*?)(?=,|;|\[|\])/g, // 'accept'/'or' to ',' | ';' | ']'
    /(.*)/g, // entire answer
  ];
  const answers = answerRegexes.flatMap(
    (r) =>
      getCaptureGroups(normalizedAnswer, r)
        .map(removeExtraSpaces)
        .map((s) => s.trim())
        .filter(Boolean), // remove empty strings
  );

  // combine bold answers and parsed answers
  let allAnswers = [...boldAnswers, ...answers];

  // convert numbers to word form
  allAnswers = allAnswers.map((ans) => convertNumberToWords(ans));

  // parse any last names and mark them as valid
  const lastNames = allAnswers
    .flatMap((ans) => {
      return nlp(ans).people().match('#LastName').text();
    })
    .filter(Boolean);
  logger.info('Last names:', lastNames);

  return [...new Set([...allAnswers, ...lastNames])];
};

/**
 * Parse all promptable answers from an answerline.
 */
const parsePromptableAnswers = (answer: string) => {
  // clean answerline
  let normalizedAnswer = cleanAnswerline(answer);

  // get all underlined answers
  const underlineTags = ['u'];
  const underlinedAnswers = underlineTags.flatMap((t) =>
    getTextBetweenTags(normalizedAnswer, t)
      .map(removeExtraSpaces)
      .map((s) => s.trim()),
  );

  // remove tags from answerline
  normalizedAnswer = remove(normalizedAnswer, anyTag);

  // parse answers according to acf guidelines
  const answerRegexes = [
    /(?!\[|,|;|\s)(?<!do not |do not accept or)(?:prompt on)\s(.*?)\s(?=prompt on|or|until|before|after\s)/g, // 'accept'/'or' to 'accept' | 'or' | 'until' | 'before' 'after'
    /(?!\[|,|;|\s)(?<!do not |do not accept or)(?:prompt on)\s(.*?)(?=,|;|\[|\])/g, // 'accept'/'or' to ',' | ';' | ']'
  ];
  const answers = answerRegexes.flatMap(
    (r) =>
      getCaptureGroups(normalizedAnswer, r)
        .map(removeExtraSpaces)
        .map((s) => s.trim())
        .filter(Boolean), // remove empty strings
  );

  // combine underlined answers and parsed answers
  let allAnswers = [...underlinedAnswers, ...answers];

  // convert numbers to word form
  allAnswers = allAnswers.map((ans) => convertNumberToWords(ans));

  return [...new Set(allAnswers)];
};

/**
 * Check if an answer "approximately" matches any correct answers. Uses Dice's
 * coefficient to compare strings.
 */
const checkAnswer = (userAnswer: string, answers: string[]) => {
  return ss.findBestMatch(userAnswer, answers);
};

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
        this.promptableAnswers.splice(ratings.bestMatchIndex, 1);
        return JudgeResult.prompt;
      }
    }

    return JudgeResult.incorrect;
  }
}
