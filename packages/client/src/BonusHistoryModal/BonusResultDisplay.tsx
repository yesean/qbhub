import { Divider, Flex } from '@chakra-ui/react';
import { BonusResult } from '@qbhub/types';
import { Fragment } from 'react';

import BonusReaderPreviousBonusPart from '../BonusReader/BonusReaderPreviousBonusPart';

type BonusResultDisplayProps = {
  result: BonusResult;
};

export default function BonusResultDisplay({
  result,
}: BonusResultDisplayProps) {
  return (
    <Flex direction="column" gap={2}>
      {result.parts.map((bonusPartResult, index) => (
        <Fragment key={bonusPartResult.number}>
          <BonusReaderPreviousBonusPart
            bonus={result.question}
            bonusPartResult={bonusPartResult}
          />
          {index < result.parts.length - 1 && (
            <Divider borderColor="gray.300" />
          )}
        </Fragment>
      ))}
    </Flex>
  );
}
