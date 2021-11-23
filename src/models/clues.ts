import { Category, Difficulty, Subcategory } from '../types/questions';
import { client, QueryBuilder } from '../utils/db';
import { getQuestionCondition } from './utils';

export const getClues = (
  categories: Category[],
  subcategories: Subcategory[],
  difficulties: Difficulty[],
  answer: string,
  limit: number,
) => {
  const columns = [
    { column: 'name', alias: 'tournament' },
    { column: 'text', alias: 'text' },
    { column: 'normalized_answer', alias: 'answer' },
  ];
  const tossup = {
    categories,
    subcategories,
    difficulties,
    text: '',
    answer,
  };
  const condition = getQuestionCondition(tossup, {
    useNormalized: true,
    exact: true,
  });
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .limit(limit)
    .build();

  return client.query(query);
};
