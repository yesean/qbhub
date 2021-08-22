import { useEffect, useState } from 'react';
import { Container, Text } from '@chakra-ui/react';

type QuestionProps = {
  text: string;
};

const Question: React.FC<QuestionProps> = ({ text }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incrementIds, setIncrementIds] = useState<NodeJS.Timeout[]>([]);
  const [words, setWords] = useState<string[]>([]);

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

  useEffect(() => {
    if (text === '') {
      setVisibleIndex(0);
      incrementIds.forEach(window.clearTimeout);
      setIncrementIds([]);
    }
  }, [text, incrementIds]);

  useEffect(() => {
    const id = setTimeout(() => setVisibleIndex((i) => i + 1), 250);
    setIncrementIds((ids) => [...ids, id]);
  }, [visibleIndex, words.length]);

  return (
    <Container
      maxW="container.md"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      borderRadius="md"
    >
      {words.map((w, i) => (
        <Text d="inline" visibility={computeVisibility(i)}>{`${w} `}</Text>
      ))}
    </Container>
  );
};

export default Question;
