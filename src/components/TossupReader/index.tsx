import { useContext } from 'react';
import { Flex } from '@chakra-ui/react';

import Info from './Info';
import Question from './Question';
import Answer from './Answer';
import UserInput from './UserInput';
import Score from './Score';
import { TossupContext } from '../../services/TossupContext';

type TossupReaderProps = {};

const TossupReader: React.FC<TossupReaderProps> = () => {
  const {
    tossup: { text, answer, category, difficulty, tournament },
  } = useContext(TossupContext);

  return (
    <Flex direction="column">
      <Info
        category={category}
        difficulty={difficulty}
        tournament={tournament}
      />
      <Answer answer={answer} />
      <Question text={text} />
      <UserInput />
      <Score />
    </Flex>
  );
};

export default TossupReader;
