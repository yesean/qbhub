import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import BonusResultAccordion from './BonusResultAccordion';

export default function BonusResults() {
  const { results } = useSelector(selectBonusReader);

  return (
    <Flex direction="column" overflow="auto">
      {results.map((result) => (
        <BonusResultAccordion key={result.instanceID} result={result} />
      ))}
    </Flex>
  );
}
