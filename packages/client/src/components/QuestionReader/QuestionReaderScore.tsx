import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { QuestionReaderStatus } from '../../utils/questionReader';
import { QuestionResult } from './QuestionReaderContext';
import useQuestionReaderContext from './useQuestionReaderContext';

export default function QuestionReaderScore() {
  const { previousResults, status } = useQuestionReaderContext();

  if (previousResults.length === 0) return null;

  const score = previousResults.reduce((acc, result) => acc + result.score, 0);
  const delta = (previousResults.at(-1) as QuestionResult).score;
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
}
