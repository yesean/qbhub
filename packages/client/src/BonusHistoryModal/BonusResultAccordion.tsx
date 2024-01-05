import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { BonusResult } from '@qbhub/types';
import { Fragment } from 'react';
import BonusReaderPreviousBonusPart from '../BonusReader/BonusReaderPreviousBonusPart';
import QuestionInfo from '../components/QuestionReader/QuestionInfo';
import BonusResultScoreBadge from './BonusResultScoreBadge';

type BonusResultAccordionProps = {
  result: BonusResult;
};

export default function BonusResultAccordion({
  result,
}: BonusResultAccordionProps) {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <Box>
          <AccordionButton>
            <AccordionIcon />
            <QuestionInfo questionMetadata={result.bonus} />
            <BonusResultScoreBadge result={result} />
          </AccordionButton>
          <AccordionPanel borderRadius="md" px={8}>
            <Flex direction="column" gap={2}>
              {result.parts.map((bonusPartResult, index) => (
                <Fragment key={bonusPartResult.number}>
                  <BonusReaderPreviousBonusPart
                    bonus={result.bonus}
                    bonusPartResult={bonusPartResult}
                  />
                  {index < result.parts.length - 1 && (
                    <Divider borderColor="gray.300" />
                  )}
                </Fragment>
              ))}
            </Flex>
          </AccordionPanel>
        </Box>
      </AccordionItem>
    </Accordion>
  );
}
