import { Flex } from '@chakra-ui/react';

import Info from './Info';
import Question from './Question';
import Answer from './Answer';
import UserInput from './UserInput';
import Score from './Score';

type TossupReaderProps = {
  text: string;
  answer: string;
};

const TossupReader: React.FC<TossupReaderProps> = ({ text, answer }) => {
  return (
    <Flex direction="column">
      <Info />
      <Answer answer={answer} />
      <Question text={text} />
      <UserInput />
      <Score />
    </Flex>
  );
};

export default TossupReader;
