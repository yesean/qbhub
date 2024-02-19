import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { selectTossupReader } from '../TossupReader/tossupReaderSlice';
import TossupResultAccordion from './TossupResultAccordion';

export default function TossupResults() {
  const { results } = useSelector(selectTossupReader);

  return (
    <Flex direction="column" overflow="auto">
      {results.map((result) => (
        <TossupResultAccordion key={result.instanceID} result={result} />
      ))}
    </Flex>
  );
}
