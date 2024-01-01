import { isEmpty, log } from '@qbhub/utils';
import { findBestMatch } from 'string-similarity';
import {
  normalizeAnswer,
  parseAcceptableAnswers,
  parsePromptableAnswers,
} from './reader';

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
