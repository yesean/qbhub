import { Heading } from '@chakra-ui/react';

type ResultProps = {
  text: string;
};
const Result: React.FC<React.PropsWithChildren<ResultProps>> = ({ text }) => (
  <Heading pl={4} textAlign="center" size="md" whiteSpace="pre" mb={4}>
    {text}
  </Heading>
);

export default Result;
