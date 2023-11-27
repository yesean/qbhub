import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import {
  QuestionReaderStatus,
  useQuestionReaderContext,
} from './QuestionReaderContext';

export default () => {
  const { previousResults, status } = useQuestionReaderContext();

  if (previousResults.length === 0) return null;

  const score = previousResults.reduce((acc, result) => acc + result.score, 0);
  const delta = (previousResults.at(-1) as TossupResult).score;
  const shouldShowDelta = status === QuestionReaderStatus.Judged;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{score}</StatNumber>
      {shouldShowDelta && (
        <StatHelpText textAlign="center" mb={0}>
          <StatArrow type={delta > 0 ? 'increase' : 'decrease'} />
          {Math.abs(delta)}
        </StatHelpText>
      )}
    </Stat>
  );
};
