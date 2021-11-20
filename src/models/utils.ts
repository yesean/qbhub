import { Tossup } from '../types/questions';

const colInArr = (col: string, arr: any[]) => `${col} in (${arr.join(',')})`;

export const getQuestionCondition = (
  tossup: Tossup,
  { ignoreEmptyNormalized = true, useNormalized = false, exact = false } = {},
) => {
  const { categories, subcategories, difficulties, text, answer } = tossup;
  const cats =
    categories.length === 0
      ? false
      : colInArr('tossups.category_id', categories);
  const subcats =
    subcategories.length === 0
      ? false
      : colInArr('tossups.subcategory_id', subcategories);
  const catAndSubcat =
    categories.length === 0 && subcategories.length === 0
      ? true
      : `(${cats} or ${subcats})`;

  const diffs =
    difficulties.length > 0
      ? colInArr('tournaments.difficulty', difficulties)
      : true;
  const textCond = `tossups.text ilike '%${text}%'`;
  const answerSource = useNormalized
    ? 'tossups.normalized_answer'
    : 'tossups.answer';
  const answerComp = exact ? '=' : 'ilike';
  const answerQuery = exact ? answer : `%${answer}%`;
  const answerCond = `${answerSource} ${answerComp} '${answerQuery}'`;
  const normalized = ignoreEmptyNormalized
    ? `tossups.normalized_answer <> ''`
    : true;

  const condition = `${catAndSubcat} and ${diffs} and ${textCond} and ${answerCond} and ${normalized}`;
  return condition;
};
