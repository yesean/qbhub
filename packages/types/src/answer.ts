export type FrequencyListEntry = {
  answer: string;
  frequency: string;
};

export enum AnswerOutcome {
  correct,
  incorrect,
  prompt,
}
