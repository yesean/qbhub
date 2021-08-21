import { Flex } from '@chakra-ui/react';

import Info from './Info';
import Question from './Question';
import Answer from './Answer';
import Score from './Score';

const TossupReader: React.FC = () => {
  return (
    <Flex direction="column">
      <Info />
      <Question />
      <Answer />
      <Score />
    </Flex>
  );
};

export default TossupReader;
