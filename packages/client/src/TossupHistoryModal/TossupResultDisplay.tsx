import { Box } from '@chakra-ui/react';
import { TossupResult } from '@qbhub/types';
import TossupReaderAnswerDisplay from '../TossupReader/TossupReaderAnswerDisplay';
import FormattedQuestion from '../components/FormattedQuestion';
import TossupResultUserInput from './TossupResultUserInput';

type TossupResultProps = {
  result: TossupResult;
};

export default function TossupResultDisplay({ result }: TossupResultProps) {
  return (
    <>
      <Box mb={2}>
        <FormattedQuestion
          buzzIndex={result.buzzIndex}
          words={result.formattedWords}
        />
      </Box>
      <TossupReaderAnswerDisplay tossup={result.tossup} />
      <TossupResultUserInput result={result} />
    </>
  );
}