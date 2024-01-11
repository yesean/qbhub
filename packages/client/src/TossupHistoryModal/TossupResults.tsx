import { Flex } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import TossupResultAccordion from './TossupResultAccordion';

type TossupResultsProps = {
  results: TossupResult[];
};

export default function TossupResults({ results }: TossupResultsProps) {
  return (
    <Flex direction="column" overflow="auto">
      {results.map((result) => (
        <TossupResultAccordion key={result.instanceID} result={result} />
      ))}
    </Flex>
  );
}
