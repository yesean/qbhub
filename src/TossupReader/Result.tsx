import { Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { TossupScore } from '../types/tossups';
import { ReaderStatus, selectTossupReader } from './tossupReaderSlice';

const Result: React.FC = () => {
  const {
    status,
    current: {
      result: { score },
    },
  } = useSelector(selectTossupReader);

  let text;
  if (status === ReaderStatus.prompting) text = 'Prompt!';
  else if (score === TossupScore.power) text = '🎉  Power!  🥳';
  else if (score === TossupScore.ten) text = 'Ten!';
  else if (score === TossupScore.neg) text = 'Neg!';

  return (
    <Heading pl={4} textAlign="center" size="md" whiteSpace="pre" mb={4}>
      {text}
    </Heading>
  );
};

export default Result;
