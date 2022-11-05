import { Box } from '@chakra-ui/react';
import FormattedQuestion from '../components/reader/FormattedQuestion';
import { getTossupWords } from '../utils/reader';

type LeadinProps = {
  text: string;
  buzzIndex: number;
};

const Leadin = ({ text, buzzIndex }: LeadinProps) => (
  <Box>
    <b>BONUS:</b>{' '}
    <FormattedQuestion
      words={getTossupWords(text)}
      indices={{ buzz: buzzIndex }}
    />
  </Box>
);

export default Leadin;
