import { Heading } from '@chakra-ui/react';

type InfoProps = {
  text: string;
};
const Info: React.FC<React.PropsWithChildren<InfoProps>> = ({ text }) => (
  <Heading pl={4} size="sm" mb={4}>
    {text}
  </Heading>
);

export default Info;
