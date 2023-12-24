import { Heading } from '@chakra-ui/react';
import {
  Question,
  getCategoryName,
  getDifficultyName,
  getSubcategoryName,
  getTournamentName,
} from '@qbhub/types';

type QuestionInfoProps = {
  question: Question;
};

export default function QuestionInfo({ question }: QuestionInfoProps) {
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
