import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import nlp from 'compromise';
import { Fragment } from 'react';
import ss from 'string-similarity';
import { TossupReaderWord } from '../types/tossups';
import logger from './logger';
import {
  anyTag,
  betweenParentheses,
  getCaptureGroups,
  ltgt,
  remove,
  tag,
} from './regex';
import {
  convertNumberToWords,
  getTextBetweenTags,
  removeExtraSpaces,
} from './string';

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
  buzzIndex: number,
  visibleIndex: number,
) =>
  words.map((w, i) => (
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
      {i === buzzIndex && (
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
      )}
    </Fragment>
  ));

/**
 * Clean a tossup answerline for parsing.
 */
const cleanAnswerline = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(ltgt, '') // remove author metadata
    .replaceAll(betweenParentheses, '') // remove parenthesized stuff
    .replaceAll(tag('u'), '') // remove underline tags
    .replaceAll(tag('em'), '') // remove underline tags
    .replaceAll(/-/g, ' ') // dashes to spaces
    .trim();

/**
 * Parse all valid answers from an answerline.
 */
export const parseAnswers = (answer: string): string[] => {
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
    /(?!\[|,|;|\s)(?:accept|or)\s(.*?)\s(?=accept|or|until|before|after\s)/g, // 'accept'/'or' to 'accept' | 'or' | 'until' | 'before' 'after'
    /(?!\[|,|;|\s)(?:accept|or)\s(.*?)(?=,|;|\[|\])/g, // 'accept'/'or' to ',' | ';' | ']'
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
export const parsePromptableAnswers = (answer: string) => {
  // clean answerline
  const normalizedAnswer = cleanAnswerline(answer);
};

/**
 * Check if an answer "approximately" matches any correct answers. Uses Dice's
 * coefficient to compare strings.
 */
export const checkAnswer = (answer: string, correctAnswers: string[]) => {
  const minRating = 0.6;
  const ratings = ss.findBestMatch(answer, correctAnswers);
  logger.info('Answer ratings:', ratings);
  return ratings.bestMatch.rating > minRating;
};
