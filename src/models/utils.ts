import { Category, Difficulty, Subcategory } from '../utils/types';

const colInArr = (col: string, arr: any[]) => `${col} in (${arr.join(',')})`;

export const getTossupCondition = (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  text: string,
  answer: string,
) => {
  let condition;
  if (categories.length === 0 && subcategories.length === 0) condition = true;
  else if (subcategories.length > 0)
    condition = colInArr('tossups.subcategory_id', subcategories);
  else if (categories.length > 0)
    condition = colInArr('tossups.category_id', categories);
  const diffCondition =
    difficulties.length > 0
      ? colInArr('tournaments.difficulty', difficulties)
      : true;
  const textCondition = `tossups.text ilike '%${text}%'`;
  const answerCondition = `tossups.answer ilike '%${answer}%'`;

  condition = `${condition} and ${diffCondition} and ${textCondition} and ${answerCondition}`;

  return condition;
};
