import { FormattedWord } from '@qbhub/types';
import {
  QBString,
  getAllCaptureGroups,
  getTextBetweenTag,
  getUniqueItems,
  getWordsBetweenTag,
  groupBy,
  lastIndexOfMultiple,
  objectMap,
  removeFirstNames,
} from '@qbhub/utils';
import DOMPurify from 'isomorphic-dompurify';
import ReactHTMLParser from 'react-html-parser';

/**
 * Sanitize and parse string into JSX
 */
export function parseHTMLString(s: string) {
  return ReactHTMLParser(DOMPurify.sanitize(s));
}

const POWER_MARKER = '(*)';

/**
 * Get words from string with formatting information, using tags
 */
export function getFormattedWords(text: string): FormattedWord[] {
  const words = new QBString(text).removeTag('strong').getWords();
  const powerIndex = words.indexOf(POWER_MARKER);

  const boldWords = getWordsBetweenTag(text, 'strong');
  const boldWordCount = objectMap(
    groupBy(boldWords, (word) => word),
    (group) => group.length,
  );

  const formattedWords = words.map((word, index) => {
    if (boldWordCount?.[word] > 0 && index <= powerIndex) {
      boldWordCount[word] -= 1;
      return { isBold: true, value: word };
    }
    return { isBold: false, value: word };
  });

  return formattedWords;
}

/**
 * Get power index from tossup text
 */
export function getPowerIndex(words: FormattedWord[]) {
  return words.findIndex(({ value }) => value === POWER_MARKER);
}

/**
 * Normalize answer for comparison
 */
export function normalizeAnswer(answer: string): string {
  return new QBString(answer)
    .removeTags()
    .deburr()
    .replaceIntegersWithWords()
    .removeNonAlphanumeric()
    .normalizeWhitespace()
    .get()
    .toLowerCase();
}

/**
 * Parse all valid answers from an answerline.
 */
export function parseAcceptableAnswers(answerline: string): string[] {
  // parse acceptable answers, roughly based on acf guidelines
  const primaryAnswerRegex = /^(.*?)(?:$|(?:\[| or ).*)/g; // first answer up to '[' or EOL
  const acceptableRegex =
    /(?:[[,; ])(?:accept |or )(.*?)(?= (?:do not|prompt|accept|or|until|before|after) |[,;[\]]|$)/g;
  const cleanedAnswerline = cleanAnswerlineForParsing(answerline);
  const parsedAnswers = [
    ...getAllCaptureGroups(cleanedAnswerline, primaryAnswerRegex),
    ...(
      Array.from(
        cleanedAnswerline.matchAll(acceptableRegex),
      ) as RegExpExecArray[]
    )
      .filter((match) => filterNegativeAnswers(match, 'accept'))
      .map((e) => e[1]),
  ];

  const boldedAnswers = getTextBetweenTag(answerline, 'strong');
  const answers = [...boldedAnswers, ...parsedAnswers];
  return processAnswers(answers);
}

/**
 * Parse all promptable answers from an answerline
 */
export function parsePromptableAnswers(answerline: string) {
  // parse promptable answers, roughly based on acf guidelines
  const promptRegex =
    /(?:[[,; ]prompt on| or) (.*?)(?= (?:do not|prompt|accept|or|until|before|after) |[,;[\]]|$)/g;
  const cleanedAnswerline = cleanAnswerlineForParsing(answerline);
  const parsedAnswers = (
    Array.from(cleanedAnswerline.matchAll(promptRegex)) as RegExpExecArray[]
  )
    .filter((match) => filterNegativeAnswers(match, 'prompt'))
    .map((e) => e[1]);

  const underlinedAnswers = getTextBetweenTag(answerline, 'u');
  const answers = [...underlinedAnswers, ...parsedAnswers];
  return processAnswers(answers);
}

function cleanAnswerlineForParsing(answerline: string): string {
  return new QBString(answerline)
    .removeTags()
    .removePattern(/\((?!accept|or|prompt).*?\)/g) // remove parenthesized content if not important
    .normalizeBrackets()
    .normalizeWhitespace()
    .apply((str) => (parseHTMLString(str)[0] ?? '') as unknown as string) // convert html entities to unicode
    .get();
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
function filterNegativeAnswers(
  { 0: matchedText, index, input }: RegExpExecArray,
  answerType: 'accept' | 'prompt',
) {
  const lowercaseInput = input.toLowerCase();
  const answerPrefix = QBString.getWords(matchedText)[0];

  if (answerType === 'accept' && answerPrefix === 'accept') {
    const negatives = ['do not', 'do not prompt on or', 'do not prompt or'];
    return negatives.every((neg) => !lowercaseInput.endsWith(neg, index));
  }

  if (answerType === 'prompt' && answerPrefix === 'prompt') {
    const negatives = ['do not', 'do not accept or'];
    return negatives.every((neg) => !lowercaseInput.endsWith(neg, index));
  }

  const startIndex = lastIndexOfMultiple(
    lowercaseInput,
    [';', ',', '['],
    index,
  );
  const prevString = lowercaseInput.slice(startIndex, index);

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
}
