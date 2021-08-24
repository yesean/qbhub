import { useContext, useEffect, useState } from 'react';
import { Center, CircularProgress, Container, Text } from '@chakra-ui/react';
import { Mode, ModeContext } from '../../../services/ModeContext';

type QuestionProps = {
  text: string;
};

const Question: React.FC<QuestionProps> = ({ text }) => {
  const { mode, setMode } = useContext(ModeContext);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incrementIds, setIncrementIds] = useState<NodeJS.Timeout[]>([]);
  const [words, setWords] = useState<string[]>([]);

  // scramble letters of unread words
  useEffect(() => {
    const getRand = (n: number) => Math.floor(Math.random() * n);

    const shuffleString = (s: string) => {
      const chars = s.split('');
      const shuffled = [];
      while (shuffled.length < s.length) {
        const randomIndex = getRand(chars.length);
        const [removedChar] = chars.splice(randomIndex, 1);
        shuffled.push(removedChar);
      }
      return shuffled.join('');
    };

    const textWords = text.split(' ');
    const textWordsScrambled = textWords.map((w, i) =>
      i > visibleIndex ? shuffleString(w) : w
    );
    setWords(textWordsScrambled);
  }, [text, visibleIndex]);

  const computeVisibility = (index: number): 'visible' | 'hidden' => {
    return index < visibleIndex ? 'visible' : 'hidden';
  };

  // reveal rest of tossup
  useEffect(() => {
    const revealWords = () => {
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds((ids) => (ids.length > 0 ? [] : ids));
      setWords(text.split(' '));
      setVisibleIndex(words.length);
    };
    if (mode === Mode.revealed) {
      revealWords();
    }
  }, [incrementIds, mode, words.length, text]);

  // pause reading when answering
  useEffect(() => {
    const pauseWords = () => {
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds((ids) => (ids.length > 0 ? [] : ids));
    };
    if (mode === Mode.answering) {
      pauseWords();
    }
  }, [incrementIds, mode, words.length, text]);

  // reset state when fetching new tossup
  useEffect(() => {
    if (mode === Mode.fetchingTossup) {
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds((ids) => (ids.length > 0 ? [] : ids));
      setVisibleIndex(0);
    }
  }, [mode, incrementIds]);

  // read tossup at 1word/250ms
  useEffect(() => {
    if (mode === Mode.reading) {
      const textWords = text.split(' ');
      if (visibleIndex < textWords.length) {
        const id = setTimeout(
          () =>
            setVisibleIndex((i) =>
              i < words.length && mode === Mode.reading ? i + 1 : i
            ),
          250
        );
        setIncrementIds((ids) => [...ids, id]);
      } else {
        setMode(Mode.answering);
      }
    }
  }, [visibleIndex, words.length, mode, setMode, text]);

  const shouldShowCircularProgress = mode === Mode.fetchingTossup;

  return (
    <Container
      maxW="container.md"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      borderRadius="md"
    >
      {shouldShowCircularProgress && (
        <Center>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      )}
      {words.map((w, i) => (
        <Text
          /* eslint react/no-array-index-key: "off" */
          key={`${w}${i}`}
          d="inline"
          visibility={computeVisibility(i)}
        >{`${w} `}</Text>
      ))}
    </Container>
  );
};

export default Question;
