import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import TossupResultAccordion from './TossupResultAccordion';

export default function TossupResults() {
  const { results } = useSelector(selectTossupReader);

  return (
    <Flex direction="column" overflow="auto">
      {results.map((result, index) => (
        <TossupResultAccordion
          // eslint-disable-next-line react/no-array-index-key
          key={`${result.tossup.id}${index}`}
          result={result}
        />
      ))}
    </Flex>
  );
}
