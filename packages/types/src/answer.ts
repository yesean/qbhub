export type FrequencyListAnswer = {
  answer: string;
  frequency: string;
};

export enum AnswerOutcome {
  correct,
  incorrect,
  prompt,
}
