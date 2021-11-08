import { useContext } from 'react';
import { Heading } from '@chakra-ui/react';

import { TossupResultContext } from '../../services/TossupResultContext';
import { TossupResultScore } from '../../types';

const Result: React.FC = () => {
  const { result } = useContext(TossupResultContext);

  if (result === null) return null;

  let text;
  if (result.score === TossupResultScore.power) text = '🎉  Power!  🥳';
  else if (result.score === TossupResultScore.ten) text = '😇  Ten!';
  else if (result.score === TossupResultScore.neg) text = '😩  Neg!';

  return (
    <Heading pl={4} textAlign="center" size="md" whiteSpace="pre" mb={4}>
      {text}
    </Heading>
  );
};

export default Result;
