import { Container } from '@chakra-ui/react';
import { TossupWord } from '@qbhub/types';
import FormattedQuestion from '../reader/FormattedQuestion';

type Props = {
  textWords: TossupWord[];
  visibleIndex: number;
};

export default ({ textWords, visibleIndex }: Props) => (
  <Container
    maxW="container.md"
    overflow="auto"
    bg="gray.100"
    w="100%"
    minH="100px"
    mb={4}
    p={4}
    display="flex"
    flexWrap="wrap"
    justifyContent="start"
    borderRadius="md"
  >
    <FormattedQuestion words={textWords} indices={{ visible: visibleIndex }} />
  </Container>
);
