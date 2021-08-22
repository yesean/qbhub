import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { Mode, ModeContext } from '../../../services/ModeContext';

const Score: React.FC = () => {
  const { mode } = useContext(ModeContext);

  const shouldShowScoreDelta = mode === Mode.revealed;

  return (
    <Stat>
      <StatLabel textAlign="center">Score</StatLabel>
      <StatNumber textAlign="center">0</StatNumber>
      {shouldShowScoreDelta && (
        <StatHelpText textAlign="center">
          <StatArrow type="increase" />
          15
        </StatHelpText>
      )}
    </Stat>
  );
};

export default Score;
