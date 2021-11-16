import { Category, Difficulty, Subcategory } from '../utils/types';

const colInArr = (col: string, arr: any[]) => `${col} in (${arr.join(',')})`;

export const getTossupCondition = (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  text: string,
  answer: string,
  ignoreEmptyNormalized = true,
) => {
  const cats =
    categories.length === 0
      ? true
      : colInArr('tossups.category_id', categories);
  const subcats =
    subcategories.length === 0
      ? true
      : colInArr('tossups.subcategory_id', subcategories);
  const diffs =
    difficulties.length > 0
      ? colInArr('tournaments.difficulty', difficulties)
      : true;
  const textCond = `tossups.text ilike '%${text}%'`;
  const answerCond = `tossups.answer ilike '%${answer}%'`;
  const normalized = ignoreEmptyNormalized
    ? `tossups.normalized_answer <> ''`
    : true;

  const condition = `(${cats} or ${subcats}) and ${diffs} and ${textCond} and ${answerCond} and ${normalized}`;
  return condition;
};
