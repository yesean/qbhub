import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';

const Score: React.FC = () => {
  const {
    status,
    score,
    current: { result },
  } = useSelector(selectTossupReader);

  const scoreDisplay =
    status === ReaderStatus.judged
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
