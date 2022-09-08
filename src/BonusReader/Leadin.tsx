import { Box } from '@chakra-ui/react';
import { getTossupWords, renderQuestion } from '../utils/reader';

type LeadinProps = {
  text: string;
  buzzIndex: number;
};

const Leadin = ({ text, buzzIndex }: LeadinProps) => (
  <Box>
    <b>BONUS:</b> {renderQuestion(getTossupWords(text), { buzz: buzzIndex })}
  </Box>
);

export default Leadin;
