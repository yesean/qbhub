import { Heading } from '@chakra-ui/react';

type InfoProps = {
  text: string;
};
const Info: React.FC<React.PropsWithChildren<InfoProps>> = ({ text }) => (
  <Heading mb={4} pl={4} size="sm">
    {text}
  </Heading>
);

export default Info;
