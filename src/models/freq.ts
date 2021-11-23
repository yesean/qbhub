import { client, QueryBuilder } from '../utils/db';
import { Category, Difficulty, Subcategory } from '../types/questions';
import { getQuestionCondition } from './utils';

export const getFreq = (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  text: string,
  answer: string,
  limit: number | null,
  offset: number | null,
) => {
  const columns = [
    { column: 'normalized_answer', alias: 'answer' },
    { column: 'count(normalized_answer)', alias: 'frequency' },
  ];
  const columnOrder: { column: string; direction: 'asc' | 'desc' }[] = [
    { column: 'count(normalized_answer)', direction: 'desc' },
    { column: 'normalized_answer', direction: 'asc' },
  ];
  const tossup = {
    categories,
    subcategories,
    difficulties,
    text,
    answer,
  };
  const condition = getQuestionCondition(tossup, { useNormalized: true });
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .groupBy('normalized_answer')
    .orderBy(columnOrder)
    .limit(limit)
    .offset(offset)
    .build();

  return client.query(query);
};
