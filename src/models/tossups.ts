import { client, QueryBuilder } from '../utils/db';
import { Category, Difficulty, Subcategory } from '../utils/types';

export const getTossups = async (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  text: string,
  answer: string,
  limit: number | null,
) => {
  const catCondition =
    categories.length > 0
      ? `tossups.category_id in (${categories.join(', ')})`
      : false;
  const subcatCondition =
    subcategories.length > 0
      ? `tossups.subcategory_id in (${subcategories.join(', ')})`
      : true;
  const diffCondition =
    difficulties.length > 0
      ? `tournaments.difficulty in (${difficulties.join(', ')})`
      : true;
  const textCondition = `tossups.text ilike '%${text}%'`;
  const answerCondition = `tossups.answer ilike '%${answer}%'`;

  let condition;
  if (categories.length === 0 && subcategories.length === 0) condition = true;
  else if (subcategories.length > 0) condition = subcatCondition;
  else if (categories.length > 0) condition = catCondition;
  condition = `${condition} and ${diffCondition} and ${textCondition} and ${answerCondition}`;

  const columns = [
    { column: 'text', alias: 'text' },
    { column: 'answer', alias: 'answer' },
    { column: 'formatted_text', alias: 'formatted_text' },
    { column: 'formatted_answer', alias: 'formatted_answer' },
    { column: 'normalized_answer', alias: 'normalized_answer' },
    { column: 'category_id', alias: 'category' },
    { column: 'subcategory_id', alias: 'subcategory' },
    { column: 'difficulty', alias: 'difficulty' },
    { column: 'name', alias: 'tournament' },
  ];
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .random()
    .limit(limit)
    .build();

  return client.query(query);
};
