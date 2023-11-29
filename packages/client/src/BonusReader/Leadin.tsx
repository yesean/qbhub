import { Box } from '@chakra-ui/react';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { getTossupWords } from '../utils/reader';

type LeadinProps = {
  buzzIndex: number;
  text: string;
};

const Leadin = ({ buzzIndex, text }: LeadinProps) => (
  <Box>
    <b>BONUS:</b>{' '}
    <FormattedQuestion
      words={getTossupWords(text)}
      indices={{ buzz: buzzIndex }}
    />
  </Box>
);

export default Leadin;
