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
  latestResult: QuestionResult | undefined;
  score: number;
  status: QuestionReaderStatus;
};

export default function QuestionReaderScore({
  latestResult,
  score,
  status,
}: QuestionReaderScoreProps) {
  if (latestResult == null) return null;

  const latestScore = latestResult.score;
  const shouldShowDelta = status === QuestionReaderStatus.Judged;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{score}</StatNumber>
      {shouldShowDelta && (
        <StatHelpText mb={0} textAlign="center">
          <StatArrow type={latestScore > 0 ? 'increase' : 'decrease'} />
          {Math.abs(latestScore)}
        </StatHelpText>
      )}
    </Stat>
  );
}
