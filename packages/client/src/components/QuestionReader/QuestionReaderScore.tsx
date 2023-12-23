import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ReaderStatus } from '../../utils/questionReader';
import useQuestionReaderContext from './useQuestionReaderContext';

export default function QuestionReaderScore() {
  const { latestResult, score, status } = useQuestionReaderContext();

  if (latestResult == null) return null;

  const latestScore = latestResult.score;
  const shouldShowDelta = status === ReaderStatus.Judged;

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
