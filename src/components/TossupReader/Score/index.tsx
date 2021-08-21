import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

const Score: React.FC = () => {
  return (
    <Stat>
      <StatLabel textAlign="center">Score</StatLabel>
      <StatNumber textAlign="center">100</StatNumber>
      <StatHelpText textAlign="center">
        <StatArrow type="increase" />
        15
      </StatHelpText>
    </Stat>
  );
};

export default Score;
