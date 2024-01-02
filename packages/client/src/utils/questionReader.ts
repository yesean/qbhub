// question reader states
export enum QuestionReaderStatus {
  Reading,
  Answering,
  Judged,
}

// question reader state machine
export function getNextStatus(
  prevStatus: QuestionReaderStatus,
  { isPrompted = false } = {},
): QuestionReaderStatus {
  switch (prevStatus) {
    case QuestionReaderStatus.Reading:
      return QuestionReaderStatus.Answering;
    case QuestionReaderStatus.Answering:
      return isPrompted
        ? QuestionReaderStatus.Answering
        : QuestionReaderStatus.Judged;
    case QuestionReaderStatus.Judged:
      return QuestionReaderStatus.Reading;
  }
}

const SLOWEST_DELAY = 500;
const FASTEST_DELAY = 25;
const DELAY_RANGE = SLOWEST_DELAY - FASTEST_DELAY;

/**
 * Convert speed from percentage into a timeout delay
 */
export function getReadingTimeoutDelay(speed: number) {
  const scaledSpeed = 10 * Math.sqrt(speed); // skew speed towards faster end, common reading speed will probably in the faster end
  // speed is a number between 0 - 100, however, a higher speed means a lower delay
  // we also don't want delay to be 0, which is too fast
  return SLOWEST_DELAY - DELAY_RANGE * (scaledSpeed / 100);
}
