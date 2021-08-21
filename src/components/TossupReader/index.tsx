import { Flex } from '@chakra-ui/react';

import Info from './Info';
import Question from './Question';
import Answer from './Answer';
import UserInput from './UserInput';
import Score from './Score';

const TossupReader: React.FC = () => {
  return (
    <Flex direction="column">
      <Info />
      <Answer />
      <Question />
      <UserInput />
      <Score />
    </Flex>
  );
};

export default TossupReader;
