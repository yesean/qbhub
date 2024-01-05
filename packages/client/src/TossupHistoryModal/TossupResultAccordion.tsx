import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import QuestionInfo from '../components/QuestionReader/QuestionInfo';
import TossupResultDisplay from './TossupResultDisplay';
import TossupResultScoreBadge from './TossupResultScoreBadge';

type TossupResultProps = {
  result: TossupResult;
};

export default function TossupResultAccordion({ result }: TossupResultProps) {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <Box>
          <AccordionButton>
            <AccordionIcon />
            <QuestionInfo questionMetadata={result.tossup} />
            <TossupResultScoreBadge result={result} />
          </AccordionButton>
          <AccordionPanel borderRadius="md" px={8}>
            <TossupResultDisplay result={result} />
          </AccordionPanel>
        </Box>
      </AccordionItem>
    </Accordion>
  );
}