import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { QuestionResult } from '@qbhub/types';
import { ReaderStatus } from '../../utils/questionReader';
import useQuestionReaderContext from './useQuestionReaderContext';

export default function QuestionReaderScore() {
  const { previousResults, status } = useQuestionReaderContext();

  if (previousResults.length === 0) return null;

  const score = previousResults.reduce((acc, result) => acc + result.score, 0);
  const delta = (previousResults.at(-1) as QuestionResult).score;
  const shouldShowDelta = status === ReaderStatus.Judged;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{score}</StatNumber>
      {shouldShowDelta && (
        <StatHelpText mb={0} textAlign="center">
          <StatArrow type={delta > 0 ? 'increase' : 'decrease'} />
          {Math.abs(delta)}
        </StatHelpText>
      )}
    </Stat>
  );
}
