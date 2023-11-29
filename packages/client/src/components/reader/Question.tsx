import { RepeatIcon } from '@chakra-ui/icons';
import {
  Center,
  CircularProgress,
  Container,
  Flex,
  IconButton,
} from '@chakra-ui/react';

type QuestionProps = {
  emptyMessage: string;
  onEmpty: () => void;
  showEmpty: boolean;
  showLoading: boolean;
};

const Question: React.FC<React.PropsWithChildren<QuestionProps>> = ({
  children,
  emptyMessage,
  onEmpty,
  showEmpty,
  showLoading,
}) => {
  const render = () => {
    if (showLoading) {
      return (
        <Center mb={8}>
          <CircularProgress color="cyan.100" isIndeterminate />
        </Center>
      );
    }

    if (showEmpty) {
      return (
        <>
          <Container bg="gray.100" borderRadius="md" mb={4} p={4}>
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
        bg="gray.100"
        borderRadius="md"
        display="flex"
        flexWrap="wrap"
        justifyContent="start"
        maxW="container.md"
        mb={4}
        minH="100px"
        overflow="auto"
        p={4}
        w="100%"
      >
        {children}
      </Container>
    );
  };

  return render();
};

export default Question;
