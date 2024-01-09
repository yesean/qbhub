import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { BonusResult } from '@qbhub/types';
import QuestionInfo from '../components/QuestionReader/QuestionInfo';
import BonusResultDisplay from './BonusResultDisplay';
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
            <QuestionInfo questionMetadata={result.question} />
            <BonusResultScoreBadge result={result} />
          </AccordionButton>
          <AccordionPanel>
            <BonusResultDisplay result={result} />
          </AccordionPanel>
        </Box>
      </AccordionItem>
    </Accordion>
  );
}
