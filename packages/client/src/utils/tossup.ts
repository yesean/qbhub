import { QuestionResult, TossupResult, TossupScore } from '@qbhub/types';
import { getFormattedWords, getPowerIndex } from './reader';

function getTossupResultScore({
  buzzIndex,
  isCorrect,
  question,
}: QuestionResult): TossupScore {
  const tossupWords = getFormattedWords(question.formattedText);
  const isInPower = buzzIndex <= getPowerIndex(tossupWords);
  const isBuzzAtEnd = buzzIndex === tossupWords.length - 1;

  if (isCorrect) {
    return isInPower ? TossupScore.power : TossupScore.ten;
  }
  return isBuzzAtEnd ? TossupScore.incorrect : TossupScore.neg;
}

export function getTossupResult(
  result: QuestionResult,
  normalizedAnswer: string,
): TossupResult {
  return {
    formattedWords: getFormattedWords(result.question.formattedText),
    score: getTossupResultScore(result),
    tossup: { ...result.question, normalizedAnswer },
    ...result,
  };
}
