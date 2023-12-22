import { QuestionParameters } from '@qbhub/types';
import { log } from '@qbhub/utils';
import pg from 'pg';
import {
  Column,
  Order,
  Parameter,
  QuestionFilterOptions,
} from '../types/db.js';

const { Client } = pg;

// connect to postgresql database
export const client = new Client();
client.connect().catch(() => {
  log.error('unable to connect postgresql');
  process.exit(1);
});

// helper functions for sql syntax
const fuzzy = (s: string) => `%${s}%`;
const getList = (values: any[]) => `(${values.join(',')})`;
const columnInList = (column: string, list: any[]) =>
  `${column} in ${getList(list)}`;

/**
 * Build `where` condition for filtering by category/subcategory.
 */
export const getCombinedCategoriesCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const { categories, subcategories } = questionParameters;

  /*
   * Category/Subcategory filtering falls into 4 cases.
   * 1. no categories selected, no subcategories selected -> no restrictions
   * 2. categories selected, no subcategories selected -> use categories as restrictions
   * 3. no categories selected, subcategories selected -> use subcategories as restrictions
   * 4. categories selected, subcategories selected -> use categories *or* subcategories as restrictions (both can satisfy)
   */
  let categoriesCondition;
  let subcategoriesCondition;
  let combinedCategoriesCondition;
  if (categories.length === 0) {
    categoriesCondition = false;
  } else {
    categoriesCondition = columnInList('category_id', categories.map(addArg));
  }
  if (subcategories.length === 0) {
    subcategoriesCondition = false;
  } else {
    subcategoriesCondition = columnInList(
      'subcategory_id',
      subcategories.map(addArg),
    );
  }
  if (categories.length === 0 && subcategories.length === 0) {
    combinedCategoriesCondition = true;
  } else {
    combinedCategoriesCondition = `(${categoriesCondition} or ${subcategoriesCondition})`;
  }
  return combinedCategoriesCondition;
};

/**
 * Build `where` condition for filtering by difficulty.
 */
export const getDifficultiesCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const { difficulties } = questionParameters;

  let difficultiesCondition;
  if (difficulties.length === 0) {
    difficultiesCondition = true;
  } else {
    difficultiesCondition = columnInList(
      'difficulty',
      difficulties.map(addArg),
    );
  }

  return difficultiesCondition;
};

/**
 * Build `where` condition for filtering by tournaments.
 */
export const getTournamentsCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const { tournaments } = questionParameters;

  let tournamentsCondition;
  if (tournaments.length === 0) {
    tournamentsCondition = true;
  } else {
    tournamentsCondition = columnInList(
      'tournament_id',
      tournaments.map(addArg),
    );
  }

  return tournamentsCondition;
};

/**
 * Build `where` condition for filtering by text.
 */
export const getTextCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const { text } = questionParameters;
  const textCondition = `text ILIKE ${addArg(fuzzy(text))}`;
  return textCondition;
};

/**
 * Build `where` condition for filtering by answer.
 */
export const getAnswerCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
  options: QuestionFilterOptions,
) => {
  const { answer } = questionParameters;
  const { useExactAnswer = false, useNormalizedAnswer = false } = options;

  const source = useNormalizedAnswer ? 'normalized_answer' : 'answer';
  const comparison = useExactAnswer ? '=' : 'ILIKE';
  const pattern = useExactAnswer ? answer : fuzzy(answer);
  const answerCondition = `${source} ${comparison} ${addArg(pattern)}`;

  return answerCondition;
};

/**
 * Build `where` condition for filtering by start year.
 */
export const getFromCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const { from } = questionParameters;
  const fromCondition = `year >= ${addArg(from)}`;
  return fromCondition;
};

/**
 * Build `where` condition for filtering by end year.
 */
export const getUntilCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const { until } = questionParameters;
  const untilCondition = `year <= ${addArg(until)}`;
  return untilCondition;
};

/**
 * Build `where` condition for filtering by primary key `id` of bonus.
 * Used to retrieve bonus_parts, when the bonus_id is known.
 */
export const getPrimaryKeyBonusCondition = (
  bonusIds: number[],
  addArg: (arg: Parameter) => string,
) => {
  const primaryKeyBonusCondition = columnInList(
    'bonus_id',
    bonusIds.map(addArg),
  );
  return primaryKeyBonusCondition;
};

/**
 * Builds the `where` condition to filter tossups.
 */
export const getTossupCondition = (
  questionFilters: QuestionParameters,
  addArg: (arg: Parameter) => string,
  options: QuestionFilterOptions,
) => {
  const { ignoreEmptyNormalizedAnswer = true } = options;
  const combinedCategoriesCondition = getCombinedCategoriesCondition(
    questionFilters,
    addArg,
  );
  const difficultiesCondition = getDifficultiesCondition(
    questionFilters,
    addArg,
  );
  const tournamentsCondition = getTournamentsCondition(questionFilters, addArg);
  const textCondition = getTextCondition(questionFilters, addArg);
  const answerCondition = getAnswerCondition(questionFilters, addArg, options);
  const fromCondition = getFromCondition(questionFilters, addArg);
  const untilCondition = getUntilCondition(questionFilters, addArg);
  const ignoreEmptyNormalizedAnswerCondition = ignoreEmptyNormalizedAnswer
    ? "normalized_answer != ''"
    : true;
  const conditions = [
    combinedCategoriesCondition,
    difficultiesCondition,
    tournamentsCondition,
    textCondition,
    answerCondition,
    fromCondition,
    untilCondition,
    ignoreEmptyNormalizedAnswerCondition,
  ];
  return conditions.join(' and ');
};

/**
 * Builds the `where` condition to filter bonuses.
 */
export const getBonusesCondition = (
  questionFilters: QuestionParameters,
  addArg: (arg: Parameter) => string,
) => {
  const combinedCategoriesCondition = getCombinedCategoriesCondition(
    questionFilters,
    addArg,
  );
  const difficultiesCondition = getDifficultiesCondition(
    questionFilters,
    addArg,
  );
  const tournamentsCondition = getTournamentsCondition(questionFilters, addArg);
  const fromCondition = getFromCondition(questionFilters, addArg);
  const untilCondition = getUntilCondition(questionFilters, addArg);

  const conditions = [
    combinedCategoriesCondition,
    difficultiesCondition,
    tournamentsCondition,
    fromCondition,
    untilCondition,
  ];
  return conditions.join(' and ');
};

/**
 * Builds the `where` condition to filter bonus parts.
 */
export const getBonusPartsCondition = (
  bonusIds: number[],
  addArg: (arg: Parameter) => string,
  options: QuestionFilterOptions,
) => {
  const { ignoreEmptyNormalizedAnswer = false } = options;

  const primaryKeyBonusCondition = getPrimaryKeyBonusCondition(
    bonusIds,
    addArg,
  );
  const ignoreEmptyNormalizedAnswerCondition = ignoreEmptyNormalizedAnswer
    ? "normalized_answer != ''"
    : true;
  const conditions = [
    primaryKeyBonusCondition,
    ignoreEmptyNormalizedAnswerCondition,
  ];
  return conditions.join(' and ');
};

/**
 * Helper class for building SQL queries. Uses parameterized queries.
 *
 * Sample usage:
 * const [query, values] = new QueryBuilder().select(...)
 *                                           .from(...)
 *                                           ...
 *                                           .build() // must call build at the end
 */
export class QueryBuilder {
  private commands: string[];

  private parameters: Parameter[];

  constructor() {
    this.parameters = [];
    this.commands = [];
  }

  select(columns: Column[]) {
    const command = columns
      .map(({ alias, name }) => {
        if (alias === undefined) return name;

        return `${name} AS ${alias}`;
      })
      .join(',');
    return this.addCommand(`SELECT ${command}`);
  }

  from(table: string) {
    return this.addCommand(`FROM ${table}`);
  }

  innerJoin(table: string, foreign: string, primary: string) {
    return this.addCommand(`INNER JOIN ${table} ON ${foreign} = ${primary}`);
  }

  filterTossups(
    questionFilters: QuestionParameters,
    options: QuestionFilterOptions = {},
  ) {
    const command = getTossupCondition(
      questionFilters,
      this.register.bind(this),
      options,
    );
    return this.addCommand(`WHERE ${command}`);
  }

  filterBonuses(questionFilters: QuestionParameters) {
    const command = getBonusesCondition(
      questionFilters,
      this.register.bind(this),
    );
    return this.addCommand(`WHERE ${command}`);
  }

  filterBonusParts(bonusIds: number[], options: QuestionFilterOptions = {}) {
    const command = getBonusPartsCondition(
      bonusIds,
      this.register.bind(this),
      options,
    );
    return this.addCommand(`WHERE ${command}`);
  }

  where(condition: string) {
    return this.addCommand(`WHERE ${condition}`);
  }

  groupBy(column: string) {
    return this.addCommand(`GROUP BY ${column}`);
  }

  orderBy(values: Order) {
    const command = values.map((v) => `${v.name} ${v.direction}`).join(',');
    return this.addCommand(`ORDER BY ${command}`);
  }

  random() {
    return this.addCommand('ORDER BY random()');
  }

  offset(n: number) {
    return this.addCommand(`OFFSET ${this.register(n)}`);
  }

  limit(n: number) {
    return this.addCommand(`LIMIT ${this.register(n)}`);
  }

  /**
   * Builds and returns the fully formed query and its parameters.
   */
  build(): [string, Parameter[]] {
    return [this.commands.join('\n'), this.parameters];
  }

  /**
   * Registers an argument and returns its identifier.
   */
  private register(arg: Parameter) {
    this.parameters.push(arg);
    return `$${this.parameters.length}`;
  }

  private addCommand(command: string) {
    this.commands.push(command);
    return this;
  }
}
