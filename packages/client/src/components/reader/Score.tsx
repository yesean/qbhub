import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

type ScoreProps = {
  delta: number;
  score: number;
  showDelta: boolean;
};

const Score: React.FC<React.PropsWithChildren<ScoreProps>> = ({
  delta,
  score,
  showDelta,
}) => {
  const renderScore = showDelta ? `${score - delta} → ${score}` : score;

  return (
    <Stat>
      <StatLabel fontSize="xl" textAlign="center">
        Score
      </StatLabel>
      <StatNumber textAlign="center">{renderScore}</StatNumber>
      {showDelta && (
        <StatHelpText mb={0} textAlign="center">
          <StatArrow type={delta > 0 ? 'increase' : 'decrease'} />
          {Math.abs(delta)}
        </StatHelpText>
      )}
    </Stat>
  );
};

export default Score;
