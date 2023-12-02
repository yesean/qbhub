import { Box } from '@chakra-ui/react';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { getFormattedWords } from '../utils/reader';

type LeadinProps = {
  buzzIndex: number;
  text: string;
};

const Leadin = ({ buzzIndex, text }: LeadinProps) => (
  <Box>
    <b>BONUS:</b>{' '}
    <FormattedQuestion
      indices={{ buzz: buzzIndex }}
      words={getFormattedWords(text)}
    />
  </Box>
);

export default Leadin;
