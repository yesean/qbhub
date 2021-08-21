import { Center } from '@chakra-ui/react';

import TossupReader from '../TossupReader';

type BodyProps = {
  text: string;
  answer: string;
};

const Body: React.FC<BodyProps> = ({ text, answer }) => {
  return (
    <Center flexGrow={1} p={4}>
      <TossupReader text={text} answer={answer} />
    </Center>
  );
};

export default Body;
