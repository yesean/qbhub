import { Heading } from '@chakra-ui/react';

type ResultProps = {
  text: string;
};
const Result: React.FC<React.PropsWithChildren<ResultProps>> = ({ text }) => (
  <Heading mb={4} pl={4} size="md" textAlign="center" whiteSpace="pre">
    {text}
  </Heading>
);

export default Result;
