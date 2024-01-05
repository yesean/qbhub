import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectBonusReader } from '../BonusReader/bonusReaderSlice';
import BonusResultAccordion from './BonusResultAccordion';

export default function BonusResults() {
  const { results } = useSelector(selectBonusReader);

  return (
    <Flex direction="column" overflow="auto">
      {results.map((result, index) => (
        <BonusResultAccordion
          // eslint-disable-next-line react/no-array-index-key
          key={`${result.bonus.id}${index}`}
          result={result}
        />
      ))}
    </Flex>
  );
}
