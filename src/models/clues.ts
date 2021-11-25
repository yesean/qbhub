import { QuestionFilters } from '../types/questions';
import { client, QueryBuilder, getQuestionCondition } from '../utils/db';

const columns = [
  { column: 'name', alias: 'tournament' },
  { column: 'text', alias: 'text' },
  { column: 'normalized_answer', alias: 'answer' },
];

export const getClues = (questionFilters: QuestionFilters) => {
  const condition = getQuestionCondition(questionFilters, {
    useNormalizedAnswer: true,
    useExactAnswer: true,
  });
  const query = QueryBuilder.start()
    .select(columns)
    .from('tossups')
    .innerJoin('tournaments', 'tossups.tournament_id = tournaments.id')
    .where(condition)
    .limit(questionFilters.limit)
    .build();

  return client.query(query);
};
