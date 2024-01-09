import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ScoredQuestionResult } from '@qbhub/types';

type QuestionReaderScoreProps = {
  currentResult: ScoredQuestionResult | undefined;
  score: number;
};

export default function QuestionReaderScore({
  currentResult,
  score,
}: QuestionReaderScoreProps) {
  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{score}</StatNumber>
      {currentResult !== undefined && (
        <StatHelpText mb={0} textAlign="center">
          <StatArrow type={currentResult.score > 0 ? 'increase' : 'decrease'} />
          {Math.abs(currentResult.score)}
        </StatHelpText>
      )}
    </Stat>
  );
}
