import { Client } from 'pg';
import { Column, Order, Parameter, QuestionFilterOptions } from '../types/db';
import { QuestionFilters, QuestionParameters } from '../types/controller';

// connect to postgresql database
export const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});
client.connect();

const fuzzy = (s: string) => `%${s}%`;
const getList = (values: any[]) => `(${values.join(',')})`;
const columnInList = (column: string, list: any[]) =>
  `${column} in ${getList(list)}`;

/**
 * Builds the `where` condition to filter various entities (tossups, clues, etc).
 */
export const getQuestionCondition = (
  questionParameters: QuestionParameters,
  addArg: (arg: Parameter) => string,
  options: QuestionFilterOptions,
) => {
  const { categories, subcategories, difficulties, text, answer } =
    questionParameters;

  const {
    useExactAnswer = false,
    useNormalizedAnswer = false,
    ignoreEmptyNormalizedAnswer = true,
  } = options;

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

  let difficultiesCondition;
  if (difficulties.length === 0) {
    difficultiesCondition = true;
  } else {
    difficultiesCondition = columnInList(
      'difficulty',
      difficulties.map(addArg),
    );
  }

  const textCondition = `tossups.text ILIKE ${addArg(fuzzy(text))}`;

  const source = useNormalizedAnswer ? 'normalized_answer' : 'answer';
  const comparison = useExactAnswer ? '=' : 'ILIKE';
  const pattern = useExactAnswer ? answer : fuzzy(answer);
  const answerCondition = `${source} ${comparison} ${addArg(pattern)}`;

  const ignoreEmptyNormalizedAnswerCondition = ignoreEmptyNormalizedAnswer
    ? "normalized_answer != ''"
    : true;

  const conditions = [
    combinedCategoriesCondition,
    difficultiesCondition,
    textCondition,
    answerCondition,
    ignoreEmptyNormalizedAnswerCondition,
  ];
  return conditions.join(' and ');
};
/**
 * Helper class for building SQL queries.
 */
export class QueryBuilder {
  private commands: string[];

  private parameters: Parameter[];

  constructor() {
    this.parameters = [];
    this.commands = [];
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

  select(columns: Column[]) {
    const command = columns
      .map(({ name, alias }) => {
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

  questionFilter(
    questionFilters: QuestionFilters,
    options: QuestionFilterOptions = {},
  ) {
    const command = getQuestionCondition(
      questionFilters,
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

  limit(n: number | null) {
    return this.addCommand(`LIMIT ${this.register(n)}`);
  }

  build(): [string, Parameter[]] {
    return [this.commands.join('\n'), this.parameters];
  }
}
