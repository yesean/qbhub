import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { QuestionResult } from '@qbhub/types';
import { QuestionReaderStatus } from '../../utils/questionReader';

type QuestionReaderScoreProps = {
  result: QuestionResult | undefined;
  score: number;
  status: QuestionReaderStatus;
};

export default function QuestionReaderScore({
  result,
  score,
  status,
}: QuestionReaderScoreProps) {
  if (result === undefined) return null;

  const shouldShowDelta = status === QuestionReaderStatus.Judged;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{score}</StatNumber>
      {shouldShowDelta && (
        <StatHelpText mb={0} textAlign="center">
          <StatArrow type={result.score > 0 ? 'increase' : 'decrease'} />
          {Math.abs(result.score)}
        </StatHelpText>
      )}
    </Stat>
  );
}
