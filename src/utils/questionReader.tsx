import { BellIcon } from '@chakra-ui/icons';
import { Container, Text } from '@chakra-ui/react';
import DOMPurify from 'dompurify';
import { Fragment } from 'react';
import ReactHTMLParser from 'react-html-parser';
import ss from 'string-similarity';
import { TossupReaderWord } from '../types/tossupReader';
import logger from './logger';

export const checkAnswer = (answer: string, correctAnswers: string[]) => {
  const minRating = 0.6;
  const ratings = ss.findBestMatch(answer, correctAnswers);
  logger.info('Answer ratings:', ratings);
  return ratings.bestMatch.rating > minRating;
};

export const parseHTMLString = (s: string) =>
  ReactHTMLParser(DOMPurify.sanitize(s));

export const getTextBetweenTags = (tag: string, text: string) => {
  const regex = new RegExp(
    /* eslint no-useless-escape: "off" */
    `<${tag}>(.*?)<\/${tag}>`,
    'g',
  );
  return Array.from(text.matchAll(regex)).map((t) => t[1]);
};

export const checkIfTagEnclosed = (tag: string, text: string, word: string) => {
  return getTextBetweenTags(tag, text).join(' ')?.includes(word);
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

export const getWord = (
  word: TossupReaderWord,
  index: number,
  visibleIndex: number,
) => (index <= visibleIndex ? word.original : word.shuffled);

export const computeVisibility = (
  index: number,
  visibleIndex: number,
): 'visible' | 'hidden' => (index <= visibleIndex ? 'visible' : 'hidden');

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
