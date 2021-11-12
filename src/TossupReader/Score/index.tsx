import { useContext, useEffect, useState } from 'react';
import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

import { Mode, ModeContext } from '../../services/ModeContext';
import { TossupScore } from '../../types/tossupReader';
import { TossupResultContext } from '../../services/TossupResultContext';

const Score: React.FC = () => {
  const { mode } = useContext(ModeContext);
  const { result } = useContext(TossupResultContext);
  const [score, setScore] = useState({
    shouldShow: false,
    score: 0,
    delta: TossupScore.neg,
  });

  useEffect(() => {
    setScore((s) => ({ ...s, shouldShow: mode === Mode.revealed }));

    if (mode === Mode.revealed && result !== null) {
      setScore((s) => ({
        ...s,
        delta: result.score,
        score: s.score + result.score,
      }));
    }
  }, [mode, result]);

  const scoreDisplay =
    mode === Mode.revealed
      ? `${score.score - score.delta} → ${score.score}`
      : score.score;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{scoreDisplay}</StatNumber>
      {score.shouldShow && (
        <StatHelpText textAlign="center">
          <StatArrow type={score.delta > 0 ? 'increase' : 'decrease'} />
          {Math.abs(score.delta)}
        </StatHelpText>
      )}
    </Stat>
  );
};

export default Score;
