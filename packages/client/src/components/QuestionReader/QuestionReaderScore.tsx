import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { QuestionResult } from '@qbhub/types';

type QuestionReaderScoreProps<T extends number> = {
  result: QuestionResult<T> | undefined;
  score: T;
};

export default function QuestionReaderScore<T extends number>({
  result,
  score,
}: QuestionReaderScoreProps<T>) {
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
