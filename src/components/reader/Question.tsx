import { Center, CircularProgress, Container } from '@chakra-ui/react';

type QuestionProps = {
  showLoading: boolean;
  showEmpty: boolean;
  emptyMessage: string;
};

const Question: React.FC<QuestionProps> = ({
  showLoading,
  showEmpty,
  emptyMessage,
  children,
}) => {
  const render = () => {
    if (showLoading) {
      return (
        <Center>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      );
    }
    if (showEmpty) {
      return emptyMessage;
    }
    return children;
  };

  return (
    <Container
      maxW="container.md"
      overflow="auto"
      bg="gray.100"
      w="100%"
      mb={4}
      p={4}
      d="flex"
      flexWrap="wrap"
      justifyContent={showLoading ? 'center' : 'start'}
      borderRadius="md"
    >
      {render()}
    </Container>
  );
};

export default Question;
