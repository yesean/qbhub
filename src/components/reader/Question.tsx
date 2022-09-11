import { RepeatIcon } from '@chakra-ui/icons';
import {
  Center,
  CircularProgress,
  Container,
  Flex,
  IconButton,
} from '@chakra-ui/react';

type QuestionProps = {
  showLoading: boolean;
  showEmpty: boolean;
  emptyMessage: string;
  onEmpty: () => void;
};

const Question: React.FC<React.PropsWithChildren<QuestionProps>> = ({
  showLoading,
  showEmpty,
  emptyMessage,
  onEmpty,
  children,
}) => {
  const render = () => {
    if (showLoading) {
      return (
        <Center mb={8}>
          <CircularProgress isIndeterminate color="cyan.100" />
        </Center>
      );
    }

    if (showEmpty) {
      return (
        <>
          <Container bg="gray.100" p={4} borderRadius="md" mb={4}>
            {emptyMessage}
          </Container>
          <Flex justify="center">
            <IconButton
              aria-label="Try Again"
              icon={<RepeatIcon />}
              onClick={onEmpty}
            />
          </Flex>
        </>
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
