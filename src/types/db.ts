export type Parameter = string | number;

export type Column = {
  name: string;
  alias?: string;
};

export type Order = {
  name: string;
  direction: 'asc' | 'desc';
}[];

export type QuestionFilterOptions = {
  ignoreEmptyNormalizedAnswer?: boolean;
  useNormalizedAnswer?: boolean;
  useExactAnswer?: boolean;
};
