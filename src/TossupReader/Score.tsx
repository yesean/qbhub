import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {
  ReaderStatus,
  selectCurrentResult,
  selectScore,
  selectStatus,
} from './tossupReaderSlice';

const Score: React.FC = () => {
  const status = useSelector(selectStatus);
  const score = useSelector(selectScore);
  const result = useSelector(selectCurrentResult);

  const scoreDisplay =
    status === ReaderStatus.answered
      ? `${score - result.score} → ${score}`
      : score;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{scoreDisplay}</StatNumber>
      {result.score && (
        <StatHelpText textAlign="center">
          <StatArrow type={result.score > 0 ? 'increase' : 'decrease'} />
          {Math.abs(result.score)}
        </StatHelpText>
      )}
    </Stat>
  );
};

export default Score;
