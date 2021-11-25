import { Client } from 'pg';
import { QuestionParameters } from '../types/questions';

// connect to postgresql database
export const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});
client.connect();

/**
 * Helper class for building SQL queries.
 */
export class QueryBuilder {
  static start() {
    return new QueryBuilder('');
  }

  text: string;

  params: string[];

  constructor(text: string) {
    this.text = text;
    this.params = [];
  }

  build() {
    this.text = this.text.trim();
    return this.text;
  }

  private append(cmd: string) {
    this.text = `${this.text}  ${cmd}`;
    return this;
  }

  select(columns: { column: string; alias: string }[]) {
    const colsCmd = columns.map((c) => `${c.column} as ${c.alias}`).join(',');
    return this.append(`select ${colsCmd}`);
  }

  from(table: string) {
    return this.append(`from ${table}`);
  }

  innerJoin(table: string, condition: string) {
    return this.append(`inner join ${table} on ${condition}`);
  }

  where(condition: string) {
    return this.append(`where ${condition}`);
  }

  groupBy(column: string) {
    return this.append(`group by ${column}`);
  }

  orderBy(values: { column: string; direction: 'asc' | 'desc' }[]) {
    const cmd = values.map((v) => `${v.column} ${v.direction}`).join(',');
    return this.append(`order by ${cmd}`);
  }

  random() {
    return this.append('order by random()');
  }

  offset(n: number) {
    return this.append(`offset ${n}`);
  }

  limit(n: number | null) {
    return this.append(`limit ${n}`);
  }
}

const getList = (values: any[]) => `(${values.join(',')})`;
const columnInList = (column: string, list: any[]) =>
  `${column} in ${getList(list)}`;

/**
 * Builds the `where` condition to filter various entities (tossups, clues, etc).
 */
export const getQuestionCondition = (
  questionParameters: QuestionParameters,
  {
    ignoreEmptyNormalizedAnswer = true,
    useNormalizedAnswer = false,
    useExactAnswer = false,
  } = {},
) => {
  const { categories, subcategories, difficulties, text, answer } =
    questionParameters;

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
    categoriesCondition = columnInList('category_id', categories);
  }
  if (subcategories.length === 0) {
    subcategoriesCondition = false;
  } else {
    subcategoriesCondition = columnInList('subcategory_id', subcategories);
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
    difficultiesCondition = columnInList('difficulty', difficulties);
  }

  const textCondition = `tossups.text ilike '%${text}%'`;

  const source = useNormalizedAnswer ? 'normalized_answer' : 'answer';
  const comparison = useExactAnswer ? '=' : 'ilike';
  const pattern = useExactAnswer ? answer : `%${answer}%`;
  const answerCondition = `${source} ${comparison} '${pattern}'`;

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
