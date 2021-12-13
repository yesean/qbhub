import { Center, CircularProgress, Container } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReader } from '../hooks/reader';
import { renderQuestion } from '../utils/reader';
import {
  buzz,
  ReaderStatus,
  selectTossupReader,
  setVisible,
} from './tossupReaderSlice';

const Question: React.FC = () => {
  const {
    status,
    current: {
      tossup: { formattedText },
      powerIndex,
      buzzIndex,
    },
  } = useSelector(selectTossupReader);
  const dispatch = useDispatch();
  const { words, visibleIndex, pause, reveal } = useReader(formattedText);

  // update visible index
  useEffect(() => {
    dispatch(setVisible(visibleIndex));
  }, [dispatch, visibleIndex]);

  // pause reading when answering
  useEffect(() => {
    if (status === ReaderStatus.answering) {
      pause();
    }
  }, [pause, status]);

  // reveal rest of tossup
  useEffect(() => {
    if (status === ReaderStatus.judged) {
      reveal();
    }
  }, [reveal, status]);

  // buzz at the end of the tossup
  useEffect(() => {
    if (visibleIndex === words.length - 1) {
      dispatch(buzz());
    }
  }, [dispatch, visibleIndex, words.length]);

  return (
    <>
      {renderQuestion(words, {
        visible: visibleIndex,
        bold: powerIndex,
        buzz: buzzIndex,
      })}
    </>
  );
};

const QuestionContainer: React.FC = () => {
  const { status } = useSelector(selectTossupReader);

  const shouldShowCircularProgress = status === ReaderStatus.fetching;
  const shouldShowEmptyMsg = status === ReaderStatus.empty;

  const render = () => {
    if (shouldShowCircularProgress) {
      return (
        <Center>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      );
    }
    if (shouldShowEmptyMsg) {
      return 'No tossups found. Try tweaking the search parameters.';
    }
    return <Question />;
  };

  return (
    <Container
      maxW="container.md"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      d="flex"
      flexWrap="wrap"
      justifyContent={shouldShowCircularProgress ? 'center' : 'start'}
      borderRadius="md"
    >
      {render()}
    </Container>
  );
};

export default QuestionContainer;
