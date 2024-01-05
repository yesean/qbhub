import { Flex } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import TossupResultAccordion from './TossupResultAccordion';

type TossupResultProps = {
  results: TossupResult[];
};

const TossupResults: React.FC<React.PropsWithChildren<TossupResultProps>> = ({
  results,
}) => (
  <Flex direction="column" gap={4}>
    {results.map((result, index) => (
      <TossupResultAccordion
        // eslint-disable-next-line react/no-array-index-key
        key={`${result.tossup.id}${index}`}
        result={result}
      />
    ))}
  </Flex>
);

export default TossupResults;
