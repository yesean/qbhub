import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { QuestionResult } from '@qbhub/types';

type QuestionReaderScoreProps = {
  result: QuestionResult | undefined;
  score: number;
};

export default function QuestionReaderScore({
  result,
  score,
}: QuestionReaderScoreProps) {
  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{score}</StatNumber>
      {result !== undefined && (
        <StatHelpText mb={0} textAlign="center">
          <StatArrow type={result.score > 0 ? 'increase' : 'decrease'} />
          {Math.abs(result.score)}
        </StatHelpText>
      )}
    </Stat>
  );
}
