import { Center, CircularProgress, Container } from '@chakra-ui/react';

type QuestionProps = {
  showLoading: boolean;
  showEmpty: boolean;
  emptyMessage: string;
};

const Question: React.FC<React.PropsWithChildren<QuestionProps>> = ({
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
      return (
        <Container bg="gray.100" p={4} borderRadius="md">
          {emptyMessage}
        </Container>
      );
    }

    return (
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
        justifyContent={showLoading ? 'center' : 'start'}
        borderRadius="md"
      >
        {children}
      </Container>
    );
  };

  return render();
};

export default Question;
