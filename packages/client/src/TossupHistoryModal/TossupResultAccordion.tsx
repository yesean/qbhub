import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import TossupReaderAnswerDisplay from '../TossupReader/TossupReaderAnswerDisplay';
import FormattedQuestion from '../components/FormattedQuestion';
import QuestionInfo from '../components/QuestionReader/QuestionInfo';
import TossupResultScoreBadge from './TossupResultScoreBadge';
import TossupResultUserInput from './TossupResultUserInput';

type TossupResultProps = {
  result: TossupResult;
};

export default function TossupResultAccordion({ result }: TossupResultProps) {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <AccordionIcon />
          <QuestionInfo question={result.tossup} />
          <TossupResultScoreBadge result={result} />
        </AccordionButton>
        <AccordionPanel>
          <Box mb={2}>
            <FormattedQuestion
              buzzIndex={result.buzzIndex}
              words={result.formattedWords}
            />
          </Box>
          <TossupReaderAnswerDisplay tossup={result.tossup} />
          <TossupResultUserInput result={result} />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
