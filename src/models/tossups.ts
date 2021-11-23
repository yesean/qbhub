import { client, QueryBuilder } from '../utils/db';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { getQuestionCondition } from './utils';

export const getTossups = (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  text: string,
  answer: string,
  limit: number | null,
) => {
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
  const tossup = {
    categories,
    subcategories,
    difficulties,
    text,
    answer,
  };
  const condition = getQuestionCondition(tossup);
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
