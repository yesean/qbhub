// question reader states
export enum QuestionReaderStatus {
  Reading,
  Answering,
  AnsweringAfterPrompt,
  Judged,
}

type NextStatusOptions = {
  isPrompted?: boolean;
};

// question reader state machine
export const getNextStatus = (
  prevStatus: QuestionReaderStatus,
  { isPrompted = false }: NextStatusOptions = {},
): QuestionReaderStatus => {
  switch (prevStatus) {
    case QuestionReaderStatus.Reading:
      return QuestionReaderStatus.Answering;
    case QuestionReaderStatus.Answering:
      return isPrompted
        ? QuestionReaderStatus.AnsweringAfterPrompt
        : QuestionReaderStatus.Judged;
    case QuestionReaderStatus.AnsweringAfterPrompt:
      return QuestionReaderStatus.Judged;
    case QuestionReaderStatus.Judged:
      return QuestionReaderStatus.Reading;
  }
};
