import { Heading } from '@chakra-ui/react';
import {
  getCategoryName,
  getDifficultyName,
  getSubcategoryName,
  getTournamentName,
  QuestionMetadata,
} from '@qbhub/types';

type QuestionInfoProps = {
  questionMetadata: QuestionMetadata;
};

export default function QuestionInfo({ questionMetadata }: QuestionInfoProps) {
  const tournament = getTournamentName(questionMetadata.tournament);
  const difficulty = getDifficultyName(questionMetadata.difficulty);
  const category = getCategoryName(questionMetadata.category);

  let text = `${tournament} / ${difficulty} / ${category}`;

  // append subcategory if available
  if (questionMetadata.subcategory != null) {
    const subcategory = getSubcategoryName(questionMetadata.subcategory);
    text += `/ ${subcategory}`;
  }

  return (
    <Heading px={4} size="sm">
      {text}
    </Heading>
  );
}
