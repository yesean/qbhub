import { Flex } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import TossupResultAccordion from './TossupResultAccordion';

type TossupResultsProps = {
  results: TossupResult[];
};

export default function TossupResults({ results }: TossupResultsProps) {
  return (
    <Flex direction="column" overflow="auto">
      {results.map((result, index) => (
        <TossupResultAccordion
          // eslint-disable-next-line react/no-array-index-key
          key={`${result.question.id}${index}`}
          result={result}
        />
      ))}
    </Flex>
  );
}
