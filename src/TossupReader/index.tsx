import { useContext, useMemo, useState } from 'react';
import { Center, Flex } from '@chakra-ui/react';

import Info from './Info';
import Answer from './Answer';
import Result from './Result';
import Progress from './Progress';
import Question from './Question';
import UserInput from './UserInput';
import Score from './Score';
import { TossupContext } from '../services/TossupContext';
import { Mode, ModeContext } from '../services/ModeContext';
import { TossupBuzz } from '../types';
import { TossupBuzzContext } from '../services/TossupBuzzContext';

type TossupReaderProps = {};

const TossupReader: React.FC<TossupReaderProps> = () => {
  const { mode } = useContext(ModeContext);
  const {
    tossup: {
      text,
      formattedText,
      formattedAnswer,
      category,
      subcategory,
      difficulty,
      tournament,
    },
  } = useContext(TossupContext);
  const [tossupBuzz, setTossupBuzz] = useState<TossupBuzz | null>(null);

  const shouldShowInfo = mode !== Mode.start && mode !== Mode.fetchingTossup;
  const shouldShowAnswer = mode === Mode.revealed;
  const shouldShowProgress = mode === Mode.answering;
  const shouldShowQuestion = mode !== Mode.start;
  const shouldShowScore = mode !== Mode.start;

  const tossupBuzzContext = useMemo(
    () => ({
      buzz: tossupBuzz,
      setBuzz: setTossupBuzz,
    }),
    [tossupBuzz],
  );

  return (
    <TossupBuzzContext.Provider value={tossupBuzzContext}>
      <Flex
        direction="column"
        w="100%"
        maxH="100%"
        maxW="3xl"
        padding={4}
        overflow="auto"
      >
        {shouldShowInfo && (
          <Info
            category={category}
            subcategory={subcategory}
            difficulty={difficulty}
            tournament={tournament}
          />
        )}
        {shouldShowAnswer && <Answer answer={formattedAnswer} />}
        {shouldShowQuestion && (
          <Question text={text} formattedText={formattedText} />
        )}
        <Result />
        {shouldShowProgress && <Progress />}
        <Center>
          <UserInput />
        </Center>
        {shouldShowScore && <Score />}
      </Flex>
    </TossupBuzzContext.Provider>
  );
};

export default TossupReader;
