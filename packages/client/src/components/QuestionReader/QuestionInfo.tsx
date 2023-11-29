import { Heading } from '@chakra-ui/react';
import {
  getCategoryName,
  getDifficultyName,
  getSubcategoryName,
  getTournamentName,
} from '@qbhub/types';
import useQuestionReaderContext from './useQuestionReaderContext';

export default function QuestionInfo() {
  const { question } = useQuestionReaderContext();

  const tournament = getTournamentName(question.tournament);
  const difficulty = getDifficultyName(question.difficulty);
  const category = getCategoryName(question.category);

  let text = `${tournament} / ${difficulty} / ${category}`;

  // append subcategory if available
  if (question.subcategory != null) {
    const subcategory = getSubcategoryName(question.subcategory);
    text += `/ ${subcategory}`;
  }

  return (
    <Heading px={4} size="sm">
      {text}
    </Heading>
  );
}
