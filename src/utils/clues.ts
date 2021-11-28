import nlp from 'compromise';
import cNgrams from 'compromise-ngrams';
import cSentences from 'compromise-sentences';
import { PlainTossup } from 'db';
import { Bag, ClueBagMap } from '../types/clues';
import { Clue } from '../types/controller';
import { each, max, unique } from './array';
import logger from './logger';

const nlpEx = nlp.extend(cNgrams).extend(cSentences);

type RegexReplace = [RegExp | string, string];
const quotes: RegexReplace = [/["'\u2018\u2019\u201C\u201D]/g, ''];
const between: RegexReplace = [/\(.*\)|\[.*\]|<.*>|&lt;.*&gt;.*/g, ''];
const uselessPunctuation: RegexReplace = [/[`~@#$%^&()+=[\]{}|\\:<>/]/g, ''];

const spacePunctuation: RegexReplace = [/[-_,*]/g, ' '];
const usefulPunctuation: RegexReplace = [/[`;;.!?/]/g, ''];
const ftp: RegexReplace = ['for (?:10|ten) points', ''];
const shrinkSpace: RegexReplace = [/\s\s+/g, ' '];

/**
 * Normalizes a tossup for splitting into sentences.
 */
export const normalizeTossup = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(...quotes)
    .replaceAll(...between)
    .replaceAll(...uselessPunctuation)
    .replaceAll(...shrinkSpace)
    .trim();

/**
 * Normalizes a clue for scoring.
 */
export const normalizeClue = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(...spacePunctuation)
    .replaceAll(...usefulPunctuation)
    .replaceAll(...shrinkSpace)
    .replaceAll(...ftp)
    .replaceAll(...shrinkSpace)
    .trim();

/**
 * Split a string into sentences.
 */
export const getSentences = (s: string): string[] =>
  nlpEx(normalizeTossup(s)) // remove quotes since quotes after periods hurt parsing
    .sentences()
    .json()
    .map(({ text }: any) => text);

/**
 * Split a string into clauses.
 */
export const getClauses = (s: string) => nlpEx(s).clauses().out('array');

/**
 * Parses clues from an array of tossups.
 */
export const getAllClues = (tossups: PlainTossup[]): Clue[] =>
  tossups
    .map((tossup) => {
      const sens = getSentences(tossup.text);
      const clues = sens
        .map((sen) =>
          getClauses(sen).map((clause) => ({
            clue: normalizeClue(clause),
            sentence: sen,
            tournament: tossup.tournament,
            score: 0,
          })),
        )
        .flat();
      return clues;
    })
    .flat()
    .reduce<[Clue[], Set<string>]>(
      unique<Clue>((clue) => clue.clue),
      [[], new Set()],
    )[0]
    .sort((a, b) => b.clue.length - a.clue.length);

/**
 * Gets a bag of words model from a string.
 */
const getBag = (clue: string) => {
  const doc = nlpEx(clue);
  const ignore = new Set(
    [
      doc.conjunctions(),
      doc.prepositions(),
      doc.match('#Determiner'),
      doc.match('#Possessive && #Pronouns'),
    ]
      .map((extDoc) => extDoc.out('array'))
      .flat(),
  );

  const meaningfulWords = clue.split(' ').filter((w) => !ignore.has(w));
  return meaningfulWords.reduce<Bag>((bag, word) => {
    if (word in bag) {
      bag[word] += 1;
    } else {
      bag[word] = 1;
    }
    return bag;
  }, {});
};

/**
 * Gets a ClueBagMap from an array of clues, mapping each clue to its bag.
 */
const getClueBagMap = (clues: Clue[]) =>
  clues.map(({ clue }) => clue).reduce<ClueBagMap>(each(getBag), {});

/**
 * Gets a bag of words model from a collection of clues. The term
 * frequency in the corpus is not its total frequency but rather the number of
 * clues (documents) that it is contained in (i.e. document frequency).
 */
const getCorpusBag = (clueBagMap: ClueBagMap) =>
  Object.values(clueBagMap).reduce<Bag>((acc, bag) => {
    const words = Object.keys(bag);
    words.forEach((word) => {
      if (word in acc) {
        acc[word] += 1;
      } else {
        acc[word] = 1;
      }
    });
    return acc;
  }, {});

/**
 * Remove a clue from the corpus bag.
 */
const removeClue = (clue: Clue, clueBagMap: ClueBagMap, corpusBag: Bag) => {
  const words = Object.keys(clueBagMap[clue.clue]);
  words.forEach((word) => {
    corpusBag[word] -= 1;
  });
};

/**
 * Calculates the tf-idf score of a word against a clue (document) and the
 * entire corpus of clues.
 * corpusWeight is used to scale the effect of inverse document frequency.
 */
const tfIdf = (
  word: string,
  clueBag: Bag,
  corpusBag: Bag,
  numClues: number,
) => {
  const idfWeight = 1;
  const documentFrequency = corpusBag[word] ?? 0;

  const tf = clueBag[word] ?? 0;
  const idf = Math.log(numClues / (1 + idfWeight * documentFrequency)); // add one to avoid division by zero
  return tf * idf;
};

/**
 * Scores a word against a clue and the corpus.
 */
const scoreWord = (
  word: string,
  clue: Clue,
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
  numClues: number,
) => tfIdf(word, clueBagMap[clue.clue], corpusBag, numClues);

/**
 * Scores a clue against a clue and the corpus.
 */
const scoreClue = (
  queryClue: Clue,
  baseClue: Clue,
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
  numClues: number,
) => {
  const words = Object.keys(clueBagMap[queryClue.clue]);
  const totalScore = words
    .map((word) => scoreWord(word, baseClue, clueBagMap, corpusBag, numClues))
    .reduce((sum, score) => sum + score);
  return totalScore;
};

/**
 * Gets a unique array of clues, consolidating *similar* clues together.
 */
const combineClues = (
  clues: Clue[],
  clueBagMap: ClueBagMap,
  corpusBag: Bag,
): Clue[] => {
  const uniqueClues: Clue[] = [];
  while (clues.length > 0) {
    // ideally, tf > 2.5 and idf < 6
    const SCORE_THRESHOLD = 2.5 * Math.log(clues.length / (1 + 6));

    const queryClue = clues[0]; // use first clue as the search query
    const clueScores = new Map([[0, 0]]); // maps clue index to clue score
    const similarClues = [0]; // indices of clues to remove

    // score clues compared to first clue
    for (let i = 1; i < clues.length; i += 1) {
      const clueScore = scoreClue(
        queryClue,
        clues[i],
        clueBagMap,
        corpusBag,
        clues.length,
      );
      if (clueScore > SCORE_THRESHOLD) {
        clueScores.set(i, clueScore);
        similarClues.push(i);
      }
    }

    // get clue with best match
    const bestClue = similarClues.reduce(max((e) => clueScores.get(e)));
    uniqueClues.push({ ...clues[bestClue], score: clueScores.get(bestClue) });

    // remove similar clues
    // ignore warning since the forEach callback is used immediately
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    similarClues.forEach((idx) =>
      removeClue(clues[idx], clueBagMap, corpusBag),
    );
    clues = clues.filter((_, idx) => !clueScores.has(idx));
  }

  // sort clues by score
  const roundToHundreths = (n: number) => Math.round(n * 100) / 100;
  return uniqueClues
    .sort((a, b) => b.score - a.score)
    .map((clue) => ({ ...clue, score: roundToHundreths(clue.score) }));
};

/**
 * Wrapper function for combineClues.
 */
export const getUniqueClues = (clues: Clue[]) => {
  logger.info('Calculating bag of words for each clue.');
  const clueBagMap = getClueBagMap(clues);

  // remove useless clues
  logger.info('Removing useless clues.');
  clues = clues.filter((clue) => {
    if (Object.keys(clueBagMap[clue.clue]).length === 0) {
      delete clueBagMap[clue.clue];
      return false;
    }
    return true;
  });

  logger.info('Calculating bag of words for corpus.');
  const corpusBag = getCorpusBag(clueBagMap);
  logger.info('Combining clues.');
  return combineClues(clues, clueBagMap, corpusBag);
};
