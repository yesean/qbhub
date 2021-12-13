import { Heading } from '@chakra-ui/react';

type InfoProps = {
  info: string;
};
const Info: React.FC<InfoProps> = ({ info }) => {
  return (
    <Heading pl={4} size="sm" mb={4}>
      {info}
    </Heading>
  );
};

export default Info;
