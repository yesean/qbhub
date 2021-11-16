import { Tossup } from '../types/questions';

const colInArr = (col: string, arr: any[]) => `${col} in (${arr.join(',')})`;

export const getTossupCondition = (
  tossup: Tossup,
  { ignoreEmptyNormalized = true, useNormalized = false } = {},
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
  const answerCond = `${
    useNormalized ? 'tossups.normalized_answer' : 'tossups.answer'
  } ilike '%${answer}%'`;
  const normalized = ignoreEmptyNormalized
    ? `tossups.normalized_answer <> ''`
    : true;

  const condition = `${catAndSubcat} and ${diffs} and ${textCond} and ${answerCond} and ${normalized}`;
  return condition;
};
